import test from "node:test";
import assert from "node:assert/strict";
import { readRoute, routeHash } from "../src/routes.mjs";
import { searchRecords } from "../src/global-search.mjs";
test("Shared hosting hash routes round-trip record, tab and search safely", () => {
  for (const r of [
    { page: "Kredi kartları", record: "7", tab: "Gelecek Dönem", event: "42" },
    { page: "Hesaplar", record: "bank/a b" },
    { page: "Arama", q: "Emre & Öztürk", category: "vehicles" },
    { page: "Bildirimler", source: "accounts" },
  ]) {
    const decoded = readRoute(routeHash(r));
    for (const [key, value] of Object.entries(r))
      assert.equal(decoded[key], value);
  }
  assert.equal(readRoute("#/%broken").page, "Genel bakış");
});
const data = {
  today: "2026-10-28",
  parties: [
    { id: 1, name: "EMRE IŞIK", type: "Müşteri", active: true },
    { id: 2, name: "Emre arşiv", active: false },
  ],
  accounts: [{ id: "bank", name: "Günlük", holder: "Emre", active: true }],
  cards: [{ id: 3, name: "Axess", holder: "Emre", active: true }],
  vehicles: [
    { id: 4, plate: "34ABC", owner: "Emre", name: "Sedan", active: true },
  ],
  events: [
    {
      id: 9,
      description: "Emre teslimatı",
      party_id: 1,
      event_date: "2020-01-01",
      event_time: "10:00:00",
      kind: "Satış",
    },
    {
      id: 10,
      description: "Emre iptal",
      cancelled: true,
      event_date: "2026-01-01",
      event_time: "10:00:00",
    },
    {
      id: 11,
      description: "İlgisiz",
      creator: "Emre",
      event_date: "2026-01-01",
      event_time: "10:00:00",
    },
  ],
};
test("General search is categorized, owner-based and independent of overview period", () => {
  const r = searchRecords(data, "emre");
  assert.deepEqual(
    Object.values(r).map((x) => x.length),
    [1, 1, 1, 1, 1],
  );
  assert.equal(r.events[0].route.record, "1");
  assert.equal(r.events[0].route.event, "9");
  assert.equal(searchRecords(data, "ışık").parties[0].title, "EMRE IŞIK");
  assert.equal(searchRecords(data, "em").events.length, 0);
});
test("Archive/cancellation scope is explicit and creators do not match descriptions", () => {
  const r = searchRecords(data, "emre", { archived: true, cancelled: true });
  assert.equal(r.parties.length, 2);
  assert.equal(r.events.length, 2);
  assert.ok(!r.events.some((r) => r.key === "event-11"));
});
