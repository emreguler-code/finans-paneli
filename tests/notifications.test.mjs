import test from 'node:test';
import assert from 'node:assert/strict';
import {recentEvents,orderNotifications,notificationSource,readableAlertDetail} from '../src/notification-utils.mjs';
import {currentVehicleRecord,vehicleRecordStatus,vehiclePaid} from '../src/tracking-utils.mjs';
test('Party recent panels use net party effect and exclude zero, planned and cancelled records',()=>{
 const data={today:'2026-10-13',events:[{id:1,party_id:1,event_date:'2026-10-13',event_time:'10:00',party_effect:300,cash_effect:-900},{id:2,party_id:1,event_date:'2026-10-13',event_time:'11:00',party_effect:-200,cash_effect:500},{id:3,party_id:1,event_date:'2026-10-13',party_effect:100,scheduled:true},{id:4,party_id:1,event_date:'2026-10-13',party_effect:100,cancelled:true},{id:5,party_id:1,event_date:'2026-10-13',party_effect:0}]};
 assert.deepEqual(recentEvents(data,{source:'parties',sign:1}).map(e=>e.id),[1]);assert.deepEqual(recentEvents(data,{source:'parties',sign:-1}).map(e=>e.id),[2]);
});
test('Notifications have stable deduplicated severity order and source classification',()=>{
 const a={id:'kmh-1',page:'Hesaplar',level:'info'},b={id:'claim-1',page:'Ödeme Planı',level:'danger',date:'2026-10-10'};assert.deepEqual(orderNotifications([a,b,a]).map(x=>x.id),['claim-1','kmh-1']);assert.equal(notificationSource(b),'parties');assert.match(readableAlertDetail('Vade 2026-10-15'),/15 Eki 2026/);
});
test('Vehicle current policy does not replace valid coverage with a future renewal',()=>{
 const records=[{id:1,active:true,type:'insurance',date:'2025-10-20',end_date:'2026-10-20'},{id:2,active:true,type:'insurance',date:'2026-10-20',end_date:'2027-10-20'}];assert.equal(currentVehicleRecord(records,'insurance','2026-10-13').id,1);assert.equal(currentVehicleRecord(records,'insurance','2026-10-21').id,2);
});
test('Policy validity and payment status remain independent and estimates do not become payments',()=>{
 const data={today:'2026-10-13',events:[{id:1,operation:'expense',amount_cents:4000,cash_effect:-4000}]},r={id:1,active:true,type:'casco',date:'2026-01-01',end_date:'2027-01-01',amount_cents:10000,payment_events:[1]};assert.equal(vehicleRecordStatus(r,{km:100},data).text,'Geçerli');assert.equal(vehiclePaid(r,data),4000);assert.equal(vehiclePaid({...r,payment_events:[],estimated:true},data),0);
});
