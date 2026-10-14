import {Sheet} from './ui';
import {collectAlerts,AlertNotice} from './Alerts';
import {globalEventAmount} from './list-utils.mjs';
import {DatePicker} from './DatePicker';
import {presetRange} from './date-utils.mjs';
import React, { useState, useEffect } from "react";
import {
  Users,
  LayoutDashboard,
  List,
  ArrowLeftRight,
  Landmark,
  CreditCard,
  ChartNoAxesCombined,
  Search,
  Bell,
  Plus,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Clock3,
  CircleAlert,
  Check,
  X,
  Download,
  SlidersHorizontal,
  Wallet,
  CalendarDays,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {money, day} from "./data";
import {api} from "./api";
import {FinanceHub,FinanceDialog} from "./Finance";
import {can,useViewport} from "./ui";
const navigation = [
  ["Genel bakış", LayoutDashboard],
  ["Cari hesaplar", Users],
  ["Tahsilat & Ödeme", ArrowLeftRight],
  ["Ödeme Planı", CalendarDays],
  ["Hesaplar", Landmark],
  ["Kredi kartları", CreditCard],
  ["Raporlar", ChartNoAxesCombined],
  ["Kullanıcılar", Users],
];
const descriptions = {
  "Genel bakış": "Bugünün durumu, hareketlerin ve sıradaki adımların.",
  Hareketler: "Banka ve kasa kayıtlarını tek yerden incele.",
  "Tahsilat & Ödeme": "Tahsilatlarını ve ödeme vadelerini takip et.",
  Hesaplar: "Paranın bulunduğu hesaplar ve güncel bakiyeleri.",
  "Kredi kartları": "Borç, kullanılabilir limit ve ödeme tarihleri.",
  Raporlar: "Dönemin verilerini incele ve dışa aktar.",
};
function Heading({ title, sub, children }) {
  return (
    <div className="panel-heading">
      <div>
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      {children}
    </div>
  );
}
export function App({initialData,onLogout}) {
  useViewport();
  const [fullData,setFullData]=useState(initialData);
  const [financeContext,setFinanceContext]=useState(null);
  const [contextKey,setContextKey]=useState(0);
  function openFinance(c){setContextKey(k=>k+1);setFinanceContext(c);setDrawer(null)}
  const [partyLabel,setPartyLabel]=useState('');
  const [today,setToday]=useState(initialData.today);
  const TODAY=today;
  const [busy,setBusy]=useState(false);
  const demo=initialData.demo;
  function applyState(data){setFullData(data);setAccounts(data.accounts);setTx(data.tx);setClaims(data.claims);setCards(data.cards);setToday(data.today);}
  const dateObj=new Date(TODAY+"T12:00:00");
  const fullDate=dateObj.toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"});
  const monthName=dateObj.toLocaleDateString("tr-TR",{month:"long"});
  const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const dateOffset=n=>{const d=new Date(dateObj);d.setDate(d.getDate()+n);return iso(d)};
  const prevStart=new Date(dateObj.getFullYear(),dateObj.getMonth()-1,1,12);
  const start=period=>period==="month"?TODAY.slice(0,7)+"-01":period==="previous"?iso(prevStart):iso(new Date(dateObj.getFullYear(),dateObj.getMonth()-2,1,12));
  const end=period=>period==="previous"?iso(new Date(dateObj.getFullYear(),dateObj.getMonth(),0,12)):TODAY;
  const periodCaption=period=>period==="month"?`1–${dateObj.getDate()} ${monthName} ${dateObj.getFullYear()}`:period==="previous"?`1–${new Date(dateObj.getFullYear(),dateObj.getMonth(),0).getDate()} ${prevStart.toLocaleDateString("tr-TR",{month:"long",year:"numeric"})}`:`${day(start(period))}–${day(TODAY)} ${dateObj.getFullYear()}`;
  const [page, setPage] = useState("Genel bakış"),
    [compact, setCompact] = useState(false),
    [mobileMore, setMobileMore] = useState(false),
    [period, setPeriod] = useState("month"),
    [scope, setScope] = useState("all"),
    [search, setSearch] = useState(""),
    [kind, setKind] = useState("all"),
    [filters, setFilters] = useState(false),
    [claimFilter, setClaimFilter] = useState("all"),
    [accounts, setAccounts] = useState(initialData.accounts),
    [tx, setTx] = useState(initialData.tx),
    [claims, setClaims] = useState(initialData.claims),
    [cards, setCards] = useState(initialData.cards),
    [drawer, setDrawer] = useState(null),
    [bell, setBell] = useState(false),
    [toast, setToast] = useState(null),
    [extra, setExtra] = useState(false),
    [error, setError] = useState(""),
    [form, setForm] = useState({});
  const notifications=collectAlerts(fullData);
  const accountName = (id) => accounts.find((a) => a.id === id)?.name;
  const go = (p) => {
    setPage(p);
    setDrawer(null);
    setMobileMore(false);
    setBell(false);
    setSearch("");
    setKind("all");
    setScope("all");
    setClaimFilter("all");
  };
  const notify = (title, detail) => setToast({ title, detail });
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    const handler = (e) => {
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
    receivable = claims
      .filter((c) => c.type === "alacak")
      .reduce((s, c) => s + c.amount, 0) + (fullData.advances||[]).filter(a=>a.kind==="Verilen avans").reduce((s,a)=>s+a.amount_cents/100,0) + cards.reduce((s,c)=>s+Math.max(0,-c.debt),0),
    debt =
      claims
        .filter((c) => c.type === "borç")
        .reduce((s, c) => s + c.amount, 0) +
      cards.reduce((s, c) => s + Math.max(0,c.debt), 0) + (fullData.advances||[]).filter(a=>a.kind==="Alınan avans").reduce((s,a)=>s+a.amount_cents/100,0);
  const late = claims.filter((c) => c.due && c.due < TODAY),
    soon = [
      ...claims
        .filter((c) => c.type === "borç")
        .map((c) => ({ ...c, label: "Ödeme" })),
      ...cards.map((c) => ({
        ...c,
        amount: c.statement,
        label: "Kart ekstresi",
        card: true,
      })),
    ]
      .filter((c) => c.due >= TODAY && c.due <= dateOffset(7) && c.amount > 0)
      .sort((a, b) => a.due.localeCompare(b.due)),
    upcoming = soon.reduce((s, c) => s + c.amount, 0);
  const [overviewRange,setOverviewRange]=useState(()=>presetRange('Bu Ay',TODAY));
  const inPeriod = t => t.date >= overviewRange.from && t.date <= overviewRange.to;
  const periodTx = tx.filter(
      (t) =>
        inPeriod(t) &&
        (scope === "all" || t.account === scope) &&
        t.kind !== "Transfer",
    ),
    incoming = periodTx
      .filter((t) => t.amount > 0)
      .reduce((s, t) => s + t.amount, 0),
    outgoing = Math.max(
      0,
      -periodTx.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0),
    );
  const visible = tx
    .filter(
      (t) =>
        inPeriod(t) &&
        (scope === "all" || t.account === scope) &&
        (kind === "all" || t.kind === kind) &&
        `${t.name} ${t.desc} ${t.category}`
          .toLocaleLowerCase("tr")
          .includes(search.toLocaleLowerCase("tr")),
    )
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  const dates=[];
  for(let d=new Date(overviewRange.from+"T12:00:00");iso(d)<=overviewRange.to;d.setDate(d.getDate()+1))dates.push(iso(d));
  const nextIncomeDate=claims.filter(c=>c.type==='alacak'&&c.due>=TODAY).map(c=>c.due).sort()[0];
  const chart = dates.map((date) => ({
    label: day(date),
    incoming: periodTx
      .filter((t) => t.date === date && t.amount > 0)
      .reduce((s, t) => s + t.amount, 0),
    outgoing: -periodTx
      .filter((t) => t.date === date && t.amount < 0)
      .reduce((s, t) => s + t.amount, 0),
  }));
  function openForm(context = {}) {
    if(!can(fullData.user,'create'))return notify('Görüntüleme yetkisi','Bu hesap yeni kayıt oluşturamaz.');
    const claim=context.claimId?claims.find(c=>c.id===context.claimId):null;
    openFinance({entity:'event',initial:{...context,kind:context.kind==='Transfer'?'Virman':context.kind||'Tahsilat',partyId:claim?.partyId||'',description:claim?.desc||context.name||'',linkedId:claim?.id,operation:claim?(fullData.events.find(e=>e.id===claim.id)?.operation==='customer_return'?'return_payment':claim.type==='alacak'?'collection':'payment'):undefined,account:context.account||accounts.find(a=>a.active)?.id||''}});
  }
  async function save(e) {
    e.preventDefault(); if(busy)return; setError('');setBusy(true);
    try {const result=await api('movement',form);applyState(result.state);setDrawer(null);notify('İşlem kaydedildi',`${money(Number(form.amount.replace(',','.')),2)} TL · ${accountName(form.account)}`);}
    catch(e){setError(e.message);}
    finally{setBusy(false);}
  }
  function csv() {
    const rows = [
      ["Tarih", "Açıklama", "Hesap", "Tutar", "Tür"],
      ...visible.map((t) => [
        t.date,
        t.name,
        accountName(t.account),
        t.amount,
        t.kind,
      ]),
    ];
    const blob = new Blob(
      [
        "\uFEFF" +
          rows
            .map((r) =>
              r
                .map((v) => '"' + (typeof v==='string' && /^[=+\-@\t\r]/.test(v)?"'"+v:String(v)).replaceAll('"', '""') + '"')
                .join(";"),
            )
            .join("\n"),
      ],
      { type: "text/csv;charset=utf-8" },
    );
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "finans-hareketleri.csv";
    a.click();
    URL.revokeObjectURL(a.href);
    notify("Rapor indirildi", "Seçili kayıtlar CSV olarak hazırlandı.");
  }
  const controls = (
    <div className="period-controls">
      <DatePicker range from={overviewRange.from} to={overviewRange.to} today={TODAY} label="Nakit akışı dönemi" clearable={false} onChange={setOverviewRange}/>
      <label className="select-wrap">
        <select
          aria-label="Hesap kapsamı"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
        >
          <option value="all">Tüm hesaplar</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <ChevronDown size={12} />
      </label>
    </div>
  );
  const recentEvents=fullData.events.filter(e=>!e.cancelled&&inPeriod({date:e.event_date})&&(scope==='all'||e.account_id===scope||e.target_id===scope)&&`${e.description} ${e.party_name||''} ${e.card_name||''}`.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr'))).sort((a,b)=>(b.event_date+b.event_time).localeCompare(a.event_date+a.event_time)||b.id-a.id).map(e=>({id:e.id,date:e.event_date,time:e.event_time.slice(0,5),name:e.party_name||e.card_name||e.description||e.kind,desc:e.description||e.kind,account:e.account_id,accountText:e.kind==='Virman'?`${e.account_name} → ${e.target_name}`:e.account_name||e.card_name||'Nakit hareketi yok',amount:globalEventAmount(e)/100,neutral:e.kind==='Virman'}));
  const table = (short) => (
    <div className="table-wrap">
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
          {(short ? recentEvents.slice(0,5) : visible).map((t) => (
            <tr key={t.id} onClick={() => openFinance({entity:'event',mode:'view',item:fullData.events.find(e=>e.id===t.id)})}>
              <td className="date-cell">
                {day(t.date)}
                <small>{t.time}</small>
              </td>
              <td>
                <button
                  className="row-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFinance({entity:'event',mode:'view',item:fullData.events.find(e=>e.id===t.id)});
                  }}
                >
                  {t.name}
                </button>
                <small>{t.desc}</small>
              </td>
              <td className="account-col">
                <span>{t.accountText||accountName(t.account)}</span>
              </td>
              <td className={"numeric " + (t.neutral?"":t.amount > 0 ? "positive" :t.amount<0?"danger-text":"")}>
                {t.neutral?"":t.amount > 0 ? "+" :t.amount<0?"−":""}
                {money(Math.abs(t.amount), 2)}
                <span className="unit"> TL</span>
              </td>
              <td className="arrow-col">
                <ChevronRight size={15} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(short?recentEvents:visible).length === 0 && (
        <div className="empty">
          <Search size={24} />
          <b>Kayıt bulunamadı</b>
          <span>Arama veya filtreleri değiştirebilirsiniz.</span>
          <button
            className="text-action"
            onClick={() => {
              setSearch("");
              setScope("all");
              setKind("all");
            }}
          >
            Filtreleri temizle
          </button>
        </div>
      )}
    </div>
  );
  const cashflow = (
    <section className="panel flow-panel">
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
      <div
        className="chart"
        aria-label="Günlere göre banka ve kasa girişleri ile çıkışları"
      >
        {periodTx.length === 0 ? (
          <div className="empty chart-empty">
            <ChartNoAxesCombined size={24} />
            <span>Bu kapsamda nakit hareketi yok.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chart}
              margin={{ top: 6, right: 0, left: -18, bottom: 0 }}
            >
              <CartesianGrid stroke="#E5EBEF" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#596879", fontSize: 12 }}
                minTickGap={20}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#596879", fontSize: 12 }}
                tickFormatter={(v) =>
                  v === 0 ? "0" : money(v / 1000) + " bin"
                }
              />
              <Tooltip
                cursor={{ fill: "#F0F5F6" }}
                contentStyle={{
                  border: "1px solid #DDE3E8",
                  borderRadius: 10,
                  fontSize: 13,
                }}
                formatter={(v, n) => [money(v) + " TL", n]}
              />
              <Bar
                dataKey="incoming"
                name="Gelen para"
                fill="#087F8C"
                radius={[3, 3, 0, 0]}
                maxBarSize={14}
                isAnimationActive={false}
              />
              <Bar
                dataKey="outgoing"
                name="Giden para"
                fill="#A8BBC3"
                radius={[3, 3, 0, 0]}
                maxBarSize={14}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="panel-foot">
        <span>
          {day(overviewRange.from)} – {day(overviewRange.to)}{" "}
          · Gerçekleşen
        </span>
        <button className="text-action" onClick={() => setPage("Raporlar")}>
          Hareketleri incele <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
  const attention = (
    <section className="panel attention-panel">
      <Heading title="Dikkat isteyenler" sub="Öncelik sırasına göre">
        <span className="count">{late.length + soon.length}</span>
      </Heading>
      {late.length > 0 && (
        <button
          className="attention-row late"
          onClick={() => {
            go("Ödeme Planı");
            setClaimFilter("late");
          }}
        >
          <span className="status-icon danger">
            <CircleAlert size={18} />
          </span>
          <span className="attention-copy">
            <b>{late.every(c=>c.type==="alacak")?"Geciken alacak":"Geciken kayıtlar"}</b>
            <small>
              {late[0].name} · {day(late[0].due)}
            </small>
            <span>
              {money(late.reduce((s, c) => s + c.amount, 0))} TL{" "}
              <em>Vadesi geçti</em>
            </span>
          </span>
          <ChevronRight size={16} />
        </button>
      )}
      <div className="section-eyebrow">ÖNÜMÜZDEKİ 7 GÜN</div>
      {soon.map((c) => (
        <button
          className="attention-row"
          key={(c.card ? "card" : "claim") + c.id}
          onClick={() =>
            setDrawer({ type: c.card ? "card" : "claim", item: c })
          }
        >
          <span className="due-date">
            <b>{Number(c.due.slice(-2))}</b>
            <small>{new Date(c.due+"T12:00:00").toLocaleDateString("tr-TR",{month:"short"})}</small>
          </span>
          <span className="attention-copy">
            <b>{c.name}</b>
            <small>{c.label}</small>
          </span>
          <span className="due-value">
            {money(c.amount)}
            <small>TL</small>
          </span>
          <ChevronRight size={14} />
        </button>
      ))}
      {soon.length === 0 && <p className="quiet-state">Yaklaşan ödeme yok.</p>}
      <div className="next-income">
        <ArrowDownLeft size={15} />
        <span>{nextIncomeDate?new Date(nextIncomeDate+"T12:00:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long"}):"—"} · Beklenen tahsilat</span>
        <strong>
          {money(
            claims
              .filter((c) => c.due === nextIncomeDate && c.type === "alacak")
              .reduce((s, c) => s + c.amount, 0),
          )}{" "}
          TL
        </strong>
      </div>
    </section>
  );
  const accountsPanel = (
    <section className="panel accounts-panel">
      <Heading title="Hesapların" sub="Bugün itibarıyla">
        <button
          className="icon-button"
          aria-label="Tüm hesapları gör"
          onClick={() => go("Hesaplar")}
        >
          <ArrowUpRight size={17} />
        </button>
      </Heading>
      {accounts.map((a) => (
        <button
          className="account-row"
          key={a.id}
          onClick={() => {
            go("Raporlar");
            setScope(a.id);
          }}
        >
          <span className="account-icon">
            {a.type === "Kasa" ? <Wallet size={17} /> : <Landmark size={17} />}
          </span>
          <span>
            <b>{a.name}</b>
            <small>{a.type}</small>
          </span>
          <strong>
            {money(a.balance)} <small>TL</small>
          </strong>
        </button>
      ))}
      <div className="card-mini">
        <CreditCard size={18} />
        <div>
          <b>Kredi kartı borcu</b>
          <small>{cards.length} kart · Nakit bakiyesinden ayrı</small>
        </div>
        <button onClick={() => go("Kredi kartları")}>
          {money(cards.reduce((s, c) => s + c.debt, 0))} TL{" "}
          <ChevronRight size={14} />
        </button>
      </div>
    </section>
  );
  const showClaim = (c) => (
    <button
      className="claim-row"
      key={c.id}
      onClick={() => setDrawer({ type: "claim", item: c })}
    >
      <span
        className={"account-icon " + (c.type === "alacak" ? "positive" : "")}
      >
        {c.type === "alacak" ? (
          <ArrowDownLeft size={18} />
        ) : (
          <ArrowUpRight size={18} />
        )}
      </span>
      <div>
        <b>{c.name}</b>
        <small>{c.desc}</small>
      </div>
      <span className="claim-type">
        {c.type === "alacak" ? "Alacak" : "Borç"}
      </span>
      <span className="claim-due">
        {day(c.due)}
        {c.due < TODAY && <small className="danger-text">Vadesi geçti</small>}
      </span>
      <strong>{money(c.amount)} TL</strong>
      <ChevronRight size={16} />
    </button>
  );
  return (
    <div className={"app " + (compact ? "compact" : "")}>
      <aside className="sidebar" inert={!!drawer}>
        <div className="brand">
          <span className="brand-mark">
            <ChartNoAxesCombined size={21} />
          </span>
          {!compact && (
            <span>
              finans<span className="brand-period">.</span>
            </span>
          )}
        </div>
        <div className="workspace-label">KİŞİSEL ÇALIŞMA ALANI</div>
        <nav aria-label="Ana navigasyon">
          {navigation.filter(([name])=>name!=='Kullanıcılar'||can(fullData.user,'admin')).map(([name, Icon]) => (
            <button
              key={name}
              className={page === name ? "active" : ""}
              aria-current={page === name ? "page" : undefined}
              aria-label={name}
              onClick={() => go(name)}
            >
              <Icon size={19} />
              <span>{name}</span>
              {name === "Ödeme Planı" && late.length > 0 && !compact && (
                <em>{late.length}</em>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button onClick={() => setDrawer({ type: "info" })}>
            <Settings size={18} />
            <span>Görünüm ve bilgiler</span>
          </button>
          <button
            aria-label={compact ? "Menüyü genişlet" : "Menüyü daralt"}
            onClick={() => setCompact(!compact)}
          >
            {compact ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
            <span>Menüyü daralt</span>
          </button>
          <div className="demo-note">
            <i />
            {demo?"Örnek veri · 1.6.0":"Çalışma alanı"}
          </div>
        </div>
      </aside>
      <div className="main-shell" inert={!!drawer}>
        <header className="topbar">
          <div className="breadcrumb">
            <span>Çalışma alanı</span>
            <ChevronRight size={13} />
            <b>{page}</b>{page==="Cari hesaplar"&&partyLabel&&<><ChevronRight size={13}/><span>{partyLabel}</span></>}
          </div>
          <div className="top-actions">
            <label className="search">
              <Search size={16} />
              <input
                id="search"
                aria-label="İşlemlerde ara"
                placeholder="İşlem veya kişi ara"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setPage("Raporlar");
                }}
              />
              <kbd>Ctrl K</kbd>
            </label>
            <div className="notification-holder">
              <button
                className="icon-button notification-button"
                aria-label="Bildirimleri aç"
                onClick={() => setBell(!bell)}
              >
                <Bell size={19} />
                {notifications.length > 0 && <i />}
              </button>
              {bell&&<Sheet title="Bildirimler" onClose={()=>setBell(false)}><div className="sheet-scroll notification-list">{notifications.length?notifications.map(alert=><AlertNotice key={alert.id} alert={alert} onOpen={()=>{go(alert.page);if(alert.account!==undefined)setScope(alert.account)}}/>):<p className="muted">Dikkat gerektiren bildirim yok.</p>}</div></Sheet>}
            </div>
            <span className="header-divider" />
            <span className="date-label">
              {fullDate} <b>{dateObj.toLocaleDateString("tr-TR",{weekday:"long"})}</b>
            </span>
          </div>
        </header>
        <main className="main-content">
          {page==="Genel bakış"&&<div className="page-title">
            <div>
              <h1>{page === "Genel bakış" ? "Finansal görünüm" : page}</h1>
              <p>{descriptions[page]}</p>
            </div>
            <button className="primary-button" disabled={!can(fullData.user,'create')} onClick={() => openForm()}>
              <Plus size={17} />
              <span className="sr-only">İşlem ekle</span>
            </button>
          </div>}
          {page !== "Genel bakış" ? <FinanceHub key={page} page={page} data={fullData} onState={applyState} notify={notify} open={openFinance} search={search} initialAccount={scope} initialDue={claimFilter} onLabel={setPartyLabel}/> : page === "Genel bakış" ? (
            <>
              <div className="snapshot-label">
                <span>GÜNCEL DURUM</span>
                <span>
                  {fullDate} itibarıyla <i />
                </span>
              </div>
              <section className="summary">
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
                {[
                  [receivable, "Alacaklar", "Verilen avans ve kart alacağı dâhil", "alacak"],
                  [debt, "Borçlar", "Kredi kartları ve alınan avans dâhil", "borç"],
                  [
                    upcoming,
                    "Yaklaşan ödeme",
                    "Toplam borcun vadesi yaklaşan kısmı",
                    "upcoming",
                  ],
                ].map(([n, l, note, target]) => (
                  <button
                    className="metric"
                    key={l}
                    onClick={() => {
                      if (target === "upcoming")
                        setDrawer({ type: "upcoming" });
                      else {
                        go("Ödeme Planı");
                        setClaimFilter(target);
                      }
                    }}
                  >
                    <div className="metric-label">
                      {l}
                      {target === "upcoming" && (
                        <span className="tiny-badge">7 gün</span>
                      )}
                    </div>
                    <div className="metric-value">
                      {money(n)}
                      <span>TL</span>
                    </div>
                    <div className="metric-note">{note}</div>
                  </button>
                ))}
              </section>
              <div className="dashboard-grid">
                {cashflow}
                {attention}
              </div>
              <div className="dashboard-grid lower">
                <section className="panel transactions-panel">
                  <Heading
                    title="Son hareketler"
                    sub="Tüm işlem türleri · Seçili dönem ve hesap kapsamı"
                  >
                    <button
                      className="text-action"
                      onClick={() => setPage("Raporlar")}
                    >
                      Tümünü gör <ArrowRight size={14} />
                    </button>
                  </Heading>
                  {table(true)}
                </section>
                {accountsPanel}
              </div>
              <footer>
                <span>{demo?"Örnek veriler":"Kalıcı kayıtlar"} · Banka bağlantısı yok</span>
                <span>Tutarlar Türk lirası (TL)</span>
              </footer>
            </>
          ) : page === "Hareketler" ? (
            <>
              <div className="list-toolbar">
                {controls}
                <div className="toolbar-right">
                  <button
                    className="secondary-button"
                    onClick={() => setFilters(!filters)}
                  >
                    <SlidersHorizontal size={16} />
                    Filtreler
                  </button>
                  <button className="secondary-button" onClick={csv}>
                    <Download size={16} />
                    CSV indir
                  </button>
                </div>
              </div>
              {filters && (
                <div className="filter-panel">
                  <label>
                    İşlem türü
                    <select
                      aria-label="İşlem türü filtresi"
                      value={kind}
                      onChange={(e) => setKind(e.target.value)}
                    >
                      <option value="all">Tümü</option>
                      <option>Tahsilat</option>
                      <option>Ödeme</option>
                      <option>Transfer</option>
                    </select>
                  </label>
                </div>
              )}
              <section className="panel transactions-panel">
                <Heading
                  title={`${visible.length} hareket`}
                  sub="Satıra tıklayarak ayrıntıyı aç"
                />
                {table(false)}
              </section>
            </>
          ) : page === "Tahsilat & Ödeme" ? (
            <>
              <div className="segmented">
                {[
                  ["all", "Tümü"],
                  ["alacak", "Alacaklar"],
                  ["borç", "Borçlar"],
                  ["late", "Gecikenler"],
                ].map(([v, l]) => (
                  <button
                    key={v}
                    aria-pressed={claimFilter === v}
                    className={claimFilter === v ? "selected" : ""}
                    onClick={() => setClaimFilter(v)}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {claimFilter === "borç" && (
                <div className="info-note">
                  <CreditCard size={17} />
                  <span>
                    {money(cards.reduce((s, c) => s + c.debt, 0))} TL kart borcu{" "}
                    <button
                      className="text-action"
                      onClick={() => go("Kredi kartları")}
                    >
                      Kredi kartları
                    </button>{" "}
                    bölümünde izlenir.
                  </span>
                </div>
              )}
              <section className="panel">
                <Heading title="Vade takibi" sub={`Bugün: ${fullDate}`} />
                {claims
                  .filter(
                    (c) =>
                      (claimFilter === "all" ||
                        (claimFilter === "late"
                          ? c.due < TODAY
                          : c.type === claimFilter)) &&
                      c.name
                        .toLocaleLowerCase("tr")
                        .includes(search.toLocaleLowerCase("tr")),
                  )
                  .sort((a, b) => a.due.localeCompare(b.due))
                  .map(showClaim)}
              </section>
            </>
          ) : page === "Hesaplar" ? (
            <>
              <div className="account-grid">
                {accounts.map((a) => (
                  <section className="panel account-detail" key={a.id}>
                    <span className="account-icon">
                      {a.type === "Kasa" ? (
                        <Wallet size={24} />
                      ) : (
                        <Landmark size={24} />
                      )}
                    </span>
                    <h2>{a.name}</h2>
                    <p>{a.type}</p>
                    <div className="big-balance">
                      {money(a.balance)}
                      <small> TL</small>
                    </div>
                    <div className="account-buttons">
                      <button
                        className="secondary-button"
                        onClick={() => {
                          go("Raporlar");
                          setScope(a.id);
                        }}
                      >
                        Hareketleri gör
                      </button>
                      <button
                        className="primary-button"
                        onClick={() => openForm({ account: a.id })}
                      >
                        <Plus size={16} />
                        İşlem
                      </button>
                    </div>
                  </section>
                ))}
              </div>
              <button
                className="secondary-button"
                onClick={() => openForm({ kind: "Transfer" })}
              >
                <ArrowLeftRight size={16} />
                Hesaplar arası transfer
              </button>
            </>
          ) : page === "Kredi kartları" ? (
            <div className="card-list">
              {cards.map((c) => (
                <section className="panel compact-card" key={c.id}>
                  <div className="compact-card-head">
                    <span className="account-icon">
                      <CreditCard size={22} />
                    </span>
                    <div>
                      <h2>{c.name}</h2>
                      <p>Son ödeme {day(c.due)} {c.due.slice(0,4)}</p>
                    </div>
                  </div>
                  <div className="card-stat-row">
                    {[
                      ["Güncel borç", c.debt],
                      ["Ekstre borcu", c.statement],
                      ["Kullanılabilir limit", c.limit - c.debt],
                    ].map(([l, n]) => (
                      <div key={l}>
                        <span>{l}</span>
                        <b>{money(n)} TL</b>
                      </div>
                    ))}
                  </div>
                  <div
                    className="usage-track"
                    role="meter"
                    aria-label="Limit kullanım oranı"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={(c.debt / c.limit) * 100}
                  >
                    <span
                      style={{ width: (c.statement / c.limit) * 100 + "%" }}
                    />
                    <span
                      className="secondary-segment"
                      style={{
                        width: ((c.debt - c.statement) / c.limit) * 100 + "%",
                      }}
                    />
                  </div>
                  <div className="usage-label">
                    <span>
                      Limit {money(c.limit)} TL · %
                      {money((c.debt / c.limit) * 100, 1)} kullanım
                    </span>
                    <span>Ekstre / Dönem içi</span>
                  </div>
                  <button
                    className="primary-button"
                    onClick={() =>
                      openForm({
                        kind: "Kart ödemesi",
                        name: c.name,
                        amount: String(c.statement),
                        cardId: c.id,
                      })
                    }
                  >
                    Ödeme kaydet
                  </button>
                </section>
              ))}
            </div>
          ) : (
            <>
              <div className="report-heading">
                <span className="muted">
                  Nakit hareketleri raporu · Harcama raporundan ayrıdır
                </span>
                <button className="secondary-button" onClick={csv}>
                  <Download size={16} />
                  Raporu indir
                </button>
              </div>
              <div className="dashboard-grid">
                {cashflow}
                <section className="panel">
                  <Heading title="Çıkışların dağılımı" sub="Seçili dönemde" />
                  {Object.entries(
                    periodTx
                      .filter((t) => t.amount < 0)
                      .reduce(
                        (o, t) => ({
                          ...o,
                          [t.category]: (o[t.category] || 0) - t.amount,
                        }),
                        {},
                      ),
                  )
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, n]) => (
                      <div className="breakdown" key={name}>
                        <div>
                          <span>{name}</span>
                          <b>{money(n)} TL</b>
                        </div>
                        <div className="usage-track">
                          <span style={{ width: (n / outgoing) * 100 + "%" }} />
                        </div>
                      </div>
                    ))}
                </section>
              </div>
              <section className="panel transactions-panel">
                <Heading
                  title="Raporun kaynak kayıtları"
                  sub="Filtreler grafikle birlikte uygulanır"
                />
                {table(false)}
              </section>
            </>
          )}
        </main>
      </div>
      <nav
        inert={!!drawer}
        className="mobile-nav"
        aria-label="Mobil navigasyon"
      >
        {[
          ["Genel bakış", "Özet", LayoutDashboard],
          ["Raporlar", "Raporlar", ChartNoAxesCombined],
          ["Tahsilat & Ödeme", "Ödeme", ArrowLeftRight],
        ].map(([p, l, Icon]) => (
          <button
            key={p}
            className={page === p ? "active" : ""}
            onClick={() => go(p)}
          >
            <Icon size={21} />
            {l}
          </button>
        ))}
        <button onClick={() => setMobileMore(!mobileMore)}>
          <MoreHorizontal size={21} />
          Diğer
        </button>
      </nav>
      {mobileMore && (
        <div className="mobile-more">
          {navigation.filter(([name])=>!["Genel bakış","Hareketler","Raporlar","Tahsilat & Ödeme"].includes(name)&&(name!=="Kullanıcılar"||can(fullData.user,"admin"))).map(([name, Icon]) => (
            <button key={name} onClick={() => go(name)}>
              <Icon size={19} />
              {name}
              <ChevronRight size={15} />
            </button>
          ))}
        </div>
      )}
      {drawer && (
        <div className="drawer-layer">
          <button
            className="backdrop"
            aria-label="Paneli kapat"
            onClick={() => setDrawer(null)}
          />
          <section
            className="drawer"
            onKeyDown={(e) => {
              if (e.key !== "Tab") return;
              const els = [
                ...e.currentTarget.querySelectorAll(
                  "button:not([disabled]),input,select:not([disabled]),textarea",
                ),
              ];
              if (e.shiftKey && document.activeElement === els[0]) {
                e.preventDefault();
                els.at(-1)?.focus();
              } else if (!e.shiftKey && document.activeElement === els.at(-1)) {
                e.preventDefault();
                els[0]?.focus();
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
          >
            <div className="drawer-heading">
              <div>
                <span className="eyebrow">
                  {drawer.type === "form" ? "HIZLI İŞLEM" : "AYRINTI"}
                </span>
                <h2 id="drawer-title">
                  {drawer.type === "form"
                    ? "İşlem ekle"
                    : drawer.type === "tx"
                      ? "Hareket ayrıntısı"
                      : drawer.type === "upcoming"
                        ? "Yaklaşan ödemeler"
                        : drawer.type === "info"
                          ? "Prototip bilgileri"
                          : drawer.item.name}
                </h2>
              </div>
              <button
                autoFocus={drawer.type !== "form"}
                className="icon-button"
                aria-label="Paneli kapat"
                onClick={() => setDrawer(null)}
              >
                <X size={22} />
              </button>
            </div>
            {drawer.type === "form" ? (
              <form onSubmit={save}>
                <div className="form-context">
                  <Landmark size={16} />
                  {accountName(form.account)}
                  <span>{demo?"Örnek kayıt":"Yeni kayıt"}</span>
                </div>
                <label>
                  İşlem türü
                  <select
                    value={form.kind}
                    onChange={(e) => setForm({ ...form, kind: e.target.value })}
                    disabled={!!form.claimId || !!form.cardId}
                  >
                    <option>Tahsilat</option>
                    <option>Ödeme</option>
                    <option>Transfer</option>
                    {form.cardId && <option>Kart ödemesi</option>}
                  </select>
                </label>
                <label>
                  Tutar <span>TL</span>
                  <input
                    autoFocus
                    required
                    inputMode="decimal"
                    placeholder="0,00"
                    value={form.amount}
                    onChange={(e) => {
                      setError("");
                      setForm({ ...form, amount: e.target.value });
                    }}
                  />
                </label>
                {form.kind !== "Transfer" && (
                  <label>
                    Kişi / açıklama
                    <input
                      required
                      value={form.name}
                      placeholder="Örn. Atlas Danışmanlık"
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </label>
                )}
                <label>
                  {form.kind === "Transfer" ? "Kaynak hesap" : "Hesap"}
                  <select
                    value={form.account}
                    onChange={(e) =>
                      setForm({ ...form, account: e.target.value })
                    }
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </label>
                {form.kind === "Transfer" && (
                  <label>
                    Hedef hesap
                    <select
                      value={form.target}
                      onChange={(e) =>
                        setForm({ ...form, target: e.target.value })
                      }
                    >
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <label>
                  İşlem tarihi
                  <DatePicker value={form.date} max={TODAY} required today={TODAY} label="İşlem tarihi" onChange={v=>setForm({...form,date:v})}/>
                </label>
                <button
                  className="extra-toggle"
                  type="button"
                  aria-expanded={extra}
                  onClick={() => setExtra(!extra)}
                >
                  <SlidersHorizontal size={16} />
                  Ek bilgiler
                  <ChevronDown size={16} />
                </button>
                {extra && (
                  <div className="extra-fields">
                    <label>
                      Açıklama
                      <textarea
                        value={form.desc}
                        onChange={(e) =>
                          setForm({ ...form, desc: e.target.value })
                        }
                      />
                    </label>
                    <label>
                      Kategori
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value })
                        }
                      >
                        {[
                          "Diğer",
                          "Hizmet",
                          "Ofis",
                          "Kira",
                          "Malzeme",
                          "Faturalar",
                          "Ulaşım",
                          "Ekipman",
                        ].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Belge / referans no
                      <input
                        value={form.document}
                        onChange={(e) =>
                          setForm({ ...form, document: e.target.value })
                        }
                      />
                    </label>
                  </div>
                )}
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <div className="form-footer">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setDrawer(null)}
                  >
                    Vazgeç
                  </button>
                  <button type="submit" className="primary-button" disabled={busy}>
                    <Check size={17} />
                    {busy?"Kaydediliyor…":"Kaydet"}
                  </button>
                </div>
                <p className="form-help">
                  Kayıtlar veritabanına kaydedilir. Bankada para hareketi yapılmaz.
                </p>
              </form>
            ) : drawer.type === "tx" ? (
              <>
                <div
                  className={
                    "detail-amount " +
                    (drawer.item.amount > 0 ? "positive" : "")
                  }
                >
                  {drawer.item.amount > 0 ? "+" : "−"}
                  {money(Math.abs(drawer.item.amount), 2)}
                  <small> TL</small>
                </div>
                <dl>
                  {[
                    ["Açıklama", drawer.item.name],
                    ["Not", drawer.item.desc],
                    ["Hesap", accountName(drawer.item.account)],
                    [
                      "Tarih",
                      day(drawer.item.date) + " " + drawer.item.date.slice(0,4) + " · " + drawer.item.time,
                    ],
                    ["Tür", drawer.item.kind],
                    ["Kategori", drawer.item.category],
                    ["Belge no", drawer.item.document || "Eklenmedi"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : drawer.type === "claim" ? (
              <>
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
                    <dd>{day(drawer.item.due)} {drawer.item.due.slice(0,4)}</dd>
                  </div>
                  <div>
                    <dt>Açıklama</dt>
                    <dd>{drawer.item.desc}</dd>
                  </div>
                </dl>
                <button
                  className="primary-button wide"
                  onClick={() =>
                    openForm({
                      kind:
                        drawer.item.type === "alacak" ? "Tahsilat" : "Ödeme",
                      name: drawer.item.name,
                      amount: String(drawer.item.amount),
                      claimId: drawer.item.id,
                    })
                  }
                >
                  {drawer.item.type === "alacak"
                    ? "Tahsilat kaydet"
                    : "Ödeme kaydet"}
                  <ArrowRight size={16} />
                </button>
              </>
            ) : drawer.type === "card" ? (
              <>
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
                <button
                  className="primary-button wide"
                  onClick={() =>
                    openForm({
                      kind: "Kart ödemesi",
                      name: drawer.item.name,
                      amount: String(drawer.item.statement),
                      cardId: drawer.item.id,
                    })
                  }
                >
                  Ödeme kaydet
                </button>
              </>
            ) : drawer.type === "upcoming" ? (
              <>
                <p className="muted">{day(TODAY)}–{day(dateOffset(7))} {TODAY.slice(0,4)} · {money(upcoming)} TL</p>
                {soon.map((c) => (
                  <button
                    className="claim-row upcoming-row"
                    key={(c.card ? "card" : "claim") + c.id}
                    onClick={() =>
                      setDrawer({ type: c.card ? "card" : "claim", item: c })
                    }
                  >
                    <div>
                      <b>{c.name}</b>
                      <small>
                        {day(c.due)} · {c.label}
                      </small>
                    </div>
                    <strong>{money(c.amount)} TL</strong>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </>
            ) : (
              <>
                <p>Finans · Sürüm 1.6.0</p>
                <p>{fullData.user.short_name} · {fullData.user.role}</p>
                {can(fullData.user,'admin')&&<p><a className="text-button" href="update.php">Sistem güncellemesi</a></p>}
                <dl>
                  <div>
                    <dt>Tasarım dili</dt>
                    <dd>Sakin netlik</dd>
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
              </>
            )}
          </section>
        </div>
      )}
      {financeContext&&<FinanceDialog key={contextKey} context={financeContext} data={fullData} onClose={()=>setFinanceContext(null)} onState={applyState} notify={notify} replace={openFinance}/>}
      {toast && (
        <div className="toast" role="status">
          <span className="status-icon success">
            <Check size={18} />
          </span>
          <div>
            <b>{toast.title}</b>
            <small>{toast.detail}</small>
          </div>
          <button
            className="icon-button"
            aria-label="Bildirimi kapat"
            onClick={() => setToast(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
