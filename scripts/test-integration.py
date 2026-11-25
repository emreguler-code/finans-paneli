#!/usr/bin/env python3
"""Own disposable Docker services. Never target a user's existing database/config."""
from pathlib import Path
import argparse,hashlib,json,os,secrets,shutil,socket,subprocess,time,urllib.request,urllib.error,uuid,zipfile
ROOT=Path(__file__).resolve().parents[1]
PHP_BASE='php:8.5-cli@sha256:50956f094e90a716d43bea28087d447555ad80510e386ab8c9c10d8c70d781a9'
DB_IMAGE='mariadb:12.3.3@sha256:4ebbcf100a3ba320766dfa0e1af008df12261301db6ef72798c7650f70794aed'
# Include the base digest so an older cached PHP image cannot bypass an upgrade.
PHP_IMAGE='finans-php-test:'+hashlib.sha256(PHP_BASE.encode()).hexdigest()[:16]
def run(args,**kwargs):return subprocess.run(args,check=True,**kwargs)
def free_port():
 with socket.socket() as sock:
  sock.bind(('127.0.0.1',0));return sock.getsockname()[1]
def main():
 parser=argparse.ArgumentParser();parser.add_argument('suite',choices=['api','migrations','browser','package','demo','backups','mobile']);parser.add_argument('--keep',action='store_true',help='Keep this isolated demo running');args=parser.parse_args()
 ident=uuid.uuid4().hex[:12];runtime=ROOT/'.qa'/ident;runtime.mkdir(parents=True)
 names=[];db_name='finans-qa-db-'+ident;api_name='finans-qa-php-'+ident
 password=secrets.token_hex(24);token=secrets.token_hex(32);admin=secrets.token_hex(24)
 db_port=free_port();api_port=free_port();env=os.environ.copy()
 env.update(API_TEST_USERNAME='qa-admin',API_TEST_PASSWORD=admin,API_TEST_SETUP_TOKEN=token,API_TEST_URL=f'http://127.0.0.1:{api_port}/api/index.php',QA_STATE_PATH=str(runtime/'qa-state.json'),QA_SQL_CONTAINER=db_name,QA_PHP_CONTAINER=api_name)
 def sql(statement):
  result=run(['docker','exec','-i',db_name,'sh','-c','exec mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" --batch --skip-column-names'],input=statement,text=True,capture_output=True)
  return result.stdout.strip()
 try:
  docker_env=runtime/'db.env';docker_env.write_text(f'MARIADB_ROOT_PASSWORD={password}\nMARIADB_ROOT_HOST=%\nMARIADB_DATABASE=finans_test\n');docker_env.chmod(0o600)
  run(['docker','run','-d','--name',db_name,'--network','host','--env-file',str(docker_env),*(['--tmpfs','/var/lib/mysql:rw,size=2g'] if os.environ.get('QA_DB_TMPFS')=='1' else []),DB_IMAGE,f'--port={db_port}','--bind-address=127.0.0.1'],stdout=subprocess.DEVNULL);names.append(db_name)
  for _ in range(60):
   if subprocess.run(['docker','exec',db_name,'healthcheck.sh','--connect','--innodb_initialized'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode==0:break
   time.sleep(1)
  else:raise RuntimeError('Disposable database did not become ready')
  if subprocess.run(['docker','image','inspect',PHP_IMAGE],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode:
   build=runtime/'build';build.mkdir();(build/'Dockerfile').write_text(f'FROM {PHP_BASE}\nRUN docker-php-ext-install -j2 pdo_mysql\n')
   docker_config=ROOT/'.qa/docker';docker_config.mkdir(exist_ok=True)
   run(['docker','--config',str(docker_config),'build','-t',PHP_IMAGE,str(build)],stdout=subprocess.DEVNULL)
  web=runtime/'web'
  if args.suite=='package':
   version=json.loads((ROOT/'package.json').read_text())['version']
   with zipfile.ZipFile(ROOT/'dist/releases'/f'finans-paneli-{version}.zip') as full, zipfile.ZipFile(ROOT/'dist/releases'/f'finans-paneli-{version}-hosting.zip') as hosting:
    expected={name.removeprefix('hosting/'):full.read(name) for name in full.namelist() if name.startswith('hosting/')}
    expected.update({name:full.read(name) for name in full.namelist() if name.startswith('licenses/')})
    assert set(hosting.namelist())==set(expected), 'Hosting archive has missing or extra files'
    assert all(hosting.read(name)==content for name,content in expected.items()), 'Hosting archive differs from full package'
    assert 'api/config.php' not in expected and 'api/v2/migrations/002-cari.sql' in expected
    hosting.extractall(web)
   print('PASS hosting-only archive matches complete package; no credentials or extra documents')
   # Exercise the actual user upgrade path without touching a real configuration.
   prior=ROOT/'releases/1.25.0/finans-paneli-1.25.0-hosting.zip'
   if not prior.exists():raise RuntimeError('Missing 1.25.0 upgrade fixture')
   upgrade=runtime/'upgrade';upgrade.mkdir()
   with zipfile.ZipFile(prior) as old:old.extractall(upgrade)
   sentinel=upgrade/'api/config.php';sentinel.write_text('synthetic-existing-config')
   old_assets=set((upgrade/'assets').iterdir())
   with zipfile.ZipFile(ROOT/'dist/releases'/f'finans-paneli-{version}-hosting.zip') as new:new.extractall(upgrade)
   assert sentinel.read_text()=='synthetic-existing-config', 'Upgrade overwrote existing config'
   assert all(asset.exists() for asset in old_assets), 'Upgrade removed still-cached old assets'
   import re
   html=(upgrade/'index.html').read_text()
   for asset in re.findall(r'(?:src|href)=["\']([^"\']+)["\']',html):
    assert (upgrade/asset.removeprefix('./')).is_file(), 'Missing startup asset after upgrade: '+asset
   assert (upgrade/'assets/boot.js').is_file(), 'Missing classic startup recovery'
   print('PASS 1.25.0 to current ZIP overlay retains config/old assets and resolves every startup reference')

  else:
   shutil.copytree(ROOT/'public',web,ignore=shutil.ignore_patterns('config.php'))
   migrations=web/'api/v2/migrations';migrations.mkdir();shutil.copyfile(ROOT/'database/migrations/002-cari.sql',migrations/'002-cari.sql')
  config=web/'api/config.php';config.write_text("<?php\nreturn "+"['db_host'=>'127.0.0.1','db_port'=>"+str(db_port)+",'db_name'=>'finans_test','db_user'=>'root','db_password'=>'"+password+"','setup_token'=>'"+token+"','require_https'=>false];\n");config.chmod(0o600)
  if args.suite in ['api','browser','demo','backups','mobile']:
   sql('USE finans_test;'+(ROOT/'database/schema.sql').read_text())
  if args.suite in ['browser','demo','mobile']:
   for source in (ROOT/'dist/client').iterdir():
    if source.is_dir():shutil.copytree(source,web/source.name,dirs_exist_ok=True)
    else:shutil.copyfile(source,web/source.name)
  run(['docker','run','-d','--name',api_name,'--network','host','-e','PHP_CLI_SERVER_WORKERS=4','-v',f'{ROOT}:{ROOT}','-w',str(ROOT),PHP_IMAGE,'-S',f'127.0.0.1:{api_port}','-t',str(web)],stdout=subprocess.DEVNULL);names.append(api_name)
  if args.suite in ['migrations','package']:
   # Tables are intentionally absent; a JSON 503 proves PHP is responding before fixture import.
   for _ in range(100):
    try:
     json.load(urllib.request.urlopen(env['API_TEST_URL']+'?action=session',timeout=1));break
    except urllib.error.HTTPError as error:
     if error.code==503 and isinstance(json.load(error),dict):break
    except (OSError,ValueError):pass
    time.sleep(.1)
   else:raise RuntimeError('Disposable PHP server did not become ready')
   run(['python3',str(ROOT/'tests/migration-integration.py')],env=env)
   if args.suite=='package':
    run(['python3',str(ROOT/'tests/finance-integration.py')],env=env)
    for path in ['/', '/update.php', '/assets/fonts.css']:
     response=urllib.request.urlopen(f'http://127.0.0.1:{api_port}'+path)
     assert response.status==200 and response.read(), path
    print('PASS packaged frontend, updater and local font stylesheet')
    env.update(QA_BASE_URL=f'http://127.0.0.1:{api_port}',QA_USERNAME=env['API_TEST_USERNAME'],QA_PASSWORD=admin,QA_OUTPUT_DIR=str(runtime/'package-demo'))
    run(['python3',str(ROOT/'tests/demo-audit.py')],env=env)
    run(['node',str(ROOT/'tests/demo-updater.cjs')],env=env)
  else:
   for _ in range(100):
    try:
     if json.load(urllib.request.urlopen(env['API_TEST_URL']+'?action=session',timeout=1)).get('setupRequired'):break
    except Exception:pass
    time.sleep(.1)
   else:raise RuntimeError('Disposable PHP API did not become ready')
   import http.cookiejar
   opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
   session=json.load(opener.open(env['API_TEST_URL']+'?action=session'))
   body=json.dumps(dict(username=env['API_TEST_USERNAME'],password=admin,token=token)).encode()
   json.load(opener.open(urllib.request.Request(env['API_TEST_URL']+'?action=setup',data=body,headers={'Content-Type':'application/json','X-CSRF-Token':session['csrf']})))
   if args.suite=='backups':run(['python3',str(ROOT/'tests/backups-integration.py')],env=env)
   if args.suite=='api':run(['python3',str(ROOT/'tests/finance-integration.py')],env=env)
   if args.suite in ['browser','mobile']:
    # Browser acceptance initializes its own fixture, independent of API-suite mutations.
    session=json.load(opener.open(env['API_TEST_URL']+'?action=session'))
    json.load(opener.open(urllib.request.Request(env['API_TEST_URL']+'?action=update_apply',data=b'{}',headers={'Content-Type':'application/json','X-CSRF-Token':session['csrf']})))
    payload=json.dumps({'requestId':str(uuid.uuid4()),'profile':'compact'}).encode()
    json.load(opener.open(urllib.request.Request(env['API_TEST_URL']+'?action=demo_seed',data=payload,headers={'Content-Type':'application/json','X-CSRF-Token':session['csrf']})))
    env.update(QA_BASE_URL=f'http://127.0.0.1:{api_port}',QA_USERNAME=env['API_TEST_USERNAME'],QA_PASSWORD=admin,QA_OUTPUT_DIR=str(runtime/'browser'))
    run(['node',str(ROOT/('tests/mobile120-browser.cjs' if args.suite=='mobile' else 'tests/browser120.cjs'))],env=env)
    # Comparison uses the same API data for the prior packaged frontend.
    baseline=ROOT/'.qa/baseline-1.6/hosting'
    if args.suite=='browser' and baseline.exists() and os.environ.get('QA_COMPARE_RELEASE')=='1':
     shutil.copytree(web/'api',baseline/'api',dirs_exist_ok=True)
     env['QA_COMPARE_BASELINE']=str(baseline);env['QA_COMPARE_WEB']=str(web)
     run(['node',str(ROOT/'tests/visual-compare.cjs')],env=env)
  if args.suite=='demo':
   env.update(QA_BASE_URL=f'http://127.0.0.1:{api_port}',QA_USERNAME=env['API_TEST_USERNAME'],QA_PASSWORD=admin,QA_OUTPUT_DIR=str(runtime/'demo'))
   run(['python3',str(ROOT/'tests/demo-audit.py')],env=env)
   run(['node',str(ROOT/'tests/demo-browser.cjs')],env=env)
   if args.keep:
    local=runtime/'local-session.json';local.write_text(json.dumps({'url':env['QA_BASE_URL'],'username':env['QA_USERNAME'],'password':admin,'containers':names}));local.chmod(0o600)
    (ROOT/'.qa/current-demo').write_text(str(runtime))
    print('Isolated demo retained; local session details in ignored runtime directory')
  print(f'PASS {args.suite}: isolated services and fixtures; output {runtime.relative_to(ROOT)}')
 finally:
  retained=args.suite=='demo' and args.keep and (runtime/'local-session.json').exists()
  for name in ([] if retained else reversed(names)):subprocess.run(['docker','rm','-fv',name],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
  for secret in [runtime/'db.env',runtime/'web/api/config.php']+([ROOT/'.qa/baseline-1.6/hosting/api/config.php'] if args.suite=='browser' else []):
   if not retained:secret.unlink(missing_ok=True)
if __name__=='__main__':main()
