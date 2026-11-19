import test from "node:test";
import assert from "node:assert/strict";
import {
  partyMonthly,
  weekDates,
  periodMatches,
} from "../src/party-monthly.mjs";
const party = { id: 1, type: "Tedarikçi" };
const event = (id, operation, amount, extra = {}) => ({
  id,
  party_id: 1,
  operation,
  kind: operation === "payment" ? "Ödeme" : "Borç",
  amount_cents: amount,
  party_effect: operation === "payment" ? amount : -amount,
  event_date: "2026-11-10",
  account_id: 1,
  settled_cents: 0,
  ...extra,
});
const data = (events) => ({ today: "2026-11-17", events });
test("monthly volume separates invoiced purchases, actual cash/card payments and open balance", () => {
  const s = partyMonthly(
    party,
    data([
      event(1, "purchase_invoice", 10000, {
        settled_cents: 2000,
        party_effect: -8000,
      }),
      event(2, "purchase_no_invoice", 5000, {
        settled_cents: 1000,
        party_effect: -4000,
        account_id: null,
        card_id: 2,
      }),
      event(3, "payment", 3000),
    ]),
    "2026-11",
  );
  assert.deepEqual(
    s.outer.map((d) => d.value),
    [10000, 5000],
  );
  assert.deepEqual(
    s.inner.map((d) => d.value),
    [5000, 1000, 9000],
  );
});
test("old debt payment is separated; later months and cancelled/planned facts cannot leak in", () => {
  const rows = [
    event(1, "purchase_invoice", 8000, { event_date: "2026-10-10" }),
    event(2, "purchase_invoice", 12000),
    event(3, "payment", 10000),
    event(4, "payment", 1000, { event_date: "2026-12-01" }),
    event(5, "purchase_invoice", 99999, { cancelled: true }),
    event(6, "payment", 88888, { scheduled: true }),
  ];
  const s = partyMonthly(party, data(rows), "2026-11");
  assert.equal(s.old, 8000);
  assert.deepEqual(
    s.inner.map((d) => d.value),
    [2000, 0, 10000],
  );
  assert.equal(s.periodTotal, 10000);
});
test("refunds reduce net purchases and actual refunded cash rather than add income slices", () => {
  const s = partyMonthly(
    party,
    data([
      event(1, "purchase_invoice", 10000, {
        settled_cents: 6000,
        party_effect: -4000,
      }),
      event(2, "supplier_return", 2000, {
        settled_cents: 1000,
        party_effect: 1000,
        kind: "Alacak",
      }),
    ]),
    "2026-11",
  );
  assert.equal(s.net, 8000);
  assert.deepEqual(
    s.inner.map((d) => d.value),
    [5000, 0, 3000],
  );
});
test("unassignable return/payment ratios are not forced into an invented 100%", () => {
  const s = partyMonthly(
    party,
    data([
      event(1, "supplier_return", 2000, {
        settled_cents: 2000,
        party_effect: 0,
        kind: "Alacak",
      }),
    ]),
    "2026-11",
  );
  assert.equal(s.net, -2000);
  assert.deepEqual(s.inner, []);
});
test("customer collection against prior sales is separate from current-month coverage", () => {
  const p = { id: 1, type: "Müşteri" };
  const rows = [
    event(1, "sale", 8000, {
      party_effect: 8000,
      event_date: "2026-10-01",
      kind: "Alacak",
    }),
    event(2, "sale", 12000, { party_effect: 12000, kind: "Alacak" }),
    event(3, "collection", 10000, { party_effect: -10000, kind: "Tahsilat" }),
  ];
  const s = partyMonthly(p, data(rows), "2026-11");
  assert.equal(s.old, 8000);
  assert.deepEqual(
    s.inner.map((d) => d.value),
    [2000, 10000],
  );
});
test("personnel only explicitly assigned payments count and debt is never auto-netted", () => {
  const p = {
    id: 1,
    type: "Personel",
    profile: {
      staff_month: "2026-11",
      salary_payments: [2],
      meal_payments: [3],
      meal_due_cents: 3000,
    },
  };
  const s = partyMonthly(
    p,
    data([
      event(1, "salary", 30000),
      event(2, "payment", 20000),
      event(3, "payment", 3000),
      event(4, "employee_purchase", 5000),
    ]),
    "2026-11",
  );
  assert.equal(s.net, 33000);
  assert.deepEqual(
    s.inner.map((d) => d.value),
    [23000, 10000],
  );
});
test("week runs Monday to Sunday across month/year boundary, matching API due-date order", () => {
  assert.deepEqual(weekDates("2027-01-01"), [
    "2026-12-28",
    "2026-12-29",
    "2026-12-30",
    "2026-12-31",
    "2027-01-01",
    "2027-01-02",
    "2027-01-03",
  ]);
  const matches = periodMatches([
    event(1, "purchase_invoice", 1000, { due_date: "2026-11-30" }),
    event(2, "purchase_invoice", 1000, { due_date: "2026-11-20" }),
    event(3, "payment", 500),
  ]);
  assert.equal(matches[0].b, 2);
});
test("deferred refund actually received this month reverses the original payment bucket", () => {
  const s = partyMonthly(
    party,
    data([
      event(1, "purchase_invoice", 10000, {
        settled_cents: 10000,
        party_effect: 0,
      }),
      event(2, "supplier_return", 2000, {
        return_mode: "later",
        party_effect: 2000,
        kind: "Alacak",
      }),
      event(3, "collection", 2000, {
        linked_id: 2,
        party_effect: -2000,
        kind: "Tahsilat",
      }),
    ]),
    "2026-11",
  );
  assert.equal(s.net, 8000);
  assert.deepEqual(
    s.inner.map((d) => d.value),
    [8000, 0, 0],
  );
  assert.equal(s.periodTotal, 8000);
});
test("missing personnel payment mapping is not reported as an unpaid salary", () => {
  const s = partyMonthly(
    { id: 1, type: "Personel", profile: {} },
    data([event(1, "salary", 30000), event(2, "payment", 5000)]),
    "2026-11",
  );
  assert.equal(s.net, 30000);
  assert.deepEqual(s.inner, []);
  assert.match(s.notice, /belirlenmediği/);
});
test("earlier advances or opening credits are never relabeled as current cash or unpaid debt", () => {
  const s = partyMonthly(
    party,
    data([
      event(1, "payment", 5000, { event_date: "2026-10-10" }),
      event(2, "purchase_invoice", 10000),
    ]),
    "2026-11",
  );
  assert.equal(s.outsideCoverage, 5000);
  assert.deepEqual(s.inner, []);
  assert.match(s.notice, /dönem dışı/);
});
test("opening balances paid this month are classified as carried debt, for suppliers and customers", () => {
  for (const supplier of [true, false]) {
    const p = { id: 1, type: supplier ? "Tedarikçi" : "Müşteri" },
      sign = supplier ? -1 : 1;
    const rows = [
      event(1, "opening", 8000, {
        party_effect: sign * 8000,
        event_date: "2026-10-01",
      }),
      event(2, supplier ? "purchase_invoice" : "sale", 10000, {
        party_effect: sign * 10000,
      }),
      event(3, supplier ? "payment" : "collection", 10000, {
        party_effect: -sign * 10000,
        kind: supplier ? "Ödeme" : "Tahsilat",
      }),
    ];
    const s = partyMonthly(p, data(rows), "2026-11");
    assert.equal(s.old, 8000);
    assert.equal(s.periodTotal, 10000);
    assert.equal(s.inner[0].value, 2000);
    assert.equal(s.inner.at(-1).value, 8000);
  }
});

test("salary immediate settlement is counted once without a manual mapping", () => {
  const s = partyMonthly(
    { id: 1, type: "Personel", profile: {} },
    data([event(1, "salary", 30000, { settled_cents: 10000 })]),
    "2026-11",
  );
  assert.equal(s.gross, 30000);
  assert.equal(s.periodTotal, 10000);
  assert.deepEqual(
    s.inner.map((x) => x.value),
    [10000, 20000],
  );
});
test("a salary with no payments is genuinely unpaid even without profile metadata", () => {
  const s = partyMonthly(
    { id: 1, type: "Personel", profile: {} },
    data([event(1, "salary", 30000)]),
    "2026-11",
  );
  assert.deepEqual(
    s.inner.map((x) => x.value),
    [0, 30000],
  );
});

test("automated meal accrual replaces legacy meal metadata without double counting", () => {
  const staff = {
    id: 1,
    type: "Personel",
    profile: {
      automation_start_month: "2026-11",
      staff_month: "2026-11",
      meal_due_cents: 50000,
    },
  };
  const s = partyMonthly(
    staff,
    data([event(1, "salary", 450000), event(2, "meal", 50000)]),
    "2026-11",
  );
  assert.equal(s.gross, 500000);
  assert.equal(s.outer.find((x) => x.name === "Yemek").value, 50000);
  assert.equal(s.inner.find((x) => x.name === "Ödenen").value, 0);
});
