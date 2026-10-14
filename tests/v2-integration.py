"""Run only against isolated finans_test seeded with v1 sample data. Mutates fixtures."""
import os,json,uuid,urllib.request,urllib.error,http.cookiejar,concurrent.futures
URL=os.environ.get('API_TEST_URL','http://127.0.0.1:8088/api/index.php')
USER=os.environ['API_TEST_USERNAME']; PASSWORD=os.environ['API_TEST_PASSWORD']; TOKEN=os.environ['API_TEST_SETUP_TOKEN']
class Client:
 def __init__(self):self.opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));self.csrf=''
 def call(self,action,body=None,**params):
  from urllib.parse import urlencode
  r=urllib.request.Request(URL+'?'+urlencode({'action':action,**params}),data=json.dumps(body).encode() if body is not None else None,headers={'Content-Type':'application/json','X-CSRF-Token':self.csrf})
  try:res=self.opener.open(r);code=res.status;raw=res.read();data=json.loads(raw)
  except urllib.error.HTTPError as e:code=e.code;data=json.loads(e.read())
  if 'csrf' in data:self.csrf=data['csrf']
  return code,data
 def login(self,user=USER,password=PASSWORD):self.call('session');assert self.call('login',dict(username=user,password=password))[0]==200
c=Client();passed=[]
def ok(name,v):
 assert v,name
 passed.append(name);print('PASS',name,flush=True)
def post(action,**body):return c.call(action,dict(requestId=str(uuid.uuid4()),**body))
def state():
 code,s=c.call('state');assert code==200,s
 return s
def ev(id):return next(e for e in state()['events'] if e['id']==id)
def party(id):return next(p for p in state()['parties'] if p['id']==id)
def account(id):return next(a for a in state()['accounts'] if a['id']==id)
def cash():return sum(a['balance_cents'] for a in state()['accounts'])
def create(**kw):
 b=dict(kind='Tahsilat',amount='100',date='2026-10-09',description='V2 test',account='bank');b.update(kw);code,r=post('event_save',**b);assert code==200,r;return r['id']
def status(id,cancelled=True):return post('event_status',id=id,version=ev(id)['version'],cancelled=cancelled,reason='Test correction')
def edit(id,**kw):
 e=ev(id);b=dict(id=id,version=e['version'],kind=e['kind'],amount=str(e['amount_cents']/100),date=e['event_date'],time=e['event_time'],due=e['due_date'] or '2026-10-09',description=e['description'],account=e['account_id'] or '',target=e['target_id'] or '',partyId=e['party_id'] or '',cardId=e['card_id'] or '',direction=e['direction'],reason='Test revision');b.update(kw);return post('event_save',**b)
ok('Anonymous state denied',c.call('state')[0]==401)
c.call('session');code,r=c.call('setup',dict(username=USER,password=PASSWORD,token=TOKEN));assert code==200,r
ok('Old schema blocks new mutations',c.call('state')[1].get('upgradeRequired'))
ok('Authenticated administrator sees upgrade status',c.call('update_status')[0]==200)
code,r=c.call('update_apply',{});print('Upgrade result:',r,flush=True);ok('One click upgrade succeeds',code==200)
s=state();ok('Seed cash preserved',cash()==12480000);ok('Seed net cari preserved',sum(p['balance_cents'] for p in s['parties'])==5050000);ok('Seed card debt preserved',round(sum(x['debt'] for x in s['cards'])*100)==2430000)
ok('Seed statement preserved',round(sum(x['statement'] for x in s['cards'])*100)==1630000)
before=json.dumps(s['events'],sort_keys=True);ok('Updater repeat succeeds',c.call('update_apply',{})[0]==200);ok('Updater repeat does not duplicate events',before==json.dumps(state()['events'],sort_keys=True))
# Downloaded backup remains authenticated and complete; never print backup contents.
raw=c.opener.open(URL+'?action=update_backup').read();ok('Backup complete marker present',json.loads(raw.splitlines()[-1]).get('complete'))
base=dict(name='V2 Tedarikçi',title='Örnek Unvan',type='Tedarikçi',opening='0',date='2026-10-09',due='2026-10-16');code,r=post('party_save',**base);ok('Create party',code==200);pid=r['id']
start=cash();bill=create(kind='Borç',amount='8000',partyId=pid,due='2026-10-16');ok('Bill does not move cash',cash()==start);ok('Bill creates payable',party(pid)['balance_cents']==-800000)
payment=create(kind='Ödeme',amount='10000',partyId=pid);ok('Excess payment becomes supplier advance',party(pid)['balance_cents']==200000);ok('Payment moves cash once',cash()==start-1000000)
bill2=create(kind='Borç',amount='5000',partyId=pid,due='2026-10-23');s=state();ok('Next invoice consumes advance',party(pid)['balance_cents']==-300000);ok('Only remaining amount is due',next(x for x in s['claims'] if x['id']==bill2)['amount_cents']==300000);ok('Allocation records 2000 advance use',any(x['bill_id']==bill2 and x['payment_id']==payment and x['amount_cents']==200000 for x in s['allocations']))
ok('Bill cancel succeeds',status(bill2)[0]==200);ok('Bill cancellation leaves real cash intact',cash()==start-1000000);ok('Bill cancellation restores advance',party(pid)['balance_cents']==200000);ok('Cancelled event retained',ev(bill2)['cancelled']==1)
ok('Restore succeeds',status(bill2,False)[0]==200);ok('Restore reuses advance',party(pid)['balance_cents']==-300000)
ok('Partial payment creates correct remaining',bool(create(kind='Ödeme',amount='1000,25',partyId=pid)) and party(pid)['balance_cents']==-199975)
before=cash();ok('Date/amount edit succeeds',edit(bill2,amount='6000,50',date='2026-10-08')[0]==200);ok('Bill edit only changes cari',party(pid)['balance_cents']==-300025 and cash()==before)
logs=c.call('audit',entity='event',id=bill2)[1]['logs'];ok('Audit includes create cancel restore edit',set(x['operation'] for x in logs)=={'create','cancel','restore','edit'});ok('Audit keeps old and new amount',json.loads(logs[0]['before_json'])['amount_cents']==500000 and int(json.loads(logs[0]['after_json'])['amount_cents'])==600050)
from datetime import datetime
from zoneinfo import ZoneInfo
ok('Audit timestamps use Turkey time',logs[0]['created_at'][:13]==datetime.now(ZoneInfo('Europe/Istanbul')).strftime('%Y-%m-%d %H'))
# Independent opposite invoices do not net by themselves.
receivable=create(kind='Alacak',amount='700',partyId=pid,due='2026-10-30');ok('Opposite invoice remains separately open',any(x['id']==receivable and x['amount_cents']==70000 for x in state()['claims']))
collect=create(kind='Tahsilat',amount='900',partyId=pid);ok('Excess collection tracked independently',any(x['party_id']==pid and x['kind']=='Alınan avans' and x['amount_cents']==20000 for x in state()['advances']))
# Global event count is one while account deltas are two.
s=state();n=len(s['events']);before=cash();bank=account('bank')['balance_cents'];saving=account('saving')['balance_cents'];tr=create(kind='Virman',amount='123,45',target='saving');ok('Transfer appears once globally',len(state()['events'])==n+1);ok('Transfer conserves cash',cash()==before);ok('Transfer updates both accounts',account('bank')['balance_cents']==bank-12345 and account('saving')['balance_cents']==saving+12345)
status(tr);ok('Transfer cancellation reverses both legs',account('bank')['balance_cents']==bank and account('saving')['balance_cents']==saving)
# Card creation and full lifecycle.
code,r=post('card_save',name='Test kart',limit='20000',opening='1000',statement='600',statementDate='2026-10-01',due='2026-10-12',cutDay=1,lastFour='1234');ok('Create credit card',code==200);cid=r['id']
getcard=lambda:next(ca for ca in state()['cards'] if ca['id']==cid)
before=cash();cp=create(kind='Kart harcaması',amount='500',cardId=cid);ok('Card purchase increases debt without cash',getcard()['debt']==1500 and cash()==before)
refund=create(kind='Kart iadesi',amount='100',cardId=cid);ok('Card refund reduces debt',getcard()['debt']==1400)
paid=create(kind='Kart ödemesi',amount='400',cardId=cid);ok('Card payment decreases debt and cash once',getcard()['debt']==1000 and cash()==before-40000)
status(paid);ok('Card payment cancellation reverses effects',getcard()['debt']==1400 and cash()==before)
# Rolling the statement must include the formerly unbilled opening amount.
ok('Legacy statement dates are explicitly unverified',all(x['statement_date'] is None and int(x['statement_needs_review'])==1 for x in state()['cards'] if x['id']!=cid))
ca=getcard();ok('Initial statement excludes unbilled opening',ca['statement']==500)
code,r=post('card_save',id=cid,version=ca['version'],name=ca['name'],limit='20000',statementDate='2026-10-09',due='2026-10-19',cutDay=9,lastFour='1234',reason='Next statement')
ok('Statement rollover saves',code==200)
ok('Statement rollover includes opening unbilled and purchases',getcard()['statement']==1400)
ca=getcard();ok('Cannot backdate before opening statement',post('card_save',id=cid,version=ca['version'],name=ca['name'],limit='20000',statementDate='2026-09-01',due='2026-10-19',cutDay=1,reason='Invalid date')[0]==422)
# Editing a transfer must replace both legs, not add another transfer.
status(tr,False);ok('Edit transfer amount',edit(tr,amount='10,01')[0]==200)
ok('Edited transfer still conserves cash',account('bank')['balance_cents']==bank-1001 and account('saving')['balance_cents']==saving+1001)
status(tr)
ca=getcard();ok('Limit can be edited below debt without changing debt',post('card_save',id=cid,version=ca['version'],name=ca['name'],limit='900',statementDate='2026-10-09',due='2026-10-19',cutDay=9,reason='Limit changed')[0]==200 and getcard()['debt']==1400)
# Validation and retry safety.
payload=dict(requestId=str(uuid.uuid4()),kind='Tahsilat',amount='0,01',date='2026-10-09',description='Exact cent',account='bank');before=cash();code,r=c.call('event_save',payload);id=r['id'];ok('Exact cent',code==200 and cash()==before+1);ok('Idempotent retry',c.call('event_save',payload)[1].get('duplicate') and cash()==before+1);ok('Changed retry rejected',c.call('event_save',{**payload,'amount':'2'})[0]==422)
for name,change in [('Three decimals',{'amount':'1.001'}),('Negative amount',{'amount':'-1'}),('Future transaction',{'date':'2027-01-01'}),('Bad calendar date',{'date':'2026-02-30'}),('Missing account',{'account':'missing'}),('Self transfer',{'kind':'Virman','target':'bank'}),('Missing party for invoice',{'kind':'Borç'})]:
 code,r=c.call('event_save',{**payload,'requestId':str(uuid.uuid4()),**change});ok(name+' rejected',code==422)
ok('Stale edit rejected',post('event_save',id=id,version=0,kind='Tahsilat',amount='1',date='2026-10-09',description='stale',account='bank',reason='stale')[0]==422)
# Account management and creator audit.
code,r=post('account_save',name='Yeni kasa',type='Kasa',opening='50,25');ok('Create cash account with exact opening',code==200);aid=r['id'];ok('New account appears without fixed seed IDs',account(aid)['balance_cents']==5025)
a=account(aid);ok('Edit account',post('account_save',id=aid,version=a['version'],name='Düzenlenmiş kasa',type='Kasa',reason='Ad değişti')[0]==200)
# Role boundaries, including crafted API calls.
clients={}
for role in ['editor','user','viewer']:
 code,r=post('user_save',username='test-'+role,shortName=role.title(),password=PASSWORD,role=role);ok('Create '+role,code==200);u=Client();u.login('test-'+role);clients[role]=(u,r['id'])
for role,(u,uid) in clients.items():
 ok(role+' can view',u.call('state')[0]==200)
 body={**payload,'requestId':str(uuid.uuid4())};code,r=u.call('event_save',body);ok(role+' create permission',code==(403 if role=='viewer' else 200))
 target=ev(id);editbody={**payload,'requestId':str(uuid.uuid4()),'id':id,'version':target['version'],'reason':'role test'};code,r=u.call('event_save',editbody);ok(role+' edit permission',code==(200 if role=='editor' else 403))
 ok(role+' cannot cancel',u.call('event_status',dict(requestId=str(uuid.uuid4()),id=id,version=ev(id)['version'],cancelled=True,reason='Denied'))[0]==403)
 ok(role+' cannot manage users',u.call('user_save',dict(requestId=str(uuid.uuid4()),username='forbidden',shortName='No',password=PASSWORD,role='admin'))[0]==403)
 ok(role+' cannot update',u.call('update_apply',{})[0]==403)
# Changes take effect on already signed-in session.
u,uid=clients['user'];usr=next(x for x in state()['users'] if int(x['id'])==uid);post('user_save',id=uid,version=int(usr['version']),username=usr['username'],shortName='Stopped',role='user',active=False,reason='Disable');ok('Disabled session immediately rejected',u.call('state')[0]==401)
admin=state()['user'];usr=next(x for x in state()['users'] if int(x['id'])==admin['id']);ok('Last admin protected',post('user_save',id=admin['id'],version=int(usr['version']),username=USER,shortName='Admin',role='viewer',reason='Invalid demotion')[0]==422)
anon=Client();ok('No CSRF rejected',anon.call('event_save',payload)[0]==403)
# Independent sessions replay same operation concurrently.
a=Client();b=Client();a.login();b.login();payload={**payload,'requestId':str(uuid.uuid4()),'amount':'1,25'};before=cash()
with concurrent.futures.ThreadPoolExecutor(2) as ex:results=list(ex.map(lambda client:client.call('event_save',payload),[a,b]))
ok('Concurrent retries apply once',all(r[0]==200 for r in results) and cash()==before+125)
n=Client();n.login();ok('Fresh session preserves all data',n.call('state')[1]['events']==state()['events'])
print(json.dumps({'passed':len(passed),'failed':0}),flush=True)
