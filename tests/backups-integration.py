"""Destructive restore/clear checks in a runner-owned disposable database only."""
from pathlib import Path
import os,json,uuid,hashlib,urllib.request,urllib.error,http.cookiejar,subprocess,secrets,datetime,time
URL=os.environ['API_TEST_URL'];runtime=Path(os.environ['QA_STATE_PATH']).parent;checks=[];csrf='';password=os.environ['API_TEST_PASSWORD'];username=os.environ['API_TEST_USERNAME']
assert os.environ['QA_SQL_CONTAINER'].startswith('finans-qa-db-')
op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
def call(action,body=None,params=None,token=None,raw=None,content_type=None,confirm_backup=True):
 global csrf
 from urllib.parse import urlencode
 if action=='backup_create' and body is not None:body={'requestId':str(uuid.uuid4()),**body}
 headers={'X-CSRF-Token':csrf if token is None else token};payload=raw if raw is not None else json.dumps(body).encode() if body is not None else None
 if payload is not None:headers['Content-Type']=content_type or 'application/json'
 request=urllib.request.Request(URL+'?'+urlencode({'action':action,**(params or {})}),data=payload,headers=headers)
 try:
  response=op.open(request);code=response.status;blob=response.read();kind=response.headers.get('Content-Type','');data=json.loads(blob) if 'json' in kind else blob
 except urllib.error.HTTPError as e:code=e.code;data=json.load(e)
 if isinstance(data,dict) and 'csrf' in data:csrf=data['csrf']
 if action=='backup_create' and confirm_backup and isinstance(data,dict) and data.get('confirmationRequired'):return call(action,{**body,'confirmLatest':data['last']['id']},confirm_backup=False)
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
code,result=call('backup_create',{});assert code==200,result;manual=result['backup'];ok('Manual backup records all managed table counts',manual['schema']==12 and manual['counts']['fin_events']==len(baseline['events']))
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
bad=blob.replace(b'"schema":12',b'"schema":13',1);ok('Modified backup cannot pass integrity or schema checks',upload(bad)[0]==422)
ok('Rejected imports leave no catalog entries',len(call('backup_status')[1]['backups'])==count)
viewer_pass=secrets.token_hex(16);code,v=post('user_save',username='backup-viewer',shortName='Backup Viewer',password=viewer_pass,role='viewer',active=True);assert code==200,v
assert call('login',dict(username='backup-viewer',password=viewer_pass))[0]==200
for action,body in [('backup_status',None),('backup_create',{}),('backup_restore',{}),('demo_clear',{}),('factory_reset',{})]:ok('Viewer cannot access '+action,call(action,body)[0]==403)
assert call('login',dict(username=username,password=password))[0]==200
def scheduled(at):
 # Exercise the same CLI scheduler with a controlled clock, no browser or production DB.
 prefix="$action='scheduler_test';$config=require "+json.dumps(str(runtime/'web/api/config.php'))+";require "+json.dumps(str(runtime/'web/api/v2/backups.php'))+";"
 connect="$db=new PDO('mysql:host='.$config['db_host'].';port='.$config['db_port'].';dbname='.$config['db_name'].';charset=utf8mb4',$config['db_user'],$config['db_password'],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);$db->exec(\"SET time_zone = '+03:00'\");$db->query(\"SELECT GET_LOCK('finans_update',5)\");"
 return json.loads(php(prefix+connect+'echo json_encode((bool)backupAutomatic($db,new DateTimeImmutable('+json.dumps(at)+')));'))
assert call('backup_settings',dict(enabled=True))[0]==200
n=len(call('backup_status')[1]['backups'])
ok('Enabling automatic backups does not create a snapshot',n==count)
for _ in range(3):assert call('backup_auto_tick',{})[1]['created'] is False;assert call('backup_status')[0]==200
ok('Browser ticks and repeated settings reads never create automatic backups',len(call('backup_status')[1]['backups'])==n)
ok('Scheduler cannot create a backup before 03:00 Istanbul',scheduled('2030-01-01T02:59:59+03:00') is False)
ok('Scheduler creates once at 03:00 Istanbul using UTC cron time',scheduled('2030-01-01T00:00:00Z') is True)
ok('Repeated cron within 03:00 hour does not duplicate daily backup',scheduled('2030-01-01T03:20:00+03:00') is False)
ok('Scheduler does not make late daytime backups',scheduled('2030-01-02T12:00:00+03:00') is False)
for day in range(2,8):assert scheduled(f'2030-01-{day:02}T03:00:00+03:00') is True
backups=call('backup_status')[1]['backups'];ok('All backup kinds together are limited to five files',len(backups)==5)
# Manual backups must also be bounded, and pruning must not reset the daily schedule.
manual_ids=[]
for _ in range(6):
 code,created=call('backup_create',{});assert code==200;manual_ids.append(created['backup']['id'])
ok('Manual backup creation retains exactly the newest five snapshots',set(b['id'] for b in call('backup_status')[1]['backups'])==set(manual_ids[-5:]))
ok('Rotation removes old payload and catalog files from disk',php('$root='+json.dumps(str(root))+';echo count(glob($root.\"/*.jsonl\")).\"/\".count(glob($root.\"/*.meta.json\"));')=='5/5')
ok('Evicting automatic files does not permit a second automatic backup today',scheduled('2030-01-07T03:40:00+03:00') is False)
code,fresh=upload(blob);assert code==200;manual=fresh['backup']
ok('Import retains the uploaded file and respects the five backup limit',len(call('backup_status')[1]['backups'])==5 and any(b['id']==manual['id'] for b in call('backup_status')[1]['backups']))
assert call('backup_settings',dict(enabled=False))[0]==200
ok('Disabled schedule makes no backups even at 03:00',scheduled('2030-01-08T03:00:00+03:00') is False)
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
code,fresh=upload(blob);assert code==200;manual=fresh['backup']
php('$root='+json.dumps(str(root))+';$path=$root.\"/'+manual['id']+'.meta.json\";$m=json_decode(file_get_contents($path),true);$m[\"created_at\"]=\"1999-01-01T00:00:00+03:00\";file_put_contents($path,json_encode($m));')
code,r=call('backup_restore',dict(id=manual['id'],password=password,confirm='GERİ YÜKLE'));assert code==200,r
ok('Restore revokes other authenticated sessions before they can use old record identities',json.load(other.open(URL+'?action=session'))['user'] is None)
ok('Restore recovers every financial module exactly',financial(state())==baseline)
ok('Oldest restore target survives safety backup until restore completes; newest safety is retained',len(call('backup_status')[1]['backups'])==5 and any(b['id']==r['safetyBackup']['id'] for b in call('backup_status')[1]['backups']))
ok('Restore preserves the current administrator password',call('login',dict(username=username,password=password))[0]==200)
ok('Restore creates a safety snapshot of the replaced real records',r['safetyBackup']['kind']=='before_restore' and r['safetyBackup']['counts']['accounts']==1)
ok('Restore leaves unrelated tables intact',sql('SELECT COUNT(*) FROM unrelated_business')=='1')
# A different current administrator must survive importing an older installation's users.
u=next(u for u in state()['users'] if u['id']==state()['user']['id'])
code,r=post('user_save',id=u['id'],version=u['version'],username='recovery-admin',shortName='Kurtarma yöneticisi',role='admin',password='',active=True,reason='Restore identity coverage');assert code==200,r;username='recovery-admin'
assert call('login',dict(username=username,password=password))[0]==200
code,fresh=upload(blob);assert code==200;manual=fresh['backup']
code,r=call('backup_restore',dict(id=manual['id'],password=password,confirm='GERİ YÜKLE'));assert code==200,r
ok('Administrator absent from old backup is preserved without id collision',state()['user']['username']==username and call('login',dict(username=username,password=password))[0]==200 and financial(state())==baseline)
# Structurally valid file with invalid FK must roll back the entire replacement.
def break_fk(rows):next(r['row'] for r in rows if r.get('table')=='fin_events')['party_id']=4294967000
code,bad=upload(edited(blob,break_fk));assert code==200,bad
before=financial(state());code,r=call('backup_restore',dict(id=bad['backup']['id'],password=password,confirm='GERİ YÜKLE'));ok('Invalid relationships roll back the entire restore',code==503 and financial(state())==before)
ok('Failed restore releases maintenance lock',call('backup_create',{})[0]==200)
# Never let FK cascades affect an unrelated application, including another schema.
code,fresh=upload(blob);assert code==200;manual=fresh['backup']
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
ok('Legacy weekly settings become daily at 03:00 without immediate backup',call('backup_status')[1]['automatic']['time']=='03:00' and call('backup_status')[1]['automatic']['interval']=='daily')
ok('CLI scheduler works without a browser session on the next scheduled day',scheduled('2030-01-08T03:00:00+03:00') is True)
auto=next(b for b in call('backup_status')[1]['backups'] if b['kind']=='automatic')
code,cron_blob=call('backup_download',params={'id':auto['id']});old_created=next(json.loads(l)['row']['created_at'] for l in blob.splitlines() if json.loads(l).get('table')=='users');cron_created=next(json.loads(l)['row']['created_at'] for l in cron_blob.splitlines() if json.loads(l).get('table')=='users');ok('Cron and API snapshots preserve the same timestamp timezone',code==200 and old_created==cron_created)
def legacy_schema11(rows):
 rows[0]['schema']=11;rows[0]['tables']['cards'].remove('bank')
 for row in rows:
  if row.get('table')=='cards':row['row'].pop('bank')
  if row.get('table')=='app_meta':row['row']['schema_version']=11
code,legacy=upload(edited(blob,legacy_schema11));assert code==200,legacy
ok('Previous release schema-11 backups remain importable with their original schema label',legacy['backup']['schema']==11)
old_financial=financial(state());code,result=call('backup_restore',dict(id=legacy['backup']['id'],password=password,confirm='GERİ YÜKLE'));assert code==200,result
ok('Previous release backup restores financial data and keeps current schema 12',state()['schemaVersion']==12 and financial(state())==old_financial)
code,result=post('demo_seed',profile='compact');ok('Legacy updater demo replacement also creates a safety backup',code==200 and any(b['kind']=='before_demo' for b in call('backup_status')[1]['backups']))

# Manual duplicates require explicit consent before creating another file.
items=call('backup_status')[1]['backups'];key=str(uuid.uuid4())
code,prompt=call('backup_create',{'requestId':key},confirm_backup=False)
ok('Same-day repeat asks before creating or pruning any backup',code==200 and prompt.get('confirmationRequired') and call('backup_status')[1]['backups']==items)
ok('Repeat warning names actual rotation victim only at capacity',prompt['willDelete']['id']==items[-1]['id'] if len(items)>=5 else prompt['willDelete'] is None)
code,repeat=call('backup_create',{'requestId':key,'confirmLatest':prompt['last']['id']},confirm_backup=False);assert code==200,repeat
catalog=call('backup_status')[1]['backups'];code,retry=call('backup_create',{'requestId':key,'confirmLatest':prompt['last']['id']},confirm_backup=False)
ok('Identical manual request retries never rotate another backup',code==200 and retry.get('duplicate') and retry['backup']['id']==repeat['backup']['id'] and call('backup_status')[1]['backups']==catalog)
# Factory reset is distinct from demo clear and preserves only the current administrator.
assert post('user_save',username='second-reset-admin',shortName='Second admin',role='admin',password='Synthetic-reset-password-24')[0]==200
before_reset=financial(state());original_hash=sql('SELECT password_hash FROM users WHERE id='+str(state()['user']['id']));reset_body=dict(password=password,confirm='FABRİKA AYARLARINA SIFIRLA')
ok('Factory reset requires password and exact typed confirmation',call('factory_reset',{**reset_body,'password':'wrong'})[0]==422 and call('factory_reset',{**reset_body,'confirm':'sil'})[0]==422 and financial(state())==before_reset)
code,result=call('factory_reset',reset_body);assert code==200,result
clean=state();ok('Factory reset clears all business modules and keeps current admin only',not clean['demo'] and all(not clean[k] for k in ['events','parties','accounts','cards','vehicles','vehicle_records','campaigns','campaign_entries','claims']) and sql('SELECT COUNT(*) FROM users')=='1' and sql('SELECT password_hash FROM users')==original_hash)
ok('Factory reset writes audit and retains recoverable safety snapshot',result['safetyBackup']['kind']=='before_reset' and sql("SELECT COUNT(*) FROM audit_log WHERE operation='factory_reset'")=='1')
ok('Current administrator can log in with unchanged password after reset',call('login',dict(username=username,password=password))[0]==200)
# A real workspace can also be explicitly reset; source safety snapshot can restore previous records.
assert post('account_save',name='Real account',type='Kasa',opening='10')[0]==200
ok('Factory reset is available in real-data mode',call('factory_reset',reset_body)[0]==200 and not state()['accounts'])
code,r=call('backup_restore',dict(password=password,confirm='GERİ YÜKLE',id=result['safetyBackup']['id']));assert code==200,r
ok('Pre-reset safety snapshot restores all financial data',financial(state())==before_reset)

(runtime/'backup-checks.json').write_text(json.dumps({'passed':len(checks),'checks':checks}))
print('Backup restore and demo-clear checks complete',len(checks))
