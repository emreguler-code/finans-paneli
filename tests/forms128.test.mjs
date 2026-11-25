import test from "node:test";
import assert from "node:assert/strict";
import { transactionPreview } from "../src/transaction-preview.mjs";
import { istanbulDay } from "../src/current-day.mjs";
const party = { balance_cents: 1400000 };
test("Editing applies only delta, settled purchases preserve open balance", () => {
  assert.deepEqual(
    transactionPreview(
      party,
      { id: 1, party_effect: 550000 },
      { operation: "sale", amount: "4.500,00" },
      "full",
    ),
    { delta: -100000, balance: 1300000 },
  );
  assert.deepEqual(
    transactionPreview(
      party,
      {},
      {
        operation: "purchase_invoice",
        amount: "12.500,00",
        immediate: true,
        settled: "2.500,00",
      },
      "partial",
    ),
    { delta: -1000000, balance: 400000 },
  );
  assert.equal(
    transactionPreview(
      party,
      {},
      {
        operation: "customer_return",
        amount: "100",
        immediate: true,
        settled: "101",
      },
      "partial",
    ),
    null,
  );
  assert.deepEqual(
    transactionPreview(
      party,
      {},
      { operation: "sale", amount: "100", scheduled: true },
      "full",
    ),
    { delta: 0, balance: 1400000 },
  );
});
test("Istanbul midnight determines day independently of UTC or demo clock", () => {
  assert.equal(istanbulDay(new Date("2026-11-29T20:59:59Z")), "2026-11-29");
  assert.equal(istanbulDay(new Date("2026-11-29T21:00:00Z")), "2026-11-30");
});
