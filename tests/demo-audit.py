"""Independent reconciliation of a large, fictional seven-month demo."""
import os,json,uuid,urllib.request,http.cookiejar,datetime,collections
from pathlib import Path
op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));csrf='';checks=[]
def call(action,body=None):
 global csrf
 r=op.open(urllib.request.Request(os.environ['API_TEST_URL']+'?action='+action,data=None if body is None else json.dumps(body).encode(),headers={'Content-Type':'application/json','X-CSRF-Token':csrf}))
 d=json.load(r);csrf=d.get('csrf',csrf);return d
def ok(name,value):
 assert value,name
 checks.append(name);print('PASS',name,flush=True)
call('session');call('login',{'username':os.environ['API_TEST_USERNAME'],'password':os.environ['API_TEST_PASSWORD']});call('update_apply',{})
call('demo_seed',{'requestId':str(uuid.uuid4())})
s=call('state');before=next(a['balance_cents'] for a in s['accounts'] if a['id']=='bank')
payload={'requestId':str(uuid.uuid4()),'operation':'expense','account':'bank','amount':'37.49','date':'2026-10-13','description':'Demo iptal edilmiş gider'}
id=call('event_save',payload)['id'];ok('Large demo write subtracts exact cents',next(a['balance_cents'] for a in call('state')['accounts'] if a['id']=='bank')==before-3749)
e=next(e for e in call('state')['events'] if e['id']==id)
call('event_save',{**payload,'id':id,'version':e['version'],'requestId':str(uuid.uuid4()),'amount':'49.99','reason':'Demo düzenleme kontrolü'})
ok('Editing replaces old cash effect',next(a['balance_cents'] for a in call('state')['accounts'] if a['id']=='bank')==before-4999)
for cancelled in [True,False,True]:
 e=next(e for e in call('state')['events'] if e['id']==id)
 call('event_status',{'id':id,'version':e['version'],'cancelled':cancelled,'reason':'Demo iptal / geri açma çapraz kontrolü','requestId':str(uuid.uuid4())})
 ok('Cancel/restore preserves balance '+str(cancelled),next(a['balance_cents'] for a in call('state')['accounts'] if a['id']=='bank')==before-(0 if cancelled else 4999))
s=call('state');events=s['events'];active=[e for e in events if not e['cancelled'] and not e['scheduled']]
ok('Large demo covers at least 500 rows and seven months',len(events)>=500 and len({e['event_date'][:7] for e in active})==7)
ok('Large demo has ten parties and three cards',len(s['parties'])==10 and len(s['cards'])==3)
call('login',{'username':os.environ['API_TEST_USERNAME'],'password':os.environ['API_TEST_PASSWORD']});ok('Administrator survives comprehensive reset',call('state')['user']['role']=='admin')
# Calculate expected cash from business operations, independently of API cash_effect.
def cash(e):
 if e['scheduled']:return 0
 op=e['operation'];n=e['amount_cents'];settled=e['settled_cents']
 if op in ['sale','purchase_invoice','purchase_no_invoice']:return (settled if op=='sale' else -settled) if e['account_id'] else 0
 if e['card_id'] and op not in ['cash_advance','card_payment']:return 0
 return n if op in ['income','collection','refund','cash_advance'] else -n if op in ['expense','payment','employee_expense','card_payment','return_payment'] else 0
for a in s['accounts']:
 total=int(a['opening_cents'])
 for e in active:
  if e['operation']=='transfer':total+=e['amount_cents']*((1 if e['target_id']==a['id'] else 0)-(1 if e['account_id']==a['id'] else 0))
  elif e['account_id']==a['id']:total+=cash(e)
 ok('Opening plus real movements equals balance: '+a['name'],total==a['balance_cents'])
for e in events:ok('Cash projection event '+str(e['id']),cash(e)==e['cash_effect'])
# Party gross sign and immediate settlement must reconcile to the balance.
for p in s['parties']:
 total=0
 for e in active:
  if e['party_id']!=p['id']:continue
  sign=1 if e['operation'] in ['sale','supplier_return','employee_purchase','employee_expense','payment','return_payment'] else -1
  total+=sign*(e['amount_cents']-e['settled_cents'])
 ok('Party balance reconciles: '+p['name'],total==p['balance_cents'])
months=collections.defaultdict(lambda:{'incoming':0,'outgoing':0,'count':0});weeks=collections.defaultdict(lambda:{'incoming':0,'outgoing':0,'count':0})
for e in active:
 n=cash(e);d=datetime.date.fromisoformat(e['event_date']);week=(d-datetime.timedelta(days=d.weekday())).isoformat()
 for row in [months[e['event_date'][:7]],weeks[week]]:
  row['incoming']+=max(n,0);row['outgoing']+=max(-n,0);row['count']+=1
ok('Weekly and monthly incoming agree',sum(r['incoming'] for r in months.values())==sum(r['incoming'] for r in weeks.values()))
ok('Weekly and monthly outgoing agree',sum(r['outgoing'] for r in months.values())==sum(r['outgoing'] for r in weeks.values()))
ok('Global cash delta equals report net (transfers cancel)',sum(a['balance_cents']-int(a['opening_cents']) for a in s['accounts'])==sum(r['incoming']-r['outgoing'] for r in months.values()))
for c in s['cards']:
 own=[e for e in active if e['card_id']==c['id'] or e['target_card_id']==c['id']]
 latest=c['statements'][-1];cut=latest['cut_date'];paid=0;post=0
 for e in own:
  effect=(-e['amount_cents'] if e['target_card_id']==c['id'] else (e['amount_cents'] if e['operation'] in ['expense','payment','cash_advance','card_transfer'] else -e['amount_cents']))
  repayment=e['target_card_id']==c['id'] or e['operation']=='card_payment'
  if repayment and e['event_date']>cut:paid-=effect
  elif not repayment and e['period_date']>cut:post+=effect
 expected=int(latest['total_cents'])-paid+post
 ok('Card debt equals latest statement minus payments plus unbilled: '+c['name'],expected==round(c['debt']*100))
 ok('Card available limit reconciles: '+c['name'],int(c['limit_cents'])-expected==c['available_cents'])
 for st in c['statements']:
  ok('Statement carry + known + difference = total '+str(st['id']),st['carry_cents']+st['known_cents']+st['difference_cents']==int(st['total_cents']))
installments=[e for e in events if e['description'].startswith('Demo kuruşlu altı taksit')]
ok('Six installments preserve exact cents',len(installments)==6 and sum(e['amount_cents'] for e in installments)==123457)
ok('Scheduled movements do not change cash',all(e['cash_effect']==0 for e in events if e['scheduled']))
out=Path(os.environ['QA_OUTPUT_DIR']);out.mkdir(parents=True,exist_ok=True)
(out/'demo-state.json').write_text(json.dumps(s,ensure_ascii=False,indent=2))
(out/'reconciliation.json').write_text(json.dumps({'passed':len(checks),'events':len(events),'months':dict(sorted(months.items())),'weeks':dict(sorted(weeks.items())),'checks':checks},ensure_ascii=False,indent=2))
print('PASS comprehensive demo reconciliation:',len(checks),'checks;',len(events),'events;',len(weeks),'weeks')
