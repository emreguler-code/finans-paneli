export const weekdays = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];
export function nextVisit(days, today) {
  if (!days?.length) return "";
  const d = new Date(today + "T12:00:00Z"),
    weekday = d.getUTCDay() || 7;
  const offset = Math.min(...days.map((day) => (day - weekday + 7) % 7));
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}
export function weekStart(today) {
  const d = new Date(today + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}
export function staffStatus(party, data) {
  const p = party.profile || {},
    month = data.today.slice(0, 7);
  const events = data.events.filter(
    (e) =>
      e.party_id === party.id &&
      !e.cancelled &&
      !e.scheduled &&
      e.event_date <= data.today,
  );
  const salary = events
    .filter((e) => e.operation === "salary" && e.event_date.startsWith(month))
    .reduce((s, e) => s + e.amount_cents, 0);
  const sum = (ids) =>
    p.staff_month === month
      ? events
          .filter(
            (e) =>
              (ids || []).includes(e.id) &&
              e.event_date.startsWith(month) &&
              ["payment", "employee_expense"].includes(e.operation),
          )
          .reduce((s, e) => s + e.amount_cents, 0)
      : 0;
  return {
    salary,
    paid: sum(p.salary_payments),
    meal: p.staff_month === month ? p.meal_due_cents || 0 : 0,
    mealPaid: sum(p.meal_payments),
    leave:
      p.leave_week === weekStart(data.today) &&
      p.leave_used != null &&
      p.leave_total != null
        ? { used: p.leave_used, total: p.leave_total }
        : null,
  };
}
export function customerStats(party, data) {
  const end = new Date(data.today.slice(0, 7) + "-01T12:00:00Z"),
    start = new Date(end);
  start.setUTCMonth(start.getUTCMonth() - 6);
  const from = start.toISOString().slice(0, 10),
    to = end.toISOString().slice(0, 10);
  const events = data.events.filter(
    (e) =>
      e.party_id === party.id &&
      !e.cancelled &&
      !e.scheduled &&
      e.event_date <= data.today,
  );
  const sales = events.filter(
    (e) => e.operation === "sale" && e.event_date >= from && e.event_date < to,
  );
  const avg = sales.length
    ? Math.round(sales.reduce((s, e) => s + e.amount_cents, 0) / 6)
    : null;
  const matured = events.filter(
    (e) =>
      e.operation === "sale" &&
      e.due_date &&
      e.due_date <= data.today &&
      e.amount_cents > 0,
  );
  let total = 0,
    onTime = 0;
  for (const e of matured) {
    const matches = (data.allocations || []).filter((a) => a.bill_id === e.id);
    const credited = matches
      .filter((a) =>
        events.some(
          (other) =>
            other.id === a.payment_id && other.operation === "customer_return",
        ),
      )
      .reduce((s, a) => s + a.amount_cents, 0);
    const eligible = Math.max(0, e.amount_cents - credited);
    total += eligible;
    onTime += Math.min(
      eligible,
      (e.event_date <= e.due_date
        ? Math.min(e.settled_cents || 0, e.amount_cents)
        : 0) +
        matches
          .filter(
            (a) =>
              a.date <= e.due_date &&
              events.some(
                (payment) =>
                  payment.id === a.payment_id &&
                  payment.operation === "collection",
              ),
          )
          .reduce((s, a) => s + a.amount_cents, 0),
    );
  }
  return {
    from,
    to,
    avg,
    performance: total
      ? Math.min(100, Math.round((onTime / total) * 100))
      : null,
    claims: (data.claims || [])
      .filter(
        (c) => (c.partyId || c.party_id) === party.id && c.type === "alacak",
      )
      .sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999")),
  };
}
