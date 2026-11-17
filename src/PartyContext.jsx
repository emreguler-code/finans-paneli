import { CheckCircle2, Clock, Info, AlertCircle } from "lucide-react";
import { fmt, can } from "./ui";
import { dateLabel } from "./DatePicker";
import { POS_PROGRAMS } from "./BankCards";
import { campaignProgress } from "./tracking-utils.mjs";
import {
  nextVisit,
  weekdays,
  staffStatus,
  customerStats,
} from "./profile-utils.mjs";
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
  const profile = party.profile || {},
    edit = () => open({ entity: "party", item: party });
  const period = new Date(data.today + "T12:00:00Z").toLocaleDateString(
    "tr-TR",
    { month: "long", year: "numeric", timeZone: "UTC" },
  );
  let content;
  if (party.type === "Personel") {
    const s = staffStatus(party, data),
      status = (due, paid) => (!due ? "" : paid >= due ? "success" : "warning");
    content = (
      <>
        <p className="context-period">{period}</p>
        <Line
          label="Maaş"
          level={status(s.salary, s.paid)}
          help={
            s.salary
              ? `Ödenen ${fmt(s.paid)} TL · Kalan ${fmt(Math.max(0, s.salary - s.paid))} TL`
              : "Bu ay maaş hak edişi girilmedi."
          }
        >
          {s.salary ? fmt(s.salary) + " TL" : "Tanımlanmadı"}
        </Line>
        <Line
          label="Yemek ücreti"
          level={status(s.meal, s.mealPaid)}
          help={
            s.meal
              ? `Ödenen ${fmt(s.mealPaid)} TL · Kalan ${fmt(Math.max(0, s.meal - s.mealPaid))} TL`
              : "Dönem tutarı ve ilgili ödemeler ayrıca seçilir."
          }
        >
          {s.meal ? fmt(s.meal) + " TL" : "Tanımlanmadı"}
        </Line>
        <Line
          label="Haftalık izin"
          help="Kullanılan / haftalık hak · yıllık izin dahil değildir."
        >
          {s.leave ? `${s.leave.used} / ${s.leave.total} gün` : "Tanımlanmadı"}
        </Line>
      </>
    );
  } else if (party.type === "Tedarikçi") {
    const days = profile.visit_days || [],
      next = nextVisit(days, data.today);
    const campaigns = (data.campaigns || []).filter(
      (c) =>
        c.active &&
        c.start_date <= data.today &&
        c.end_date >= data.today &&
        (!c.party_ids.length || c.party_ids.includes(party.id)) &&
        (!c.pos_programs.length ||
          c.pos_programs.some((p) => (party.pos_programs || []).includes(p))),
    );
    content = (
      <>
        <Line
          label="Ziyaret günleri"
          help={
            next
              ? "Sonraki planlı ziyaret: " +
                (next === data.today ? "Bugün" : dateLabel(next))
              : ""
          }
        >
          {days.length
            ? days.map((d) => weekdays[d - 1]).join(" · ")
            : "Ziyaret günü tanımlanmadı"}
        </Line>
        <Line label="POS programları">
          {(party.pos_programs || [])
            .map((p) => POS_PROGRAMS.find((v) => v.code === p)?.label || p)
            .join(" · ") || "Tanımlanmadı"}
        </Line>
        <h3 className="context-subtitle">İlişkili aktif kampanyalar</h3>
        {campaigns.length ? (
          campaigns.map((c) => {
            const entries = (data.campaign_entries || []).filter((entry) =>
              data.events.some(
                (e) => e.id === entry.event_id && e.party_id === party.id,
              ),
            );
            const progress = campaignProgress(c, data);
            const ownReceived = entries
              .filter((e) => e.active && e.confirmed)
              .reduce((sum, e) => sum + e.received, 0);
            return (
              <Line
                key={c.id}
                label={c.name}
                help={data.cards
                  .filter((card) => c.card_ids.includes(card.id))
                  .map((card) => card.name)
                  .join(" · ")}
              >
                {c.participation === "joined"
                  ? "Katılım yapıldı"
                  : c.participation === "required"
                    ? "Katılım bekliyor"
                    : "Katılım gerekmiyor"}
                <small>
                  Bu tedarikçi: {entries.filter((e) => e.active).length} bağlı
                  kayıt
                  {["points", "cashback"].includes(c.reward_type)
                    ? ` · Alınan ${ownReceived} ${c.reward_type === "points" ? "puan" : "TL"}`
                    : ""}
                </small>
                {["points", "cashback"].includes(c.reward_type) && (
                  <small>
                    Kampanya geneli beklenen: {progress.expected}{" "}
                    {c.reward_type === "points" ? "puan" : "TL"}
                  </small>
                )}
              </Line>
            );
          })
        ) : (
          <p className="muted">Bu tedarikçiyle eşleşen aktif kampanya yok.</p>
        )}
      </>
    );
  } else {
    const s = customerStats(party, data);
    content = (
      <>
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
      </>
    );
  }
  return (
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
  );
}
