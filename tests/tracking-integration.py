"""Executed in the isolated finance integration fixture; no production access."""
# Uses call/post/state/entity/ok/event from finance-integration.py.
baseline=state()
code,r=post('vehicle_save',plate='34 QA 180',name='Deneme araç',year=2024,km=45000);assert code==200,r
vehicle=r['id'];ok('Vehicle persisted and plate normalized',entity('vehicles',vehicle)['plate']=='34QA180')
ok('Vehicle kind and body style are validated',post('vehicle_save',plate='99QA999',name='Invalid',vehicle_kind='plane')[0]==422)
ok('Duplicate vehicle plate rejected',post('vehicle_save',plate='34QA180',name='Diğer')[0]==422)
code,r=post('vehicle_save',**{**entity('vehicles',vehicle),'km':46000,'vehicle_kind':'motorcycle'});ok('Vehicle edits require version',code==200 and entity('vehicles',vehicle)['km']==46000 and entity('vehicles',vehicle)['vehicle_kind']=='motorcycle')
ok('Stale vehicle edit rejected',post('vehicle_save',**{**entity('vehicles',vehicle),'version':1})[0]==422)
payment=event(amount='100',description='Araç için gerçekleşmiş gider')
record=dict(vehicle_id=vehicle,type='insurance',title='Deneme trafik poliçesi',date='2026-10-01',end_date='2027-10-01',due_date='2026-10-25',amount='300',reminder_days=30,installments=[dict(date='2026-10-25',amount='150'),dict(date='2026-11-25',amount='150')],payment_events=[payment])
financial=state();signature=lambda s:([a['balance_cents'] for a in s['accounts']],[c['debt'] for c in s['cards']],len(s['events']))
code,r=post('vehicle_record_save',**record);assert code==200,r;record_id=r['id'];ok('Vehicle policy, full installment schedule and payment link persist',entity('vehicle_records',record_id)['payment_events']==[payment])
ok('Same payment cannot be counted for two vehicle records',post('vehicle_record_save',**record)[0]==422)
ok('Incomplete installment total rejected',post('vehicle_record_save',**{**record,'payment_events':[],'amount':'400'})[0]==422)
ok('Overlinked payment rejected',post('vehicle_record_save',**{**record,'payment_events':[payment],'amount':'99','installments':[]})[0]==422)
ok('Income cannot be linked as vehicle payment',post('vehicle_record_save',**{**record,'payment_events':[event(operation='income',amount='20')],'installments':[]})[0]==422)
# Snapshot after creating the test income; metadata must leave this snapshot unchanged.
financial=state()
code,r=post('vehicle_record_save',**{**record,'id':record_id,'version':entity('vehicle_records',record_id)['version'],'payment_events':[]});assert code==200,r
code,r=call('audit',entity='vehicle_record',id=record_id);ok('Vehicle payment link changes are audited',code==200 and any('payment_events' in (log['before_json'] or '') for log in r['logs']))
c=state()['cards'][0]['id'];purchase=event(cardId=c,account='',amount='500',description='Kampanya denemesi')
campaign=dict(name='Deneme puan kampanyası',start_date='2026-10-01',end_date='2026-10-31',participation='joined',reward_type='points',reward_mode='percent',reward_value='10',per_tx_cap='40',total_cap='100',min_spend='100',required_count=1,card_ids=[c],party_ids=[],tags=[],pos_programs=[])
financial=state();code,r=post('campaign_save',**campaign);assert code==200,r;campaign_id=r['id'];ok('Campaign conditions persist separately from ledger',entity('campaigns',campaign_id)['min_spend_cents']==10000)
ok('Campaign negative reward rejected',post('campaign_save',**{**campaign,'reward_value':'-1'})[0]==422)
ok('Campaign invalid date range rejected',post('campaign_save',**{**campaign,'start_date':'2026-11-01'})[0]==422)
ok('Campaign unsafe source link rejected',post('campaign_save',**{**campaign,'source_url':'javascript:alert(1)'})[0]==422)
code,r=post('campaign_entry_save',campaign_id=campaign_id,event_id=purchase,received='25',confirmed=True);assert code==200,r;entry=r['id'];ok('Received campaign points persist',entity('campaign_entries',entry)['received']==25)
ok('Duplicate purchase campaign link rejected',post('campaign_entry_save',campaign_id=campaign_id,event_id=purchase,received='0')[0]==422)
ok('Cash movement cannot enter card campaign',post('campaign_entry_save',campaign_id=campaign_id,event_id=payment,received='0')[0]==422)
ok('Tracking metadata never changes balances or creates ledger transactions',signature(financial)==signature(state()))
# Entity reason optional; financial correction still requires it.
p=state()['parties'][0];code,r=post('party_save',**{**p,'name':p['name']+' opsiyonel','reason':''});ok('Party edit reason is optional',code==200)
e=entity('events',purchase);ok('Financial edit reason remains required',post('event_save',**{**e,'id':purchase,'version':e['version'],'operation':'expense','cardId':c,'account':'','amount':'500','settled':'0','date':e['event_date'],'periodDate':e['period_date'],'reason':''})[0]==422)
# Viewer can read metadata but cannot mutate it.
code,r=post('user_save',username='tracking-viewer',shortName='Takip',password='ReadOnly180!x',role='viewer');assert code==200,r
call('logout',{});call('session');code,r=call('login',dict(username='tracking-viewer',password='ReadOnly180!x'));assert code==200,r
ok('Viewer reads new tracking modules',len(state()['vehicles'])>0 and len(state()['campaigns'])>0)
ok('Viewer cannot create vehicles',post('vehicle_save',plate='06QA180',name='Yetkisiz')[0]==403)
ok('Viewer cannot edit campaign',post('campaign_save',**{**campaign,'id':campaign_id,'version':1})[0]==403)
call('logout',{});call('session');code,r=call('login',dict(username=os.environ['API_TEST_USERNAME'],password=os.environ['API_TEST_PASSWORD']));assert code==200,r
