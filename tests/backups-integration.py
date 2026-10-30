"""Destructive restore/clear checks in a runner-owned disposable database only."""
from pathlib import Path
import os,json,uuid,hashlib,urllib.request,urllib.error,http.cookiejar,subprocess,secrets,datetime,time
URL=os.environ['API_TEST_URL'];runtime=Path(os.environ['QA_STATE_PATH']).parent;checks=[];csrf='';password=os.environ['API_TEST_PASSWORD'];username=os.environ['API_TEST_USERNAME']
assert os.environ['QA_SQL_CONTAINER'].startswith('finans-qa-db-')
op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
def call(action,body=None,params=None,token=None,raw=None,content_type=None):
 global csrf
 from urllib.parse import urlencode
 headers={'X-CSRF-Token':csrf if token is None else token};payload=raw if raw is not None else json.dumps(body).encode() if body is not None else None
 if payload is not None:headers['Content-Type']=content_type or 'application/json'
 request=urllib.request.Request(URL+'?'+urlencode({'action':action,**(params or {})}),data=payload,headers=headers)
 try:
  response=op.open(request);code=response.status;blob=response.read();kind=response.headers.get('Content-Type','');data=json.loads(blob) if 'json' in kind else blob
 except urllib.error.HTTPError as e:code=e.code;data=json.load(e)
 if isinstance(data,dict) and 'csrf' in data:csrf=data['csrf']
 return code,data
def post(a,**body):return call(a,dict(requestId=str(uuid.uuid4()),**body))
def ok(name,test):
 assert test,name
 checks.append(name);print('PASS',name,flush=True)
def state():
 code,s=call('state');assert code==200,s;return s
def financial(s):return {k:s[k] for k in ['accounts','cards','parties','events','claims','vehicles','vehicle_records','campaigns','campaign_entries','today','demo']}
def upload(blob):
 boundary='finans-'+uuid.uuid4().hex
 payload=('--'+boundary+'\r\nContent-Disposition: form-data; name="backup"; filename="snapshot.jsonl"\r\nContent-Type: application/octet-stream\r\n\r\n').encode()+blob+('\r\n--'+boundary+'--\r\n').encode()
 return call('backup_upload',raw=payload,content_type='multipart/form-data; boundary='+boundary)
def edited(blob,fn):
 lines=[json.loads(line) for line in blob.splitlines()];fn(lines)
 raw=b''.join(json.dumps(row,ensure_ascii=False,separators=(',',':')).encode()+b'\n' for row in lines[:-1]);lines[-1]['sha256']=hashlib.sha256(raw).hexdigest();return raw+json.dumps(lines[-1],ensure_ascii=False,separators=(',',':')).encode()+b'\n'
def php(code):return subprocess.run(['docker','exec',os.environ['QA_PHP_CONTAINER'],'php','-r',code],text=True,capture_output=True,check=True).stdout.strip()
def sql(command):return subprocess.run(['docker','exec','-i',os.environ['QA_SQL_CONTAINER'],'sh','-c','exec mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" --batch --skip-column-names'],input='USE finans_test;'+command,text=True,capture_output=True,check=True).stdout.strip()
call('session');ok('Backup endpoints require authentication',call('backup_status')[0]==401)
assert call('login',dict(username=username,password=password))[0]==200
assert call('update_apply',{})[0]==200
assert post('demo_seed',profile='compact')[0]==200
baseline=financial(state());initial_user=state()['user']
ok('Backup status starts with disabled automatic schedule',call('backup_status')[1]['automatic']['enabled'] is False)
ok('CSRF protects manual backup creation',call('backup_create',{},token='wrong')[0]==403)
ok('Read-only request cannot create a backup',call('backup_create')[0]==405)
code,result=call('backup_create',{});assert code==200,result;manual=result['backup'];ok('Manual backup records all managed table counts',manual['schema']==11 and manual['counts']['fin_events']==len(baseline['events']))
code,blob=call('backup_download',params={'id':manual['id']});ok('Downloaded backup is complete and has a file checksum',code==200 and blob.endswith(b'\n') and hashlib.sha256(blob).hexdigest()==manual['sha256'])
lines=blob.splitlines();footer=json.loads(lines[-1]);ok('Backup footer independently verifies row content',hashlib.sha256(b'\n'.join(lines[:-1])+b'\n').hexdigest()==footer['sha256'])
ok('Backup never includes installation config or setup token',os.environ['API_TEST_SETUP_TOKEN'].encode() not in blob and b'config.php' not in blob)
ok('Backup id traversal is rejected',call('backup_download',params={'id':'../../config.php'})[0]==422)
root=next(runtime.glob('.finans-private-*'));ok('Backups live outside web root with private permissions',not root.is_relative_to(runtime/'web') and json.loads(php('$root='+json.dumps(str(root))+';echo json_encode([fileperms($root)&0777,fileperms($root."/'+manual['id']+'.jsonl")&0777]);'))==[448,384])
code,result=upload(blob);assert code==200,result;ok('Uploading a valid backup does not change financial data',financial(state())==baseline and result['backup']['kind']=='uploaded')
count=len(call('backup_status')[1]['backups']);ok('Truncated backup is rejected before import',upload(b'\n'.join(lines[:-1])+b'\n')[0]==422)
bad=blob.replace(b'finans-backup-2',b'finans-backup-X',1);ok('Unknown backup format is rejected',upload(bad)[0]==422)
bad=edited(blob,lambda rows:rows[0].update(schema=999));ok('Incompatible schema is rejected',upload(bad)[0]==422)
def bad_table(rows):
 row=next(r for r in rows if 'table' in r);row['table']='users`; DROP TABLE accounts; --'
ok('Table names are validated even with a recomputed checksum',upload(edited(blob,bad_table))[0]==422)
bad=blob.replace(b'"schema":11',b'"schema":12',1);ok('Modified backup cannot pass integrity or schema checks',upload(bad)[0]==422)
ok('Rejected imports leave no catalog entries',len(call('backup_status')[1]['backups'])==count)
viewer_pass=secrets.token_hex(16);code,v=post('user_save',username='backup-viewer',shortName='Backup Viewer',password=viewer_pass,role='viewer',active=True);assert code==200,v
assert call('login',dict(username='backup-viewer',password=viewer_pass))[0]==200
for action,body in [('backup_status',None),('backup_create',{}),('backup_restore',{}),('demo_clear',{})]:ok('Viewer cannot access '+action,call(action,body)[0]==403)
assert call('login',dict(username=username,password=password))[0]==200
assert call('backup_settings',dict(enabled=True,interval='daily'))[0]==200
ok('First due automatic tick creates one backup',call('backup_auto_tick',{})[1]['created'] is True)
ok('Repeated automatic tick does not duplicate a period',call('backup_auto_tick',{})[1]['created'] is False)
for _ in range(15):
 php('$root='+json.dumps(str(root))+";foreach(glob($root.'/*.meta.json') as $path){$m=json_decode(file_get_contents($path),true);if($m['kind']==='automatic'){$m['created_at']='2000-01-01T00:00:00+03:00';file_put_contents($path,json_encode($m));}}")
 assert call('backup_auto_tick',{})[1]['created']
backups=call('backup_status')[1]['backups'];ok('Retention keeps 14 automatic backups and all manual backups',sum(b['kind']=='automatic' for b in backups)==14 and any(b['id']==manual['id'] for b in backups))
assert call('backup_settings',dict(enabled=False,interval='weekly'))[0]==200
ok('Disabled automatic schedule makes no backups',call('backup_auto_tick',{})[1]['created'] is False)
sql("CREATE TABLE unrelated_business (id INT PRIMARY KEY) ENGINE=InnoDB;INSERT INTO unrelated_business VALUES(1)")
code,r=call('demo_clear',dict(password='wrong',confirm='DEMO VERİLERİNİ SİL'));ok('Wrong administrator password cannot clear data',code==422 and financial(state())==baseline)
ok('Explicit typed clear confirmation is required',call('demo_clear',dict(password=password,confirm='sil'))[0]==422)
other=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));session=json.load(other.open(URL+'?action=session'));req=urllib.request.Request(URL+'?action=login',data=json.dumps(dict(username=username,password=password)).encode(),headers={'Content-Type':'application/json','X-CSRF-Token':session['csrf']});assert json.load(other.open(req))['user']==username
code,r=call('demo_clear',dict(password=password,confirm='DEMO VERİLERİNİ SİL'));assert code==200,r;s=state();ok('Clear starts an empty real-data workspace',not s['demo'] and all(len(s[k])==0 for k in ['accounts','cards','parties','events','claims','vehicles','vehicle_records','campaigns','campaign_entries']))
ok('Clear revokes other existing administrator sessions',json.load(other.open(URL+'?action=session'))['user'] is None)
ok('Clear creates a mandatory recoverable safety backup',r['safetyBackup']['kind']=='before_clear' and r['safetyBackup']['counts']['fin_events']==len(baseline['events']))
ok('Clear preserves administrator login and removes non-admin demo users',s['user']['username']==username and all(u['role']=='admin' for u in s['users']))
ok('Unrelated database tables are never cleared',sql('SELECT COUNT(*) FROM unrelated_business')=='1')
ok('Real data cannot be cleared using demo action',call('demo_clear',dict(password=password,confirm='DEMO VERİLERİNİ SİL'))[0]==422)
code,a=post('account_save',name='Gerçek başlangıç kasası',type='Kasa',opening='1234,56');assert code==200,a
ok('New real-data records can be entered after clear',state()['accounts'][0]['balance_cents']==123456 and not state()['demo'])
# Preserve a password changed after the selected backup.
u=next(u for u in state()['users'] if u['id']==state()['user']['id']);new_password=secrets.token_hex(18)
code,r=post('user_save',id=u['id'],version=u['version'],username=username,shortName=u['short_name'],role='admin',password=new_password,active=True,reason='Test password preservation');assert code==200,r;password=new_password
other_session=json.load(other.open(URL+'?action=session'));other_request=urllib.request.Request(URL+'?action=login',data=json.dumps(dict(username=username,password=password)).encode(),headers={'Content-Type':'application/json','X-CSRF-Token':other_session['csrf']});assert json.load(other.open(other_request))['user']==username
code,r=call('backup_restore',dict(id=manual['id'],password=password,confirm='GERİ YÜKLE'));assert code==200,r
ok('Restore revokes other authenticated sessions before they can use old record identities',json.load(other.open(URL+'?action=session'))['user'] is None)
ok('Restore recovers every financial module exactly',financial(state())==baseline)
ok('Restore preserves the current administrator password',call('login',dict(username=username,password=password))[0]==200)
ok('Restore creates a safety snapshot of the replaced real records',r['safetyBackup']['kind']=='before_restore' and r['safetyBackup']['counts']['accounts']==1)
ok('Restore leaves unrelated tables intact',sql('SELECT COUNT(*) FROM unrelated_business')=='1')
# A different current administrator must survive importing an older installation's users.
u=next(u for u in state()['users'] if u['id']==state()['user']['id'])
code,r=post('user_save',id=u['id'],version=u['version'],username='recovery-admin',shortName='Kurtarma yöneticisi',role='admin',password='',active=True,reason='Restore identity coverage');assert code==200,r;username='recovery-admin'
assert call('login',dict(username=username,password=password))[0]==200
code,r=call('backup_restore',dict(id=manual['id'],password=password,confirm='GERİ YÜKLE'));assert code==200,r
ok('Administrator absent from old backup is preserved without id collision',state()['user']['username']==username and call('login',dict(username=username,password=password))[0]==200 and financial(state())==baseline)
# Structurally valid file with invalid FK must roll back the entire replacement.
def break_fk(rows):next(r['row'] for r in rows if r.get('table')=='fin_events')['party_id']=4294967000
code,bad=upload(edited(blob,break_fk));assert code==200,bad
before=financial(state());code,r=call('backup_restore',dict(id=bad['backup']['id'],password=password,confirm='GERİ YÜKLE'));ok('Invalid relationships roll back the entire restore',code==503 and financial(state())==before)
ok('Failed restore releases maintenance lock',call('backup_create',{})[0]==200)
# Never let FK cascades affect an unrelated application, including another schema.
party=before['parties'][0]['id'];sql(f'CREATE TABLE unrelated_link (id INT PRIMARY KEY,party_id INT UNSIGNED,FOREIGN KEY(party_id) REFERENCES parties(id) ON DELETE CASCADE) ENGINE=InnoDB;INSERT INTO unrelated_link VALUES(1,{party})')
ok('Related non-application tables block restore before deletion',call('backup_restore',dict(id=manual['id'],password=password,confirm='GERİ YÜKLE'))[0]==422 and sql('SELECT COUNT(*) FROM unrelated_link')=='1' and financial(state())==before);sql('DROP TABLE unrelated_link')
sql(f'CREATE DATABASE finans_external_guard;CREATE TABLE finans_external_guard.link (id INT PRIMARY KEY,party_id INT UNSIGNED,FOREIGN KEY(party_id) REFERENCES finans_test.parties(id) ON DELETE CASCADE) ENGINE=InnoDB;INSERT INTO finans_external_guard.link VALUES(1,{party})')
ok('Cross-database cascade relations block restore',call('backup_restore',dict(id=manual['id'],password=password,confirm='GERİ YÜKLE'))[0]==422 and sql('SELECT COUNT(*) FROM finans_external_guard.link')=='1')
ok('Cross-database cascade relations also block demo clear',call('demo_clear',dict(password=password,confirm='DEMO VERİLERİNİ SİL'))[0]==422 and financial(state())==before);sql('DROP DATABASE finans_external_guard')
# Test the exact storage resolver in a fresh PHP process (no live config hot-reload).
code="$action='test';$config=require "+json.dumps(str(runtime/'web/api/config.php'))+";$config['backup_dir']="+json.dumps(str(runtime/'web/unsafe-backups'))+";$_SERVER['DOCUMENT_ROOT']="+json.dumps(str(runtime/'web'))+";require "+json.dumps(str(runtime/'web/api/v2/private-storage.php'))+";try{backupRoot();echo 'unsafe';}catch(DomainException $e){echo 'rejected';}"
ok('Public web-root backup storage is rejected',php(code)=='rejected')
ok('Rejected storage does not modify finance data',financial(state())==before)
ok('Unsafe configured storage is rejected before directory creation',php('echo is_dir('+json.dumps(str(runtime/'web/unsafe-backups'))+')?"created":"absent";')=='absent')
# Reproduce shared hosting: app in public_html/finans; CLI has no DOCUMENT_ROOT.
nested=runtime/'hosting/public_html/finans/api/v2'
php('$dir='+json.dumps(str(nested))+';mkdir($dir,0700,true);copy('+json.dumps(str(runtime/'web/api/v2/private-storage.php'))+',$dir."/private-storage.php");')
resolver="$action='test';$config=['db_name'=>'nested-test','setup_token'=>'synthetic'];require "+json.dumps(str(nested/'private-storage.php'))+";"
http_root=php(resolver+'$_SERVER["DOCUMENT_ROOT"]='+json.dumps(str(runtime/'hosting/public_html'))+';echo backupRoot();')
cli_root=php(resolver+'unset($_SERVER["DOCUMENT_ROOT"]);echo backupRoot(false);')
ok('Subdirectory install stores backups outside public_html with the same CLI path',http_root==cli_root and Path(http_root).parent==runtime/'hosting')
unsafe=json.dumps(str(runtime/'hosting/public_html/unsafe-cron'))
ok('CLI also rejects configured public_html storage',php(resolver+"$config['backup_dir']="+unsafe+";try{backupRoot();echo 'unsafe';}catch(DomainException $e){echo 'rejected';}")=='rejected')

cron=runtime/'web/api/backup-cron.php';ok('CLI cron respects disabled schedule', 'gerekmiyor' in php('include '+json.dumps(str(cron))+';'));
try:
 response=op.open(URL.replace('index.php','backup-cron.php'));http_code=response.status
except urllib.error.HTTPError as e:http_code=e.code
ok('Cron cannot be invoked over HTTP',http_code==404)
assert call('backup_settings',dict(enabled=True,interval='weekly'))[0]==200
ok('Weekly schedule avoids another backup in the same week',call('backup_auto_tick',{})[1]['created'] is False)
php('$root='+json.dumps(str(root))+";foreach(glob($root.'/*.meta.json') as $path){$m=json_decode(file_get_contents($path),true);if($m['kind']==='automatic'){$m['created_at']='2000-01-01T00:00:00+03:00';file_put_contents($path,json_encode($m));}}")
ok('CLI cron creates a due backup without a browser session', 'oluşturuldu' in php('include '+json.dumps(str(cron))+';'))
auto=next(b for b in call('backup_status')[1]['backups'] if b['kind']=='automatic')
code,cron_blob=call('backup_download',params={'id':auto['id']});old_created=next(json.loads(l)['row']['created_at'] for l in blob.splitlines() if json.loads(l).get('table')=='users');cron_created=next(json.loads(l)['row']['created_at'] for l in cron_blob.splitlines() if json.loads(l).get('table')=='users');ok('Cron and API snapshots preserve the same timestamp timezone',code==200 and old_created==cron_created)
code,result=post('demo_seed',profile='compact');ok('Legacy updater demo replacement also creates a safety backup',code==200 and any(b['kind']=='before_demo' for b in call('backup_status')[1]['backups']))
(runtime/'backup-checks.json').write_text(json.dumps({'passed':len(checks),'checks':checks}))
print('Backup restore and demo-clear checks complete',len(checks))
