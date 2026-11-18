import { staffStatus, weekStart } from "./profile-utils.mjs";
export function weekDates(today) {
  const start = new Date(weekStart(today) + "T12:00:00Z");
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    return d.toISOString().slice(0, 10);
  });
}
// Mirror the API's open-item matching order, at the selected month's cutoff.
// Recomputing from posted facts prevents later payments leaking into past months.
export function periodMatches(events) {
  const byId = new Map(events.map((e) => [e.id, e])),
    groups = new Map(),
    matches = [];
  for (const e of events) {
    const net = Number(e.party_effect) || 0;
    if (!net) continue;
    let lane = "main";
    if (
      e.return_mode === "later" &&
      ["supplier_return", "customer_return"].includes(e.operation)
    )
      lane = "return-" + e.id;
    else if (
      e.linked_id &&
      ["collection", "return_payment"].includes(e.operation) &&
      byId.get(e.linked_id)?.return_mode === "later"
    )
      lane = "return-" + e.linked_id;
    const key = e.party_id + "|" + lane;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ ...e, left: Math.abs(net) });
  }
  for (const rows of groups.values()) {
    rows.sort(
      (a, b) =>
        (a.due_date || "9999-12-31").localeCompare(
          b.due_date || "9999-12-31",
        ) ||
        a.event_date.localeCompare(b.event_date) ||
        a.id - b.id,
    );
    const positive = rows.filter((e) => e.party_effect > 0),
      negative = rows.filter((e) => e.party_effect < 0);
    let p = 0,
      n = 0;
    while (p < positive.length && n < negative.length) {
      const a = positive[p],
        b = negative[n],
        amount = Math.min(a.left, b.left);
      matches.push({ a: a.id, b: b.id, amount });
      a.left -= amount;
      b.left -= amount;
      if (!a.left) p++;
      if (!b.left) n++;
    }
  }
  return matches;
}
export function partyMonthly(party, data, month) {
  const end = new Date(month + "-01T12:00:00Z");
  end.setUTCMonth(end.getUTCMonth() + 1);
  end.setUTCDate(0);
  const cutoff =
    end.toISOString().slice(0, 10) < data.today
      ? end.toISOString().slice(0, 10)
      : data.today;
  const events = data.events.filter(
    (e) =>
      e.party_id === party.id &&
      !e.cancelled &&
      !e.scheduled &&
      e.event_date <= cutoff,
  );
  const current = events.filter((e) => e.event_date.startsWith(month));
  if (party.type === "Personel") {
    const s = staffStatus(party, { ...data, today: cutoff });
    // No stored entitlement/payment mapping is silently reused for another month.
    const salary = current
      .filter((e) => e.operation === "salary")
      .reduce((n, e) => n + e.amount_cents, 0);
    const meal = month === cutoff.slice(0, 7) ? s.meal : 0;
    const net = salary + meal,
      paid = Math.min(net, s.paid + s.mealPaid);
    const assigned = new Set(
      party.profile?.staff_month === month
        ? [
            ...(party.profile?.salary_payments || []),
            ...(party.profile?.meal_payments || []),
          ]
        : [],
    );
    const unassigned = current
      .filter(
        (e) =>
          ["payment", "employee_expense"].includes(e.operation) &&
          e.payment_purpose !== "Diğer" &&
          !assigned.has(e.id),
      )
      .reduce((sum, e) => sum + e.amount_cents, 0);
    return {
      gross: net,
      returns: 0,
      net,
      outer: [
        { name: "Maaş", value: salary },
        { name: "Yemek", value: meal },
      ],
      inner: unassigned
        ? []
        : [
            { name: "Ödenen", value: paid },
            { name: "Kalan hakediş", value: Math.max(0, net - paid) },
          ],
      notice: unassigned
        ? "Ödemelerin ait olduğu hakedişler belirlenmediği için oran gösterilmiyor."
        : "",
      unassigned,
      excess: Math.max(0, s.paid + s.mealPaid - net),
      periodTotal: s.paid + s.mealPaid,
      old: 0,
    };
  }
  const supplier = party.type === "Tedarikçi",
    ops = supplier ? ["purchase_invoice", "purchase_no_invoice"] : ["sale"];
  const bills = current.filter((e) => ops.includes(e.operation)),
    billIds = new Set(bills.map((e) => e.id));
  const returns = current.filter(
    (e) => e.operation === (supplier ? "supplier_return" : "customer_return"),
  );
  const gross = bills.reduce((n, e) => n + e.amount_cents, 0),
    returned = returns.reduce((n, e) => n + e.amount_cents, 0),
    net = gross - returned;
  let cash = 0,
    card = 0,
    old = 0,
    unknown = 0,
    linkedRefunds = 0,
    outsideCoverage = 0;
  const add = (e, amount) => {
    if (e.card_id) card += amount;
    else if (e.account_id) cash += amount;
    else unknown += Math.abs(amount);
  };
  bills.forEach((e) => add(e, Math.min(e.amount_cents, e.settled_cents || 0)));
  returns.forEach((e) =>
    add(e, -Math.min(e.amount_cents, e.settled_cents || 0)),
  );
  for (const returned of returns.filter((e) => e.return_mode === "later")) {
    let remaining = returned.amount_cents - (returned.settled_cents || 0);
    for (const refund of current.filter(
      (e) =>
        e.linked_id === returned.id &&
        e.operation === (supplier ? "collection" : "return_payment"),
    )) {
      const used = Math.min(remaining, refund.amount_cents);
      add(refund, -used);
      linkedRefunds += used;
      remaining -= used;
    }
  }
  const byId = new Map(events.map((e) => [e.id, e]));
  const paymentOp = supplier ? "payment" : "collection";
  for (const m of periodMatches(events)) {
    const a = byId.get(m.a),
      b = byId.get(m.b);
    const payment =
      a.operation === paymentOp ? a : b.operation === paymentOp ? b : null;
    const bill = payment === a ? b : a;
    if (payment?.event_date.startsWith(month) && bill.operation === "opening") {
      old += m.amount;
      continue;
    }
    if (
      !payment?.event_date.startsWith(month) ||
      !ops.includes(bill.operation)
    ) {
      if (
        billIds.has(a.id) &&
        !["supplier_return", "customer_return"].includes(b.operation)
      )
        outsideCoverage += m.amount;
      else if (
        billIds.has(b.id) &&
        !["supplier_return", "customer_return"].includes(a.operation)
      )
        outsideCoverage += m.amount;
      continue;
    }
    if (billIds.has(bill.id)) add(payment, m.amount);
    else old += m.amount;
  }
  // Ratios are shown only when these actual amounts form a nonnegative whole.
  const valid =
    net >= 0 &&
    cash >= 0 &&
    card >= 0 &&
    cash + card <= net &&
    unknown === 0 &&
    outsideCoverage === 0;
  const inner = supplier
    ? [
        { name: "Nakit / banka", value: cash },
        { name: "Kredi kartı", value: card },
        { name: "Açık borç", value: net - cash - card },
      ]
    : [
        { name: "Tahsil edilen", value: cash + card },
        { name: "Açık alacak", value: net - cash - card },
      ];
  const outer = supplier
    ? [
        {
          name: "Faturalı alış",
          value: bills
            .filter((e) => e.operation === "purchase_invoice")
            .reduce((n, e) => n + e.amount_cents, 0),
        },
        {
          name: "Faturasız alış",
          value: bills
            .filter((e) => e.operation === "purchase_no_invoice")
            .reduce((n, e) => n + e.amount_cents, 0),
        },
      ]
    : [];
  const periodTotal =
    current
      .filter((e) => e.operation === paymentOp)
      .reduce((n, e) => n + e.amount_cents, 0) +
    bills.reduce((n, e) => n + (e.settled_cents || 0), 0) -
    returns.reduce((n, e) => n + (e.settled_cents || 0), 0) -
    linkedRefunds;
  return {
    gross,
    returns: returned,
    net,
    outer,
    inner: valid ? inner : [],
    valid,
    periodTotal,
    old,
    outsideCoverage,
    notice: outsideCoverage
      ? "Bu ayın işlemlerinde dönem dışı ödeme veya başka mahsup var. Bu tutarları bu ay ödenmiş gibi gösteren bir oran oluşturulmadı."
      : "",
    cash,
    card,
    excess: 0,
  };
}
