import test from 'node:test';
import assert from 'node:assert/strict';
import {operationDirection,grossPartyAmount,kmhUsage,hasMaturity} from '../src/v16-utils.mjs';
test('Cari gross amount stays distinct from partial or complete settlement',()=>{
 const e={party_id:1,kind:'Alacak',amount_cents:100000,settled_cents:30000,party_effect:70000};
 assert.equal(grossPartyAmount(e),100000);assert.equal(grossPartyAmount({...e,settled_cents:100000,party_effect:0}),100000);
});
test('Picker and ledger directions agree for every approved cari operation',()=>{
 for(const [op,kind] of Object.entries({purchase_invoice:'Borç',purchase_no_invoice:'Borç',supplier_return:'Alacak',sale:'Alacak',customer_return:'Borç',salary:'Borç',employee_purchase:'Alacak',employee_expense:'Alacak',collection:'Tahsilat',payment:'Ödeme',return_payment:'Ödeme'}))assert.equal(operationDirection(op,true),Math.sign(grossPartyAmount({party_id:1,kind,amount_cents:100})));
 assert.equal(operationDirection('collection',false),1);assert.equal(operationDirection('payment',false),-1);
 assert.equal(operationDirection('opening',true,'Borç'),-1);
});
test('KMH limit never becomes cash and interest requires an explicit rate',()=>{
 assert.deepEqual(kmhUsage({credit_limit_cents:100000,balance_cents:-25000,daily_interest_rate:null}),{limit:100000,used:25000,available:75000,percent:25,dailyInterest:null});
 assert.equal(kmhUsage({credit_limit_cents:100000,balance_cents:-25000,daily_interest_rate:'0.10'}).dailyInterest,25);
 assert.equal(kmhUsage({credit_limit_cents:100000,balance_cents:5000,daily_interest_rate:'0.10'}).used,0);
 assert.equal(kmhUsage({credit_limit_cents:100000,balance_cents:-120000}).available,0);
 assert.equal(kmhUsage({credit_limit_cents:100000,balance_cents:-120000}).percent,100);
});
test('Vadesiz accounts have no maturity reminder',()=>{
 assert.equal(hasMaturity({type:'Banka hesabı',maturity_date:'2026-10-20'}),false);
 assert.equal(hasMaturity({type:'Vadeli hesap',maturity_date:'2026-10-20'}),true);
});
