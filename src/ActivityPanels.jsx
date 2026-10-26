import {ChevronRight} from 'lucide-react';
import {collectAlerts,AlertNotice} from './Alerts';
import {notificationSource,orderNotifications,recentEvents} from './notification-utils.mjs';
import {dateLabel} from './DatePicker';
import {fmt,tone} from './ui';
import {operationLabel} from './operations.mjs';
export function NotificationPreview({data,source,subject,onOpen,onAll,title='Uyarılar',className=''}){
 const alerts=orderNotifications(collectAlerts(data).filter(a=>notificationSource(a)===source&&(!subject||String(a.vehicleId||a.account||a.partyId||'')===String(subject))));
 return <section className={'panel notification-preview '+(source==='accounts'?'account-alerts ':'')+className} aria-label={source==='accounts'?'Hesap uyarıları':title}><header><h2>{title}</h2><small>{alerts.length}</small></header>{alerts.slice(0,5).map(a=><AlertNotice key={a.id} alert={a} onOpen={()=>onOpen(a)}/>)}{!alerts.length&&<p className="empty">Güncel uyarı bulunmuyor.</p>}<button className="text-button preview-all" onClick={()=>onAll({source,subject:subject?String(subject):'all'})}>Tümünü göster <ChevronRight size={16}/></button></section>;
}
export function RecentActivity({data,source,partyId,sign=0,title='Son işlemler',open}){
 const rows=recentEvents(data,{source,partyId,sign});
 return <section className="panel recent-activity" role="region" aria-label={title}><header><h2>{title}</h2></header>{rows.map(e=><button key={e.id} data-activity-id={e.id} className="recent-activity-row" onClick={()=>open({entity:'event',mode:'view',item:e,...(source==='parties'?{effect:e.party_effect}:{})})}><span><strong>{e.description||operationLabel(e)}</strong><small>{source==='parties'?e.party_name:e.card_name||e.account_name} · {operationLabel(e)}</small><small>{dateLabel(e.event_date)} · {e.event_time?.slice(0,5)}</small></span><span className={'activity-amount '+(source==='parties'?tone(e.party_effect):'')}>{source==='parties'&&e.party_effect>0?'+':''}{fmt(source==='parties'?e.party_effect:e.amount_cents)} <small>TL</small>{source==='parties'&&<small>Net cari etki</small>}</span></button>)}{!rows.length&&<p className="empty">Bu kapsamda hareket yok.</p>}</section>;
}
