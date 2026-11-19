import { staffAccrualAlerts } from "./staff-automation.mjs";
import {
  notificationLevels,
  readableAlertDetail,
} from "./notification-utils.mjs";

import { CircleAlert, Info, ChevronRight } from "lucide-react";
import {
  vehicleReminders,
  vehicleSchedule,
  addDays,
} from "./tracking-utils.mjs";
import { fmt } from "./ui";
import { isKmh, kmhUsage, hasMaturity } from "./account-utils.mjs";
export function kmhAlert(a) {
  if (!isKmh(a)) return null;
  const u = kmhUsage(a);
  if (!u.used) return null;
  return {
    id: "kmh-" + a.id,
    page: "Hesaplar",
    account: a.id,
    title:
      u.dailyInterest === null
        ? "KMH faiz oranı girilmemiş"
        : `Günlük tahmini faiz: ${fmt(u.dailyInterest)} TL`,
    detail:
      u.dailyInterest === null
        ? `${a.name} · Kullanılan limit ${fmt(u.used)} TL. Tahmin için hesap ayarlarına günlük oranı girin.`
        : `${a.name} · Bugünkü kullanılan limit ve girilen günlük oran; vergi ve valör hariç.`,
    level:
      u.used > u.limit
        ? "danger"
        : u.dailyInterest === null
          ? "warning"
          : "info",
  };
}
export function collectAlerts(data) {
  const alerts = [],
    today = data.today;
  alerts.push(...staffAccrualAlerts(data));
  const soon = (d) =>
    d &&
    d <=
      new Date(new Date(today + "T12:00:00Z").getTime() + 7 * 86400000)
        .toISOString()
        .slice(0, 10);
  for (const c of data.claims || [])
    if (soon(c.due))
      alerts.push({
        id: "claim-" + c.id,
        eventId: c.id,
        date: c.due,
        partyId: c.partyId || c.party_id,
        groupKey: "claim-" + c.type + "-" + (c.partyId || c.party_id || c.name),
        groupName: c.name,
        amount_cents: c.amount_cents,
        page: "Ödeme Planı",
        title: `${c.type === "borç" ? "Ödeme" : "Tahsilat"} ${c.due < today ? "gecikmiş" : c.due === today ? "bugün" : "yaklaşıyor"}`,
        detail: `${c.name} · ${c.due} · ${fmt(c.amount_cents)} TL`,
        level: c.due < today ? "danger" : "warning",
      });
  for (const a of data.accounts || [])
    if (a.active) {
      const warning = kmhAlert(a);
      if (warning) alerts.push(warning);
      if (hasMaturity(a) && soon(a.maturity_date))
        alerts.push({
          id: "maturity-" + a.id,
          date: a.maturity_date,
          page: "Hesaplar",
          account: a.id,
          title: "Hesap vade sonu",
          detail: `${a.name} · ${a.maturity_date}`,
          level: a.maturity_date < today ? "danger" : "warning",
        });
    }
  for (const e of data.events || [])
    if (
      e.scheduled &&
      !e.cancelled &&
      e.account_id &&
      soon(e.due_date || e.event_date)
    )
      alerts.push({
        id: "scheduled-" + e.id,
        date: e.due_date || e.event_date,
        page: "Hesaplar",
        account: e.account_id,
        eventId: e.id,
        title:
          "Planlanan " +
          (e.operation === "income" ? "tahsilat" : "ödeme") +
          ((e.due_date || e.event_date) < today ? " gecikmiş" : " yaklaşıyor"),
        detail: `${e.account_name} · ${e.description} · ${e.due_date || e.event_date} · ${fmt(e.amount_cents)} TL`,
        level: (e.due_date || e.event_date) < today ? "danger" : "warning",
      });
  for (const c of data.cards || [])
    if (c.active) {
      if (c.statement > 0 && soon(c.due))
        alerts.push({
          id: "card-due-" + c.id,
          date: c.due,
          page: "Kredi kartları",
          account: c.id,
          title: "Kart ödemesi " + (c.due < today ? "gecikmiş" : "yaklaşıyor"),
          detail: `${c.name} · ${c.due} · ${fmt(Math.round(c.statement * 100))} TL`,
          level: c.due < today ? "danger" : "warning",
        });
      if (
        Number(c.statement_needs_review) ||
        (c.statements || []).some((s) => s.difference_cents < 0)
      )
        alerts.push({
          id: "card-review-" + c.id,
          page: "Kredi kartları",
          account: c.id,
          title: Number(c.statement_needs_review)
            ? "Ekstre tarihi eksik"
            : "Ekstre tutarı uyuşmuyor",
          detail: Number(c.statement_needs_review)
            ? c.name +
              " · Takip edilen ekstre kesim ve son ödeme tarihlerini girin."
            : c.name +
              " · Tanımlı hareketler ekstre toplamını aşıyor; ekstre tarihini, iadeleri ve toplamını kontrol edin.",
          level: "warning",
        });
    }
  for (const { vehicle, record, date, dueKm } of vehicleReminders(data))
    alerts.push({
      id: "vehicle-" + record.id,
      page: "Araçlarım",
      entity: "vehicle_record",
      recordId: record.id,
      vehicleId: vehicle.id,
      date: dueKm ? today : date,
      title: dueKm
        ? "Bakım kilometresi geldi"
        : record.title + " " + (date < today ? "gecikmiş" : "yaklaşıyor"),
      detail: vehicle.plate + " · " + record.title + (date ? " · " + date : ""),
      level: dueKm || date < today ? "danger" : "warning",
    });
  for (const record of data.vehicle_records || []) {
    const vehicle = data.vehicles?.find(
      (v) => v.id === record.vehicle_id && v.active,
    );
    if (!vehicle) continue;
    for (const row of vehicleSchedule(record, data))
      if (soon(row.date))
        alerts.push({
          id: "vehicle-payment-" + record.id + "-" + row.index,
          page: "Araçlarım",
          entity: "vehicle_record",
          recordId: record.id,
          vehicleId: vehicle.id,
          date: row.date,
          title:
            "Araç ödemesi " + (row.date < today ? "gecikmiş" : "yaklaşıyor"),
          detail:
            vehicle.plate +
            " · " +
            record.title +
            " · " +
            fmt(row.remaining) +
            " TL",
          level: row.date < today ? "danger" : "warning",
        });
  }
  for (const c of data.campaigns || [])
    if (c.active && c.end_date >= today) {
      if (
        c.participation === "required" &&
        (c.join_by || c.end_date) <= addDays(today, 7)
      )
        alerts.push({
          id: "campaign-join-" + c.id,
          page: "Kampanyalar",
          entity: "campaign",
          recordId: c.id,
          date: c.join_by || c.end_date,
          title: "Kampanya katılımı bekliyor",
          detail: c.name + " · " + (c.join_by || c.end_date),
          level: "warning",
        });
      if (c.end_date <= addDays(today, 7))
        alerts.push({
          id: "campaign-end-" + c.id,
          page: "Kampanyalar",
          entity: "campaign",
          recordId: c.id,
          date: c.end_date,
          title: "Kampanya bitiyor",
          detail: c.name + " · " + c.end_date,
          level: "warning",
        });
    }
  return alerts;
}
export function AlertNotice({ alert, onOpen }) {
  if (!alert) return null;
  const Icon = alert.level === "info" ? Info : CircleAlert;
  const parts = readableAlertDetail(alert.detail).split(/(\d[\d.]*,\d{2} TL)/g);
  const content = (
    <>
      <Icon size={18} />
      <span>
        <strong>{alert.title}</strong>
        <small>
          {parts.map((part, i) =>
            /^[\d.]+,\d{2} TL$/.test(part) ? (
              <span className="money-nowrap" key={i}>
                {part}
              </span>
            ) : (
              part
            ),
          )}
        </small>
      </span>
      {onOpen && <ChevronRight size={16} />}
    </>
  );
  return onOpen ? (
    <button
      className={"alert-notice " + alert.level}
      aria-label={
        notificationLevels[alert.level] +
        ": " +
        alert.title +
        " · " +
        readableAlertDetail(alert.detail)
      }
      onClick={onOpen}
    >
      {content}
    </button>
  ) : (
    <div className={"alert-notice " + alert.level} role="status">
      {content}
    </div>
  );
}
