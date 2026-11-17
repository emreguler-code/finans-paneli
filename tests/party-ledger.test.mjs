import test from "node:test";
import assert from "node:assert/strict";
import { partyBalanceLabel, listedPartyEffect } from "../src/party-ledger.mjs";

test("Party balance labels explain who owes whom for all three types", () => {
  for (const [type, positive, negative] of [
    ["Tedarikçi", "Tedarikçiden alacağımız", "Tedarikçiye borcumuz"],
    ["Müşteri", "Müşteriden alacağımız", "Müşteriye borcumuz"],
    ["Personel", "Personelden alacağımız", "Personele borcumuz"],
  ]) {
    assert.equal(partyBalanceLabel({ type, balance_cents: 1 }), positive);
    assert.equal(partyBalanceLabel({ type, balance_cents: -1 }), negative);
    assert.equal(
      partyBalanceLabel({ type, balance_cents: 0 }),
      "Hesap dengede",
    );
  }
});
test("Filtered totals use API net effects, excluding cancelled and planned entries", () => {
  const entries = [
    { amount_cents: 91300, settled_cents: 20000, party_effect: -71300 },
    { amount_cents: 40000, party_effect: 40000 },
    { amount_cents: 99900, party_effect: -99900, cancelled: 1 },
    { amount_cents: 88800, party_effect: -88800, scheduled: true },
  ];
  assert.equal(listedPartyEffect(entries), -31300);
  assert.equal(listedPartyEffect(entries.slice(0, 1)), -71300);
  assert.equal(listedPartyEffect([]), 0);
  assert.equal(entries[0].amount_cents, 91300);
});

import { movementDate, monthlyEffects } from "../src/party-ledger.mjs";
test("Business dates use relative labels, cross years and leap days without timezone drift", () => {
  assert.equal(
    movementDate("2026-11-16", "16:11:00", "2026-11-16"),
    "Bugün, 16:11",
  );
  assert.equal(movementDate("2026-11-15", "18:55", "2026-11-16"), "Dün, 18:55");
  assert.equal(
    movementDate("2026-11-17", "09:00", "2026-11-16", { planned: true }),
    "Yarın, 09:00",
  );
  assert.equal(
    movementDate("2026-11-10", "22:00", "2026-11-16"),
    "10 Kasım, 22:00",
  );
  assert.equal(movementDate("2026-10-03", "22:00", "2026-11-16"), "3 Ekim");
  assert.equal(
    movementDate("2025-10-03", "22:00", "2026-11-16"),
    "3 Ekim 2025",
  );
  assert.equal(movementDate("2025-12-31", "23:59", "2026-01-01"), "Dün, 23:59");
  assert.equal(movementDate("2024-02-29", "10:00", "2024-03-01"), "Dün, 10:00");
  assert.equal(
    movementDate("2026-11-16", "16:11", "2026-11-16", { full: true }),
    "16 Kasım 2026, 16:11",
  );
  assert.equal(movementDate("2026-02-30", "", "2026-03-01"), "Tarih yok");
});
test("Monthly totals span pages and filtered scope, using net cents and excluding inactive entries", () => {
  const items = Array.from({ length: 30 }, () => ({
    event_date: "2026-10-10",
    party_effect: -71300,
  }));
  items.push(
    { event_date: "2026-10-12", party_effect: 40000 },
    { event_date: "2026-10-12", party_effect: 99999, cancelled: true },
    { event_date: "2026-10-13", party_effect: 99999, scheduled: true },
    { event_date: "2026-11-10", party_effect: 12345 },
  );
  const m = monthlyEffects(items);
  assert.equal(m.get("2026-10").net, 30 * -71300 + 40000);
  assert.equal(m.get("2026-10").count, 31);
  assert.equal(m.get("2026-10").negative, 30 * -71300);
  assert.equal(m.get("2026-11").positive, 12345);
  assert.equal(monthlyEffects(items.slice(0, 1)).get("2026-10").net, -71300);
});
