import test from 'node:test';
import assert from 'node:assert/strict';
import {partyBalanceLabel,listedPartyEffect} from '../src/party-ledger.mjs';

test('Party balance labels explain who owes whom for all three types',()=>{
 for(const [type,positive,negative] of [['Tedarikçi','Tedarikçiden alacağımız','Tedarikçiye borcumuz'],['Müşteri','Müşteriden alacağımız','Müşteriye borcumuz'],['Personel','Personelden alacağımız','Personele borcumuz']]){
  assert.equal(partyBalanceLabel({type,balance_cents:1}),positive);
  assert.equal(partyBalanceLabel({type,balance_cents:-1}),negative);
  assert.equal(partyBalanceLabel({type,balance_cents:0}),'Hesap dengede');
 }
});
test('Filtered totals use API net effects, excluding cancelled and planned entries',()=>{
 const entries=[{amount_cents:91300,settled_cents:20000,party_effect:-71300},{amount_cents:40000,party_effect:40000},{amount_cents:99900,party_effect:-99900,cancelled:1},{amount_cents:88800,party_effect:-88800,scheduled:true}];
 assert.equal(listedPartyEffect(entries),-31300);
 assert.equal(listedPartyEffect(entries.slice(0,1)),-71300);
 assert.equal(listedPartyEffect([]),0);
 assert.equal(entries[0].amount_cents,91300);
});
