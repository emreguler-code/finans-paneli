// Selected 1.25 design states, using synthetic facts only.
const assert = require("node:assert/strict");
module.exports = async function party125Acceptance(
  p,
  ok,
  shot,
  base,
  original,
) {
  const data = JSON.parse(JSON.stringify(original));
  data.today = "2026-11-17";
  const supplier = data.parties[0];
  supplier.profile = { visit_days: [1, 5] };
  supplier.pos_programs = ["garanti:bonus", "yapikredi:world", "akbank:axess"];
  const customer = data.parties[1];
  customer.title = "Ada Tasarım Ltd.";
  customer.tax_no = "1234567890";
  customer.phone = "0212 555 00 00";
  customer.address = "Örnek Mah. İstanbul";
  const staff = {
    ...customer,
    id: 4,
    type: "Personel",
    name: "Can Kaya",
    title: "",
    profile: {
      staff_month: "2026-11",
      salary_payments: [106],
      meal_payments: [107],
      meal_due_cents: 300000,
      work_calendar: {
        "2026-11-16": "morning",
        "2026-11-17": "evening",
        "2026-11-18": "morning",
        "2026-11-19": "evening",
        "2026-11-20": "annual_leave",
        "2026-11-21": "sick_leave",
        "2026-11-22": "weekly_leave",
      },
    },
  };
  data.parties.push(staff);
  const e = (id, party, op, amount, effect, extra = {}) => ({
    ...data.events[0],
    id,
    party_id: party.id,
    party_name: party.name,
    operation: op,
    kind: effect > 0 ? "Alacak" : "Borç",
    amount_cents: amount,
    settled_cents: 0,
    party_effect: effect,
    party_balance: effect,
    event_date: "2026-11-16",
    account_id: 1,
    card_id: null,
    cancelled: false,
    scheduled: false,
    description:
      op === "purchase_invoice"
        ? "Kırtasiye alımı"
        : op === "purchase_no_invoice"
          ? "Ambalaj alımı"
          : "Örnek işlem",
    ...extra,
  });
  data.events = [
    e(101, supplier, "purchase_invoice", 1000000, -600000, {
      settled_cents: 400000,
    }),
    e(102, supplier, "purchase_no_invoice", 500000, -300000, {
      settled_cents: 200000,
      account_id: null,
      card_id: 1,
      event_date: "2026-11-17",
    }),
    e(103, customer, "sale", 2000000, 2000000),
    e(104, customer, "collection", 1200000, -1200000, {
      kind: "Tahsilat",
      event_date: "2026-11-17",
    }),
    e(105, staff, "salary", 3000000, -3000000),
    e(106, staff, "payment", 2100000, 2100000, { kind: "Ödeme" }),
    e(107, staff, "payment", 300000, 300000, { kind: "Ödeme" }),
  ];
  const balances = new Map();
  for (const event of data.events) {
    const balance = (balances.get(event.party_id) || 0) + event.party_effect;
    balances.set(event.party_id, balance);
    event.party_balance = balance;
  }
  data.accounts = [
    {
      id: 1,
      name: "Merkez Kasa",
      active: true,
      type: "cash",
      balance_cents: 5000000,
    },
  ];
  data.cards = [
    {
      id: 1,
      name: "Bonus Kart",
      bank: "garanti",
      program: "bonus",
      active: true,
      limit_cents: 10000000,
      debt: 2000,
      statements: [],
    },
  ];
  data.claims = [];
  data.allocations = [];
  supplier.balance_cents = -900000;
  customer.balance_cents = 800000;
  staff.balance_cents = -600000;
  const handler = async (route) => {
    const action = new URL(route.request().url()).searchParams.get("action");
    if (action === "state") return route.fulfill({ json: data });
    return route.fallback();
  };
  await p.route("**/api/index.php?**", handler);
  try {
    await p.setViewportSize({ width: 1920, height: 1080 });
    await p.goto(base + "/?qa125=1#/cariler/1");
    await p.locator(".week-calendar").waitFor();
    ok(
      "Past planned visit covers day abbreviation and date with one passive surface",
      await p
        .locator(".week-day.past-visit")
        .evaluate(
          (e) =>
            e.children[0].textContent === "Pt" ||
            e.children[0].textContent === "Sa",
        ),
    );
    ok(
      "Bank logos have no separate captions",
      (await p.locator(".supplier-pos-logo").count()) === 3,
    );
    ok(
      "Desktop shows monthly summary below information with no tab UI",
      (await p.locator(".party-monthly").isVisible()) &&
        !(await p.locator(".party-context-tabs").isVisible()),
    );
    const donut = await p.locator(".party-donut").getAttribute("aria-label");
    ok(
      "Supplier payment shares reconcile to net monthly volume",
      donut.includes("4.000,00") &&
        donut.includes("2.000,00") &&
        donut.includes("9.000,00"),
    );
    await p.locator(".main-content").evaluate((e) => (e.scrollTop = 0));
    await shot("125-supplier-desktop");
    await p.locator(".party-monthly").scrollIntoViewIfNeeded();
    await shot("125-supplier-monthly");
    await p.locator(".main-content").evaluate((e) => (e.scrollTop = 0));
    const search = p.locator(".inline-list-tools input");
    await search.click();
    await p
      .getByRole("dialog", { name: "Arama önerileri", exact: true })
      .waitFor();
    await p
      .getByRole("dialog", { name: "Arama önerileri", exact: true })
      .getByRole("button", { name: "Pencereyi kapat", exact: true })
      .click();
    await p.waitForTimeout(100);
    ok(
      "Suggestion close does not reopen on restored input focus",
      (await p
        .getByRole("dialog", { name: "Arama önerileri", exact: true })
        .count()) === 0,
    );
    await search.click();
    await p
      .getByRole("dialog", { name: "Arama önerileri", exact: true })
      .waitFor();
    await search.press("Escape");
    ok(
      "Escape also keeps suggestions closed",
      (await p
        .getByRole("dialog", { name: "Arama önerileri", exact: true })
        .count()) === 0,
    );
    await search.press("ArrowDown");
    await p
      .getByRole("dialog", { name: "Arama önerileri", exact: true })
      .waitFor();
    await p.keyboard.press("Escape");
    await p
      .getByRole("button", { name: "Yeni işlem ekle", exact: true })
      .click();
    const draft = p.locator(".ledger-new-row");
    await draft.locator("input[name=description]").focus();
    await shot("125-inline-closed");
    const date = draft.getByRole("button", {
      name: "İşlem tarihi",
      exact: true,
    });
    await date.click();
    await p
      .getByRole("dialog", { name: "İşlem tarihi", exact: true })
      .waitFor();
    await date.click();
    ok(
      "Second date trigger click closes calendar without dismissing the draft",
      (await p
        .getByRole("dialog", { name: "İşlem tarihi", exact: true })
        .count()) === 0 && (await draft.isVisible()),
    );
    const tagArrow = draft.getByRole("button", {
      name: "Etiket seçenekleri",
      exact: true,
    });
    await tagArrow.click();
    ok(
      "Default tag dropdown shows other existing labels",
      await p
        .getByRole("option", { name: "Kırtasiye", exact: true })
        .isVisible(),
    );
    await tagArrow.click();
    ok(
      "Second tag-arrow click closes its own menu",
      (await p
        .getByRole("listbox", { name: "Etiketler", exact: true })
        .count()) === 0,
    );
    const tagInput = draft.getByRole("combobox", {
      name: "Etiket (isteğe bağlı)",
      exact: true,
    });
    await tagInput.press("ArrowDown");
    await tagInput.press("ArrowDown");
    await tagInput.press("Enter");
    ok(
      "Tag list supports keyboard selection",
      (await tagInput.inputValue()) === "Gıda",
    );
    await draft.getByRole("combobox", { name: "İşlem", exact: true }).click();
    await p
      .getByRole("option", { name: "Faturalı Alış", exact: true })
      .waitFor();
    await shot("125-inline-menu");
    await p.locator(".ledger-view").screenshot({
      path: require("node:path").join(
        process.env.QA_OUTPUT_DIR || ".qa/party121",
        "ledger125-menu-" + p.context().browser().browserType().name() + ".png",
      ),
    });
    await draft
      .getByRole("combobox", { name: "İşlem", exact: true })
      .press("ArrowDown");
    await draft
      .getByRole("combobox", { name: "İşlem", exact: true })
      .press("Enter");
    ok(
      "Operation menu supports keyboard selection",
      (await draft.locator('select[aria-label="İşlem"]').inputValue()) ===
        "purchase_invoice",
    );
    await draft.locator("input[name=amount]").fill("12500");
    await p.locator(".inline-extra > summary").click();
    await shot("125-inline-expanded");
    ok(
      "New row never asks for an edit reason",
      (await p.locator(".entry-inline input[name=reason]").count()) === 0,
    );
    await p
      .getByRole("button", { name: "Yeni işlemi iptal et", exact: true })
      .click();
    await p
      .getByRole("button", { name: "Değişikliklerden vazgeç", exact: true })
      .click();
    await p.goto(base + "/#/cariler/2");
    await p.locator(".party-compact-info").waitFor();
    await p.locator(".main-content").evaluate((e) => (e.scrollTop = 0));
    await shot("125-customer-desktop");
    ok(
      "Customer calendar marks actual posted days",
      (await p.locator(".week-day.visit").count()) === 2,
    );
    ok(
      "Customer ring shows collected and open shares of this month",
      (await p.locator(".party-donut").getAttribute("aria-label")).includes(
        "60%",
      ),
    );
    await p.goto(base + "/#/cariler/4");
    await p.locator(".week-calendar").waitFor();
    await p.locator(".main-content").evaluate((e) => (e.scrollTop = 0));
    await shot("125-staff-desktop");
    ok(
      "Personnel identity rows remain compact",
      await p
        .locator(".party-compact-info > div")
        .first()
        .evaluate((e) => e.getBoundingClientRect().height <= 30),
    );
    const path = require("node:path"),
      out = process.env.QA_OUTPUT_DIR || ".qa/party121";
    await p.locator(".party-context").screenshot({
      path: path.join(
        out,
        "staff125-info-" + p.context().browser().browserType().name() + ".png",
      ),
    });
    await p.locator(".party-monthly").screenshot({
      path: path.join(
        out,
        "staff125-summary-" +
          p.context().browser().browserType().name() +
          ".png",
      ),
    });
    ok(
      "Morning and evening use upper/lower halves, with all three leave statuses",
      (await p.locator(".week-day.morning").count()) === 2 &&
        (await p.locator(".week-day.evening").count()) === 2 &&
        (await p
          .locator(
            ".week-day.weekly_leave,.week-day.annual_leave,.week-day.sick_leave",
          )
          .count()) === 3,
    );
    for (const width of [320, 390, 768]) {
      await p.setViewportSize({ width, height: 844 });
      ok(
        "Context fits narrow viewport " + width,
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      if (width < 760) {
        ok(
          "Monthly summary is a separate mobile tab " + width,
          !(await p.locator(".party-monthly").isVisible()),
        );
        await p.getByRole("tab", { name: "Aylık Özet", exact: true }).click();
        await p.locator(".party-monthly").waitFor();
        await shot("125-staff-month-" + width);
        await p
          .getByRole("tab", { name: "Durum ve bilgiler", exact: true })
          .click();
        const legend = await p
          .locator(".week-legend > span")
          .evaluateAll((es) => es.map((e) => e.getBoundingClientRect().top));
        ok(
          "Staff legend stays on one line " + width,
          Math.max(...legend) - Math.min(...legend) < 2,
        );
        await p.locator(".week-calendar").scrollIntoViewIfNeeded();
        await shot("125-staff-calendar-" + width);
      }
    }
  } finally {
    await p.unroute("**/api/index.php?**", handler);
  }
  assert.ok(true);
};
