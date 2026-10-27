"""Real PHP/MariaDB integration checks. Use only an isolated fictional test database."""
from pathlib import Path
import json,uuid,urllib.request,urllib.error,http.cookiejar,os
URL=os.environ.get('API_TEST_URL','http://127.0.0.1:8088/api/index.php')
op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()));csrf='';checks=[]
def call(action,body=None,**params):
 global csrf
 from urllib.parse import urlencode
 r=urllib.request.Request(URL+'?'+urlencode({'action':action,**params}),data=json.dumps(body).encode() if body is not None else None,headers={'Content-Type':'application/json','X-CSRF-Token':csrf})
 try:
  response=op.open(r);code=response.status;data=json.load(response)
 except urllib.error.HTTPError as e:code=e.code;data=json.load(e)
 if 'csrf' in data:csrf=data['csrf']
 return code,data
def post(action,**kw):return call(action,dict(requestId=str(uuid.uuid4()),**kw))
def ok(name,test):
 assert test,name
 checks.append(name);print('PASS',name,flush=True)
def state():
 code,s=call('state');assert code==200,s;return s
def entity(key,id):return next(x for x in state()[key] if x['id']==id)
def event(**b):
 payload=dict(operation='expense',amount='100',settled='0',date='2026-10-13',time='12:00',description='Integration',account='bank',periodDate='2026-10-13');payload.update(b)
 code,r=post('event_save',**payload);assert code==200,r;return r['id']
call('session')
code,r=call('login',dict(username=os.environ['API_TEST_USERNAME'],password=os.environ['API_TEST_PASSWORD']));assert code==200,r
code,r=call('update_apply',{});ok('Schema 11 update succeeds',code==200)
ok('Schema 11 active',state()['schemaVersion']==11)
code,r=post('demo_seed',profile='compact');assert code==200,r
ok('Demo seed succeeds',r.get('demoReady'))
ok('Administrator login survives demo reset',call('login',dict(username=os.environ['API_TEST_USERNAME'],password=os.environ['API_TEST_PASSWORD']))[0]==200)
s=state();ok('Demo has 4 accounts including KMH and 3 cards',len(s['accounts'])==4 and len(s['cards'])==3)
supplier=next(p for p in s['parties'] if p['type']=='Tedarikçi')['id'];person=next(p for p in s['parties'] if p['type']=='Personel')['id'];customer=next(p for p in s['parties'] if p['type']=='Müşteri')['id'];card=s['cards'][0]['id'];card2=s['cards'][1]['id']
before=entity('accounts','bank')['balance_cents'];balance=entity('parties',supplier)['balance_cents']
id=event(operation='purchase_invoice',partyId=supplier,amount='1000',settled='250',due='')
ok('Partial invoice moves only settled cash',entity('accounts','bank')['balance_cents']==before-25000)
ok('Partial invoice leaves only net cari debt',entity('parties',supplier)['balance_cents']==balance-75000)
ok('No invented due date',entity('events',id)['due_date'] is None)
before=entity('accounts','bank')['balance_cents'];balance=entity('parties',person)['balance_cents'];event(operation='salary',partyId=person,amount='5000')
ok('Salary accrual changes no cash',entity('accounts','bank')['balance_cents']==before)
ok('Salary creates personnel payable',entity('parties',person)['balance_cents']==balance-500000)
before=entity('accounts','bank')['balance_cents'];balance=entity('parties',person)['balance_cents'];event(operation='employee_expense',partyId=person,amount='300')
ok('Company payment on behalf creates receivable',entity('parties',person)['balance_cents']==balance+30000)
ok('Company payment on behalf moves cash once',entity('accounts','bank')['balance_cents']==before-30000)
before=entity('accounts','bank')['balance_cents'];balance=entity('parties',customer)['balance_cents'];event(operation='sale',partyId=customer,amount='2000',settled='750')
ok('Partial sale leaves receivable',entity('parties',customer)['balance_cents']==balance+125000)
ok('Partial sale collects once',entity('accounts','bank')['balance_cents']==before+75000)
id=event(operation='supplier_return',partyId=supplier,amount='500',settled='200')
before=entity('accounts','bank')['balance_cents'];event(operation='collection',partyId=supplier,linkedId=id,amount='100')
ok('Later supplier return collection moves cash once',entity('accounts','bank')['balance_cents']==before+10000)
ok('Supplier generic collection without return rejected',post('event_save',operation='collection',partyId=supplier,amount='100',settled='0',date=s['today'],account='bank')[0]==422)
ok('Cari transfer rejected',post('event_save',operation='transfer',partyId=supplier,amount='100',settled='0',date=s['today'],account='bank',target='cash')[0]==422)
before=entity('accounts','bank')['balance_cents'];debt=entity('cards',card)['debt'];event(operation='payment',partyId=supplier,amount='100',cardId=card,account='')
ok('Cari card payment leaves bank balance unchanged',entity('accounts','bank')['balance_cents']==before)
ok('Cari card payment increases card debt once',round(entity('cards',card)['debt']*100)==round(debt*100)+10000)
st=entity('cards',card)['statements'][-1];total=st['total_cents'];diff=st['difference_cents'];before=entity('accounts','bank')['balance_cents']
id=event(operation='expense',cardId=card,account='',amount='1000',date='2026-10-08',periodDate='2026-10-08')
c=entity('cards',card);ok('Historical statement detail retains bank statement total',c['statements'][-1]['total_cents']==total)
ok('Historical detail reduces statement difference',c['statements'][-1]['difference_cents']==diff-100000)
ok('Historical detail does not duplicate statement debt',round(c['debt']*100)==round((debt+100)*100))
ok('Statement detail never changes bank',entity('accounts','bank')['balance_cents']==before)
remaining=round(c['statement']*100);id=event(operation='card_payment',cardId=card,account='bank',amount='500',linkedId=st['id'])
ok('Repayment reduces statement remaining',round(entity('cards',card)['statement']*100)==remaining-50000)
ok('Repayment reduces bank once',entity('accounts','bank')['balance_cents']==before-50000)
e=entity('events',id);post('event_status',id=id,version=e['version'],cancelled=True,reason='Payment correction')
ok('Cancelling real payment restores remaining',round(entity('cards',card)['statement']*100)==remaining)
ok('Cancelling real payment restores bank',entity('accounts','bank')['balance_cents']==before)
before=entity('accounts','bank')['balance_cents'];id=event(operation='expense',scheduled=True,date='2026-10-25',due='2026-10-25',amount='800')
ok('Planned bank expense does not change balance',entity('accounts','bank')['balance_cents']==before)
ok('Scheduled expense cash effect zero',entity('events',id)['cash_effect']==0)
e=entity('events',id);code,r=post('event_save',id=id,version=e['version'],operation='expense',amount='800',settled='0',date=s['today'],time='12:00',account='bank',scheduled=False,reason='Realized')
ok('Realizing planned expense succeeds',code==200)
ok('Realized expense changes balance once',entity('accounts','bank')['balance_cents']==before-80000)
e=entity('events',id);ok('Blank tag becomes General',e['tag']=='Genel')
debt=entity('cards',card2)['debt'];id=event(operation='expense',cardId=card2,account='',amount='1000,01',installments=3)
parts=[e for e in state()['events'] if e['installment_group']==entity('events',id)['installment_group']]
ok('Installments preserve exact total cents',sum(e['amount_cents'] for e in parts)==100001 and len(parts)==3)
ok('Future installments reserve limit immediately',round(entity('cards',card2)['debt']*100)==round(debt*100)+100001)
ok('Future periods are retained',max(e['period_date'] for e in parts)=='2026-12-13')
before=sum(a['balance_cents'] for a in state()['accounts']);event(operation='transfer',amount='200',account='bank',target='cash')
ok('Bank cash transfer preserves total cash',sum(a['balance_cents'] for a in state()['accounts'])==before)
before=entity('accounts','cash')['balance_cents'];debt=entity('cards',card2)['debt'];event(operation='cash_advance',amount='100',account='cash',cardId=card2)
ok('Cash advance adds cash and card liability once',entity('accounts','cash')['balance_cents']==before+10000 and round(entity('cards',card2)['debt']*100)==round(debt*100)+10000)
# Deferred refunds remain separate from supplier payables; settlement never creates another return.
id=event(operation='supplier_return',partyId=supplier,amount='700',settled='0',returnMode='later',due='2026-10-21')
ok('Deferred supplier return has independent receivable',any(c['id']==id and c['amount_cents']==70000 and c['type']=='alacak' for c in state()['claims']))
event(operation='collection',partyId=supplier,linkedId=id,amount='200')
ok('Deferred supplier return partial settlement matches original',any(c['id']==id and c['amount_cents']==50000 for c in state()['claims']))
id=event(operation='customer_return',partyId=customer,amount='400',returnMode='later',due='2026-10-22')
ok('Deferred customer refund remains payable',any(c['id']==id and c['type']=='borç' and c['amount_cents']==40000 for c in state()['claims']))
event(operation='return_payment',partyId=customer,linkedId=id,amount='150')
ok('Customer refund payment reduces existing return',any(c['id']==id and c['amount_cents']==25000 for c in state()['claims']))
ok('Customer cannot use generic supplier purchase',post('event_save',operation='purchase_invoice',partyId=customer,amount='100',settled='0',date=s['today'],account='bank')[0]==422)
ok('Personnel cannot use merchandise purchase',post('event_save',operation='purchase_invoice',partyId=person,amount='100',settled='0',date=s['today'],account='bank')[0]==422)
ok('Other cari type cannot be created',post('party_save',name='Other test',type='Diğer',opening='0')[0]==422)
id=event(operation='expense',amount='111',tag='Otomotiv');e=entity('events',id)
ok('Financial editing requires a reason',post('event_save',id=id,version=e['version'],operation='expense',amount='112',settled='0',date=s['today'],time='12:00',account='bank')[0]==422)
code,r=post('event_save',id=id,version=e['version'],operation='expense',amount='112',settled='0',date=s['today'],time='12:00',account='bank',reason='Correction',tag='Gıda')
ok('Editing amount and tag succeeds together',code==200 and entity('events',id)['tag']=='Gıda')
ok('Stale version rejected',post('event_save',id=id,version=e['version'],operation='expense',amount='113',settled='0',date=s['today'],account='bank',reason='Stale')[0]==422)
key=str(uuid.uuid4());payload=dict(requestId=key,operation='expense',amount='17',settled='0',date=s['today'],account='bank',time='12:00')
code,r=call('event_save',payload);cid=r['id'];code,r=call('event_save',payload)
ok('Request retry returns same event, no duplicate balance',code==200 and r['id']==cid and r.get('duplicate'))
ok('Request key reuse with changed payload rejected',call('event_save',{**payload,'amount':'18'})[0]==422)
before=sum(a['balance_cents'] for a in state()['accounts']);origin=round(entity('cards',card2)['debt']*100);dest=round(entity('cards',card)['debt']*100)
event(operation='card_transfer',amount='100',account='',cardId=card2,targetCardId=card)
ok('Card transfer changes both liabilities exactly once',round(entity('cards',card2)['debt']*100)==origin+10000 and round(entity('cards',card)['debt']*100)==dest-10000)
ok('Card transfer creates no cash effect',sum(a['balance_cents'] for a in state()['accounts'])==before)
before=entity('cards',card)['statements'][-1]['total_cents'];debt=entity('cards',card)['debt']
event(operation='expense',cardId=card,account='',amount='30000',date='2026-10-08',periodDate='2026-10-08')
ok('Negative statement discrepancy is exposed',entity('cards',card)['statements'][-1]['difference_cents']<0)
ok('Excess known details do not silently change bank total',entity('cards',card)['statements'][-1]['total_cents']==before and entity('cards',card)['debt']==debt)
ok('Duplicate statement cut date rejected clearly',post('statement_save',cardId=card,date='2026-10-10',due='2026-10-20',total='16000')[0]==422)
bad=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
try:bad.open(URL+'?action=state');denied=False
except urllib.error.HTTPError as err:denied=err.code==401
ok('Anonymous data access denied',denied)
# A new statement supersedes the prior snapshot without charging the old statement again.
before=round(entity('cards',card)['debt']*100)
code,r=post('statement_save',cardId=card,date='2026-10-12',due='2026-10-22',total='17000')
ok('Next statement can be recorded',code==200)
ok('Next statement replaces snapshot, no cumulative statement duplication',round(entity('cards',card)['debt']*100)==before+100000)
remaining=round(entity('cards',card)['statement']*100);before=entity('accounts','bank')['balance_cents']
event(operation='card_payment',cardId=card,account='bank',amount='100',linkedId=st['id'])
ok('Paying old statement also reduces current carried debt',round(entity('cards',card)['statement']*100)==remaining-10000)
ok('Old-statement repayment still moves bank once',entity('accounts','bank')['balance_cents']==before-10000)
creditcard=state()['cards'][2]['id']
code,r=post('statement_save',cardId=creditcard,date='2026-10-10',due='2026-10-20',total='1000');assert code==200,r
before=entity('accounts','bank')['balance_cents'];event(operation='refund',cardId=creditcard,account='',amount='1500')
ok('Refund exceeding statement creates real card credit, no payable',round(entity('cards',creditcard)['debt']*100)==-50000 and entity('cards',creditcard)['statement']==0)
ok('Card refund creates no bank movement and releases available limit',entity('accounts','bank')['balance_cents']==before and entity('cards',creditcard)['available_cents']==entity('cards',creditcard)['limit_cents']+50000)
snapshot=json.dumps(state()['events'],sort_keys=True);ok('Repeated update is idempotent',call('update_apply',{})[0]==200 and json.dumps(state()['events'],sort_keys=True)==snapshot)
kmh=entity('accounts','kmh');snapshot=state()['events'];balance=kmh['balance_cents']
code,r=post('account_save',id='kmh',version=kmh['version'],name=kmh['name'],type=kmh['type'],creditLimit='50000',dailyInterestRate='0,15',active=True)
ok('KMH settings accept explicit daily rate and limit',code==200 and entity('accounts','kmh')['credit_limit_cents']==5000000 and float(entity('accounts','kmh')['daily_interest_rate'])==.15)
ok('KMH estimate settings create no cash event',entity('accounts','kmh')['balance_cents']==balance and state()['events']==snapshot)
kmh=entity('accounts','kmh');code,r=post('account_save',id='kmh',version=kmh['version'],name=kmh['name'],type=kmh['type'],creditLimit='0',dailyInterestRate='',active=True)
ok('KMH zero limit rejected',code==422)
kmh=entity('accounts','kmh');code,r=post('account_save',id='kmh',version=kmh['version'],name=kmh['name'],type=kmh['type'],creditLimit='50000',dailyInterestRate='-1',active=True)
ok('Negative daily rate rejected',code==422)
kmh=entity('accounts','kmh');code,r=post('account_save',id='kmh',version=kmh['version'],name=kmh['name'],type=kmh['type'],creditLimit='50000',dailyInterestRate='',active=True)
ok('Missing rate stays null and is not invented',code==200 and entity('accounts','kmh')['daily_interest_rate'] is None)
id=event(operation='sale',partyId=customer,amount='1000',settled='1000',time='15:43:21',document='FTR-123')
e=entity('events',id);ok('Fully collected sale retains gross and zero net',e['amount_cents']==100000 and e['party_effect']==0)
ok('Time and document persist exactly',e['event_time']=='15:43:21' and e['document_no']=='FTR-123')
# Lightweight party search must retain full-state balances and escaped literal search.
code,r=call('parties');s=state()
ok('Party search balances match full state',code==200 and {p['id']:p['balance_cents'] for p in r['parties']}=={p['id']:p['balance_cents'] for p in s['parties']})
ok('Party search totals retain global meaning',r['total']==len(s['parties']) and r['net_cents']==sum(p['balance_cents'] for p in s['parties']))
code,r=call('parties',type='Tedarikçi')
ok('Party search type filter preserved',code==200 and all(p['type']=='Tedarikçi' for p in r['parties']))
code,r=post('party_save',name='QA_% literal',type='Müşteri',opening='0');assert code==200,r
code,r=call('parties',q='QA_%')
ok('Party search treats SQL wildcards literally',code==200 and [p['name'] for p in r['parties']]==['QA_% literal'])
# Optional supplier POS metadata is independent of the financial ledger.
payload=dict(name='POS Deneme Tedarikçi',type='Tedarikçi',opening='0',pos_programs=['garanti:bonus','yapikredi:world'])
code,r=post('party_save',**payload);assert code==200,r;pos_id=r['id']
ok('Supplier supports multiple POS programs',entity('parties',pos_id)['pos_programs']==['garanti:bonus','yapikredi:world'])
def save_pos(**changes):
 p=entity('parties',pos_id);return post('party_save',**{**p,'reason':'POS seçenekleri denemesi',**changes})
counts=(len(state()['events']),sum(a['balance_cents'] for a in state()['accounts']))
code,r=save_pos(pos_programs=['akbank:axess','garanti:bonus','yapikredi:world']);ok('All three POS programs persist',code==200 and len(entity('parties',pos_id)['pos_programs'])==3)
p=entity('parties',pos_id);p.pop('pos_programs');code,r=post('party_save',**{**p,'reason':'Eski istemci denemesi'});ok('Omitted POS field preserves previous choices',code==200 and len(entity('parties',pos_id)['pos_programs'])==3)
code,r=call('parties',q='POS Deneme');ok('Party search returns structured POS choices',code==200 and len(r['parties'][0]['pos_programs'])==3)
for invalid in [None,'garanti:bonus',{'bank':'garanti'},['unknown:bonus'],['garanti:axess'],[False]]:
 ok('Invalid POS choices rejected '+str(invalid),save_pos(pos_programs=invalid)[0]==422)
ok('Rejected update preserves POS data',len(entity('parties',pos_id)['pos_programs'])==3)
code,r=save_pos(pos_programs=['akbank:axess','akbank:axess']);ok('Duplicate POS choices normalized',code==200 and entity('parties',pos_id)['pos_programs']==['akbank:axess'])
code,r=save_pos(pos_programs=[]);ok('All POS selections can be cleared',code==200 and entity('parties',pos_id)['pos_programs']==[])
code,r=save_pos(pos_programs=['garanti:bonus']);assert code==200,r
code,r=save_pos(type='Müşteri',pos_programs=[]);ok('Changing supplier type clears POS metadata',code==200 and entity('parties',pos_id)['pos_programs']==[])
ok('Non-supplier cannot receive POS metadata',save_pos(pos_programs=['garanti:bonus'])[0]==422)
ok('POS edits never change balances or create transactions',counts==(len(state()['events']),sum(a['balance_cents'] for a in state()['accounts'])))
code,r=call('audit',entity='party',id=pos_id);ok('POS changes are recorded in audit history',code==200 and any('pos_programs' in (l['after_json'] or '') for l in r['logs']))
# Optional link is metadata; setting/clearing it must never move money.
linked_before=state();test_card=linked_before['cards'][0]
def save_card_link(value):
 c=entity('cards',test_card['id'])
 return post('card_save',id=c['id'],version=c['version'],name=c['name'],holder=c['holder'],limit=str(c['limit_cents']/100),due=c['due'],statementDate=c['statement_date'],cutDay=c['cut_day'],lastFour=c['last_four'],linked_account_id=value)
ok('Card can explicitly link to a cash account',save_card_link('cash')[0]==200 and entity('cards',test_card['id'])['linked_account_id']=='cash')
ok('Unknown linked account is rejected',save_card_link('missing-account')[0]==422)
ok('Card link can be cleared',save_card_link('')[0]==200 and entity('cards',test_card['id'])['linked_account_id'] is None)
linked_after=state()
ok('Card linkage never changes financial facts',linked_before['events']==linked_after['events'] and [a['balance_cents'] for a in linked_before['accounts']]==[a['balance_cents'] for a in linked_after['accounts']] and [c['debt'] for c in linked_before['cards']]==[c['debt'] for c in linked_after['cards']])
exec(compile((Path(__file__).with_name('tracking-integration.py')).read_text(),'tracking-integration.py','exec'))
exec(compile((Path(__file__).with_name('profile-integration.py')).read_text(),'profile-integration.py','exec'))
Path(os.environ['QA_STATE_PATH']).write_text(json.dumps(state(),ensure_ascii=False))
print(json.dumps({'passed':len(checks),'failed':0}))
