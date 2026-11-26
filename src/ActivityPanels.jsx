import { ChevronRight } from "lucide-react";
import { collectAlerts, AlertNotice } from "./Alerts";
import {
  notificationSource,
  orderNotifications,
  recentEvents,
} from "./notification-utils.mjs";
import { dateLabel } from "./DatePicker";
import { fmt, tone } from "./ui";
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
        className +
        (!alerts.length ? " is-empty" : "")
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
      {alerts.length > 0 && (
        <button
          className="text-button preview-all"
          onClick={() =>
            onAll({ source, subject: subject ? String(subject) : "all" })
          }
        >
          Tümünü göster ({alerts.length}) <ChevronRight size={16} />
        </button>
      )}
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
              ? open({
                  entity: "event",
                  mode: "view",
                  item:
                    data.events.find((row) => row.id === e.recent_ids[0]) || e,
                  ...(source === "cards"
                    ? { lockedCardId: e.card_id || e.target_card_id }
                    : source === "accounts"
                      ? { accountId: e.account_id || e.target_id }
                      : {}),
                })
              : open({
                  entity: "event",
                  mode: "view",
                  item: e,
                  ...(source === "parties"
                    ? { effect: e.party_effect }
                    : source === "cards"
                      ? { lockedCardId: e.card_id || e.target_card_id }
                      : source === "accounts"
                        ? { accountId: e.account_id || e.target_id }
                        : {}),
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
    </section>
  );
}
