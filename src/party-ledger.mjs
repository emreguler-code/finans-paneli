// Display projections only: the API remains the authority for financial effects.
export function partyBalanceLabel(party) {
  const balance = Number(party.balance_cents) || 0;
  if (!balance) return 'Hesap dengede';
  const subject = {'Tedarikçi': ['Tedarikçiden alacağımız', 'Tedarikçiye borcumuz'], 'Müşteri': ['Müşteriden alacağımız', 'Müşteriye borcumuz'], 'Personel': ['Personelden alacağımız', 'Personele borcumuz']}[party.type];
  return subject ? subject[balance > 0 ? 0 : 1] : balance > 0 ? 'Alacağımız' : 'Borcumuz';
}

export function listedPartyEffect(events) {
  return events.filter(e => !e.cancelled && !e.scheduled).reduce((sum, e) => sum + (Number(e.party_effect) || 0), 0);
}

// Pure display helpers: dates are business dates, amounts remain integer cents.
const monthNames=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
function parts(value){const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value||'');if(!match)return null;const [year,month,day]=match.slice(1).map(Number),date=new Date(Date.UTC(year,month-1,day));return date.getUTCFullYear()===year&&date.getUTCMonth()===month-1&&date.getUTCDate()===day?{year,month,day,stamp:date.getTime()}:null;}
export function movementDate(date,time,today,{full=false,planned=false}={}){
 const value=parts(date),reference=parts(today);if(!value)return 'Tarih yok';
 const clock=(time||'').slice(0,5),suffix=clock?', '+clock:'';
 const absolute=value.day+' '+monthNames[value.month-1];
 if(full)return absolute+' '+value.year+suffix;
 const distance=reference?(value.stamp-reference.stamp)/86400000:Infinity;
 if(distance===0)return 'Bugün'+suffix;
 if(distance===-1)return 'Dün'+suffix;
 if(distance===1&&planned)return 'Yarın'+suffix;
 if(Math.abs(distance)<=7)return absolute+(value.year!==reference?.year?' '+value.year:'')+suffix;
 return absolute+(value.year!==reference?.year?' '+value.year:'');
}
export function monthlyEffects(events){
 const months=new Map();
 for(const e of events){if(!parts(e.event_date)||e.cancelled||e.scheduled)continue;const key=e.event_date.slice(0,7),m=months.get(key)||{key,label:monthNames[Number(key.slice(5))-1]+' '+key.slice(0,4),positive:0,negative:0,net:0,count:0};const effect=Number(e.party_effect)||0;if(effect>0)m.positive+=effect;else m.negative+=effect;m.net+=effect;m.count++;months.set(key,m);}
 return months;
}
export function detailedMovementDate(date,time){
 const p=parts(date);if(!p)return ['Tarih yok',''];
 const weekdays=['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
 const clock=time?(time.length===5?time+':00':time.slice(0,8)):'';
 return [p.day+' '+monthNames[p.month-1]+' '+p.year,weekdays[new Date(p.stamp).getUTCDay()]+(clock?' · '+clock:'')];
}
export function reconciledMonths(events,{effect=e=>Number(e.party_effect)||0,balance=e=>Number(e.party_balance),currentBalance}={}){
 const rows=events.filter(e=>!e.cancelled&&!e.scheduled&&parts(e.event_date)).slice().sort((a,b)=>(a.event_date+(a.event_time||'')).localeCompare(b.event_date+(b.event_time||''))||Number(a.id)-Number(b.id));
 let running=Number.isFinite(currentBalance)?currentBalance-rows.reduce((n,e)=>n+effect(e),0):rows.length&&Number.isFinite(balance(rows[0]))?balance(rows[0])-effect(rows[0]):0;
 const months=new Map();for(const e of rows){const key=e.event_date.slice(0,7),m=months.get(key)||{key,label:monthNames[Number(key.slice(5))-1]+' '+key.slice(0,4),opening:running,positive:0,negative:0,closing:running};const n=effect(e);if(n>0)m.positive+=n;else m.negative+=n;running+=n;m.closing=running;months.set(key,m)}return months;
}
