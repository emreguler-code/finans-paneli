import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cardPeriodRows,
  cardEventEffect,
  limitSegments,
  partyOptions,
  operationLabel,
} from "../src/operations.mjs";
test("Cari options are scoped and never contain transfers or Other", () => {
  assert.deepEqual(partyOptions("Tedarikçi"), [
    "purchase_invoice",
    "purchase_no_invoice",
    "supplier_return",
    "payment",
  ]);
  assert.equal(partyOptions("Personel").includes("transfer"), false);
  assert.deepEqual(partyOptions("Müşteri"), [
    "sale",
    "collection",
    "customer_return",
  ]);
});
test("Bar uses remaining statement and reserves future installment liability", () => {
  const s = limitSegments({
    limit_cents: 8000000,
    statement: 12000,
    unbilled_cents: 800000,
    future_cents: 500000,
    debt: 25000,
    available_cents: 5500000,
  });
  assert.deepEqual(
    [s.statement, s.period, s.available],
    [1200000, 1300000, 5500000],
  );
  assert.equal(
    s.widths.reduce((a, b) => a + b),
    100,
  );
});
test("Card credit and over-limit bars remain bounded", () => {
  for (const c of [
    { limit_cents: 100, statement: 2, unbilled_cents: 200, debt: 4 },
    {
      limit_cents: 100,
      statement: 0,
      unbilled_cents: 0,
      debt: -2,
      available_cents: 300,
    },
  ]) {
    const s = limitSegments(c);
    assert.ok(s.widths.every((n) => n >= 0 && n <= 100));
    assert.equal(
      s.widths.reduce((a, b) => a + b),
      100,
    );
  }
});
test("Statements do not repeat previous period details", () => {
  const card = {
    id: 1,
    statement_date: "2026-10-10",
    statements: [
      { cut_date: "2026-09-10", id: 1 },
      { cut_date: "2026-10-10", id: 2 },
    ],
  };
  const rows = [
    { id: 1, card_id: 1, period_date: "2026-09-01", event_date: "2026-09-01" },
    { id: 2, card_id: 1, period_date: "2026-10-01", event_date: "2026-10-01" },
    { id: 3, card_id: 1, period_date: "2026-11-01", event_date: "2026-10-01" },
  ];
  assert.deepEqual(
    cardPeriodRows(rows, card, "Ekstre", card.statements[1], "2026-10-13").map(
      (x) => x.id,
    ),
    [2],
  );
  assert.deepEqual(
    cardPeriodRows(rows, card, "Gelecek Dönem", null, "2026-10-13").map(
      (x) => x.id,
    ),
    [3],
  );
});
test("Transfer target card receives debt reduction, not spending", () => {
  assert.equal(
    cardEventEffect(
      { card_id: 1, target_card_id: 2, amount_cents: 500, card_effect: 500 },
      2,
    ),
    -500,
  );
  assert.equal(
    cardEventEffect(
      { card_id: 1, target_card_id: 2, amount_cents: 500, card_effect: 500 },
      1,
    ),
    500,
  );
});
test("Semantic names distinguish salary and returns from sale and purchase", () => {
  assert.equal(
    operationLabel({ operation: "salary", kind: "Borç" }),
    "Maaş Ekle",
  );
  assert.equal(
    operationLabel({ operation: "supplier_return", kind: "Alacak" }),
    "İade",
  );
  assert.equal(
    operationLabel({ operation: "purchase_invoice" }),
    "Faturalı Alış",
  );
});

test("Post-cut transfer is new debt for source and statement repayment for destination", () => {
  const statement = { id: 1, cut_date: "2026-10-10" };
  const source = {
      id: 1,
      statement_date: "2026-10-10",
      statements: [statement],
    },
    destination = { ...source, id: 2 };
  const transfer = {
    id: 9,
    card_id: 1,
    target_card_id: 2,
    operation: "card_transfer",
    amount_cents: 50000,
    card_effect: 50000,
    event_date: "2026-10-13",
    period_date: "2026-10-13",
  };
  assert.deepEqual(
    cardPeriodRows([transfer], source, "Ekstre", statement, "2026-10-13"),
    [],
  );
  assert.deepEqual(
    cardPeriodRows([transfer], destination, "Ekstre", statement, "2026-10-13"),
    [transfer],
  );
  assert.deepEqual(
    cardPeriodRows(
      [transfer],
      source,
      "Dönem içi işlemler",
      statement,
      "2026-10-13",
    ),
    [transfer],
  );
});
