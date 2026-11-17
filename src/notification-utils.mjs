export const notificationSources = {
  accounts: "Hesaplar",
  cards: "Kredi kartları",
  parties: "Cari hesaplar",
  vehicles: "Araçlarım",
  campaigns: "Kampanyalar",
};
export const notificationLevels = {
  danger: "Kritik",
  warning: "Dikkat",
  info: "Bilgi",
};
export const notificationSource = (a) =>
  a.id.startsWith("claim-")
    ? "parties"
    : {
        Hesaplar: "accounts",
        "Kredi kartları": "cards",
        Araçlarım: "vehicles",
        Kampanyalar: "campaigns",
      }[a.page] || "parties";
export const notificationSubject = (a) =>
  a.account !== undefined
    ? String(a.account)
    : a.vehicleId
      ? String(a.vehicleId)
      : a.partyId
        ? String(a.partyId)
        : a.recordId
          ? String(a.recordId)
          : "";
export function orderNotifications(alerts) {
  const rank = { danger: 0, warning: 1, info: 2 };
  return [...new Map(alerts.map((a) => [a.id, a])).values()].sort(
    (a, b) =>
      (rank[a.level] ?? 2) - (rank[b.level] ?? 2) ||
      (a.date || "9999").localeCompare(b.date || "9999") ||
      a.id.localeCompare(b.id),
  );
}
export function readableAlertDetail(text) {
  return String(text || "").replace(/\b\d{4}-\d{2}-\d{2}\b/g, (date) =>
    new Date(date + "T12:00:00Z").toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }),
  );
}
export function recentEvents(data, { source, partyId, sign = 0 } = {}) {
  const groups = new Map();
  for (const e of data.events || []) {
    if (
      e.cancelled ||
      e.scheduled ||
      e.event_date > data.today ||
      (partyId && e.party_id !== partyId)
    )
      continue;
    if (
      source === "parties"
        ? !e.party_id || (sign && Math.sign(e.party_effect) !== sign)
        : source === "cards"
          ? !(e.card_id || e.target_card_id)
          : !(e.account_id || e.target_id)
    )
      continue;
    if (source === "cards" && e.installment_group) {
      const key = e.installment_group;
      const prior = groups.get(key);
      if (prior) {
        prior.amount_cents += e.amount_cents;
        prior.recent_ids.push(e.id);
        prior.description = prior.description.replace(
          / · \d+\/\d+ taksit$/,
          "",
        );
      } else
        groups.set(key, {
          ...e,
          recent_ids: [e.id],
          description: e.description.replace(/ · \d+\/\d+ taksit$/, ""),
        });
    } else groups.set("event-" + e.id, { ...e });
  }
  return [...groups.values()]
    .sort(
      (a, b) =>
        (b.event_date + b.event_time).localeCompare(
          a.event_date + a.event_time,
        ) || b.id - a.id,
    )
    .slice(0, 5);
}
