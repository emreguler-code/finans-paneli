"""Additional 1.3 checks. Run only inside the explicitly isolated finans_test runner."""
import os,json,uuid,urllib.request,urllib.error,http.cookiejar
URL=os.environ.get('API_TEST_URL','http://127.0.0.1:8088/api/index.php');op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));csrf='';checks=[]
def call(action,body=None,**params):
 global csrf
 from urllib.parse import urlencode
 req=urllib.request.Request(URL+'?'+urlencode({'action':action,**params}),data=None if body is None else json.dumps(body).encode(),headers={'Content-Type':'application/json','X-CSRF-Token':csrf})
 try:r=op.open(req);code=r.status;v=json.load(r)
 except urllib.error.HTTPError as e:code=e.code;v=json.load(e)
 if 'csrf' in v:csrf=v['csrf']
 return code,v
def ok(label,test):
 assert test,label
 checks.append(label);print('PASS',label,flush=True)
def post(action,**values):return call(action,dict(requestId=str(uuid.uuid4()),**values))
def state():return call('state')[1]
def cash():return sum(a['balance_cents'] for a in state()['accounts'])
def event(eid):return next(e for e in state()['events'] if e['id']==eid)
call('session');assert call('login',dict(username=os.environ['API_TEST_USERNAME'],password=os.environ['API_TEST_PASSWORD']))[0]==200
ok('Schema 5 active',state()['schemaVersion']==5)
# Exercise an actual 1.2/schema-3 database transition without changing financial facts.
from pathlib import Path
import subprocess
runtime=Path(__file__).resolve().parents[1]/'.local-runtime'
s=state();before_financial=json.dumps([s['events'],s['cards'],s['parties'],[(a['id'],a['balance_cents']) for a in s['accounts']]],sort_keys=True)
subprocess.run([str(runtime/'root/usr/bin/mariadb'),'--no-defaults','--protocol=tcp','-h127.0.0.1','-P3307','-uroot'],input='USE finans_test; ALTER TABLE accounts DROP COLUMN maturity_date; UPDATE app_meta SET schema_version=3 WHERE id=1;',text=True,capture_output=True,check=True)
u=call('update_status')[1];ok('1.2 database reports target schema 5',u['version']==3 and u['target']==5)
ok('1.2 database blocks new UI until upgrade',call('state')[1].get('upgradeRequired'))
ok('1.2 to 1.3 upgrade succeeds',call('update_apply',{})[0]==200)
s=state();ok('1.2 upgrade preserves all financial facts',before_financial==json.dumps([s['events'],s['cards'],s['parties'],[(a['id'],a['balance_cents']) for a in s['accounts']]],sort_keys=True))
raw=op.open(URL+'?action=update_backup').read();ok('1.2 upgrade backup complete',json.loads(raw.splitlines()[-1]).get('complete'))

s=state();snapshot=json.dumps([s['events'],s['accounts'],s['cards'],s['parties']],sort_keys=True);ok('1.3 repeat upgrade succeeds',call('update_apply',{})[0]==200);s=state();ok('1.3 repeat preserves all balances and records',snapshot==json.dumps([s['events'],s['accounts'],s['cards'],s['parties']],sort_keys=True))
code,r=post('party_save',name='Vadesiz Tedarikçi',type='Tedarikçi',opening='0');assert code==200,r;pid=r['id'];before=cash()
def create(**values):
 code,r=post('event_save',kind=values.pop('kind','Borç'),amount=values.pop('amount','1000'),date='2026-10-09',description=values.pop('description',''),partyId=pid,**values);assert code==200,r;return r['id']
bill=create();ok('Blank description accepted',event(bill)['description']=='');ok('Omitted due remains null',event(bill)['due_date'] is None);claim=next(c for c in state()['claims'] if c['id']==bill);ok('Undated open item does not acquire event date',claim['due'] is None);ok('Undated invoice updates cari not cash',cash()==before and next(p for p in state()['parties'] if p['id']==pid)['balance_cents']==-100000)
code,r=post('event_save',kind='Alış',amount='0,25',date='2026-10-09',partyId=pid,due='',description='');ok('Alış alias accepted',code==200 and event(r['id'])['kind']=='Borç');ok('Explicit blank due remains null',event(r['id'])['due_date'] is None)
code,r=post('card_save',name='Ödeme Test Kartı',limit='50000',opening='0',statement='0',statementDate='2026-10-09',due='2026-10-19',cutDay=9,lastFour='4444');assert code==200,r;cid=r['id']
def card():return next(c for c in state()['cards'] if c['id']==cid)
pay=create(kind='Ödeme',amount='1200,50',cardId=cid,account='bank');ok('Card-funded payment has no bank account',event(pay)['account_id'] is None);ok('Card-funded payment leaves total cash unchanged',cash()==before);ok('Card-funded payment increases card debt exactly',round(card()['debt']*100)==120050);ok('Card-funded payment closes supplier invoices',not any(c['partyId']==pid for c in state()['claims']));ok('Excess card-funded payment is supplier advance',next(a for a in state()['advances'] if a['party_id']==pid)['amount_cents']==20025);ok('Card-funded payment statement projection updated',round(card()['statement']*100)==120050);ok('Card-funded payment appears exactly once',sum(e['id']==pay for e in state()['events'])==1)
code,r=post('event_status',id=pay,version=event(pay)['version'],cancelled=True,reason='Isolated reversal');ok('Card-funded payment cancellation succeeds',code==200);ok('Cancellation reverses card and cari together',round(card()['debt']*100)==0 and any(c['id']==bill for c in state()['claims']) and cash()==before)
code,r=post('event_status',id=pay,version=event(pay)['version'],cancelled=False,reason='Restore');assert code==200
code,r=post('event_save',kind='Kart ödemesi',cardId=cid,account='bank',amount='200',date='2026-10-09',description='');ok('Card repayment still supported behind transfer form',code==200);ok('Card repayment changes bank and card once',cash()==before-20000 and round(card()['debt']*100)==100050);ok('Repayment does not change supplier balance',next(p for p in state()['parties'] if p['id']==pid)['balance_cents']==20025)
e=event(bill);code,r=post('event_save',id=bill,version=e['version'],kind='Borç',amount='1000',partyId=pid,lockedPartyId=pid,description='',date='2026-10-09',due='2026-10-23',reason='Set due');ok('Assign due without new invoice',code==200 and event(bill)['due_date']=='2026-10-23');ok('Assigning due does not move cash',cash()==before-20000)
code,r=post('event_save',kind='Tahsilat',amount='1',partyId=pid,lockedPartyId=pid+1000,account='bank',description='',date='2026-10-09');ok('Different cari blocked in contextual form',code==422)
a=state()['accounts'][0];code,r=post('account_save',id=a['id'],version=a['version'],name=a['name'],type=a['type'],bank=a['bank'],iban=a['iban'],holder=a['holder'],maturityDate='2026-10-20',reason='Maturity reminder');ok('Account maturity saves',code==200);ok('Account maturity does not move cash',cash()==before-20000);ok('Account maturity included in state',next(x for x in state()['accounts'] if x['id']==a['id'])['maturity_date']=='2026-10-20')
print(json.dumps({'passed':len(checks),'failed':0}))
