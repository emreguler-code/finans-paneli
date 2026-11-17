import { dateAdd, weekStart } from "./list-utils.mjs";
export function shiftMonth(month, n) {
  const d = new Date(month + "-01T12:00:00Z");
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 7);
}
export function monthDays(month) {
  const first = month + "-01",
    last = dateAdd(shiftMonth(month, 1) + "-01", -1),
    end = dateAdd(weekStart(last), 6),
    days = [];
  for (let d = weekStart(first); d <= end; d = dateAdd(d, 1)) days.push(d);
  return days;
}
export function presetRange(p, today) {
  let from = today,
    to = today;
  if (p === "Dün") from = to = dateAdd(today, -1);
  if (p === "Bu Hafta") {
    from = weekStart(today);
    to = dateAdd(from, 6);
  }
  if (p === "Bu Ay") {
    from = today.slice(0, 7) + "-01";
    to = dateAdd(shiftMonth(today.slice(0, 7), 1) + "-01", -1);
  }
  if (p === "Son 3 Ay") from = shiftMonth(today.slice(0, 7), -2) + "-01";
  if (p === "Son 1 Yıl") from = shiftMonth(today.slice(0, 7), -11) + "-01";
  return { from, to };
}
export function dueMatches(e, data, filter) {
  if (filter === "all") return true;
  if (!["Borç", "Alacak", "Açılış"].includes(e.kind) || e.cancelled)
    return false;
  const claim = data.claims.find((c) => c.id === e.id),
    remaining = claim?.amount_cents || 0,
    due = e.due_date;
  return filter === "dated"
    ? Boolean(due)
    : filter === "undated"
      ? !due
      : filter === "open"
        ? remaining === e.amount_cents
        : filter === "partial"
          ? remaining > 0 && remaining < e.amount_cents
          : filter === "closed"
            ? remaining === 0
            : filter === "late"
              ? remaining > 0 && due && due < data.today
              : filter === "today"
                ? remaining > 0 && due === data.today
                : filter === "soon"
                  ? remaining > 0 &&
                    due &&
                    due > data.today &&
                    due <= dateAdd(data.today, 7)
                  : true;
}

// Projection only: no statement or payment is created from these estimates.
export function nextCardDates(card, today) {
  if (
    Number(card.statement_needs_review) ||
    !card.statement_date ||
    !card.due ||
    !Number(card.cut_day)
  )
    return { cut: "", due: "" };
  const base = card.statement_date > today ? card.statement_date : today;
  const month = base.slice(0, 7);
  const atMonth = (m) => {
    const [year, mon] = m.split("-").map(Number);
    const last = new Date(Date.UTC(year, mon, 0)).getUTCDate();
    return `${m}-${String(Math.min(Number(card.cut_day), last)).padStart(2, "0")}`;
  };
  let cut = atMonth(month);
  if (cut <= base) cut = atMonth(shiftMonth(month, 1));
  const offset = Math.round(
    (Date.parse(card.due + "T12:00:00Z") -
      Date.parse(card.statement_date + "T12:00:00Z")) /
      86400000,
  );
  return { cut, due: offset >= 0 ? dateAdd(cut, offset) : "" };
}
