# Runs with the isolated finance integration fixture and existing helpers.
for pid,operation,sign in [(supplier,'purchase_invoice',-1),(customer,'sale',1)]:
 for source in ['cash','card']:
  before=state();ac0=entity('accounts','bank')['balance_cents'];card0=entity('cards',card)['debt'];bal0=entity('parties',pid)['balance_cents']
  payload=dict(requestId=str(uuid.uuid4()),operation=operation,partyId=pid,amount='100',settled='150',applyExcess=True,date=before['today'],time='11:15',account='bank' if source=='cash' else '',cardId=card if source=='card' else '',description='Excess integration')
  code,r=call('event_save',payload);assert code==200,r
  parent=entity('events',r['id']);child=next(e for e in state()['events'] if e.get('managed_parent_id')==parent['id'])
  ok('Excess '+operation+' '+source+' closes gross and applies only remainder',parent['settled_cents']==10000 and parent['excess_payment_cents']==5000 and child['amount_cents']==5000 and entity('parties',pid)['balance_cents']==bal0-sign*5000)
  ok('Excess source total posts once',entity('accounts','bank')['balance_cents']==ac0+(sign*15000 if source=='cash' else 0) and round(entity('cards',card)['debt']*100)==round(card0*100)+(-sign*15000 if source=='card' else 0))
  code,retry=call('event_save',payload)
  ok('Excess retry creates no duplicate',code==200 and retry['id']==parent['id'] and len(state()['events'])==len(before['events'])+2)
  ok('Managed child cannot be edited directly',post('event_save',**{**{k:v for k,v in payload.items() if k!='requestId'},'id':child['id'],'version':child['version'],'reason':'Direct edit'})[0]==422)
  # Edit down to no excess; it must not return when parent is later cancelled/restored.
  edit={**payload,'requestId':str(uuid.uuid4()),'id':parent['id'],'version':parent['version'],'settled':'25','reason':'Remove excess'}
  code,r=call('event_save',edit);assert code==200,r
  ok('Editing removes previous excess and restores source exactly',entity('parties',pid)['balance_cents']==bal0+sign*7500 and entity('accounts','bank')['balance_cents']==ac0+(sign*2500 if source=='cash' else 0))
  _,history=call('audit',entity='event',id=parent['id']);change=next(l for l in history['logs'] if l['operation']=='edit')
  ok('Parent history includes changed excess distribution',json.loads(change['before_json'])['excess_payment_cents']==5000 and json.loads(change['after_json'])['excess_payment_cents']==0)

  for cancelled in [True,False]:
   pe=entity('events',parent['id']);code,r=post('event_status',id=pe['id'],version=pe['version'],cancelled=cancelled,reason='Status linked check');assert code==200,r
  ok('Removed excess stays cancelled after parent restore',entity('events',child['id'])['cancelled']==1)
  pe=entity('events',parent['id']);edit.update(requestId=str(uuid.uuid4()),version=pe['version'],settled='150');code,r=call('event_save',edit);assert code==200,r
  pe=entity('events',parent['id']);code,r=post('event_status',id=pe['id'],version=pe['version'],cancelled=True,reason='Cancel linked');assert code==200,r
  ok('Cancellation reverses parent and excess atomically',entity('parties',pid)['balance_cents']==bal0 and entity('accounts','bank')['balance_cents']==ac0 and entity('events',child['id'])['cancelled']==1)
  pe=entity('events',parent['id']);code,r=post('event_status',id=pe['id'],version=pe['version'],cancelled=False,reason='Restore linked');assert code==200,r
  ok('Restore reactivates only its controlled excess',entity('parties',pid)['balance_cents']==bal0-sign*5000 and entity('events',child['id'])['cancelled']==0)

code,created=post('party_save',name='Advance-only supplier',type='Tedarikçi',title='',opening='0')
assert code==200,created
pid=created['id'];parent=event(operation='purchase_invoice',partyId=pid,amount='100',settled='150',applyExcess=True)
child=next(e for e in state()['events'] if e.get('managed_parent_id')==parent)
ok('Unmatched excess is a real tracked advance',any(a['id']==child['id'] and a['amount_cents']==5000 for a in state()['advances']))
ok('Legacy opening path cannot rewrite a controlled payment',post('event_save',id=child['id'],version=child['version'],kind='Açılış',amount='10',date=state()['today'],partyId=pid,reason='Direct opening')[0]==422)
