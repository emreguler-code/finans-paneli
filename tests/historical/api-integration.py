"""Real PHP + MySQL HTTP integration checks. Use ONLY an isolated seeded test DB.
API_TEST_PASSWORD and API_TEST_SETUP_TOKEN are provided via environment, never committed.
Mutates the isolated test database. Recreate its schema and seed between runs.
"""
import os, json, uuid, urllib.request, urllib.error, http.cookiejar, concurrent.futures
BASE=os.environ.get('API_TEST_URL','http://127.0.0.1:8088/api/index.php')
USER=os.environ.get('API_TEST_USERNAME','test-admin')
PASSWORD=os.environ['API_TEST_PASSWORD']
TOKEN=os.environ.get('API_TEST_SETUP_TOKEN','')
class Client:
 def __init__(self):
  self.opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));self.csrf=''
 def call(self,action,body=None,csrf=True):
  headers={'Content-Type':'application/json'}
  if csrf:headers['X-CSRF-Token']=self.csrf
  request=urllib.request.Request(BASE+'?action='+action,data=json.dumps(body).encode() if body is not None else None,headers=headers)
  try:r=self.opener.open(request);status=r.status;data=json.load(r)
  except urllib.error.HTTPError as e:status=e.code;data=json.load(e)
  if 'csrf' in data:self.csrf=data['csrf']
  return status,data
 def login(self):
  _,s=self.call('session');assert self.call('setup' if s['setupRequired'] else 'login',dict(username=USER,password=PASSWORD,token=TOKEN))[0]==200
c=Client();passed=[]
def ok(name,condition):
 assert condition,name
 passed.append(name);print('PASS',name)
ok('Unauthorized state is denied',c.call('state')[0]==401)
c.call('session');ok('Missing CSRF is denied',c.call('login',dict(username=USER,password=PASSWORD),False)[0]==403)
c.login();status,initial=c.call('state');ok('Seed balances',status==200 and sum(a['balance'] for a in initial['accounts'])==124800 and sum(x['amount'] for x in initial['claims'] if x['type']=='alacak')==68500)
ok('Setup cannot run twice',c.call('setup',dict(username=USER,password=PASSWORD,token=TOKEN))[0] in [403,409])
def record(**kw):
 return dict(kind='Tahsilat',amount='10,25',account='bank',target='saving',date='2026-10-09',name='Integration test',desc='Automated isolated test',category='Diğer',document='',requestId=str(uuid.uuid4()),**kw)
def send(**kw):
 d=record();d.update(kw);return c.call('movement',d)
ok('More than two decimals rejected',send(amount='1.001')[0]==422)
ok('Negative amount rejected',send(amount='-1')[0]==422)
ok('Future date rejected',send(date='2026-10-10')[0]==422)
ok('Invalid calendar date rejected',send(date='2026-02-30')[0]==422)
ok('Unknown account rolls back',send(account='missing')[0]==422)
ok('Same-account transfer rejected',send(kind='Transfer',target='bank')[0]==422)
ok('Claim overpayment rejected',send(claimId=1,amount='8500.01')[0]==422)
ok('Claim type mismatch rejected',send(claimId=1,kind='Ödeme')[0]==422)
ok('Card overpayment rejected',send(cardId=1,kind='Kart ödemesi',amount='18300.01')[0]==422)
ok('Validation leaves data unchanged',c.call('state')[1]==initial)
r=record();status,data=c.call('movement',r);ok('Exact cents persist',status==201 and data['state']['accounts'][0]['balance']==96760.25)
ok('Same request is idempotent',c.call('movement',r)[1].get('duplicate') is True)
changed={**r,'amount':'20'};ok('Changed duplicate rejected',c.call('movement',changed)[0]==409)
send(kind='Ödeme',amount='10.25')
status,data=send(kind='Transfer',amount='2500');ok('Transfer preserves total cash',status==201 and sum(a['balance'] for a in data['state']['accounts'])==124800)
new=data['state']['tx'];legs=[x for x in new if x['kind']=='Transfer'];ok('Transfer creates balanced pair',len(legs)==2 and sum(x['amount'] for x in legs)==0)
send(kind='Transfer',amount='2500',account='saving',target='bank')
status,data=send(claimId=1,amount='1000');ok('Partial collection reduces receivable',status==201 and next(x['amount'] for x in data['state']['claims'] if x['id']==1)==7500)
status,data=send(cardId=1,kind='Kart ödemesi',amount='1000');ok('Card payment updates debt and statement',status==201 and data['state']['cards'][0]['debt']==17300 and data['state']['cards'][0]['statement']==11300)
other=Client();other.login();ok('New session sees persistent values',other.call('state')[1]==c.call('state')[1])
# Repeated network requests from independent sessions must insert one entry only.
clients=[Client(),Client()]
for a in clients:a.login()
r=record();before=len(c.call('state')[1]['tx'])
with concurrent.futures.ThreadPoolExecutor() as pool:results=list(pool.map(lambda cl:cl.call('movement',r),clients))
ok('Concurrent retries insert once',all(s in [200,201] for s,_ in results) and len(c.call('state')[1]['tx'])==before+1)
c.call('logout',{});ok('Logout revokes access',c.call('state')[0]==401)
print(json.dumps({'passed':len(passed),'failed':0,'checks':passed},ensure_ascii=False))
