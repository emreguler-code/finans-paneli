"""Backup, rollback and retry tests in a runner-owned disposable database."""
from pathlib import Path
import json,subprocess,urllib.request,urllib.error,http.cookiejar,os
root=Path(__file__).resolve().parents[1]
container=os.environ['QA_SQL_CONTAINER']
assert container.startswith('finans-qa-db-'), 'Migration tests require their own disposable container'
creds=dict(username=os.environ['API_TEST_USERNAME'],password=os.environ['API_TEST_PASSWORD'],token=os.environ['API_TEST_SETUP_TOKEN'])
def sql(statement):
 result=subprocess.run(['docker','exec','-i',container,'sh','-c','exec mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" --batch --skip-column-names'],input=statement,text=True,capture_output=True,check=True)
 return result.stdout.strip()
fixture=json.loads((root/'tests/fixtures/legacy-v1.json').read_text())
op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));url=os.environ['API_TEST_URL']+'?action=';csrf='';checks=0
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
sql('USE finans_test;'+fixture['schema']+fixture['sample'])
call('session');assert call('setup',creds)[0]==200
ok('Version 1 migrates directly to schema 11',call('update_apply',{})[0]==200 and call('state')[1]['schemaVersion']==11)
s=call('state')[1]
ok('Legacy administrator and total cash preserved',s['user']['username']==creds['username'] and sum(a['balance_cents'] for a in s['accounts'])==12480000)
ok('Legacy card debt preserved',round(sum(c['debt'] for c in s['cards'])*100)==2430000)
ok('Legacy net cari preserved',sum(p['balance_cents'] for p in s['parties'])==5050000)
ok('Successful migration is repeatable',call('update_apply',{})[0]==200 and call('state')[1]['events']==s['events'])
sql('DROP DATABASE IF EXISTS finans_test; CREATE DATABASE finans_test; USE finans_test;'+fixture['schema']+fixture['sample']+fixture['cari'])
op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));csrf=''
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
# Existing version 7 installations gain only optional POS metadata.
before=call('state')[1]
sql('USE finans_test; ALTER TABLE parties DROP COLUMN pos_programs; UPDATE app_meta SET schema_version=7 WHERE id=1;')
code,blocked=call('state');ok('Schema 7 requires the POS migration',code==503 and blocked.get('upgradeRequired'))
ok('Schema 7 migrates to schema 11',call('update_apply',{})[0]==200 and call('state')[1]['schemaVersion']==11)
after=call('state')[1]
ok('POS migration keeps existing financial facts',after['events']==before['events'] and [a['balance_cents'] for a in after['accounts']]==[a['balance_cents'] for a in before['accounts']])
ok('POS migration defaults every existing party to no selection',all(p['pos_programs']==[] for p in after['parties']))
ok('Administrator password survives POS migration',call('login',dict(username=creds['username'],password=creds['password']))[0]==200)
ok('POS migration can be repeated without changing state',call('update_apply',{})[0]==200 and call('state')[1]['events']==after['events'])
sql("USE finans_test; UPDATE parties SET pos_programs='[\"garanti:bonus\"]'; UPDATE app_meta SET schema_version=8 WHERE id=1;")
ok('Schema 8 migrates to 10 preserving POS data',call('update_apply',{})[0]==200 and all(p['pos_programs']==['garanti:bonus'] for p in call('state')[1]['parties']))
ok('Tracking migration preserves financial facts',call('state')[1]['events']==after['events'])
before=call('state')[1]
sql('USE finans_test; ALTER TABLE cards DROP COLUMN linked_account_id; UPDATE app_meta SET schema_version=9 WHERE id=1;')
ok('Schema 9 requires linkage migration',call('state')[0]==503)
ok('Schema 9 migrates to 10',call('update_apply',{})[0]==200 and call('state')[1]['schemaVersion']==11)
after=call('state')[1]
ok('Link migration preserves administrator and financial facts',call('login',dict(username=creds['username'],password=creds['password']))[0]==200 and before['events']==after['events'] and all(c['linked_account_id'] is None for c in after['cards']))
ok('Link migration is idempotent',call('update_apply',{})[0]==200 and call('state')[1]['events']==after['events'])
before=call('state')[1]
sql('USE finans_test; ALTER TABLE parties DROP COLUMN profile_json; UPDATE app_meta SET schema_version=10 WHERE id=1;')
ok('Schema 10 requires optional party profile migration',call('state')[0]==503)
ok('Schema 10 upgrades to 11',call('update_apply',{})[0]==200 and call('state')[1]['schemaVersion']==11)
after=call('state')[1]
ok('Party profile migration preserves financial facts',before['events']==after['events'] and [a['balance_cents'] for a in before['accounts']]==[a['balance_cents'] for a in after['accounts']])
ok('Party profile migration starts with no invented metadata',all(not p['profile'] for p in after['parties']))
ok('Party profile migration preserves login and retries safely',call('login',dict(username=creds['username'],password=creds['password']))[0]==200 and call('update_apply',{})[0]==200)
sql('DROP DATABASE finans_backup_test;');print(json.dumps({'passed':checks,'failed':0}),flush=True)
