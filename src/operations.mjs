export const operations={purchase_invoice:'Faturalı Alış',purchase_no_invoice:'Faturasız Alış',supplier_return:'İade',sale:'Satış',customer_return:'İade',salary:'Maaş Ekle',employee_purchase:'Borçlandır',employee_expense:'Borçlandır',collection:'Tahsilat',payment:'Ödeme',expense:'Harcama',income:'Tahsilat',refund:'İade',transfer:'Virman',card_payment:'Kart ödemesi',cash_advance:'Nakit avans',card_transfer:'Karttan karta aktarım',return_payment:'İade ödemesi',opening:'Açılış'};
export const operationLabel=e=>operations[e.operation]||({'Alacak':'Satış','Borç':'Alış','Kart iadesi':'İade'}[e.kind])||e.kind;
export const partyOptions=type=>type==='Tedarikçi'?['purchase_invoice','purchase_no_invoice','supplier_return','payment']:type==='Personel'?['salary','employee_purchase','collection','payment']:['sale','collection','customer_return'];
export const isInvoice=op=>['purchase_invoice','purchase_no_invoice','supplier_return','sale','customer_return'].includes(op);
export const cardEventEffect=(e,id)=>Number(e.target_card_id)===Number(id)?-e.amount_cents:e.card_effect||0;
export function cardPeriodRows(events,card,tab,statement,today){
 const rows=events.filter(e=>e.card_id===card.id||e.target_card_id===card.id);
 const before=(card.statements||[]).filter(s=>s.cut_date<(statement?.cut_date||card.statement_date)).at(-1)?.cut_date||'2000-01-01';
 if(tab==='Ekstre')return rows.filter(e=>!e.scheduled&&((e.operation==='card_payment'||e.operation==='card_transfer'&&Number(e.target_card_id)===Number(card.id))?(statement?Number(e.linked_id)===Number(statement.id)||!e.linked_id&&e.event_date>statement.cut_date:false):(e.period_date||e.event_date)<=(statement?.cut_date||card.statement_date)&&(e.period_date||e.event_date)>before));
 if(tab==='Gelecek Dönem')return rows.filter(e=>!e.scheduled&&(e.period_date||e.event_date)>today);
 return rows.filter(e=>!e.scheduled&&(e.period_date||e.event_date)>(card.statement_date||'2000-01-01')&&(e.period_date||e.event_date)<=today||!e.scheduled&&['card_payment','card_transfer'].includes(e.operation)&&e.event_date===today);
}
export function limitSegments(card){const limit=Number(card.limit_cents)||0;const debt=Math.max(0,Math.round(card.debt*100));const statement=Math.max(0,Math.min(Math.round(card.statement*100),debt));const period=Math.max(0,debt-statement);const available=Math.max(0,card.available_cents??limit-Math.round(card.debt*100));const scale=Math.max(limit,debt,1);return {statement,period,available,widths:[statement/scale*100,period/scale*100,Math.max(0,100-debt/scale*100)]};}
