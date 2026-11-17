import { useState, useId } from "react";
import { MonitorCheck, ChevronRight } from "lucide-react";
import { WeekCalendar } from "./WeekCalendar";
import { PartyMonthlySummary } from "./PartyMonthlySummary";
import { CheckCircle2, Clock, Info, AlertCircle } from "lucide-react";
import { fmt, can } from "./ui";
import { dateLabel } from "./DatePicker";
import { POS_PROGRAMS } from "./BankCards";
import bonusLogo from "./assets/pos/bonus.png";
import worldLogo from "./assets/pos/world.webp";
import axessLogo from "./assets/pos/axess.png";
const posLogos = { bonus: bonusLogo, world: worldLogo, axess: axessLogo };
import { customerStats } from "./profile-utils.mjs";
function Line({ label, children, help, level = "" }) {
  const Icon =
    level === "success"
      ? CheckCircle2
      : level === "danger"
        ? AlertCircle
        : level === "warning"
          ? Clock
          : Info;
  return (
    <div className={"context-info-row " + level}>
      <Icon size={17} />
      <div>
        <h3>{label}</h3>
        <strong>{children}</strong>
        {help && <small>{help}</small>}
      </div>
    </div>
  );
}
export function PartyContext({ party, data, open }) {
  const [tab, setTab] = useState("info");
  const tabId = useId();
  const edit = () => open({ entity: "party", item: party });
  let content;
  if (party.type === "Personel") {
    content = (
      <>
        <WeekCalendar party={party} data={data} />
        <CompactInfo party={party} staff />
      </>
    );
  } else if (party.type === "Tedarikçi") {
    const campaigns = (data.campaigns || []).filter(
      (c) =>
        c.active &&
        c.start_date <= data.today &&
        c.end_date >= data.today &&
        (!c.party_ids?.length || c.party_ids.includes(party.id)) &&
        (!c.pos_programs?.length ||
          c.pos_programs.some((p) => (party.pos_programs || []).includes(p))),
    );
    content = (
      <>
        <WeekCalendar party={party} data={data} />
        <section className="context-block">
          <h3>
            <MonitorCheck size={17} />
            POS Cihazları
          </h3>
          <div className="supplier-pos">
            {(party.pos_programs || []).map((code) => {
              const [bank, program] = code.split(":");
              return (
                <span
                  className={"supplier-pos-logo " + bank}
                  key={code}
                  role="img"
                  aria-label={
                    POS_PROGRAMS.find((p) => p.code === code)?.label || code
                  }
                  title={
                    POS_PROGRAMS.find((p) => p.code === code)?.label || code
                  }
                >
                  <img src={posLogos[program]} alt="" />
                </span>
              );
            })}
          </div>
          {!party.pos_programs?.length && <p className="muted">Tanımlanmadı</p>}
        </section>
        <section className="context-block compact-campaigns">
          <h3>Kampanyalar</h3>
          {campaigns.length ? (
            campaigns.map((c) => (
              <button
                key={c.id}
                className="text-button"
                title={c.name}
                onClick={() =>
                  open({ entity: "campaign", item: c, mode: "view" })
                }
              >
                <span>– {c.name}</span>
                <ChevronRight size={14} />
              </button>
            ))
          ) : (
            <p className="muted">İlişkili aktif kampanya yok.</p>
          )}
        </section>
      </>
    );
  } else {
    const s = customerStats(party, data);
    content = (
      <>
        <WeekCalendar party={party} data={data} />
        <CompactInfo party={party} />
        <details className="customer-history">
          <summary>Geçmiş dönem ve vadeli tahsilatlar</summary>
          <Line
            label="Aylık brüt satış ortalaması"
            help={`${dateLabel(s.from)} – ${dateLabel(s.to)} öncesi · son 6 tamamlanmış ay; iadeler dahil değil.`}
          >
            {s.avg === null ? "Yeterli veri yok" : fmt(s.avg) + " TL"}
          </Line>
          <Line
            label="Zamanında tahsil edilen tutar"
            help="Vadesi gelen satışlarda, vadeye kadar kapatılan tutarın oranı. Vadesiz satışlar dahil değil."
          >
            {s.performance === null ? "Yeterli veri yok" : `%${s.performance}`}
          </Line>
          <h3 className="context-subtitle">Tahsilat durumu</h3>
          {s.claims
            .filter((c) => c.due)
            .slice(0, 5)
            .map((c) => (
              <Line
                key={c.id}
                label={
                  c.due < data.today ? "Geciken tahsilat" : "Yaklaşan tahsilat"
                }
                level={c.due < data.today ? "danger" : "warning"}
                help={dateLabel(c.due)}
              >
                {fmt(c.amount_cents)} TL
              </Line>
            ))}
          {!s.claims.some((c) => c.due) && (
            <p className="muted">Vadeli açık tahsilat bulunmuyor.</p>
          )}
        </details>
      </>
    );
  }
  return (
    <div className="party-context-stack" data-tab={tab}>
      <div
        className="party-context-tabs"
        role="tablist"
        aria-label="Cari özeti"
      >
        <button
          id={tabId + "-info-tab"}
          role="tab"
          aria-selected={tab === "info"}
          aria-controls={tabId + "-info"}
          onClick={() => setTab("info")}
        >
          Durum ve bilgiler
        </button>
        <button
          id={tabId + "-month-tab"}
          role="tab"
          aria-selected={tab === "month"}
          aria-controls={tabId + "-month"}
          onClick={() => setTab("month")}
        >
          Aylık Özet
        </button>
      </div>
      <div id={tabId + "-info"} className="party-info-view">
        <section className="panel party-context">
          <header>
            <h2>Durum ve bilgiler</h2>
            {can(data.user, "edit") && (
              <button className="text-button" onClick={edit}>
                Düzenle
              </button>
            )}
          </header>
          {content}
        </section>
      </div>
      <div id={tabId + "-month"} className="party-month-view">
        <PartyMonthlySummary key={party.id} party={party} data={data} />
      </div>
    </div>
  );
}
function CompactInfo({ party, staff = false }) {
  const fields = [
    [staff ? "Ad soyad" : "Ünvan", party.title || party.name],
    [staff ? "TCKN" : "TCKN/VKN", party.tax_no],
    ["Adres", party.address],
    ["Telefon", party.phone],
  ];
  return (
    <section className="context-block">
      <h3>{staff ? "Personel bilgileri" : "Müşteri bilgileri"}</h3>
      <dl className="party-compact-info">
        {fields.map(([name, value]) => (
          <div key={name}>
            <dt>{name}</dt>
            <dd>{value || "Tanımlanmadı"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
