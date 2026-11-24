// Frontend acceptance against a deterministic synthetic API. No database or credentials.
const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  http = require("node:http");
const { chromium, webkit, firefox } = require("playwright");
const root = path.resolve(__dirname, "../dist/client"),
  out = path.resolve(process.env.QA_OUTPUT_DIR || ".qa/party121");
fs.mkdirSync(out, { recursive: true });
const user = {
  id: 1,
  username: "test-admin",
  short_name: "Test",
  role: "admin",
};
const party = {
  id: 1,
  name: "Poyraz Gıda",
  title: "Poyraz Gıda",
  type: "Tedarikçi",
  active: true,
  version: 1,
  phone: "",
  email: "",
  tax_no: "",
  tax_office: "",
  address: "",
  notes: "",
  pos_programs: [],
  profile: {},
};
let running = 0;
const events = Array.from({ length: 75 }, (_, i) => {
  const e = {
    id: i + 1,
    version: 1,
    party_id: 1,
    party_name: party.name,
    kind: i === 1 ? "Ödeme" : "Borç",
    operation: i === 1 ? "payment" : "purchase_invoice",
    amount_cents: i === 0 ? 91300 : i === 1 ? 40000 : 10000,
    settled_cents: i === 0 ? 20000 : 0,
    party_effect: i === 0 ? -71300 : i === 1 ? 40000 : -10000,
    event_date: new Date(Date.UTC(2026, 4, 1 + i)).toISOString().slice(0, 10),
    event_time: "16:" + String(i % 60).padStart(2, "0") + ":22",
    description:
      i === 0
        ? "Kısmi ödenen stok alışı"
        : i === 1
          ? "Tedarikçi ödemesi"
          : "Stok alışı " + (i + 1),
    tag: i % 3 === 0 ? "Otomotiv" : i % 3 === 1 ? "Gıda" : "Genel",
    creator: ["Test", "Çınar", "İpek"][i % 3],
    created_by: (i % 3) + 1,
    cancelled: i === 4 ? 1 : 0,
    scheduled: false,
    cash_effect: 0,
    card_effect: 0,
    account_id: null,
    card_id: null,
    document_no: "",
    direction: "Borç",
  };
  if (!e.cancelled) running += e.party_effect;
  e.party_balance = running;
  return e;
});
party.balance_cents = running;
const scheduled = {
  ...events[0],
  id: 76,
  event_date: "2026-11-01",
  scheduled: true,
  description: "Planlanan alış",
  party_effect: 0,
  party_balance: running,
};
const data = {
  today: "2026-10-16",
  demo: true,
  schemaVersion: 12,
  user,
  users: [
    user,
    { ...user, id: 2, username: "cinar", short_name: "Çınar" },
    { ...user, id: 3, username: "ipek", short_name: "İpek" },
  ],
  parties: [
    party,
    {
      ...party,
      id: 2,
      name: "Ada Tasarım",
      title: "",
      type: "Müşteri",
      balance_cents: 1200000,
    },
    { ...party, id: 3, name: "Dengeli hesap", title: "", balance_cents: 0 },
  ],
  events: [...events, scheduled],
  accounts: [],
  cards: [],
  claims: [],
  allocations: [],
  advances: [],
  tx: [],
  vehicles: [],
  vehicle_records: [],
  vehicle_payments: [],
  campaigns: [],
  campaign_entries: [],
};
data.accounts = [
  {
    id: 1,
    name: "Merkez Kasa",
    type: "Kasa",
    active: true,
    balance_cents: 1000000,
    version: 1,
  },
];
data.parties.push({
  ...party,
  id: 4,
  name: "Ali",
  type: "Personel",
  tax_no: "10000000146",
  profile: {
    iban: "TR330006100519786457841326",
    salary_cents: 2500000,
    work_calendar: { "2026-10-12": "morning" },
  },
});
const results = [];
const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname === "/api/index.php") {
    const a = url.searchParams.get("action");
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify(
        a === "session"
          ? { csrf: "synthetic-csrf", user }
          : a === "state"
            ? data
            : a === "parties"
              ? { parties: data.parties }
              : a === "audit"
                ? { logs: [] }
                : {},
      ),
    );
    return;
  }
  const file = path.join(root, decodeURIComponent(url.pathname));
  if (!file.startsWith(root + path.sep) && file !== root + path.sep) {
    res.writeHead(403);
    res.end();
    return;
  }
  const f =
    fs.existsSync(file) && fs.statSync(file).isFile()
      ? file
      : path.join(root, "index.html");
  res.setHeader(
    "Content-Type",
    f.endsWith(".js")
      ? "application/javascript"
      : f.endsWith(".css")
        ? "text/css"
        : f.endsWith(".ttf")
          ? "font/ttf"
          : "text/html",
  );
  res.end(fs.readFileSync(f));
});
(async () => {
  await new Promise((resolve) =>
    server.listen(Number(process.env.QA_PORT) || 0, "127.0.0.1", resolve),
  );
  const base = "http://127.0.0.1:" + server.address().port;
  if (process.env.QA_SERVE) {
    console.log("Synthetic UI fixture listening at " + base);
    await new Promise(() => {});
  }
  for (const engine of (
    process.env.QA_BROWSER_ENGINES || "chromium,webkit,firefox"
  ).split(",")) {
    const browser = await { chromium, webkit, firefox }[engine].launch({
      headless: true,
      ...(engine === "chromium" && process.env.QA_BROWSER_BIN
        ? { executablePath: process.env.QA_BROWSER_BIN, args: ["--no-sandbox"] }
        : {}),
    });
    const context = await browser.newContext({
        locale: "tr-TR",
        timezoneId: "Europe/Istanbul",
        viewport: { width: 1440, height: 1000 },
      }),
      p = await context.newPage(),
      errors = [],
      checks = [];
    p.setDefaultTimeout(12000);
    p.on("pageerror", (e) => errors.push(e.message));
    const ok = (name, value) => {
      assert.ok(value, name);
      checks.push(name);
      console.log("PASS", engine, name);
    };
    const shot = (name) =>
      p.screenshot({
        path: path.join(out, engine + "-" + name + ".png"),
        animations: "disabled",
      });
    const form = p.locator(".transaction-form");
    const choose = async (name, value) => {
      await p.getByRole("combobox", { name, exact: true }).click();
      await p.getByRole("option", { name: value, exact: true }).click();
    };
    const discard = async () => {
      await p
        .getByRole("button", {
          name: /^(Yeni işlemi iptal et|Düzenlemeyi iptal et)$/,
        })
        .click();
      const confirm = p.getByRole("button", {
        name: "Değişikliklerden vazgeç",
        exact: true,
      });
      if (await confirm.isVisible()) await confirm.click();
      await form.waitFor({ state: "hidden" });
    };
    try {
      for (const [id, type, op] of [
        [1, "Tedarikçi", "Alış"],
        [2, "Müşteri", "Satış"],
        [4, "Personel", "Ödeme"],
      ]) {
        await p.goto(base + "/#/cariler/" + id);
        await p
          .getByRole("button", { name: "Yeni işlem ekle", exact: true })
          .waitFor();
        ok(
          type + " has no duplicate balance actions",
          (await p.locator(".party-heading-actions").count()) === 0,
        );
        await p
          .getByRole("button", { name: "Yeni işlem ekle", exact: true })
          .click();
        await form.waitFor();
        ok(
          type + " form precedes read-only table",
          await p.evaluate(
            () =>
              !!(
                document
                  .querySelector(".ledger-composer")
                  .compareDocumentPosition(
                    document.querySelector(".finance-table"),
                  ) & Node.DOCUMENT_POSITION_FOLLOWING
              ),
          ),
        );
        ok(
          type + " no impossible extras before operation",
          (await form.locator(".transaction-more").count()) === 0,
        );
        await form.getByRole("button", { name: op, exact: true }).click();
        await form.locator('input[name="amount"]').fill("12500");
        if (type === "Tedarikçi") {
          await form
            .getByRole("button", { name: "Faturasız Alış", exact: true })
            .click();
          ok(
            "Invoice subtype remains explicit",
            (await form.locator('input[name="operation"]').inputValue()) ===
              "purchase_no_invoice",
          );
          await choose("Ödeme / tahsilat", "Kısmen öde");
          await form.locator('input[name="settled"]').fill("2500");
          await choose("İşlem hesabı *", "Merkez Kasa");
          ok(
            "Partial payment and source visible without optional section",
            (await form.locator('input[name="settled"]').isVisible()) &&
              (await form
                .getByRole("combobox", { name: "İşlem hesabı *", exact: true })
                .isVisible()),
          );
        }
        if (type === "Personel") {
          ok(
            "No manual salary creation",
            (await form
              .getByRole("button", { name: "Maaş", exact: true })
              .count()) === 0,
          );
          await choose("İşlem hesabı *", "Merkez Kasa");
          ok(
            "Payment purpose visible",
            await form
              .getByRole("combobox", { name: "Ödeme amacı", exact: true })
              .isVisible(),
          );
          const dates = await p
            .locator(".week-day")
            .evaluateAll((nodes) =>
              nodes.map((n) => n.getAttribute("aria-label")),
            );
          ok(
            "Staff calendar is independent of fixed demo date",
            !dates.join().includes("2026-10-12"),
          );
        }
        ok(
          type + " read-only rows contain no fields",
          (await p
            .locator("[data-ledger-id] input,[data-ledger-id] .choice-trigger")
            .count()) === 0,
        );
        await shot(type + "-desktop");
        for (const width of [390, 320, 760, 1100]) {
          await p.setViewportSize({ width, height: 844 });
          ok(
            type + " fits " + width,
            await p.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
          ok(
            type + " no mobile bottom navigation " + width,
            (await p.locator(".mobile-nav,.mobile-more").count()) === 0,
          );
          if (width === 390) await shot(type + "-mobile");
        }
        await p.setViewportSize({ width: 1440, height: 1000 });
        await discard();
      }
      await p.goto(base + "/#/cariler/1");
      await p
        .getByRole("button", { name: "Yeni işlem ekle", exact: true })
        .waitFor();
      ok(
        "Newest transaction first",
        (await p
          .locator("[data-ledger-id]")
          .first()
          .getAttribute("data-ledger-id")) === "75",
      );
      await p
        .getByRole("button", { name: "Sonraki 30 işlemi yükle", exact: true })
        .click();
      ok(
        "Older rows append",
        (await p.locator("[data-ledger-id]").count()) === 60,
      );
      await p.locator('[data-ledger-id="75"]').click();
      await p
        .getByRole("button", { name: "İşlemi düzenle", exact: true })
        .click();
      await form.locator('input[name="amount"]').fill("90");
      ok(
        "Edit preview removes old effect",
        (await form.locator(".preview-result").innerText()).includes(
          new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2 }).format(
            (running + 1000) / 100,
          ),
        ),
      );
      await p
        .getByRole("button", { name: "Değişiklikleri kaydet", exact: true })
        .click();
      ok(
        "Edit requires reason",
        (await form
          .locator('input[name="reason"]')
          .getAttribute("aria-invalid")) === "true",
      );
      await shot("edit-desktop");
      await discard();
      await p.goto(base + "/#/cariler/4");
      await p
        .locator(".party-context")
        .getByRole("button", { name: "Düzenle", exact: true })
        .click();
      const profile = p.locator('.party-context [data-record-inline="true"]');
      await profile.waitFor();
      ok(
        "Profile edits in its own information card",
        await profile.locator('input[name="name"]').isVisible(),
      );
      await shot("profile-in-card");
      await profile
        .getByRole("button", { name: "Vazgeç", exact: true })
        .click();
      await profile.waitFor({ state: "hidden" });
      ok(
        "Copy icon has no border",
        await p
          .locator(".copy-value")
          .first()
          .evaluate((e) => getComputedStyle(e).borderTopWidth === "0px"),
      );
      await p.setViewportSize({ width: 390, height: 844 });
      await p.locator(".shell-menu-button").click();
      ok(
        "Hamburger exposes navigation",
        await p
          .locator(".sidebar")
          .getByRole("button", { name: "Hesaplar", exact: true })
          .isVisible(),
      );
      await p
        .locator(".sidebar")
        .getByRole("button", { name: "Hesaplar", exact: true })
        .click();
      ok(
        "Navigation remains usable without bottom bar",
        (await p.locator("main h1").innerText()) === "Hesaplar",
      );
      await p.setViewportSize({ width: 1440, height: 1000 });
      for (const [route, action, entity, field] of [
        ["cariler", "Yeni kayıt ekle", "party", "name"],
        ["hesaplar", "Hesap ekle", "account", "name"],
        ["kartlar", "Kart ekle", "card", "name"],
        ["araclar", "Araç ekle", "vehicle", "plate"],
      ]) {
        await p.goto(base + "/#/" + route);
        await p.getByRole("button", { name: action, exact: true }).click();
        const metadata = p.locator('[data-record-inline="true"]');
        await metadata.waitFor();
        ok(
          entity + " uses shared content form",
          await metadata.locator('input[name="' + field + '"]').isVisible(),
        );
        ok(
          entity + " keeps labeled save action",
          (await metadata
            .locator(".sheet-footer .primary-button")
            .isVisible()) &&
            (
              await metadata
                .locator(".sheet-footer .primary-button")
                .innerText()
            ).trim().length > 2,
        );
        await p.setViewportSize({ width: 390, height: 844 });
        ok(
          entity + " metadata fits mobile",
          await p.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        await shot(entity + "-metadata-mobile");
        await metadata
          .getByRole("button", { name: "Vazgeç", exact: true })
          .click();
        await p.setViewportSize({ width: 1440, height: 1000 });
      }
      await p.clock.install({ time: new Date("2026-11-29T20:59:50Z") });
      await p.goto(base + "/#/cariler/4");
      await p.locator(".week-day").first().waitFor();
      ok(
        "Sunday belongs to previous real week",
        (
          await p.locator(".week-day").first().getAttribute("aria-label")
        ).includes("2026-11-23"),
      );
      await p.clock.runFor(31000);
      ok(
        "Calendar advances at Istanbul midnight without reload",
        (
          await p.locator(".week-day").first().getAttribute("aria-label")
        ).includes("2026-11-30"),
      );
      ok(
        "Old shifts are not copied into new week",
        (await p.locator(".week-day.morning,.week-day.evening").count()) === 0,
      );
      ok("No runtime errors", errors.length === 0);
      results.push({ engine, checks, errors, browser: browser.version() });
    } catch (e) {
      await shot("failure");
      fs.writeFileSync(
        path.join(out, engine + "-failure.txt"),
        String(e) + "\n" + (await p.locator("body").innerText()),
      );
      throw e;
    } finally {
      await browser.close();
    }
  }
  fs.writeFileSync(
    path.join(out, "checks.json"),
    JSON.stringify(results, null, 2),
  );
})()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => server.close());
