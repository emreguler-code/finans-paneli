"""Destructive recovery test ONLY for isolated finans_test. Uses local test runtime."""
from pathlib import Path
import json,subprocess,urllib.request,urllib.error,http.cookiejar
root=Path(__file__).resolve().parents[1];runtime=root/'.local-runtime'
creds=json.loads((runtime/'test-env.json').read_text())
client=[str(runtime/'root/usr/bin/mariadb'),'--no-defaults','--protocol=tcp','-h127.0.0.1','-P3307','-uroot','--batch','--skip-column-names']
def sql(s):return subprocess.run(client,input=s,text=True,capture_output=True,check=True).stdout.strip()
fixture=json.loads((root/'tests/fixtures/legacy-v1.json').read_text())
sql('DROP DATABASE IF EXISTS finans_test; CREATE DATABASE finans_test; USE finans_test;'+fixture['schema']+fixture['sample']+fixture['cari'])
op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));url='http://127.0.0.1:8088/api/index.php?action=';csrf='';checks=0
def call(a,b=None):
 global csrf
 try:
  r=op.open(urllib.request.Request(url+a,data=None if b is None else json.dumps(b).encode(),headers={'Content-Type':'application/json','X-CSRF-Token':csrf}));code=r.status;d=json.load(r)
 except urllib.error.HTTPError as e:code=e.code;d=json.load(e)
 if 'csrf' in d:csrf=d['csrf']
 return code,d
def ok(name,test):
 global checks
 assert test,name
 checks+=1;print('PASS',name,flush=True)
call('session');assert call('setup',creds)[0]==200
sql("USE finans_test; INSERT INTO journal(id,payload_hash) VALUES('broken-transfer',REPEAT('0',64)); INSERT INTO movements(journal_id,account_id,movement_date,movement_time,name,kind,amount_cents) VALUES('broken-transfer','bank','2026-10-09','00:00:00','Fault fixture','Transfer',-100);")
ok('Broken legacy transfer stops migration',call('update_apply',{})[0]==422)
ok('Failed migration leaves old version',sql('USE finans_test; SELECT schema_version FROM app_meta')=='2')
ok('Failed migration rolls back all new events',sql('USE finans_test; SELECT COUNT(*) FROM fin_events')=='0')
ok('Administrator remains authorized after partial DDL',call('update_status')[0]==200)
raw=op.open(url+'update_backup').read();records=[json.loads(x) for x in raw.splitlines()];ok('Failure backup is complete',records[-1].get('complete'))
# Rebuild the downloaded pre-update backup in a separate disposable database.
sql('DROP DATABASE IF EXISTS finans_backup_test; CREATE DATABASE finans_backup_test;')
def quote(v):
 if v is None:return 'NULL'
 return "CONVERT(0x"+str(v).encode().hex()+" USING utf8mb4)" if str(v) else "''"
commands=['USE finans_backup_test; SET FOREIGN_KEY_CHECKS=0;']
for r in records:
 if 'ddl' in r:commands.append(r['ddl']+';')
 elif 'row' in r:
  d=r['row'];commands.append('INSERT INTO `'+r['table']+'` ('+','.join('`'+x+'`' for x in d)+') VALUES('+','.join(quote(v) for v in d.values())+');')
commands.append('SET FOREIGN_KEY_CHECKS=1;');sql('\n'.join(commands))
ok('Downloaded backup can reconstruct tables and rows',sql('USE finans_backup_test; SELECT schema_version FROM app_meta')=='2' and sql('USE finans_backup_test; SELECT COUNT(*) FROM movements')==sql('USE finans_test; SELECT COUNT(*) FROM movements'))
sql("USE finans_test; INSERT INTO movements(journal_id,account_id,movement_date,movement_time,name,kind,amount_cents) VALUES('broken-transfer','saving','2026-10-09','00:00:00','Repaired fixture','Transfer',100);")
ok('Retry after source repair succeeds',call('update_apply',{})[0]==200)
s=call('state')[1];ok('Retry migrates exactly one repaired transfer',sum(e['kind']=='Virman' for e in s['events'])==1)
ok('Recovery preserves total cash',sum(a['balance_cents'] for a in s['accounts'])==12480000)
ok('Repeat after recovery is harmless',call('update_apply',{})[0]==200 and call('state')[1]['events']==s['events'])
sql('DROP DATABASE finans_backup_test;');print(json.dumps({'passed':checks,'failed':0}),flush=True)
