"""Destructive-to-fixtures only: requires isolated v1 seed upgraded with 002-cari.sql.
Uses API_TEST_* environment variables, no hardcoded credentials. Run after api-integration.py.
"""
import os,json,uuid,urllib.request,urllib.error,http.cookiejar,concurrent.futures
from urllib.parse import urlencode
BASE=os.environ.get('API_TEST_URL','http://127.0.0.1:8088/api/index.php')
USER=os.environ.get('API_TEST_USERNAME','test-admin');PASSWORD=os.environ['API_TEST_PASSWORD']
class Client:
 def __init__(self):self.opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));self.csrf=''
 def call(self,action,body=None,**params):
  req=urllib.request.Request(BASE+'?'+urlencode({'action':action,**params}),data=json.dumps(body).encode() if body is not None else None,headers={'Content-Type':'application/json','X-CSRF-Token':self.csrf})
  try:r=self.opener.open(req);status=r.status;data=json.load(r)
  except urllib.error.HTTPError as e:status=e.code;data=json.load(e)
  if 'csrf' in data:self.csrf=data['csrf']
  return status,data
 def login(self):self.call('session');assert self.call('login',dict(username=USER,password=PASSWORD))[0]==200
c=Client();passed=[]
def ok(n,v):
 assert v,n
 passed.append(n);print('PASS',n,flush=True)
ok('Cari endpoints require authentication',c.call('parties')[0]==401)
c.login()
def cash():return round(sum(x['balance'] for x in c.call('state')[1]['accounts'])*100)
def balance(id):return c.call('party',id=id)[1]['party']['balance_cents']
def invariant():
 s=c.call('state')[1];return c.call('parties')[1]['net_cents']==round(sum(x['amount']*(1 if x['type']=='alacak' else -1) for x in s['claims'])*100)
ok('Legacy claim payment updates cari ledger',invariant())
def form(**kw):
 d=dict(name='Özgün Test',title='Test Unvanı',type='Müşteri',phone='',email='',tax_no='',tax_office='',address='',notes='',opening='1000,25',direction='Alacak',date='2026-10-09',due='2026-10-12',requestId=str(uuid.uuid4()));d.update(kw);return d
before=cash();f=form();status,r=c.call('party_save',f);ok('Create party and opening in exact cents',status==201 and balance(r['id'])==100025);pid=r['id']
ok('Opening does not change cash',cash()==before)
ok('Opening adds a single matching claim',invariant())
ok('Create retry does not duplicate party',c.call('party_save',f)[1].get('duplicate') and balance(pid)==100025)
ok('Changed retry rejected',c.call('party_save',{**f,'name':'Changed'})[0]==409)
ok('Three character Turkish AJAX search',len(c.call('parties',q='özg')[1]['parties'])==1)
ok('Short query returns full scope',len(c.call('parties',q='öz')[1]['parties'])>1)
ok('Title AJAX search',len(c.call('parties',q='Unvanı')[1]['parties'])==1)
ok('SQL LIKE wildcard escaped',len(c.call('parties',q='%%%')[1]['parties'])==0)
ok('Type filter excludes mismatch',len(c.call('parties',q='özg',type='Personel')[1]['parties'])==0)
ok('Invalid type rejected',c.call('party_save',form(type='Bankacı'))[0]==422)
ok('Invalid email rejected',c.call('party_save',form(email='invalid'))[0]==422)
ok('Precision rejected',c.call('party_save',form(opening='1.001'))[0]==422)
def entry(**kw):
 d=dict(partyId=pid,kind='Alacak',amount='200',date='2026-10-09',due='2026-10-15',description='Cari integration',document='',account='bank',requestId=str(uuid.uuid4()));d.update(kw);return d
e=entry();ok('Accrual succeeds',c.call('party_entry',e)[0]==201 and balance(pid)==120025)
ok('Accrual has no cash effect',cash()==before and invariant())
ok('Accrual retries exactly once',c.call('party_entry',e)[1].get('duplicate') and balance(pid)==120025)
e=entry(kind='Tahsilat',amount='250,25');ok('Collection reduces party balance',c.call('party_entry',e)[0]==201 and balance(pid)==95000)
ok('Collection updates cash and claims consistently',cash()==before+25025 and invariant())
ok('Overcollection rejected',c.call('party_entry',entry(kind='Tahsilat',amount='10000'))[0]==422)
ok('Unknown account rejected',c.call('party_entry',entry(kind='Tahsilat',account='missing',amount='5'))[0]==422)
ok('Invalid date rejected',c.call('party_entry',entry(date='2026-02-30'))[0]==422)
ok('Future entry rejected',c.call('party_entry',entry(date='2026-10-10'))[0]==422)
ok('Validation preserves balance',balance(pid)==95000 and invariant())
ok('Payable accrual succeeds',c.call('party_entry',entry(kind='Borç',amount='300'))[0]==201 and balance(pid)==65000)
ok('Payment reduces payable and cash',c.call('party_entry',entry(kind='Ödeme',amount='100'))[0]==201 and balance(pid)==75000 and cash()==before+15025 and invariant())
r=c.call('party',id=pid)[1];ok('Creator and running balances returned',r['entries'][-1]['balance_cents']==75000 and r['entries'][-1]['creator']==USER.split(' ')[0])
edit={**r['party'],'requestId':str(uuid.uuid4()),'name':'Güncel Test','type':'Personel'};ok('Party edit succeeds',c.call('party_save',edit)[0]==201)
ok('Edit preserves balances',balance(pid)==75000 and invariant())
ok('Stale edit blocked',c.call('party_save',{**edit,'requestId':str(uuid.uuid4())})[0]==422)
ok('Creator and type independent',c.call('parties',q='Güncel',type='Personel')[1]['parties'][0]['id']==pid)
clients=[Client(),Client()]
for cl in clients:cl.login()
e=entry(amount='1.01');n=len(c.call('party',id=pid)[1]['entries'])
with concurrent.futures.ThreadPoolExecutor() as pool:results=list(pool.map(lambda cl:cl.call('party_entry',e),clients))
ok('Concurrent retries write one ledger record',all(s in [200,201] for s,_ in results) and len(c.call('party',id=pid)[1]['entries'])==n+1 and balance(pid)==75101 and invariant())
other=Client();other.login();ok('New session sees stored cari',other.call('party',id=pid)[1]['party']['balance_cents']==75101)
# Settle via original claim API to check bidirectional module integration.
s=c.call('state')[1];claim=next(x for x in s['claims'] if x['name']=='Güncel Test' and x['type']=='alacak')
m=dict(kind='Tahsilat',amount='10',account='bank',target='saving',date='2026-10-09',name='Güncel Test',desc='Legacy payment',claimId=claim['id'],requestId=str(uuid.uuid4()))
ok('Original claim API remains linked',c.call('movement',m)[0]==201 and balance(pid)==74101 and invariant())
ok('No missing party returns data',c.call('party',id=9999999)[0]==422)
print(json.dumps({'passed':len(passed),'failed':0},ensure_ascii=False))
