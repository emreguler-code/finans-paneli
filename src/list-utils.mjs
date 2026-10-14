export const kindLabel=k=>({'Alacak':'Satış','Borç':'Alış','Kart harcaması':'Ödeme','Kart iadesi':'Tahsilat','Kart ödemesi':'Virman'}[k]||k);
export function formatMoneyInput(value){
 if(typeof value==='number')value=String(value).replace('.',',');
 const clean=String(value??'').replace(/[^\d,.-]/g,'');
 const negative=clean.startsWith('-');
 const [whole='',...fraction]=clean.replace(/-/g,'').split(',');
 const digits=whole.replace(/\./g,'').replace(/^0+(?=\d)/,'');
 return (negative?'-':'')+digits.replace(/\B(?=(\d{3})+(?!\d))/g,'.')+(fraction.length?','+fraction.join('').slice(0,2):'');
}
export const normalizeMoney=value=>String(value??'').replaceAll('.','');
export const dateAdd=(date,days)=>{const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)};
export const weekStart=date=>dateAdd(date,-((new Date(date+'T12:00:00Z').getUTCDay()+6)%7));
export function planItems(data){
 return [...(data.events||[]).filter(e=>e.scheduled&&!e.cancelled).map(e=>({id:'scheduled-'+e.id,source:'scheduled',recordId:e.id,date:e.due_date||e.event_date,name:e.account_name||e.card_name||e.description,description:e.description,amount:e.amount_cents,type:['income','collection','refund'].includes(e.operation)?'Planlanan tahsilat':'Planlanan ödeme',direction:['income','collection','refund'].includes(e.operation)?1:-1})),...data.claims.filter(c=>c.due).map(c=>({id:'bill-'+c.id,source:'bill',recordId:c.id,partyId:c.partyId,date:c.due,name:c.name,description:c.desc,amount:c.amount_cents,type:c.type==='alacak'?'Tahsilat':'Cari ödeme',direction:c.type==='alacak'?1:-1})),
 ...data.cards.filter(c=>c.active&&c.due&&c.statement>0).map(c=>({id:'card-'+c.id,source:'card',recordId:c.id,date:c.due,name:c.name,amount:Math.round(c.statement*100),type:'Kart ödemesi',direction:-1})),
 ...data.accounts.filter(a=>a.active&&a.maturity_date).map(a=>({id:'account-'+a.id,source:'account',recordId:a.id,date:a.maturity_date,name:a.name,amount:0,type:'Hesap vade sonu',direction:0}))];
}

export const globalEventAmount=e=>e.kind==='Virman'?e.amount_cents:e.cash_effect||(e.kind==='Açılış'?e.party_effect:['Borç','Kart harcaması','Ödeme'].includes(e.kind)?-e.amount_cents:e.amount_cents);

export function sortPlanItems(items,sort){return [...items].sort((a,b)=>sort==='amount-desc'?b.amount-a.amount:sort==='date-desc'?b.date.localeCompare(a.date):a.date.localeCompare(b.date))}
