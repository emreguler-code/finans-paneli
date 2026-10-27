import {PartyContext} from './PartyContext';
import {RecentActivity} from './ActivityPanels';
import {useScopedState} from './SearchState';
import { useState, useEffect } from 'react';
import { Plus, Pencil, Info, ChevronRight, ChevronDown, ArrowLeft, ArrowUpRight, Users, UserRound } from 'lucide-react';
import { api } from './api';
import { can, fmt, tone } from './ui';
import { ListTools } from './ListTools';
import { PaymentPlan } from './PaymentPlan';
import { DatePicker } from './DatePicker';
import { dueMatches, presetRange } from './date-utils.mjs';
import {PageHeading,SummaryBar} from './PageLayout';
import { Reports } from './Reports';
import { dateAdd, globalEventAmount } from './list-utils.mjs';
import { Ledger } from './Ledger';
import { operationLabel } from './operations.mjs';
import { grossPartyAmount } from './account-utils.mjs';
import { exportRows as exportCSV } from './csv.mjs';
import { UsersPage } from './UsersPage';
const TYPES = ['Tedarikçi', 'Müşteri', 'Personel'];
const day = d => d ? new Date(d + 'T12:00:00').toLocaleDateString('tr-TR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
}) : '—';
export function FinancePages({
  page,
  data,
  open,
  search = '',
  onLabel,
  initialAccount = 'all',
  initialParty,
  initialDate,
  initialDue = 'all'
}) {
  const [selected, setSelected] = useScopedState(page+':selected',null),
    [query, setQuery] = useScopedState(page+':query',''),
    [type, setType] = useScopedState(page+':type','Tümü'),
    [parties, setParties] = useState(data.parties),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(''),
    [filters, setFilters] = useState(false),
    [kind, setKind] = useScopedState(page+':kind','Tümü'),
    [person, setPerson] = useScopedState(page+':person','Tümü'),
    [account, setAccount] = useScopedState(page+':account',initialAccount === 'all' ? 'Tümü' : initialAccount),
    [cancelled, setCancelled] = useScopedState(page+':cancelled',true),
    [archived, setArchived] = useScopedState(page+':archived',false),
    [from, setFrom] = useScopedState(page+':from',page === 'Raporlar' ? presetRange('Bu Ay', data.today).from : ''),
    [to, setTo] = useScopedState(page+':to',page === 'Raporlar' ? presetRange('Bu Ay', data.today).to : ''),
    [dueFilter, setDueFilter] = useScopedState(page+':dueFilter',initialDue),
    [balance, setBalance] = useScopedState(page+':balance','Tümü'),
    [sort, setSort] = useScopedState(page+':sort',page === 'Cari hesaplar' ? 'name-asc' : 'date-desc');
  const [tag,setTag]=useScopedState(page+':tag','all'),[filterParty,setFilterParty]=useScopedState(page+':filterParty','all'),[minAmount,setMinAmount]=useScopedState(page+':minAmount',''),[maxAmount,setMaxAmount]=useScopedState(page+':maxAmount','');
  const [partyInfo, setPartyInfo] = useState(false);
  const [selectedDay, setSelectedDay] = useScopedState(page+':selectedDay',null),
    [duePresence, setDuePresence] = useScopedState(page+':duePresence','all'),
    [dueClosure, setDueClosure] = useScopedState(page+':dueClosure','all');
  const cari = page === 'Cari hesaplar',
    reports = page === 'Raporlar',
    settle = page === 'Tahsilat & Ödeme',
    plan = page === 'Ödeme Planı',
    isUsers = page === 'Kullanıcılar';
  const party = cari ? data.parties.find(p => p.id === selected) : null;
  const detail = party,
    canCreate = can(data.user, 'create');
  useEffect(() => {
    onLabel(detail?.name || '');
    return () => onLabel('');
  }, [detail?.name]);
  useEffect(() => {
    if (!cari || party) return;
    const c = new AbortController();
    const q = (query || search).trim();
    setLoading(true);
    setError('');
    const timer = setTimeout(() => api('parties', undefined, {
      q: q.length >= 3 ? q : '',
      type
    }, c.signal).then(r => setParties(r.parties)).catch(e => {
      if (e.name !== 'AbortError') setError(e.message);
    }).finally(() => {
      if (!c.signal.aborted) setLoading(false);
    }), q.length >= 3 ? 400 : 0);
    return () => {
      clearTimeout(timer);
      c.abort();
    };
  }, [query, search, type, data, cari, selected]);
  useEffect(()=>{if(initialAccount!=='all'){setAccount(initialAccount);setSelectedDay(null)}},[initialAccount]);
  function reset() {
    setQuery('');setTag('all');setFilterParty('all');setMinAmount('');setMaxAmount('');
    setType('Tümü');
    setKind('Tümü');
    setPerson('Tümü');
    setAccount(initialAccount === 'all' ? 'Tümü' : initialAccount);
    setFrom('');
    setTo('');
    setCancelled(true);
    setArchived(false);
    setBalance('Tümü');
    setDueFilter('all');
    setDuePresence('all');
    setDueClosure('all');
    setSelectedDay(null);
    setSort(cari && !party ? 'name-asc' : party ? 'date-asc' : 'date-desc');
  }
  function select(id) {
    setPartyInfo(false);
    setSelected(id);
    reset();
    setSort(id && cari ? 'date-asc' : 'date-desc');
    setFilters(false);
  }
  function createEvent(initial = {}) {
    open({
      entity: 'event',
      lockedPartyId: party?.id,
      initial: {
        partyId: party?.id,
        kind: 'Tahsilat',
        ...initial
      }
    });
  }
  const amount = e => party ? grossPartyAmount(e) : globalEventAmount(e);
  const accountLabel = e => e.kind === 'Virman' ? `${e.account_name} → ${e.target_name}` : e.card_name ? e.account_name ? `${e.account_name} → ${e.card_name}` : e.card_name : e.account_name || 'Nakit hareketi yok';
  let events = data.events.filter(e => (cancelled || !e.cancelled) && (!party || e.party_id === party.id) && (!settle || Boolean(e.cash_effect) || Boolean(e.card_effect)) && (!party || [dueFilter, duePresence, dueClosure].every(f => dueMatches(e, data, f))) && (kind === 'Tümü' || operationLabel(e) === kind) && (person === 'Tümü' || String(e.created_by ?? '') === person) && (account === 'Tümü' || e.account_id === account || e.target_id === account || 'card:' + e.card_id === account) && (!from || e.event_date >= from) && (!to || e.event_date <= to) && `${e.description} ${e.party_name || ''} ${e.creator} ${e.document_no} ${e.account_name || ''} ${e.card_name || ''}`.toLocaleLowerCase('tr').includes((query || search).toLocaleLowerCase('tr')));
  events=events.filter(e=>(tag==='all'||(e.tag||'Genel')===tag)&&(filterParty==='all'||String(e.party_id)===String(filterParty))&&(!minAmount||Math.abs(amount(e))>=Math.round(Number(minAmount)*100))&&(!maxAmount||Math.abs(amount(e))<=Math.round(Number(maxAmount)*100)));
  const reportEvents = events;
  if (reports && selectedDay) events = events.filter(e => e.event_date >= selectedDay.from && e.event_date <= selectedDay.to);
  events.sort((a, b) => sort === 'amount-desc' ? Math.abs(amount(b)) - Math.abs(amount(a)) : sort === 'amount-asc' ? Math.abs(amount(a)) - Math.abs(amount(b)) : (sort === 'date-asc' ? 1 : -1) * ((a.event_date + a.event_time).localeCompare(b.event_date + b.event_time) || a.id - b.id));
  const csv = () => exportCSV('finans-hareketleri', ['Tarih', 'Saat', 'Açıklama', 'İşlem', 'Ekleyen', 'Hesap', 'Tutar TL', 'Durum'], events.map(e => [e.event_date, e.event_time, e.description, operationLabel(e), e.creator, accountLabel(e), amount(e) / 100, e.cancelled ? 'İptal' : 'Aktif']));
  const summary = party ? party.balance_cents : data.parties.reduce((s, p) => s + p.balance_cents, 0);
  const count = [dueFilter !== 'all', duePresence !== 'all', dueClosure !== 'all', kind !== 'Tümü', person !== 'Tümü', account !== 'Tümü', !!(from || to), !cancelled].filter(Boolean).length;
  const sortOptions = [['date-desc', 'Tarih: yeniden eskiye'], ['date-asc', 'Tarih: eskiden yeniye'], ['amount-desc', 'Tutar: yüksekten düşüğe'], ['amount-asc', 'Tutar: düşükten yükseğe']];
  const controls = {
    query,
    setQuery,
    filters,
    setFilters,
    sort,
    setSort,
    reset
  };
  const partyEvents=party?data.events.filter(e=>e.party_id===party.id&&!e.cancelled&&!e.scheduled):[];
  const latestParty=partyEvents.slice().sort((a,b)=>(b.event_date+b.event_time).localeCompare(a.event_date+a.event_time)||b.id-a.id)[0];
  const header=<><PageHeading className={party?'party-detail-header':''} title={party?.name||page} subtitle={party?party.type:cari?'Kişi ve firmaların bakiyeleri, tek bir yerde.':settle?'Gerçekleşen tahsilat ve ödemeler.':reports?'Nakit akışı ve açık bakiyeler. Kâr/zarar hesabı değildir.':isUsers?'Çalışma alanının kullanıcıları ve yetkileri.':''} back={party?()=>select(null):null} backLabel="Cari hesaplar" actions={(isUsers?can(data.user,'admin'):canCreate)&&!reports&&!plan&&<button className="primary-button icon-only" aria-label="Yeni kayıt ekle" title={party?'İşlem ekle':'Yeni kayıt ekle'} onClick={()=>party?createEvent():open({entity:cari?'party':isUsers?'user':'event'})}><Plus size={18}/></button>}/>
  {party&&<SummaryBar label="Cari hesap özeti" className={"party-detail-summary "+(partyInfo?"is-open":"")} actions={<><button className="list-icon" aria-label="Cari bilgileri" title="Cari bilgileri" aria-expanded={partyInfo} onClick={()=>setPartyInfo(!partyInfo)}><Info size={18}/></button>{can(data.user,'edit')&&<button className="list-icon" aria-label="Düzenle" title="Düzenle" onClick={()=>open({entity:'party',item:party})}><Pencil size={18}/></button>}</>} items={[
   {label:'Cari bakiye',value:<>{summary>0?'+':''}{fmt(summary)} <small>TL</small></>,help:summary>0?'Alacak':summary<0?'Borç':'Bakiye sıfır',tone:tone(summary),primary:true},
   {label:'Cari türü',value:party.type},{label:party.type==='Personel'?'İletişim':'Ticari unvan',value:party.type==='Personel'?party.phone||party.email||'Tanımlanmadı':party.title&&party.title!==party.name?party.title:party.phone||'Tanımlanmadı'},
   {label:'Son hareket',value:latestParty?day(latestParty.event_date):'Henüz hareket yok',help:partyEvents.length+' hareket kayıtlı'}
  ]}>{partyInfo&&<div className="party-inline-info"><dl>{[['Unvan',party.title],['Telefon',party.phone],['E-posta',party.email],['Vergi / kimlik no',party.tax_no],['Vergi dairesi',party.tax_office],['Adres',party.address],['Notlar',party.notes]].filter(([,v])=>v).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{![party.title,party.phone,party.email,party.tax_no,party.tax_office,party.address,party.notes].some(Boolean)&&<p className="muted">Ek bilgi girilmemiş.</p>}</div>}</SummaryBar>}</>;
  const toolbar = <ListTools {...controls} resultCount={events.length} placeholder={party?'Seçili carinin hareketlerinde ara':page+' içinde ara'} scopeControl={party?<button className="text-button" onClick={()=>select(null)}>Cari hesap listesinde ara</button>:null} count={count} csv={csv} sortOptions={sortOptions}><label>İşlem<select value={kind} onChange={e => setKind(e.target.value)}><option>Tümü</option>{['Faturalı Alış', 'Faturasız Alış', 'Satış', 'İade', 'Maaş Ekle', 'Borçlandır', 'Tahsilat', 'Ödeme', 'Harcama', 'Virman', 'Kart ödemesi', 'Nakit avans', 'Açılış'].map(k => <option key={k}>{k}</option>)}</select></label><label>Etiket<select value={tag} onChange={e=>setTag(e.target.value)}><option value="all">Tümü</option>{[...new Set(data.events.map(e=>e.tag||'Genel'))].sort().map(value=><option key={value}>{value}</option>)}</select></label>{!party&&<label>Cari<select value={filterParty} onChange={e=>setFilterParty(e.target.value)}><option value="all">Tümü</option>{data.parties.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label>}<label>En az tutar (TL)<input name="amountMin" type="number" min="0" step="0.01" value={minAmount} onChange={e=>setMinAmount(e.target.value)}/></label><label>En fazla tutar (TL)<input name="amountMax" type="number" min="0" step="0.01" value={maxAmount} onChange={e=>setMaxAmount(e.target.value)}/></label><label>Ekleyen kişi<select value={person} onChange={e => setPerson(e.target.value)}><option>Tümü</option><option value="">Önceki kayıt</option>{data.users.map(u => <option key={u.id} value={u.id}>{u.short_name || u.username}</option>)}</select></label><label>Hesap<select value={account} onChange={e => setAccount(e.target.value)}><option>Tümü</option>{data.accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}{data.cards.map(c => <option key={'card:' + c.id} value={'card:' + c.id}>{c.name} · Kart</option>)}</select></label><label>Tarih aralığı<DatePicker range from={from} to={to} today={data.today} label="Tarih aralığı" onChange={r => {
        setFrom(r.from);
        setTo(r.to);
        setSelectedDay(null);
      }} /></label>{party && <><label>Vade<select value={duePresence} onChange={e => setDuePresence(e.target.value)}>{[['all', 'Tümü'], ['dated', 'Vadesi belirtilmiş'], ['undated', 'Vadesiz']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label><label>Kapama durumu<select value={dueClosure} onChange={e => setDueClosure(e.target.value)}>{[['all', 'Tümü'], ['open', 'Açık'], ['partial', 'Kısmen kapanmış'], ['closed', 'Kapanmış']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label><label>Vade durumu<select value={dueFilter} onChange={e => setDueFilter(e.target.value)}>{[['all', 'Tümü'], ['soon', 'Vadesi yaklaşan (7 gün)'], ['today', 'Vadesi bugün'], ['late', 'Gecikmiş']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label></>}<label className="check-label"><input type="checkbox" checked={cancelled} data-filter-default={true} onChange={e => setCancelled(e.target.checked)} />İptal edilenleri göster</label></ListTools>;
  const table = <Ledger title={party?'Cari hareketleri':undefined} events={events.filter(e => !e.scheduled)} data={data} open={open} toolbar={toolbar} amount={amount} accountLabel={accountLabel} party={Boolean(party)} global={!party} />;
  const latest = new Map();
  for (const e of data.events) if (e.party_id) latest.set(e.party_id, Math.max(latest.get(e.party_id) || 0, e.id));
  let partyRows = parties.filter(p => `${p.name} ${p.title||''}`.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')) && (archived || p.active) && (balance === 'Tümü' || balance === 'Alacak' && p.balance_cents > 0 || balance === 'Borç' && p.balance_cents < 0 || balance === 'Sıfır' && p.balance_cents === 0));
  partyRows.sort((a, b) => sort === 'balance-desc' ? b.balance_cents - a.balance_cents : sort === 'balance-asc' ? a.balance_cents - b.balance_cents : sort === 'recent' ? (latest.get(b.id) || 0) - (latest.get(a.id) || 0) : (sort === 'name-desc' ? -1 : 1) * a.name.localeCompare(b.name, 'tr'));
  const content=<>
 {cari&&!party&&<SummaryBar label="Cari durum" className="party-list-summary" items={[
 {label:'Toplam alacak',value:fmt(parties.reduce((sum,p)=>sum+Math.max(0,p.balance_cents),0))+' TL',tone:'positive'},
 {label:'Toplam borç',value:fmt(parties.reduce((sum,p)=>sum+Math.max(0,-p.balance_cents),0))+' TL',tone:'danger-text'},
 {label:'Net cari bakiye',value:fmt(summary)+' TL',tone:tone(summary)}
 ]}/>}
 {plan ? <PaymentPlan data={data} open={open} exportCSV={exportCSV} initialDue={initialDue} initialParty={initialParty} initialDate={initialDate} /> : cari && !party ? <section className="panel cari-list"><ListTools {...controls} resultCount={partyRows.length} placeholder="Cari adı veya unvan ara" count={[type !== 'Tümü', balance !== 'Tümü', archived].filter(Boolean).length} csv={() => exportCSV('cari-hesaplar', ['Cari', 'Unvan', 'Tür', 'Bakiye TL'], partyRows.map(p => [p.name, p.title, p.type, p.balance_cents / 100]))} sortOptions={[['name-asc', 'Ad: A–Z'], ['name-desc', 'Ad: Z–A'], ['balance-desc', 'Bakiye: yüksekten düşüğe'], ['balance-asc', 'Bakiye: düşükten yükseğe'], ['recent', 'Son hareket']]}><label>Tür<select value={type} onChange={e => setType(e.target.value)}><option>Tümü</option>{TYPES.map(t => <option key={t}>{t}</option>)}</select></label><label>Bakiye<select value={balance} onChange={e => setBalance(e.target.value)}>{['Tümü', 'Alacak', 'Borç', 'Sıfır'].map(v => <option key={v}>{v}</option>)}</select></label><label className="check-label"><input type="checkbox" checked={archived} onChange={e => setArchived(e.target.checked)} />Arşiv dahil</label></ListTools>{loading && <p className="cari-loading" role="status">Aranıyor…</p>}<div className="party-column-head"><span>Cari</span><span>Tür</span><span>Net bakiye</span><span /></div><div className="party-rows">{partyRows.map(p => <button className="party-row" key={p.id} onClick={() => select(p.id)}><span className="cari-avatar">{p.type === 'Personel' ? <UserRound size={20} /> : <Users size={20} />}</span><span className="party-name"><strong>{p.name}</strong><small className="mobile-party-type">{p.type}</small>{p.title&&p.title!==p.name&&<small>{p.title}</small>}</span><span className="cari-type party-type" data-type={p.type}>{p.type}{!p.active ? ' · Arşiv' : ''}</span><span className={'cari-number ' + tone(p.balance_cents)}>{fmt(Math.abs(p.balance_cents))} TL{p.balance_cents !== 0 && <small>{p.balance_cents > 0 ? 'Alacak' : 'Borç'}</small>}</span><ChevronRight size={16} /></button>)}</div>{!partyRows.length && <p className="empty">Cari bulunamadı.</p>}<div className="cari-table-footer"><span>{partyRows.length} cari</span></div></section> : isUsers ? <UsersPage data={data} open={open} /> : <><>{reports && <Reports events={reportEvents} data={data} selectedDay={selectedDay} onClearDay={() => setSelectedDay(null)} onDay={(date, group) => setSelectedDay({
          from: date,
          to: group === 'Haftalık' ? dateAdd(date, 6) : date,
          label: day(date) + (group === 'Haftalık' ? ' haftası' : '')
        })} />}{table}</></>}
 </>;
 return <div className="cari-page finance-page">{!plan&&header}{error&&<p className="cari-error" role="alert">{error}</p>}{cari?<div className="party-workspace"><div className="party-main">{content}</div><aside className="context-aside">{party?<PartyContext {...{party,data,open}}/>:<RecentActivity data={data} source="parties" title="Son 5 işlem" open={open}/>}</aside></div>:content}
 {!isUsers&&<footer><span>{data.demo ? 'Örnek veriler' : 'Kalıcı kayıtlar'} · Banka bağlantısı yok</span><span>Tutarlar Türk lirası (TL)</span></footer>}</div>;
}
