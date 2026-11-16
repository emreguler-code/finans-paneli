import {AppShell,MainShell,HeaderRegion,ShellContent,ComposerHost,ContentColumns,PageFooter,SidebarControls,useShellLayout} from './AppShell';
import {usePresence} from './Motion';
import {routeHash} from './routes.mjs';
import {SettingsPage} from './SettingsPage';
import {api} from './api';
import {GlobalSearchTools,GlobalSearchPage} from './GlobalSearch';
import {useNavigation} from './Navigation';
import {NotificationsPage} from './NotificationsPage';
import {readableAlertDetail} from './notification-utils.mjs';
import { version } from '../package.json';

import {FloatingPanel} from './FloatingPanel';
import {groupAlerts} from './alert-groups.mjs';
import {fmt} from './ui';
import {ListTools} from './ListTools';
import { Sheet } from './ui';
import { collectAlerts, AlertNotice } from './Alerts';
import { globalEventAmount } from './list-utils.mjs';
import { DatePicker } from './DatePicker';
import { presetRange } from './date-utils.mjs';
import { useState, useEffect, useRef } from "react";
import { Users, LayoutDashboard, ArrowLeftRight, Landmark, CreditCard, ChartNoAxesCombined, Search, Bell, Plus, ChevronRight, ChevronDown, PanelLeftClose, PanelLeftOpen, ArrowDownLeft, ArrowUpRight, ArrowRight, CircleAlert, Check, X, Wallet, CalendarDays, MoreHorizontal, Settings, Settings2, Car, Gift, UserRoundCog } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { money, day } from "./data";
import { FinanceHub, FinanceDialog } from "./Finance";
import { can } from "./ui";
const navigation = [["Genel bakış", LayoutDashboard], ["Cari hesaplar", Users], ["Tahsilat & Ödeme", ArrowLeftRight], ["Ödeme Planı", CalendarDays], ["Hesaplar", Landmark], ["Kredi kartları", CreditCard], ["Kampanyalar", Gift], ["Araçlarım", Car], ["Raporlar", ChartNoAxesCombined], ["Kullanıcılar", UserRoundCog],["Ayarlar",Settings2]];
const descriptions = {
  "Genel bakış": "Bugünün durumu, hareketlerin ve sıradaki adımların.",
  Hareketler: "Banka ve kasa kayıtlarını tek yerden incele.",
  "Tahsilat & Ödeme": "Tahsilatlarını ve ödeme vadelerini takip et.",
  Hesaplar: "Paranın bulunduğu hesaplar ve güncel bakiyeleri.",
  "Kredi kartları": "Borç, kullanılabilir limit ve ödeme tarihleri.",
  Raporlar: "Dönemin verilerini incele ve dışa aktar."
};
function Heading({
  title,
  sub,
  children
}) {
  return <div className="panel-heading">
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {children}
    </div>;
}
export function App({
  initialData,
  onLogout
}) {
  const nav=useNavigation();
  const [fullData, setFullData] = useState(initialData);
  const [financeContext, setFinanceContext] = useState(null);
  const [contextKey, setContextKey] = useState(0);
  const returnRoute=useRef(null),contextRoute=useRef(null);
  const createPages={party:'Cari hesaplar',account:'Hesaplar',card:'Kredi kartları',vehicle:'Araçlarım'};
  const editingParty=nav.route.page==='Cari hesaplar'&&nav.route.entry==='duzenle';
  const entryPage=nav.route.record==='yeni'||editingParty;
  const creating=financeContext&&createPages[financeContext.entity]&&!financeContext.item?.id&&!['view','history','status'].includes(financeContext.mode);
  function closeFinance(){setFinanceContext(null);if(entryPage){nav.clearBlocker();nav.navigate(returnRoute.current||(editingParty?{...nav.route,entry:''}:{page:nav.route.page}),{replace:true})}}
  useEffect(()=>{if(nav.route.record==='yeni'&&!financeContext){const entity=Object.keys(createPages).find(key=>createPages[key]===nav.route.page);if(entity&&can(fullData.user,'create')){contextRoute.current=routeHash(nav.route);setFinanceContext({entity});setContextKey(k=>k+1)}else nav.navigate({page:nav.route.page},{replace:true})}},[nav.route.page,nav.route.record]);
  useEffect(()=>{if(editingParty&&!financeContext){const item=fullData.parties.find(p=>p.id===Number(nav.route.record));if(item&&can(fullData.user,'edit')){contextRoute.current=routeHash(nav.route);setFinanceContext({entity:'party',item});setContextKey(k=>k+1)}else nav.navigate({...nav.route,entry:''},{replace:true})}},[editingParty,nav.route.record]);
  useEffect(()=>{
    if(financeContext||entryPage||nav.route.page!=='Cari hesaplar'||!can(fullData.user,'create'))return;
    const party=fullData.parties.find(p=>p.id===Number(nav.route.record));if(!party)return;
    contextRoute.current=routeHash(nav.route);setContextKey(k=>k+1);
    setFinanceContext({entity:'event',lockedPartyId:party.id,persistent:true});
  },[financeContext,entryPage,nav.route.page,nav.route.record,fullData.user]);
  function openFinance(c,bypass=false) {
    if(!bypass){nav.guard(()=>openFinance(c,true));return;}
    contextRoute.current=routeHash(nav.route);
    if(createPages[c.entity]&&!c.item?.id&&!['view','history','status'].includes(c.mode)){returnRoute.current=nav.route;contextRoute.current=routeHash({page:createPages[c.entity],record:'yeni'});nav.navigate({page:createPages[c.entity],record:'yeni'})}
    if(c.entity==='party'&&c.item?.id&&!['view','history','status'].includes(c.mode)){returnRoute.current=nav.route;const route={page:'Cari hesaplar',record:String(c.item.id),entry:'duzenle'};contextRoute.current=routeHash(route);nav.navigate(route)}
    setContextKey(k => k + 1);
    setFinanceContext(c);
    setDrawer(null);
  }
  useEffect(()=>{if(financeContext&&contextRoute.current&&routeHash(nav.route)!==contextRoute.current)setFinanceContext(null)},[nav.route.page,nav.route.record,nav.route.tab,nav.route.entry]);
  const [overviewFilters,setOverviewFilters]=useState(false);
  const [partyLabel, setPartyLabel] = useState('');
  const {
    accounts,
    tx,
    claims,
    cards,
    today: TODAY,
    demo
  } = fullData;
  function applyState(data) {
    setFullData(data);
  }
  const dateObj = new Date(TODAY + "T12:00:00");
  const fullDate = dateObj.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const dateOffset = n => {
    const d = new Date(dateObj);
    d.setDate(d.getDate() + n);
    return iso(d);
  };
  const page=nav.route.page;
  const setPage=p=>nav.navigate({page:p});
  const shell=useShellLayout(),compact=shell.mode==='compact',setCompact=value=>shell.choose(value?'compact':'full');
  const
    [mobileMore, setMobileMore] = useState(false),
    [scope, setScope] = useState("all"),
    [search, setSearch] = useState(""),
    [kind, setKind] = useState("all"),
    [claimFilter, setClaimFilter] = useState("all"),
    [drawer, setDrawer] = useState(null),
    [bell, setBell] = useState(false),
    [toast, setToast] = useState(null);
  const bellButton=useRef(null);
  const [cardsMenu,setCardsMenu]=useState(false);
  const cardPresence=usePresence(cardsMenu),morePresence=usePresence(mobileMore);
  const navigateMenu=name=>{shell.setOpen(false);setCardsMenu(['Kredi kartları','Kampanyalar'].includes(name));go(name,true)};
  useEffect(()=>setCardsMenu(['Kredi kartları','Kampanyalar'].includes(page)),[page]);
  const [notificationTarget,setNotificationTarget]=useState(null),[routeKey,setRouteKey]=useState(0);
  const [notificationScope,setNotificationScope]=useState({source:'all'});
  function showNotifications(scope={source:'all'}){go('Bildirimler');nav.navigate({page:'Bildirimler',source:scope.source||'all'},{replace:true});setNotificationScope(scope);setRouteKey(key=>key+1)}
  useEffect(()=>{if(['Kullanıcılar','Ayarlar'].includes(page)&&!can(fullData.user,'admin'))nav.navigate({page:'Genel bakış'},{replace:true})},[page,fullData.user.role]);
  const notifications = groupAlerts(collectAlerts(fullData),TODAY);
  function openNotification(alert){setScope('all');setSearch('');setKind('all');setClaimFilter('all');setDrawer(null);setBell(false);setMobileMore(false);if(['Kredi kartları','Kampanyalar'].includes(alert.page))setCardsMenu(true);nav.navigate({page:alert.page,record:alert.account!==undefined?String(alert.account):alert.vehicleId?String(alert.vehicleId):'',event:alert.eventId?String(alert.eventId):'',entry:alert.vehicleId?String(alert.recordId):'',tab:alert.vehicleId?'İşlemler':alert.eventId?'Gelecek dönem hareketleri':''},{fresh:true});setNotificationTarget(alert);setRouteKey(key=>key+1);if(alert.account!==undefined)setScope(alert.account);if(alert.section==='Gecikmiş')setClaimFilter('late');if(alert.entity){const rows=alert.entity==='campaign'?fullData.campaigns:fullData.vehicle_records;const item=rows.find(item=>item.id===alert.recordId);if(item)openFinance({entity:alert.entity,item})}}
  const accountName = id => accounts.find(a => a.id === id)?.name;
  const go = (p,fresh=false) => {
    nav.navigate({page:p},{fresh});
    setDrawer(null);
    setMobileMore(false);
    setBell(false);
    setSearch("");
    setKind("all");
    setScope("all");
    setClaimFilter("all");
    setNotificationTarget(null);
  };
  const notify = (title, detail) => setToast({
    title,
    detail
  });
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    const handler = e => {
      if (e.key === "Escape") {
        setDrawer(null);
        setBell(false);
        setMobileMore(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const cash = accounts.reduce((s, a) => s + a.balance, 0),
    receivable = claims.filter(c => c.type === "alacak").reduce((s, c) => s + c.amount, 0) + (fullData.advances || []).filter(a => a.kind === "Verilen avans").reduce((s, a) => s + a.amount_cents / 100, 0) + cards.reduce((s, c) => s + Math.max(0, -c.debt), 0),
    debt = claims.filter(c => c.type === "borç").reduce((s, c) => s + c.amount, 0) + cards.reduce((s, c) => s + Math.max(0, c.debt), 0) + (fullData.advances || []).filter(a => a.kind === "Alınan avans").reduce((s, a) => s + a.amount_cents / 100, 0);
  const late = claims.filter(c => c.due && c.due < TODAY),
    soon = [...claims.filter(c => c.type === "borç").map(c => ({
      ...c,
      label: "Ödeme"
    })), ...cards.map(c => ({
      ...c,
      amount: c.statement,
      label: "Kart ekstresi",
      card: true
    }))].filter(c => c.due >= TODAY && c.due <= dateOffset(7) && c.amount > 0).sort((a, b) => a.due.localeCompare(b.due)),
    upcoming = soon.reduce((s, c) => s + c.amount, 0);
  const [overviewRange, setOverviewRange] = useState(() => presetRange('Bu Ay', TODAY));
  const inPeriod = t => t.date >= overviewRange.from && t.date <= overviewRange.to;
  const periodTx = tx.filter(t => inPeriod(t) && (scope === "all" || t.account === scope) && t.kind !== "Transfer"),
    incoming = periodTx.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0),
    outgoing = Math.max(0, -periodTx.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
  const visible = tx.filter(t => inPeriod(t) && (scope === "all" || t.account === scope) && (kind === "all" || t.kind === kind) && `${t.name} ${t.desc} ${t.category}`.toLocaleLowerCase("tr").includes(search.toLocaleLowerCase("tr"))).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const dates = [];
  for (let d = new Date(overviewRange.from + "T12:00:00"); iso(d) <= overviewRange.to; d.setDate(d.getDate() + 1)) dates.push(iso(d));
  const nextIncomeDate = claims.filter(c => c.type === 'alacak' && c.due >= TODAY).map(c => c.due).sort()[0];
  const chart = dates.map(date => ({
    label: day(date),
    incoming: periodTx.filter(t => t.date === date && t.amount > 0).reduce((s, t) => s + t.amount, 0),
    outgoing: -periodTx.filter(t => t.date === date && t.amount < 0).reduce((s, t) => s + t.amount, 0)
  }));
  function openForm(context = {}) {
    if (!can(fullData.user, 'create')) return notify('Görüntüleme yetkisi', 'Bu hesap yeni kayıt oluşturamaz.');
    const claim = context.claimId ? claims.find(c => c.id === context.claimId) : null;
    openFinance({
      entity: 'event',
      initial: {
        ...context,
        kind: context.kind === 'Transfer' ? 'Virman' : context.kind || 'Tahsilat',
        partyId: claim?.partyId || '',
        description: claim?.desc || context.name || '',
        linkedId: claim?.id,
        operation: claim ? fullData.events.find(e => e.id === claim.id)?.operation === 'customer_return' ? 'return_payment' : claim.type === 'alacak' ? 'collection' : 'payment' : undefined,
        account: context.account || accounts.find(a => a.active)?.id || ''
      }
    });
  }
  const controls = <div className="period-controls">
      <DatePicker range from={overviewRange.from} to={overviewRange.to} today={TODAY} label="Nakit akışı dönemi" clearable={false} onChange={setOverviewRange} />
      <label className="select-wrap">
        <select aria-label="Hesap kapsamı" value={scope} onChange={e => setScope(e.target.value)}>
          <option value="all">Tüm hesaplar</option>
          {accounts.map(a => <option key={a.id} value={a.id}>
              {a.name}
            </option>)}
        </select>
        <ChevronDown size={16} />
      </label>
    </div>;
  const recentEvents = fullData.events.filter(e => !e.cancelled && !e.scheduled && e.event_date<=TODAY && inPeriod({
    date: e.event_date
  }) && (kind==='all'||e.kind===kind) && (scope === 'all' || e.account_id === scope || e.target_id === scope) && `${e.description} ${e.party_name || ''} ${e.card_name || ''}`.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr'))).sort((a, b) => (b.event_date + b.event_time).localeCompare(a.event_date + a.event_time) || b.id - a.id).map(e => ({
    id: e.id,
    date: e.event_date,
    time: e.event_time.slice(0, 5),
    name: e.party_name || e.card_name || e.description || e.kind,
    desc: e.description || e.kind,
    account: e.account_id,
    accountText: e.kind === 'Virman' ? `${e.account_name} → ${e.target_name}` : e.account_name || e.card_name || 'Nakit hareketi yok',
    amount: globalEventAmount(e) / 100,
    neutral: e.kind === 'Virman'
  }));
  const table = short => <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Açıklama</th>
            <th className="account-col">Hesap</th>
            <th className="numeric">Tutar</th>
            <th className="arrow-col">
              <span className="sr-only">Ayrıntı</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {(short ? recentEvents.slice(0, 5) : visible).map(t => <tr key={t.id} onClick={() => openFinance({
          entity: 'event',
          mode: 'view',
          item: fullData.events.find(e => e.id === t.id)
        })}>
              <td className="date-cell">
                {day(t.date)}
                <small>{t.time}</small>
              </td>
              <td>
                <button className="row-link" onClick={e => {
              e.stopPropagation();
              openFinance({
                entity: 'event',
                mode: 'view',
                item: fullData.events.find(e => e.id === t.id)
              });
            }}>
                  {t.name}
                </button>
                <small>{t.desc}</small>
              </td>
              <td className="account-col">
                <span>{t.accountText || accountName(t.account)}</span>
              </td>
              <td className={"numeric " + (t.neutral ? "" : t.amount > 0 ? "positive" : t.amount < 0 ? "danger-text" : "")}>
                {t.neutral ? "" : t.amount > 0 ? "+" : t.amount < 0 ? "−" : ""}
                {money(Math.abs(t.amount), 2)}
                <span className="unit"> TL</span>
              </td>
              <td className="arrow-col">
                <ChevronRight size={16} />
              </td>
            </tr>)}
        </tbody>
      </table>
      {(short ? recentEvents : visible).length === 0 && <div className="empty">
          <Search size={18} />
          <b>Kayıt bulunamadı</b>
          <span>Arama veya filtreleri değiştirebilirsiniz.</span>
          <button className="text-action" onClick={() => {
        setSearch("");
        setScope("all");
        setKind("all");
      }}>
            Filtreleri temizle
          </button>
        </div>}
    </div>;
  const cashflow = <section className="panel flow-panel">
      <Heading title="Nakit akışı" sub="Banka ve kasada gerçekleşen hareketler">
        {controls}
      </Heading>
      <div className="flow-totals">
        <div>
          <span>
            <i className="legend incoming" />
            Gelen para
          </span>
          <strong>
            {money(incoming)} <small>TL</small>
          </strong>
        </div>
        <div>
          <span>
            <i className="legend outgoing" />
            Giden para
          </span>
          <strong>
            {money(outgoing)} <small>TL</small>
          </strong>
        </div>
        <div className="net">
          <span>Net hareket</span>
          <strong>
            {incoming - outgoing >= 0 ? "+" : "−"}
            {money(Math.abs(incoming - outgoing))} <small>TL</small>
          </strong>
        </div>
      </div>
      <div className="chart" aria-label="Günlere göre banka ve kasa girişleri ile çıkışları">
        {periodTx.length === 0 ? <div className="empty chart-empty">
            <ChartNoAxesCombined size={24} />
            <span>Bu kapsamda nakit hareketi yok.</span>
          </div> : <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart} margin={{
          top: 6,
          right: 0,
          left: -18,
          bottom: 0
        }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{
            fill: "var(--muted)",
            fontSize: 12
          }} minTickGap={20} />
              <YAxis axisLine={false} tickLine={false} tick={{
            fill: "var(--muted)",
            fontSize: 12
          }} tickFormatter={v => v === 0 ? "0" : money(v / 1000) + " bin"} />
              <Tooltip cursor={{
            fill: "var(--chart-hover)"
          }} contentStyle={{
            border: "1px solid var(--line)",
            borderRadius: 10,
            fontSize: 12
          }} formatter={(v, n) => [money(v) + " TL", n]} />
              <Bar dataKey="incoming" name="Gelen para" fill="var(--brand)" radius={[3, 3, 0, 0]} maxBarSize={14} isAnimationActive={false} />
              <Bar dataKey="outgoing" name="Giden para" fill="var(--muted)" radius={[3, 3, 0, 0]} maxBarSize={14} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>}
      </div>
      <div className="panel-foot">
        <span>
          {day(overviewRange.from)} – {day(overviewRange.to)}{" "}
          · Gerçekleşen
        </span>
        <button className="text-action" onClick={() => setPage("Raporlar")}>
          Hareketleri incele <ArrowRight size={16} />
        </button>
      </div>
    </section>;
  const attention = <section className="panel attention-panel">
      <Heading title="Dikkat isteyenler" sub="Öncelik sırasına göre">
        <span className="count">{late.length + soon.length}</span>
      </Heading>
      {late.length > 0 && <button className="attention-row late" onClick={() => {
      go("Ödeme Planı");
      setClaimFilter("late");
    }}>
          <span className="status-icon danger">
            <CircleAlert size={18} />
          </span>
          <span className="attention-copy">
            <b>{late.every(c => c.type === "alacak") ? "Geciken alacak" : "Geciken kayıtlar"}</b>
            <small>
              {late[0].name} · {day(late[0].due)}
            </small>
            <span>
              {money(late.reduce((s, c) => s + c.amount, 0))} TL{" "}
              <em>Vadesi geçti</em>
            </span>
          </span>
          <ChevronRight size={16} />
        </button>}
      <div className="section-eyebrow">ÖNÜMÜZDEKİ 7 GÜN</div>
      {soon.map(c => <button className="attention-row" key={(c.card ? "card" : "claim") + c.id} onClick={() => setDrawer({
      type: c.card ? "card" : "claim",
      item: c
    })}>
          <span className="due-date">
            <b>{Number(c.due.slice(-2))}</b>
            <small>{new Date(c.due + "T12:00:00").toLocaleDateString("tr-TR", {
            month: "short"
          })}</small>
          </span>
          <span className="attention-copy">
            <b>{c.name}</b>
            <small>{c.label}</small>
          </span>
          <span className="due-value">
            {money(c.amount)}
            <small>TL</small>
          </span>
          <ChevronRight size={16} />
        </button>)}
      {soon.length === 0 && <p className="quiet-state">Yaklaşan ödeme yok.</p>}
      <div className="next-income">
        <ArrowDownLeft size={16} />
        <span>{nextIncomeDate ? new Date(nextIncomeDate + "T12:00:00").toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long"
        }) : "—"} · Beklenen tahsilat</span>
        <strong>
          {money(claims.filter(c => c.due === nextIncomeDate && c.type === "alacak").reduce((s, c) => s + c.amount, 0))}{" "}
          TL
        </strong>
      </div>
    </section>;
  const accountsPanel = <section className="panel accounts-panel">
      <Heading title="Hesapların" sub="Bugün itibarıyla">
        <button className="icon-button" aria-label="Tüm hesapları gör" onClick={() => go("Hesaplar")}>
          <ArrowUpRight size={16} />
        </button>
      </Heading>
      {accounts.map(a => <button className="account-row" key={a.id} onClick={() => {
      go("Raporlar");
      setScope(a.id);
    }}>
          <span className="account-icon">
            {a.type === "Kasa" ? <Wallet size={18} /> : <Landmark size={18} />}
          </span>
          <span>
            <b>{a.name}</b>
            <small>{a.type}</small>
          </span>
          <strong>
            {money(a.balance)} <small>TL</small>
          </strong>
        </button>)}
      <div className="card-mini">
        <CreditCard size={18} />
        <div>
          <b>Kredi kartı borcu</b>
          <small>{cards.length} kart · Nakit bakiyesinden ayrı</small>
        </div>
        <button onClick={() => go("Kredi kartları")}>
          {money(cards.reduce((s, c) => s + c.debt, 0))} TL{" "}
          <ChevronRight size={16} />
        </button>
      </div>
    </section>;
  return <AppShell layout={shell}>
      <aside className="sidebar" data-region="1" inert={!!drawer||shell.mode==='hidden'} aria-label="Sol gezinme" role={shell.mode==='drawer'?'dialog':undefined} aria-modal={shell.mode==='drawer'?true:undefined}>
        <div className="brand">
          <span className="brand-mark">
            <ChartNoAxesCombined size={21} />
          </span>
          {!compact && <span>
              finans<span className="brand-period">.</span>
            </span>}
        </div>
        {shell.mobile&&<button type="button" className="list-icon sidebar-close" aria-label="Menüyü kapat" onClick={()=>shell.setOpen(false)}><X size={18}/></button>}
        <div className="workspace-label">KİŞİSEL ÇALIŞMA ALANI</div>
        <nav aria-label="Ana navigasyon">
          {navigation.filter(([name]) => name!=='Ayarlar'&&(name !== 'Kullanıcılar' || can(fullData.user, 'admin'))&&(name!=='Kampanyalar'||cardPresence.mounted)).map(([name, Icon]) => <button key={name} data-exiting={name==='Kampanyalar'&&!cardsMenu||undefined} inert={name==='Kampanyalar'&&!cardsMenu||undefined} aria-hidden={name==='Kampanyalar'&&!cardsMenu||undefined} className={(page === name ? "active " : "")+(name==='Kampanyalar'?'navigation-submenu':'')} aria-current={page === name ? "page" : undefined} aria-label={name} title={name} aria-expanded={name==='Kredi kartları'?cardsMenu:undefined} onClick={() => navigateMenu(name)}>
              <Icon size={20} />
              <span>{name}</span>{name==='Kredi kartları'&&<ChevronDown size={16} className={cardsMenu?'submenu-chevron rotate-open':'submenu-chevron'}/>}
              {name === "Ödeme Planı" && late.length > 0 && !compact && <em>{late.length}</em>}
            </button>)}
        </nav>
        <div className="sidebar-bottom">{can(fullData.user,'admin')&&<button aria-label="Ayarlar" aria-current={page==='Ayarlar'?'page':undefined} className={page==='Ayarlar'?'active':''} onClick={()=>navigateMenu('Ayarlar')}><Settings2 size={18}/><span>Ayarlar</span></button>}
          <button onClick={() => setDrawer({
          type: "info"
        })}>
            <Settings size={18} />
            <span>Görünüm ve bilgiler</span>
          </button>
          <button className="sidebar-layout-toggle" aria-label={compact ? "Menüyü gizle" : "Menüyü daralt"} onClick={shell.cycle}>
            {compact ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            <span>{compact?"Menüyü gizle":"Menüyü daralt"}</span>
          </button>
          <div className="demo-note">
            <i />
            {demo ? `Örnek veri · ${version}` : "Çalışma alanı"}
          </div>
        </div>
      </aside>
      <MainShell blocked={!!drawer||shell.mode==='drawer'}>
        <HeaderRegion><SidebarControls layout={shell}/>
          <div id="page-search-host" />
          <div className="top-actions">
            <div className="notification-holder">
              <button ref={bellButton} className="icon-button notification-button" aria-expanded={!!bell} aria-haspopup="dialog" aria-label="Bildirimleri aç" onClick={() => setBell(!bell)}>
                <Bell size={18} />
                {notifications.length > 0 && <i />}
              </button>
              {bell && <FloatingPanel anchor={bellButton.current} title="Bildirimler" className="notification-panel" onClose={()=>setBell(false)} width={400}><div className="notification-compact">{['Gecikmiş','Bugün','Yaklaşan','Diğer'].map(section=>{const rows=notifications.slice(0,5).filter(alert=>alert.section===section);return rows.length>0&&<section key={section}><h3>{section}</h3>{rows.map(alert=><button key={alert.id} className={'notification-row '+alert.level} onClick={()=>openNotification(alert)}><CircleAlert size={18}/><span><strong>{alert.title}</strong><small>{alert.count>1?`${alert.groupName} · ${alert.count} kayıt · ${fmt(alert.amount_cents)} TL`:readableAlertDetail(alert.detail)}</small></span><ChevronRight size={16}/></button>)}</section>})}{!notifications.length&&<p className="empty">Dikkat gerektiren bildirim yok.</p>}<button className="text-button preview-all" onClick={()=>showNotifications()}>Tümünü göster ({collectAlerts(fullData).length}) <ChevronRight size={16}/></button></div></FloatingPanel>}
            </div>
            <span className="header-divider" />
            <span className="date-label" aria-label="Çalışma alanı tarihi">
              {fullDate} <b>{dateObj.toLocaleDateString("tr-TR", {
                weekday: "long"
              })}</b>
            </span>
          </div>
        </HeaderRegion>
        <ShellContent motionKey={routeHash(nav.route)+nav.revision}><div id="entry-page-root"/>{entryPage&&<GlobalSearchTools data={fullData} showFilters={false}/>}
          {page === "Genel bakış" && <GlobalSearchTools data={fullData} placeholder="Genel bakış hareketlerinde ara" filters={overviewFilters} setFilters={setOverviewFilters} resultCount={visible.length} reset={()=>{setSearch('');setScope('all');setKind('all');setOverviewRange(presetRange('Bu Ay',TODAY))}}><label>Hesap<select value={scope} onChange={e=>setScope(e.target.value)}><option value="all">Tüm hesaplar</option>{accounts.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></label><label>Tarih aralığı<DatePicker range defaultRange={presetRange('Bu Ay',TODAY)} from={overviewRange.from} to={overviewRange.to} today={TODAY} clearable={false} onChange={range=>setOverviewRange(range.from&&range.to?range:presetRange('Bu Ay',TODAY))}/></label><label>İşlem<select value={kind} onChange={e=>setKind(e.target.value)}><option value="all">Tümü</option>{[...new Set(tx.map(t=>t.kind))].map(k=><option key={k}>{k}</option>)}</select></label></GlobalSearchTools>}
          {page === "Genel bakış" && <div className="page-title" data-region="4">
            <div>
              <h1>{page === "Genel bakış" ? "Finansal görünüm" : page}</h1>
              <p>{descriptions[page]}</p>
            </div>
            <button className="primary-button icon-only" aria-label="İşlem ekle" title="İşlem ekle" disabled={!can(fullData.user, 'create')} onClick={() => openForm()}>
              <Plus size={18} />
              <span className="sr-only">İşlem ekle</span>
            </button>
          </div>}
          {entryPage?null:page === "Ayarlar" ? <SettingsPage key={nav.revision} data={fullData} notify={notify}/> : page === "Arama" ? <GlobalSearchPage data={fullData}/> : page === "Bildirimler" ? <NotificationsPage key={routeKey+nav.revision} data={fullData} initialScope={{...notificationScope,source:nav.route.source}} onOpenNotification={openNotification}/> : page !== "Genel bakış" ? <FinanceHub key={page+'-'+routeKey+'-'+nav.revision} page={page} onNotifications={showNotifications} onOpenNotification={openNotification} initialEventId={notificationTarget?.eventId||Number(nav.route.event)||undefined} initialRecord={notificationTarget?.recordId} initialParty={notificationTarget?.partyId} initialDate={notificationTarget?.date} data={fullData} onState={applyState} notify={notify} open={openFinance} search="" initialAccount={scope} initialDue={claimFilter} onLabel={setPartyLabel} /> : <>
              <div className="snapshot-label">
                <span>GÜNCEL DURUM</span>
                <span>
                  {fullDate} itibarıyla <i />
                </span>
              </div>
              <section className="summary" data-region="5">
                <div className="metric major">
                  <div className="metric-label">
                    <Wallet size={16} />
                    Kullanılabilir nakit
                  </div>
                  <div className="metric-value">
                    {money(cash)}
                    <span>TL</span>
                  </div>
                  <div className="metric-note">Banka ve kasa toplamı</div>
                </div>
                {[[receivable, "Alacaklar", "Verilen avans ve kart alacağı dâhil", "alacak"], [debt, "Borçlar", "Kredi kartları ve alınan avans dâhil", "borç"], [upcoming, "Yaklaşan ödeme", "Toplam borcun vadesi yaklaşan kısmı", "upcoming"]].map(([n, l, note, target]) => <button className="metric" key={l} onClick={() => {
              if (target === "upcoming") setDrawer({
                type: "upcoming"
              });else {
                go("Ödeme Planı");
                setClaimFilter(target);
              }
            }}>
                    <div className="metric-label">
                      {l}
                      {target === "upcoming" && <span className="tiny-badge">7 gün</span>}
                    </div>
                    <div className="metric-value">
                      {money(n)}
                      <span>TL</span>
                    </div>
                    <div className="metric-note">{note}</div>
                  </button>)}
              </section>
              <ContentColumns className="dashboard-grid">
                {cashflow}
                {attention}
              </ContentColumns>
              <ContentColumns className="dashboard-grid lower">
                <section className="panel transactions-panel">
                  <Heading title="Son hareketler" sub="Tüm işlem türleri · Seçili dönem ve hesap kapsamı">
                    <button className="text-action" onClick={() => setPage("Raporlar")}>
                      Tümünü gör <ArrowRight size={16} />
                    </button>
                  </Heading>
                  {table(true)}
                </section>
                {accountsPanel}
              </ContentColumns>
              <PageFooter>
                <span>{demo ? "Örnek veriler" : "Kalıcı kayıtlar"} · Banka bağlantısı yok</span>
                <span>Tutarlar Türk lirası (TL)</span>
              </PageFooter>
            </>}
        </ShellContent>
      <ComposerHost/><nav inert={!!drawer} className="mobile-nav" aria-label="Mobil navigasyon">
        {[["Genel bakış", "Özet", LayoutDashboard], ["Raporlar", "Raporlar", ChartNoAxesCombined], ["Tahsilat & Ödeme", "Ödeme", ArrowLeftRight]].map(([p, l, Icon]) => <button key={p} aria-current={page===p?"page":undefined} className={page === p ? "active" : ""} onClick={() => navigateMenu(p)}>
            <Icon size={20} />
            {l}
          </button>)}
        <button aria-label="Diğer" aria-expanded={mobileMore} aria-current={!["Genel bakış","Raporlar","Tahsilat & Ödeme"].includes(page)?"page":undefined} className={mobileMore||!["Genel bakış","Raporlar","Tahsilat & Ödeme"].includes(page)?"active":""} onClick={() => setMobileMore(!mobileMore)}>
          <MoreHorizontal size={20} />
          Diğer
        </button>
      </nav></MainShell>
      {morePresence.mounted && <div className="mobile-more" data-exiting={!mobileMore||undefined} inert={!mobileMore||undefined} aria-hidden={!mobileMore||undefined}>
          {navigation.filter(([name]) => !["Genel bakış", "Hareketler", "Raporlar", "Tahsilat & Ödeme"].includes(name) && (!['Kullanıcılar','Ayarlar'].includes(name) || can(fullData.user, "admin")) && (name!=="Kampanyalar"||cardsMenu)).map(([name, Icon]) => <button key={name} className={name==='Kampanyalar'?'navigation-submenu':''} aria-expanded={name==='Kredi kartları'?cardsMenu:undefined} onClick={() => navigateMenu(name)}>
              <Icon size={20} />
              {name}
              {name==='Kredi kartları'?<ChevronDown size={16} className={cardsMenu?'rotate-open':''}/>:<ChevronRight size={16}/>}
            </button>)}
        </div>}
      {drawer && <div className="drawer-layer">
          <button className="backdrop" aria-label="Paneli kapat" onClick={() => setDrawer(null)} />
          <section className="drawer" onKeyDown={e => {
        if (e.key !== "Tab") return;
        const els = [...e.currentTarget.querySelectorAll("button:not([disabled]),input,select:not([disabled]),textarea")];
        if (e.shiftKey && document.activeElement === els[0]) {
          e.preventDefault();
          els.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === els.at(-1)) {
          e.preventDefault();
          els[0]?.focus();
        }
      }} role="dialog" aria-modal="true" aria-labelledby="drawer-title">
            <div className="drawer-heading">
              <div>
                <span className="eyebrow">
                  AYRINTI
                </span>
                <h2 id="drawer-title">
                  {drawer.type === "tx" ? "Hareket ayrıntısı" : drawer.type === "upcoming" ? "Yaklaşan ödemeler" : drawer.type === "info" ? "Uygulama bilgileri" : drawer.item.name}
                </h2>
              </div>
              <button autoFocus className="icon-button" aria-label="Paneli kapat" onClick={() => setDrawer(null)}>
                <X size={18} />
              </button>
            </div>
            {drawer.type === "tx" ? <>
                <div className={"detail-amount " + (drawer.item.amount > 0 ? "positive" : "")}>
                  {drawer.item.amount > 0 ? "+" : "−"}
                  {money(Math.abs(drawer.item.amount), 2)}
                  <small> TL</small>
                </div>
                <dl>
                  {[["Açıklama", drawer.item.name], ["Not", drawer.item.desc], ["Hesap", accountName(drawer.item.account)], ["Tarih", day(drawer.item.date) + " " + drawer.item.date.slice(0, 4) + " · " + drawer.item.time], ["Tür", drawer.item.kind], ["Kategori", drawer.item.category], ["Belge no", drawer.item.document || "Eklenmedi"]].map(([k, v]) => <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>)}
                </dl>
              </> : drawer.type === "claim" ? <>
                <div className="detail-amount">
                  {money(drawer.item.amount)}
                  <small> TL</small>
                </div>
                <dl>
                  <div>
                    <dt>Tür</dt>
                    <dd>{drawer.item.type === "alacak" ? "Alacak" : "Borç"}</dd>
                  </div>
                  <div>
                    <dt>Vade</dt>
                    <dd>{day(drawer.item.due)} {drawer.item.due.slice(0, 4)}</dd>
                  </div>
                  <div>
                    <dt>Açıklama</dt>
                    <dd>{drawer.item.desc}</dd>
                  </div>
                </dl>
                <button className="primary-button wide" onClick={() => openForm({
            kind: drawer.item.type === "alacak" ? "Tahsilat" : "Ödeme",
            name: drawer.item.name,
            amount: String(drawer.item.amount),
            claimId: drawer.item.id
          })}>
                  {drawer.item.type === "alacak" ? "Tahsilat kaydet" : "Ödeme kaydet"}
                  <ArrowRight size={16} />
                </button>
              </> : drawer.type === "card" ? <>
                <div className="detail-amount">
                  {money(drawer.item.statement)}
                  <small> TL</small>
                </div>
                <p className="muted">
                  Ekstre borcu · Son ödeme {day(drawer.item.due)}
                </p>
                <dl>
                  <div>
                    <dt>Güncel borç</dt>
                    <dd>{money(drawer.item.debt)} TL</dd>
                  </div>
                  <div>
                    <dt>Kullanılabilir limit</dt>
                    <dd>{money(drawer.item.limit - drawer.item.debt)} TL</dd>
                  </div>
                </dl>
                <button className="primary-button wide" onClick={() => openForm({
            kind: "Kart ödemesi",
            name: drawer.item.name,
            amount: String(drawer.item.statement),
            cardId: drawer.item.id
          })}>
                  Ödeme kaydet
                </button>
              </> : drawer.type === "upcoming" ? <>
                <p className="muted">{day(TODAY)}–{day(dateOffset(7))} {TODAY.slice(0, 4)} · {money(upcoming)} TL</p>
                {soon.map(c => <button className="claim-row upcoming-row" key={(c.card ? "card" : "claim") + c.id} onClick={() => setDrawer({
            type: c.card ? "card" : "claim",
            item: c
          })}>
                    <div>
                      <b>{c.name}</b>
                      <small>
                        {day(c.due)} · {c.label}
                      </small>
                    </div>
                    <strong>{money(c.amount)} TL</strong>
                    <ChevronRight size={16} />
                  </button>)}
              </> : <>
                <p>Finans · Sürüm {version}</p>
                <p>{fullData.user.short_name} · {fullData.user.role}</p>
                {can(fullData.user, 'admin') && <p><a className="text-button" href="update.php">Sistem güncellemesi</a></p>}
                <dl>
                  <div>
                    <dt>Tasarım dili</dt>
                    <dd>Sade Netlik</dd>
                  </div>
                  <div>
                    <dt>Para birimi</dt>
                    <dd>Türk lirası</dd>
                  </div>
                  <div>
                    <dt>Veri saklama</dt>
                    <dd>MySQL · Kalıcı kayıt</dd>
                  </div>
                </dl>
                <p className="muted">
                  Banka bağlantısı bulunmaz. Kayıtlar sayfa yenilendiğinde korunur.
                </p>
                <button className="secondary-button" onClick={onLogout}>Oturumu kapat</button>
              </>}
          </section>
        </div>}
      {financeContext && <FinanceDialog key={contextKey} context={financeContext} data={fullData} onClose={closeFinance} onState={applyState} notify={notify} replace={openFinance} />}
      {toast && <div className="toast" role="status">
          <span className="status-icon success">
            <Check size={18} />
          </span>
          <div>
            <b>{toast.title}</b>
            <small>{toast.detail}</small>
          </div>
          <button className="icon-button" aria-label="Bildirimi kapat" onClick={() => setToast(null)}>
            <X size={18} />
          </button>
        </div>}
    </AppShell>;
}
