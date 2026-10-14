#!/usr/bin/env python3
"""Own disposable Docker services. Never target a user's existing database/config."""
from pathlib import Path
import argparse,json,os,secrets,shutil,socket,subprocess,time,urllib.request,urllib.error,uuid,zipfile
ROOT=Path(__file__).resolve().parents[1]
PHP_BASE='php:8.3-cli@sha256:aafe21201943a8a6e497ddfb471e2ce68ada76adede38c7d61fede8918b24319'
DB_IMAGE='mariadb:11.4@sha256:1292844148b311e4ed4300022a996d39083f415a963e970cf47cad1b3b18e3a6'
def run(args,**kwargs):return subprocess.run(args,check=True,**kwargs)
def free_port():
 with socket.socket() as sock:
  sock.bind(('127.0.0.1',0));return sock.getsockname()[1]
def main():
 parser=argparse.ArgumentParser();parser.add_argument('suite',choices=['api','migrations','browser','package']);args=parser.parse_args()
 ident=uuid.uuid4().hex[:12];runtime=ROOT/'.qa'/ident;runtime.mkdir(parents=True)
 names=[];db_name='finans-qa-db-'+ident;api_name='finans-qa-php-'+ident
 password=secrets.token_hex(24);token=secrets.token_hex(32);admin=secrets.token_hex(24)
 db_port=free_port();api_port=free_port();env=os.environ.copy()
 env.update(API_TEST_USERNAME='qa-admin',API_TEST_PASSWORD=admin,API_TEST_SETUP_TOKEN=token,API_TEST_URL=f'http://127.0.0.1:{api_port}/api/index.php',QA_STATE_PATH=str(runtime/'qa-state.json'),QA_SQL_CONTAINER=db_name)
 def sql(statement):
  result=run(['docker','exec','-i',db_name,'sh','-c','exec mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" --batch --skip-column-names'],input=statement,text=True,capture_output=True)
  return result.stdout.strip()
 try:
  docker_env=runtime/'db.env';docker_env.write_text(f'MARIADB_ROOT_PASSWORD={password}\nMARIADB_ROOT_HOST=%\nMARIADB_DATABASE=finans_test\n');docker_env.chmod(0o600)
  run(['docker','run','-d','--name',db_name,'--network','host','--env-file',str(docker_env),DB_IMAGE,f'--port={db_port}','--bind-address=127.0.0.1'],stdout=subprocess.DEVNULL);names.append(db_name)
  for _ in range(60):
   if subprocess.run(['docker','exec',db_name,'healthcheck.sh','--connect','--innodb_initialized'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode==0:break
   time.sleep(1)
  else:raise RuntimeError('Disposable database did not become ready')
  if subprocess.run(['docker','image','inspect','finans-php-test'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode:
   build=runtime/'build';build.mkdir();(build/'Dockerfile').write_text(f'FROM {PHP_BASE}\nRUN docker-php-ext-install -j2 pdo_mysql\n')
   docker_config=ROOT/'.qa/docker';docker_config.mkdir(exist_ok=True)
   run(['docker','--config',str(docker_config),'build','-t','finans-php-test',str(build)],stdout=subprocess.DEVNULL)
  web=runtime/'web'
  if args.suite=='package':
   version=json.loads((ROOT/'package.json').read_text())['version']
   with zipfile.ZipFile(ROOT/'dist/releases'/f'finans-paneli-{version}.zip') as archive:
    archive.extractall(runtime/'archive')
   shutil.copytree(runtime/'archive/hosting',web)
  else:
   shutil.copytree(ROOT/'public',web,ignore=shutil.ignore_patterns('config.php'))
   migrations=web/'api/v2/migrations';migrations.mkdir();shutil.copyfile(ROOT/'database/migrations/002-cari.sql',migrations/'002-cari.sql')
  config=web/'api/config.php';config.write_text("<?php\nreturn "+"['db_host'=>'127.0.0.1','db_port'=>"+str(db_port)+",'db_name'=>'finans_test','db_user'=>'root','db_password'=>'"+password+"','setup_token'=>'"+token+"','require_https'=>false];\n");config.chmod(0o600)
  if args.suite in ['api','browser']:
   sql('USE finans_test;'+(ROOT/'database/schema.sql').read_text())
  if args.suite=='browser':
   for source in (ROOT/'dist/client').iterdir():
    if source.is_dir():shutil.copytree(source,web/source.name,dirs_exist_ok=True)
    else:shutil.copyfile(source,web/source.name)
  run(['docker','run','-d','--name',api_name,'--network','host','-e','PHP_CLI_SERVER_WORKERS=4','-v',f'{ROOT}:{ROOT}','-w',str(ROOT),'finans-php-test','-S',f'127.0.0.1:{api_port}','-t',str(web)],stdout=subprocess.DEVNULL);names.append(api_name)
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
   if args.suite=='api':run(['python3',str(ROOT/'tests/finance-integration.py')],env=env)
   if args.suite=='browser':
    # Browser acceptance initializes its own fixture, independent of API-suite mutations.
    session=json.load(opener.open(env['API_TEST_URL']+'?action=session'))
    json.load(opener.open(urllib.request.Request(env['API_TEST_URL']+'?action=update_apply',data=b'{}',headers={'Content-Type':'application/json','X-CSRF-Token':session['csrf']})))
    payload=json.dumps({'requestId':str(uuid.uuid4())}).encode()
    json.load(opener.open(urllib.request.Request(env['API_TEST_URL']+'?action=demo_seed',data=payload,headers={'Content-Type':'application/json','X-CSRF-Token':session['csrf']})))
    env.update(QA_BASE_URL=f'http://127.0.0.1:{api_port}',QA_USERNAME=env['API_TEST_USERNAME'],QA_PASSWORD=admin,QA_OUTPUT_DIR=str(runtime/'browser'))
    run(['node',str(ROOT/'tests/browser.cjs')],env=env)
    # Comparison uses the same API data for the prior packaged frontend.
    baseline=ROOT/'.qa/baseline-1.6/hosting'
    if baseline.exists():
     shutil.copytree(web/'api',baseline/'api',dirs_exist_ok=True)
     env['QA_COMPARE_BASELINE']=str(baseline);env['QA_COMPARE_WEB']=str(web)
     run(['node',str(ROOT/'tests/visual-compare.cjs')],env=env)
  print(f'PASS {args.suite}: isolated services and fixtures; output {runtime.relative_to(ROOT)}')
 finally:
  for name in reversed(names):subprocess.run(['docker','rm','-f',name],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
  for secret in [runtime/'db.env',runtime/'web/api/config.php']+([ROOT/'.qa/baseline-1.6/hosting/api/config.php'] if args.suite=='browser' else []):
   secret.unlink(missing_ok=True)
if __name__=='__main__':main()
