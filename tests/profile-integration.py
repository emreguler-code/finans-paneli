# Optional party metadata must round-trip without changing any financial facts.
s=state();pid=next(p['id'] for p in s['parties'] if p['type']=='Tedarikçi')
def save_profile(pid,profile):
 p=entity('parties',pid)
 return post('party_save',id=pid,version=p['version'],name=p['name'],title=p['title'],type=p['type'],profile=profile)
before=state()
ok('Supplier visit days round-trip and are deduplicated',save_profile(pid,{'visit_days':[5,3,1,3]})[0]==200 and entity('parties',pid)['profile']['visit_days']==[1,3,5])
ok('Visit weekdays reject out-of-range values',save_profile(pid,{'visit_days':[0,8]})[0]==422)
pid=next(p['id'] for p in s['parties'] if p['type']=='Personel')
paid=event(operation='payment',partyId=pid,amount='23',account='bank',description='Profile explicit payment')
base={'staff_month':'2026-10','salary_payments':[paid],'meal_payments':[],'meal_due_cents':300000,'leave_week':'2026-10-12','leave_used':1,'leave_total':2}
before=state();ok('Staff payment assignment and leave metadata round-trip',save_profile(pid,base)[0]==200 and entity('parties',pid)['profile']['salary_payments']==[paid])
ok('One payment cannot count as both salary and meals',save_profile(pid,{**base,'meal_payments':[paid]})[0]==422)
ok('Leave used cannot exceed weekly entitlement',save_profile(pid,{**base,'leave_used':3})[0]==422)
ok('Leave week must start on Monday',save_profile(pid,{**base,'leave_week':'2026-10-13'})[0]==422)
ok('Payment references must belong to selected employee',save_profile(pid,{**base,'salary_payments':[before['events'][0]['id']]})[0]==422)
after=state();ok('Staff metadata never creates financial transactions or changes balances',before['events']==after['events'] and [a['balance_cents'] for a in before['accounts']]==[a['balance_cents'] for a in after['accounts']])
plan={**base,'work_calendar':{'2026-10-12':'morning','2026-10-13':'evening','2026-10-14':'weekly_leave','2026-10-15':'annual_leave','2026-10-16':'sick_leave'}}
ok('Date-based schedule round-trips without financial movement',save_profile(pid,plan)[0]==200 and entity('parties',pid)['profile']['work_calendar']==plan['work_calendar'] and state()['events']==before['events'])
ok('Schedule rejects impossible dates',save_profile(pid,{**base,'work_calendar':{'2026-02-30':'morning'}})[0]==422)
ok('Schedule rejects invented shift types',save_profile(pid,{**base,'work_calendar':{'2026-10-12':'night'}})[0]==422)
ok('Schedule rejects a list instead of dated entries',save_profile(pid,{**base,'work_calendar':['morning']})[0]==422)
