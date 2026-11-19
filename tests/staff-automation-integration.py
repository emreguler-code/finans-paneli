# Executed inside the financial suite: only its disposable database/containers.
import subprocess,datetime
from concurrent.futures import ThreadPoolExecutor
from zoneinfo import ZoneInfo
container=os.environ['QA_PHP_CONTAINER'];database=os.environ['QA_SQL_CONTAINER']
web=json.loads(subprocess.check_output(['docker','inspect',container],text=True))[0]['Config']['Cmd'][-1]
def payroll_sql(statement):
 return subprocess.check_output(['docker','exec','-i',database,'sh','-c','exec mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" --batch --skip-column-names'],input="USE finans_test;\nDELIMITER $$\n"+statement+"$$\n",text=True).strip()
php='''$action="cron"; $config=require $argv[1]."/api/config.php"; require $argv[1]."/api/v2/fields.php";require $argv[1]."/api/v2/core.php";require $argv[1]."/api/v2/finance.php";require $argv[1]."/api/v2/staff-automation.php";$db=new PDO("mysql:host=127.0.0.1;port=".$config["db_port"].";dbname=".$config["db_name"].";charset=utf8mb4",$config["db_user"],$config["db_password"],[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);$db->exec("SET time_zone='+03:00'");if(!$db->query("SELECT GET_LOCK('finans_update',10)")->fetchColumn())throw new Exception('lock');try{echo json_encode(staffAccrual($db,new DateTimeImmutable($argv[2])));}finally{$db->query("SELECT RELEASE_LOCK('finans_update')");}'''
def payroll_clock(day):
 return json.loads(subprocess.check_output(['docker','exec',container,'php','-r',php,web,period+'-'+day+' 12:00:00 Europe/Istanbul'],text=True))
period=datetime.datetime.now(ZoneInfo('Europe/Istanbul')).strftime('%Y-%m');original_day=state()['today']
payroll_sql("UPDATE app_meta SET demo_date='"+period+"-03' WHERE id=1")
ids=[]
for index,(salary,meal) in enumerate([(100000,20000),(30000,0),(40000,0)]):
 code,r=post('party_save',name='QA payroll '+str(index),type='Personel',opening='0',profile={'salary_cents':salary,'meal_monthly_cents':meal,'automation_start_month':period,'iban':'TR330006100519786457841326'})
 assert code==200,r;ids.append(r['id'])
 p=entity('parties',ids[0])
for label,profile in [
 ('IBAN checksum validation rejects invalid employee bank details',{**p['profile'],'iban':'TR000006100519786457841326'}),
 ('Negative monthly salary is rejected',{**p['profile'],'salary_cents':-1}),
 ('New automation cannot backfill historical months',{**p['profile'],'automation_start_month':'2025-01'})]:
 code,r=post('party_save',**{**p,'profile':profile,'reason':'QA invalid profile'});ok(label,code==422)
cash_before={a['id']:a['balance_cents'] for a in state()['accounts']}
payroll_sql("CREATE TRIGGER qa_payroll_failure BEFORE INSERT ON fin_events FOR EACH ROW BEGIN IF NEW.party_id IN ("+','.join(map(str,ids[1:]))+") THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='QA synthetic payroll failure'; END IF; END")
with ThreadPoolExecutor(max_workers=2) as pool:
 results=list(pool.map(payroll_clock,['01','01']))
first=next(r for r in results if not r.get('skipped'));retry=next(r for r in results if r.get('skipped'));ok('Accrual run preserves successful employees when another employee fails',first['created']==2 and len(first['failed'])==2)
ok('Concurrent and same-day cron calls create no duplicate financial records',retry['skipped'] and retry['created']==0)
p=entity('parties',ids[1]);code,r=post('party_save',**{**p,'profile':{**p['profile'],'salary_cents':45000},'reason':'QA future rate'});assert code==200,r
payroll_sql('DROP TRIGGER qa_payroll_failure')
payroll_sql("CREATE TRIGGER qa_payroll_failure BEFORE INSERT ON fin_events FOR EACH ROW BEGIN IF NEW.party_id="+str(ids[2])+" THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='QA persistent payroll failure'; END IF; END")
ok('Critical notification data retains the original period fees',next(x for x in state()['staff_accrual_plan'] if x['party']==ids[1])['cents']==30000)
second=payroll_clock('02');ok('Next-day retry creates only missing accruals',second['created']==1 and len(second['failed'])==1)
rows=[e for e in state()['events'] if e['party_id'] in ids]
ok('Maaş and meal are separate gross entitlements, not cash payments',len(rows)==3 and sum(e['amount_cents'] for e in rows)==150000 and {a['id']:a['balance_cents'] for a in state()['accounts']}==cash_before)
ok('Retry uses period snapshot even when employee rate changes',next(e for e in rows if e['party_id']==ids[1])['amount_cents']==30000)
e=next(e for e in rows if e['party_id']==ids[0] and e['operation']=='salary');post('event_status',id=e['id'],version=e['version'],cancelled=True,reason='QA cancel entitlement')
third=payroll_clock('03');ok('Third attempt records unresolved failures and never recreates cancelled accruals',third['created']==0 and len(third['failed'])==1 and len([e for e in state()['events'] if e['party_id'] in ids])==3)
ok('Automatic records retain source period after cancellation',all(e.get('automation_period')==period for e in state()['events'] if e['party_id'] in ids))
count=payroll_sql("SELECT COUNT(*) FROM audit_log WHERE entity='automation' AND entity_id='staff-"+period+"' AND operation='attempt'");ok('Three daily results are retained for diagnostics',count=='3')
ok('No unlimited silent retry after third day',payroll_clock('04')['skipped'])
payroll_sql('DROP TRIGGER qa_payroll_failure')
for pid in ids:
 p=entity('parties',pid);post('party_save',**{**p,'active':False,'reason':'QA payroll end'})
payroll_sql("UPDATE app_meta SET demo_date='"+original_day+"' WHERE id=1")
