import test from "node:test";
import assert from "node:assert/strict";
import { movementReport, reportRows } from "../src/movement-report.mjs";
import { csvText } from "../src/csv.mjs";
import { transactionPreview } from "../src/transaction-preview.mjs";
test("Export net excludes cancelled/planned facts and never sums running balances", () => {
  const events = [
    {
      id: 1,
      event_date: "2026-11-01",
      operation: "sale",
      amount_cents: 10000,
      party_effect: 7000,
      party_balance: 17000,
    },
    {
      id: 2,
      operation: "sale",
      amount_cents: 9000,
      party_effect: 9000,
      party_balance: 17000,
      cancelled: true,
    },
    {
      id: 3,
      operation: "sale",
      amount_cents: 3000,
      party_effect: 3000,
      party_balance: 17000,
      scheduled: true,
    },
  ];
  const report = movementReport({
    events,
    amount: (e) => e.amount_cents,
    party: true,
    balance: 24000,
  });
  assert.deepEqual(report.summary, [
    ["Seçili kayıtların net etkisi", 7000],
    ["Güncel bakiye", 24000],
  ]);
  assert.equal(reportRows(report).at(-1)[5], 240);
  assert.equal(reportRows(report).length, 5);
  assert.ok(
    ["Saat", "Ekleyen", "Hesap"].every((name) =>
      report.csv.columns.includes(name),
    ),
  );
});
test("Card reports preserve periods and signed numeric CSV totals", () => {
  const report = movementReport({
    events: [
      {
        event_date: "2026-11-01",
        period_date: "2026-12-01",
        amount_cents: 12500,
      },
    ],
    amount: (e) => e.amount_cents,
    period: true,
    balance: 12500,
  });
  assert.equal(report.rows[0][1], "2026-12-01");
  assert.equal(
    reportRows(report).at(-1)[report.columns.indexOf("Tutar (TL)")],
    125,
  );
  assert.match(
    csvText(["Tutar"], [[-12.5], ["-CMD()"]]),
    /"-12.5"\r\n"'-CMD\(\)"/,
  );
});
test("Overpayment previews include child effect once on editing", () => {
  const p = { balance_cents: -50000 };
  assert.deepEqual(
    transactionPreview(
      p,
      {
        id: 1,
        operation: "purchase_invoice",
        party_effect: 0,
        excess_payment_cents: 5000,
      },
      {
        operation: "purchase_invoice",
        amount: "100",
        immediate: true,
        settled: "125",
      },
      "partial",
    ),
    { delta: -2500, balance: -52500 },
  );
});

test("Continuous party period reconciles carry-in; a discontinuous filter cannot invent closing balance", () => {
  const all = [
    {
      id: 1,
      event_date: "2026-10-01",
      party_effect: 10000,
      amount_cents: 10000,
    },
    {
      id: 2,
      event_date: "2026-11-01",
      party_effect: -2500,
      amount_cents: 2500,
    },
    { id: 3, event_date: "2026-11-03", party_effect: 5000, amount_cents: 5000 },
  ];
  const args = {
    events: all.slice(1),
    allEvents: all,
    party: true,
    from: "2026-11-01",
    to: "2026-11-30",
    amount: (e) => e.amount_cents,
    balance: 12500,
  };
  assert.deepEqual(movementReport(args).summary.slice(0, 3), [
    ["Devreden bakiye", 10000],
    ["Seçili kayıtların net etkisi", 2500],
    ["Dönem sonu bakiye", 12500],
  ]);
  assert.equal(movementReport({ ...args, events: [all[1]] }).summary.length, 2);
});
