import React from 'react';
import {CircleAlert,ChevronRight} from 'lucide-react';
import {fmt} from './ui';
import {isKmh,kmhUsage,hasMaturity} from './v16-utils.mjs';
export function kmhAlert(a) {
  if (!isKmh(a)) return null;
  const u=kmhUsage(a);if(!u.used)return null;
  return {id:'kmh-'+a.id,page:'Hesaplar',account:a.id,title:u.dailyInterest===null?'KMH faiz oranı girilmemiş':`Günlük tahmini faiz: ${fmt(u.dailyInterest)} TL`,detail:u.dailyInterest===null?`${a.name} · Kullanılan limit ${fmt(u.used)} TL. Tahmin için hesap ayarlarına günlük oranı girin.`:`${a.name} · Bugünkü kullanılan limit ve girilen günlük oran; vergi ve valör hariç.`,level:u.used>u.limit?'danger':'warning'};
}
export function collectAlerts(data) {
  const alerts=[],today=data.today;
  const soon=d=>d&&d<=new Date(new Date(today+'T12:00:00Z').getTime()+7*86400000).toISOString().slice(0,10);
  for(const c of data.claims||[])if(soon(c.due))alerts.push({id:'claim-'+c.id,page:'Ödeme Planı',title:`${c.type==='borç'?'Ödeme':'Tahsilat'} ${c.due<today?'gecikmiş':c.due===today?'bugün':'yaklaşıyor'}`,detail:`${c.name} · ${c.due} · ${fmt(c.amount_cents)} TL`,level:c.due<today?'danger':'warning'});
  for(const a of data.accounts||[])if(a.active){const warning=kmhAlert(a);if(warning)alerts.push(warning);if(hasMaturity(a)&&soon(a.maturity_date))alerts.push({id:'maturity-'+a.id,page:'Hesaplar',account:a.id,title:'Hesap vade sonu',detail:`${a.name} · ${a.maturity_date}`,level:a.maturity_date<today?'danger':'warning'});}
  for(const c of data.cards||[])if(c.active){
    if(c.statement>0&&soon(c.due))alerts.push({id:'card-due-'+c.id,page:'Kredi kartları',account:c.id,title:'Kart ödemesi '+(c.due<today?'gecikmiş':'yaklaşıyor'),detail:`${c.name} · ${c.due} · ${fmt(Math.round(c.statement*100))} TL`,level:c.due<today?'danger':'warning'});
    if(Number(c.statement_needs_review)||(c.statements||[]).some(s=>s.difference_cents<0))alerts.push({id:'card-review-'+c.id,page:'Kredi kartları',account:c.id,title:'Ekstre bilgilerini kontrol edin',detail:c.name+' · Ekstre tarihi veya tutar eşleşmesi inceleme bekliyor.',level:'warning'});
  }
  return alerts;
}
export function AlertNotice({alert,onOpen}) {
  if(!alert)return null;
  const content=<><CircleAlert size={17}/><span><strong>{alert.title}</strong><small>{alert.detail}</small></span>{onOpen&&<ChevronRight size={15}/>}</>;
  return onOpen?<button className={'alert-notice '+alert.level} onClick={onOpen}>{content}</button>:<div className={'alert-notice '+alert.level} role="status">{content}</div>;
}
