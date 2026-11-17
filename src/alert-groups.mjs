import { orderNotifications } from "./notification-utils.mjs";
export function groupAlerts(alerts, today) {
  const groups = new Map();
  for (const alert of alerts) {
    const section = alert.date
      ? alert.date < today
        ? "Gecikmiş"
        : alert.date === today
          ? "Bugün"
          : "Yaklaşan"
      : "Diğer";
    const key = section + ":" + (alert.groupKey || alert.id);
    if (!groups.has(key))
      groups.set(key, { ...alert, section, count: 0, amount_cents: 0 });
    const group = groups.get(key);
    group.count++;
    group.amount_cents += alert.amount_cents || 0;
  }
  return orderNotifications([...groups.values()]);
}
