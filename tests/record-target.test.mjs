import { test } from "node:test";
import assert from "node:assert/strict";
import { recordTarget, inlineHostId } from "../src/record-target.mjs";
import {
  missingAccruals,
  staffAccrualAlerts,
} from "../src/staff-automation.mjs";
const data = {
  cards: [
    {
      id: 3,
      statements: [
        { id: 9, cut_date: "2026-10-20" },
        { id: 10, cut_date: "2026-11-20" },
      ],
    },
  ],
};
test("summary navigation preserves party, bank and card source context with exact period", () => {
  const e = {
    id: 71,
    party_id: 2,
    account_id: "bank",
    card_id: 3,
    event_date: "2026-10-15",
    period_date: "2026-10-15",
  };
  assert.deepEqual(recordTarget({ entity: "event", item: e }, data), {
    page: "Cari hesaplar",
    record: "2",
    event: "71",
  });
  assert.equal(
    recordTarget({ entity: "event", item: e, accountId: "bank" }, data).record,
    "bank",
  );
  const card = recordTarget(
    { entity: "event", item: e, lockedCardId: 3 },
    data,
  );
  assert.equal(card.page, "Kredi kartları");
  assert.equal(card.statement, "9");
  assert.equal(card.tab, "Ekstre");
  assert.equal(
    recordTarget(
      { entity: "event", item: { ...e, scheduled: true }, lockedCardId: 3 },
      data,
    ).tab,
    "Gelecek Dönem",
  );
});
test("linked vehicle and campaign records navigate to their own source rather than a finance dialog", () => {
  assert.deepEqual(
    recordTarget(
      { entity: "vehicle_record", item: { id: 5, vehicle_id: 4 } },
      data,
    ),
    { page: "Araçlarım", record: "4", entry: "5", tab: "İşlemler" },
  );
  assert.equal(
    recordTarget({ entity: "campaign", item: { id: 8 } }, data).entry,
    "8",
  );
});
test("missing accrual detection treats cancelled automatic facts as already owned periods", () => {
  const d = {
    today: "2026-11-18",
    parties: [
      {
        id: 1,
        active: true,
        type: "Personel",
        profile: {
          automation_start_month: "2026-11",
          salary_cents: 100,
          meal_monthly_cents: 20,
        },
      },
    ],
    events: [],
  };
  assert.equal(missingAccruals(d).length, 2);
  d.events = [
    {
      party_id: 1,
      operation: "salary",
      automation_period: "2026-11",
      cancelled: true,
    },
  ];
  assert.equal(missingAccruals(d).length, 1);
  d.parties[0].active = false;
  assert.equal(missingAccruals(d).length, 0);
});

test("third-day deadline raises a critical alert even when cron never ran", () => {
  const d = {
    today: "2026-11-03",
    events: [],
    parties: [
      {
        id: 1,
        active: true,
        type: "Personel",
        profile: { automation_start_month: "2026-11", salary_cents: 100 },
      },
    ],
  };
  assert.equal(staffAccrualAlerts(d, "11:59:59").length, 0);
  assert.equal(staffAccrualAlerts(d, "12:00:00")[0].level, "danger");
  d.today = "2026-11-02";
  assert.equal(staffAccrualAlerts(d, "23:59:59").length, 0);
  d.today = "2026-11-04";
  assert.equal(staffAccrualAlerts(d, "00:00:00").length, 1);
  d.events = [
    { party_id: 1, operation: "salary", automation_period: "2026-11" },
  ];
  assert.equal(staffAccrualAlerts(d).length, 0);
});

test("card payment links keep the paid statement, not the next cut date", () => {
  const target = recordTarget(
    {
      entity: "event",
      item: {
        id: 90,
        operation: "card_payment",
        target_card_id: 3,
        linked_id: 9,
        event_date: "2026-11-01",
      },
    },
    data,
  );
  assert.equal(target.statement, "9");
});

test("critical missing list uses frozen period fees even after profile changes", () => {
  const d = {
    today: "2026-11-04",
    events: [],
    parties: [
      { id: 1, active: true, type: "Personel", profile: { salary_cents: 0 } },
    ],
    staff_accrual_plan: [{ party: 1, operation: "salary", cents: 100 }],
  };
  assert.equal(missingAccruals(d)[0].amount, 100);
  d.staff_accrual_plan = [];
  d.parties[0].profile = {
    salary_cents: 200,
    automation_start_month: "2026-11",
  };
  assert.equal(missingAccruals(d).length, 0);
});

test("campaign child editors use their parent even when record IDs collide", () => {
  assert.equal(
    inlineHostId({ entity: "campaign_entry", item: { id: 1, campaign_id: 2 } }),
    "2",
  );
  assert.equal(
    inlineHostId({ entity: "campaign_entry", initial: { campaign_id: 2 } }),
    "2",
  );
  assert.equal(inlineHostId({ entity: "campaign", item: { id: 1 } }), "1");
});
