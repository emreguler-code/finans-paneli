import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { collectAlerts, AlertNotice } from "./Alerts";
import {
  notificationSource,
  orderNotifications,
  recentEvents,
} from "./notification-utils.mjs";
import { dateLabel } from "./DatePicker";
import { fmt, tone, Sheet } from "./ui";
import { cardEventEffect, operationLabel } from "./operations.mjs";
export function NotificationPreview({
  data,
  source,
  subject,
  onOpen,
  onAll,
  title = "Uyarılar",
  className = "",
}) {
  const alerts = orderNotifications(
    collectAlerts(data).filter(
      (a) =>
        notificationSource(a) === source &&
        (!subject ||
          String(a.vehicleId || a.account || a.partyId || "") ===
            String(subject)),
    ),
  );
  return (
    <section
      className={
        "panel notification-preview " +
        (source === "accounts" ? "account-alerts " : "") +
        className
      }
      aria-label={source === "accounts" ? "Hesap uyarıları" : title}
    >
      <header>
        <h2>{title}</h2>
        <small>{alerts.length}</small>
      </header>
      {alerts.slice(0, 5).map((a) => (
        <AlertNotice key={a.id} alert={a} onOpen={() => onOpen(a)} />
      ))}
      {!alerts.length && <p className="empty">Güncel uyarı bulunmuyor.</p>}
      <button
        className="text-button preview-all"
        onClick={() =>
          onAll({ source, subject: subject ? String(subject) : "all" })
        }
      >
        Tümünü göster ({alerts.length}) <ChevronRight size={16} />
      </button>
    </section>
  );
}
export function RecentActivity({
  data,
  source,
  partyId,
  sign = 0,
  title = "Son işlemler",
  open,
}) {
  const [group, setGroup] = useState(null);
  const rows = recentEvents(data, { source, partyId, sign });
  const effect = (e) =>
    source === "parties"
      ? e.party_effect
      : source === "cards"
        ? -cardEventEffect(e, e.card_id || e.target_card_id)
        : e.cash_effect;
  const displayAmount = (e) =>
    e.recent_ids || ["transfer", "card_transfer"].includes(e.operation)
      ? e.amount_cents
      : Math.abs(effect(e));
  return (
    <section className="panel recent-activity" role="region" aria-label={title}>
      <header>
        <h2>{title}</h2>
      </header>
      {rows.map((e) => (
        <button
          key={e.id}
          data-activity-id={e.id}
          className="recent-activity-row"
          onClick={() =>
            e.recent_ids
              ? setGroup(e)
              : open({
                  entity: "event",
                  mode: "view",
                  item: e,
                  ...(source === "parties" ? { effect: e.party_effect } : {}),
                })
          }
        >
          <span>
            <strong>
              {e.description || operationLabel(e)}
              {e.recent_ids && <small>Taksitli alışveriş toplamı</small>}
            </strong>
            <small>
              {source === "parties"
                ? e.party_name
                : e.card_name || e.account_name}{" "}
              · {operationLabel(e)}
            </small>
            <small>
              {dateLabel(e.event_date)} · {e.event_time?.slice(0, 5)}
            </small>
          </span>
          <span className={"activity-amount " + tone(effect(e))}>
            {effect(e) > 0 ? "+" : effect(e) < 0 ? "−" : ""}
            {fmt(displayAmount(e))} <small>TL</small>
          </span>
        </button>
      ))}
      {!rows.length && <p className="empty">Bu kapsamda hareket yok.</p>}
      {group && (
        <Sheet title="Taksitli alışveriş" onClose={() => setGroup(null)}>
          <div className="sheet-scroll">
            <p>{group.description}</p>
            <strong>{fmt(group.amount_cents)} TL · toplam</strong>
            {data.events
              .filter((e) => group.recent_ids.includes(e.id))
              .sort(
                (a, b) =>
                  (a.period_date || a.event_date).localeCompare(
                    b.period_date || b.event_date,
                  ) || a.id - b.id,
              )
              .map((e) => (
                <button
                  className="recent-activity-row"
                  key={e.id}
                  onClick={() => {
                    setGroup(null);
                    open({ entity: "event", mode: "view", item: e });
                  }}
                >
                  <span>
                    {e.description}
                    <small>
                      Dönem: {dateLabel(e.period_date || e.event_date)}
                    </small>
                  </span>
                  <span>{fmt(e.amount_cents)} TL</span>
                </button>
              ))}
          </div>
        </Sheet>
      )}
    </section>
  );
}
