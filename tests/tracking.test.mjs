import { test } from "node:test";
import assert from "node:assert/strict";
import {
  vehicleSchedule,
  vehicleReminders,
  vehiclePaid,
  cardPurchases,
  campaignMatches,
  campaignProgress,
} from "../src/tracking-utils.mjs";
import { groupAlerts } from "../src/alert-groups.mjs";
const data = {
  today: "2026-10-23",
  vehicles: [{ id: 1, active: true, km: 50000 }],
  parties: [{ id: 1, pos_programs: ["garanti:bonus"] }],
  events: [
    {
      id: 1,
      card_id: "card",
      operation: "expense",
      event_date: "2026-10-10",
      amount_cents: 50000,
      settled_cents: 0,
      card_effect: 50000,
      cash_effect: 0,
      party_id: 1,
      tag: "Yakıt",
    },
    { id: 2, operation: "expense", cash_effect: -10000, card_effect: 0 },
  ],
  campaign_entries: [],
};
const campaign = {
  id: 1,
  active: true,
  card_ids: ["card"],
  party_ids: [],
  tags: ["Yakıt"],
  pos_programs: ["garanti:bonus"],
  start_date: "2026-10-01",
  end_date: "2026-10-31",
  min_spend_cents: 50000,
  required_count: 1,
  participation: "joined",
  reward_mode: "percent",
  reward_value: 10,
  reward_type: "points",
  per_tx_cap: 40,
  total_cap: 60,
};
test("Vehicle installments allocate actual payments once; estimates never enter plan", () => {
  const record = {
    active: true,
    amount_cents: 30000,
    payment_events: [2],
    installments: [
      { date: "2026-10-23", amount_cents: 15000 },
      { date: "2026-11-23", amount_cents: 15000 },
    ],
  };
  assert.equal(vehiclePaid(record, data), 10000);
  assert.deepEqual(
    vehicleSchedule(record, data).map((r) => r.remaining),
    [5000, 15000],
  );
  assert.deepEqual(vehicleSchedule({ ...record, estimated: true }, data), []);
  assert.equal(
    vehiclePaid(record, {
      ...data,
      events: [{ ...data.events[1], cancelled: true }],
    }),
    0,
  );
});
test("Maintenance triggers by mileage or date and renewed policies suppress old reminders", () => {
  const records = [
    {
      id: 1,
      vehicle_id: 1,
      active: true,
      type: "insurance",
      end_date: "2026-10-01",
    },
    {
      id: 2,
      vehicle_id: 1,
      active: true,
      type: "insurance",
      end_date: "2027-10-01",
    },
    {
      id: 3,
      vehicle_id: 1,
      active: true,
      type: "maintenance",
      next_km: 49000,
      next_date: "2027-10-01",
    },
  ];
  assert.deepEqual(
    vehicleReminders({ ...data, vehicle_records: records }).map(
      (r) => r.record.id,
    ),
    [3],
  );
  assert.equal(
    vehicleReminders({
      ...data,
      vehicles: [{ ...data.vehicles[0], active: false }],
      vehicle_records: records,
    }).length,
    0,
  );
});
test("Campaign restrictions cover POS, tag, dates and minimum spend", () => {
  assert.equal(campaignMatches(campaign, data.events[0], data), true);
  for (const change of [
    { tag: "Genel" },
    { amount_cents: 49999 },
    { event_date: "2026-11-01" },
    { party_id: 2 },
    { card_id: "other" },
  ])
    assert.equal(
      campaignMatches(campaign, { ...data.events[0], ...change }, data),
      false,
    );
});
test("Installments count as one purchase and expected rewards obey caps and participation", () => {
  const events = [
      { ...data.events[0], installment_group: "g" },
      { ...data.events[0], id: 3, installment_group: "g" },
    ],
    entries = [
      {
        id: 1,
        active: true,
        campaign_id: 1,
        event_id: 1,
        confirmed: true,
        received: 15,
      },
      {
        id: 2,
        active: true,
        campaign_id: 1,
        event_id: 3,
        confirmed: false,
        received: 99,
      },
    ];
  assert.equal(cardPurchases({ ...data, events }).length, 1);
  const progress = campaignProgress(campaign, {
    ...data,
    events,
    campaign_entries: entries,
  });
  assert.equal(progress.count, 1);
  assert.equal(progress.expected, 40);
  assert.equal(progress.received, 15);
  assert.equal(progress.pending, 25);
  assert.equal(
    campaignProgress(
      { ...campaign, participation: "required" },
      { ...data, events, campaign_entries: entries },
    ).expected,
    0,
  );
});
test("Overdue notifications aggregate within party and retain target", () => {
  const alerts = [
    {
      id: "1",
      date: "2026-10-01",
      groupKey: "p1",
      amount_cents: 100,
      page: "Ödeme Planı",
      partyId: 1,
    },
    {
      id: "2",
      date: "2026-10-02",
      groupKey: "p1",
      amount_cents: 200,
      page: "Ödeme Planı",
      partyId: 1,
    },
    { id: "3", date: "2026-10-23", groupKey: "p1", amount_cents: 500 },
  ];
  const groups = groupAlerts(alerts, data.today);
  assert.equal(groups.length, 2);
  assert.equal(groups[0].count, 2);
  assert.equal(groups[0].amount_cents, 300);
  assert.equal(groups[0].partyId, 1);
});
