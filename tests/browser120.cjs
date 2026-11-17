// Current 1.20 UI acceptance against isolated real PHP/MariaDB; prior UI scripts remain historical receipts.
const fs = require("fs"),
  path = require("path"),
  { chromium, webkit, firefox } = require("playwright");
const out = path.resolve(process.env.QA_OUTPUT_DIR || ".qa/browser120");
fs.mkdirSync(out, { recursive: true });
(async () => {
  const results = [];
  for (const engine of (process.env.QA_BROWSER_ENGINES || "chromium").split(
    ",",
  )) {
    const browser = await { chromium, webkit, firefox }[engine].launch({
      headless: true,
      ...(engine === "chromium" && process.env.QA_BROWSER_BIN
        ? { executablePath: process.env.QA_BROWSER_BIN, args: ["--no-sandbox"] }
        : {}),
    });
    const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
        locale: "tr-TR",
        timezoneId: "Europe/Istanbul",
        reducedMotion: "reduce",
      }),
      p = await context.newPage(),
      errors = [],
      checks = [];
    p.setDefaultTimeout(15000);
    p.on("pageerror", (e) => errors.push(e.message));
    const ok = (name, value) => {
      if (!value) throw Error(name);
      checks.push(name);
      console.log("PASS", engine, name);
    };
    const shot = async (name) =>
      p.screenshot({
        path: path.join(out, engine + "-" + name + ".png"),
        animations: "disabled",
      });
    const state = async () =>
      (
        await p.request.get(
          process.env.QA_BASE_URL + "/api/index.php?action=state",
        )
      ).json();
    const go = async (name) => {
      if (name === "Bildirimler") {
        await p
          .getByRole("button", { name: "Bildirimleri aç", exact: true })
          .click();
        await p
          .getByRole("dialog")
          .getByRole("button", { name: /Tümünü göster/ })
          .click();
        await p.locator("main h1").waitFor();
        return;
      }
      if (p.viewportSize().width <= 760) {
        await p.locator(".shell-menu-button").click();
        await p
          .locator(".sidebar")
          .getByRole("button", { name, exact: true })
          .click();
      } else
        await p
          .locator(".sidebar")
          .getByRole("button", { name, exact: true })
          .click();
      await p.locator("main h1").first().waitFor();
    };
    const clear = async (scope = p.locator(".page-search").last()) => {
      const b = scope.getByRole("button", {
        name: "Aramayı temizle",
        exact: true,
      });
      if (await b.count()) await b.click();
      await p.keyboard.press("Escape");
    };
    try {
      await p.goto(process.env.QA_BASE_URL);
      await p.setViewportSize({ width: 320, height: 568 });
      await p.getByLabel("Kullanıcı adı").fill(process.env.QA_USERNAME);
      await p
        .getByLabel("Parola", { exact: true })
        .fill(process.env.QA_PASSWORD);
      ok(
        "Login fits 320px",
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await p.getByRole("button", { name: "Giriş yap", exact: true }).click();
      await p.locator(".app").waitFor();
      await p.setViewportSize({ width: 1440, height: 1000 });
      for (let i = 0; i < 3; i++) await p.locator(".shell-menu-button").click();
      ok(
        "Sidebar cycles full compact hidden full without a popup",
        (await p.locator(".app").getAttribute("data-sidebar")) === "full" &&
          (await p.getByRole("dialog", { name: "Menü görünümü" }).count()) ===
            0,
      );
      await go("Cari hesaplar");
      const start = await state(),
        customer = start.parties.find((x) => x.type === "Müşteri" && x.active);
      await p.locator(".party-row").filter({ hasText: customer.name }).click();
      await p
        .getByRole("button", { name: "Yeni işlem ekle", exact: true })
        .waitFor();
      if (
        !(await state()).events.some(
          (e) =>
            e.party_id === customer.id &&
            e.operation === "sale" &&
            !e.cancelled,
        )
      ) {
        await p
          .getByRole("button", { name: "Yeni işlem ekle", exact: true })
          .click();
        await p
          .locator(".ledger-new-row")
          .getByRole("combobox", { name: "İşlem", exact: true })
          .click();
        await p.getByRole("option", { name: "Satış", exact: true }).click();
        await p.locator(".ledger-new-row input[name=amount]").fill("100");
        await p
          .getByRole("button", { name: "İşlemi kaydet", exact: true })
          .click();
        await p.locator(".ledger-new-row").waitFor({ state: "hidden" });
      }
      ok(
        "Customer offers inline creation without a detached dock",
        (await p.locator(".party-heading-actions .primary-button").count()) ===
          0 &&
          (await p
            .getByRole("button", { name: "Yeni işlem ekle", exact: true })
            .isVisible()),
      );
      const headerBalance = await p
          .locator(".party-current-balance")
          .innerText(),
        local = p.locator(".inline-list-tools"),
        search = local.locator("input");
      await search.fill('işlem:"Satış"');
      await search.press("Enter");
      ok(
        "Inline operator creates a token",
        (await local.locator(".search-token").count()) === 1,
      );
      ok(
        "Filtering preserves the actual party balance",
        (await p.locator(".party-current-balance").innerText()) ===
          headerBalance,
      );
      await clear(local);
      const event = (await state()).events.find(
        (e) =>
          e.party_id === customer.id &&
          e.operation === "sale" &&
          !e.cancelled &&
          !e.scheduled,
      );
      const row = p.locator('[data-ledger-id="' + event.id + '"]');
      while (!(await row.count())) {
        await p
          .getByRole("button", { name: "Önceki 30 işlemi yükle", exact: true })
          .click();
      }
      await row.click();
      ok(
        "Active date is a single two-line precise timestamp",
        (await row.locator(".movement-date:visible").count()) === 1 &&
          /\d\d:\d\d:\d\d/.test(
            await row.locator(".movement-date:visible").innerText(),
          ) &&
          (await p.locator(".party-effect-details time").count()) === 0,
      );
      await p
        .locator(".ledger-action-row")
        .getByRole("button", { name: "İşlemi düzenle", exact: true })
        .click();
      await p.locator(".entry-inline").waitFor();
      await row.locator("input[name=amount]").fill("2300");
      await row.getByRole("combobox", { name: "İşlem", exact: true }).click();
      await p.getByRole("option", { name: "İade", exact: true }).click();
      await p
        .getByRole("button", { name: "Değişiklikleri kaydet", exact: true })
        .click();
      ok(
        "Inline financial edits require a reason",
        (await p
          .locator(".entry-inline input[name=reason]")
          .getAttribute("aria-invalid")) === "true",
      );
      await p
        .locator(".entry-inline input[name=reason]")
        .fill("QA120 işlem yönü düzeltildi");
      await row.scrollIntoViewIfNeeded();
      await shot("party-inline-edit");
      await p.setViewportSize({ width: 390, height: 844 });
      await p
        .getByRole("button", { name: "Değişiklikleri kaydet", exact: true })
        .scrollIntoViewIfNeeded();
      ok(
        "Inline editing fits mobile and keeps save reachable",
        (await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        )) &&
          (await p
            .getByRole("button", { name: "Değişiklikleri kaydet", exact: true })
            .isVisible()),
      );
      await shot("party-inline-edit-mobile");
      await p.setViewportSize({ width: 1440, height: 1000 });
      const before = await state();
      await p
        .getByRole("button", { name: "Değişiklikleri kaydet", exact: true })
        .click();
      await p.locator(".entry-inline").waitFor({ state: "hidden" });
      let after = await state();
      const updated = after.events.find((e) => e.id === event.id);
      ok(
        "Changing operation updates the same financial record once",
        updated.operation === "customer_return" &&
          updated.amount_cents === 230000 &&
          updated.party_effect === -230000 &&
          after.events.length === before.events.length &&
          updated.version === event.version + 1,
      );
      ok(
        "Party balance reverses old effect and applies new effect",
        after.parties.find((x) => x.id === customer.id).balance_cents ===
          before.parties.find((x) => x.id === customer.id).balance_cents -
            event.party_effect +
            updated.party_effect,
      );
      if (event.account_id)
        ok(
          "Changing paid sale to offset return reverses original cash effect",
          after.accounts.find((a) => a.id === event.account_id)
            .balance_cents ===
            before.accounts.find((a) => a.id === event.account_id)
              .balance_cents -
              event.cash_effect,
        );
      const logRow = p.locator('[data-ledger-id="' + event.id + '"]');
      if ((await logRow.getAttribute("aria-expanded")) !== "true")
        await logRow.click();
      await p
        .getByRole("button", { name: "İşlem geçmişi", exact: true })
        .click();
      await p
        .getByRole("dialog", { name: "İşlem geçmişi" })
        .getByText(/QA120 işlem yönü düzeltildi/)
        .waitFor();
      ok(
        "Inline edit is audited with its reason",
        (
          await p.getByRole("dialog", { name: "İşlem geçmişi" }).innerText()
        ).includes("QA120 işlem yönü düzeltildi"),
      );
      await p.keyboard.press("Escape");
      await p
        .getByRole("button", { name: "Yeni işlem ekle", exact: true })
        .click();
      await p
        .locator(".ledger-new-row input[name=description]")
        .fill("QA125 korunacak taslak");
      await go("Hesaplar");
      await p.getByRole("alertdialog").waitFor();
      await p
        .getByRole("button", { name: "Düzenlemeye dön", exact: true })
        .click();
      ok(
        "Inline new draft guards navigation and preserves entered data",
        (await p
          .locator(".ledger-new-row input[name=description]")
          .inputValue()) === "QA125 korunacak taslak",
      );
      await p
        .getByRole("button", { name: "Yeni işlemi iptal et", exact: true })
        .click();
      await p
        .getByRole("button", { name: "Değişikliklerden vazgeç", exact: true })
        .click();
      const createBefore = await state();
      await p
        .getByRole("button", { name: "Yeni işlem ekle", exact: true })
        .click();
      const draft = p.locator(".ledger-new-row");
      await draft.getByRole("combobox", { name: "İşlem", exact: true }).click();
      await p.getByRole("option", { name: "Satış", exact: true }).click();
      await draft
        .locator("input[name=description]")
        .fill("QA125 yeni satır " + engine);
      await draft.locator("input[name=amount]").fill("25,50");
      await p
        .getByRole("button", { name: "İşlemi kaydet", exact: true })
        .click();
      await draft.waitFor({ state: "hidden" });
      const createAfter = await state();
      ok(
        "New inline row creates exactly one posted sale with no edit reason",
        createAfter.events.length === createBefore.events.length + 1 &&
          createAfter.events.some(
            (e) =>
              e.description === "QA125 yeni satır " + engine &&
              e.amount_cents === 2550 &&
              e.party_effect === 2550,
          ),
      );
      await shot("party-desktop");
      await go("Hesaplar");
      const account = (await state()).accounts.find((a) => a.active);
      await p
        .getByRole("button", {
          name: account.name + " hareketleri",
          exact: true,
        })
        .click();
      await p.locator(".persistent-composer").waitFor();
      ok(
        "Accounts share the default composer and progressive ledger",
        (await p.locator(".pagination").count()) === 0 &&
          (await p
            .locator(".account-page .page-title")
            .getByRole("button", { name: "İşlem ekle", exact: true })
            .count()) === 0,
      );
      await p
        .locator(".persistent-composer")
        .getByRole("combobox", { name: "İşlem", exact: true })
        .selectOption("income");
      await p
        .locator(".persistent-composer input[name=description]")
        .fill("QA120 banka giriş " + engine);
      await p.locator(".persistent-composer input[name=amount]").fill("25,50");
      const accountBefore = (await state()).accounts.find(
        (a) => a.id === account.id,
      ).balance_cents;
      await p
        .getByRole("button", { name: "İşlemi kaydet", exact: true })
        .click();
      await p.waitForFunction(
        () =>
          document.querySelector(".persistent-composer input[name=amount]")
            ?.value === "",
      );
      after = await state();
      const posted = after.events.find(
        (e) => e.description === "QA120 banka giriş " + engine,
      );
      ok(
        "Bank composer posts cash once to displayed account",
        posted.account_id === account.id &&
          posted.cash_effect === 2550 &&
          after.accounts.find((a) => a.id === account.id).balance_cents ===
            accountBefore + 2550,
      );
      const bankRow = p.locator('[data-ledger-id="' + posted.id + '"]');
      await bankRow.click();
      await p
        .getByRole("button", { name: "İşlemi düzenle", exact: true })
        .click();
      await p.locator(".entry-inline").waitFor();
      await bankRow
        .getByRole("combobox", { name: "İşlem", exact: true })
        .selectOption("expense");
      await p.locator(".inline-extra > summary").click();
      await bankRow.locator("input[name=amount]").fill("30");
      await p
        .locator(".entry-inline")
        .getByLabel("İşlem hesabı *", { exact: true })
        .selectOption(account.id);
      await p
        .locator(".entry-inline input[name=reason]")
        .fill("QA120 banka yönünü düzelt");
      await p
        .getByRole("button", { name: "Değişiklikleri kaydet", exact: true })
        .click();
      await p.locator(".entry-inline").waitFor({ state: "hidden" });
      after = await state();
      ok(
        "Bank inline operation reversal does not duplicate money",
        after.events.filter((e) => e.id === posted.id).length === 1 &&
          after.events.find((e) => e.id === posted.id).cash_effect === -3000 &&
          after.accounts.find((a) => a.id === account.id).balance_cents ===
            accountBefore - 3000,
      );
      await shot("account-desktop");
      await go("Kredi kartları");
      const card = (await state()).cards.find((c) => c.active);
      await p
        .getByRole("button", { name: card.name + " hareketleri", exact: true })
        .click();
      await p.locator(".persistent-composer").waitFor();
      ok(
        "Credit card composer has the displayed card locked",
        (await p.getByLabel("İşlem hesabı *", { exact: true }).count()) === 0,
      );
      await p
        .locator(".persistent-composer input[name=description]")
        .fill("QA120 kart harcaması " + engine);
      await p.locator(".persistent-composer input[name=amount]").fill("100");
      const cardBefore = await state();
      await p
        .getByRole("button", { name: "İşlemi kaydet", exact: true })
        .click();
      await p.waitForFunction(
        () =>
          document.querySelector(".persistent-composer input[name=amount]")
            ?.value === "",
      );
      after = await state();
      const cardPost = after.events.find(
        (e) => e.description === "QA120 kart harcaması " + engine,
      );
      ok(
        "Card expense creates card debt with no second cash expense",
        cardPost.card_id === card.id &&
          cardPost.card_effect === 10000 &&
          cardPost.cash_effect === 0,
      );
      ok(
        "Card spending preserves all cash account balances",
        after.accounts.every(
          (a) =>
            a.balance_cents ===
            cardBefore.accounts.find((b) => b.id === a.id).balance_cents,
        ),
      );
      for (const tab of ["Ekstre", "Dönem içi işlemler", "Gelecek Dönem"]) {
        await p.getByRole("button", { name: tab, exact: true }).click();
        ok(
          "Card retains " + tab,
          (await p
            .getByRole("button", { name: tab, exact: true })
            .getAttribute("aria-pressed")) === "true",
        );
      }
      await shot("card-desktop");
      await go("Raporlar");
      ok(
        "Reports stay analytical, without an automatic entry form",
        (await p.locator(".persistent-composer").count()) === 0 &&
          (await p.locator(".report-metrics").isVisible()),
      );
      const reportSearch = p.locator(".topbar input");
      await reportSearch.fill("etiket:Genel");
      await reportSearch.press("Enter");
      ok(
        "Reports use the same tag tokens",
        (await p
          .locator(".topbar .search-token")
          .filter({ hasText: "Etiket: Genel" })
          .count()) === 1,
      );
      await clear(p.locator(".topbar .page-search"));
      const download = p.waitForEvent("download");
      await p
        .locator(".ledger-view")
        .getByRole("button", { name: "CSV indir", exact: true })
        .click();
      ok(
        "Report CSV remains available",
        (await download).suggestedFilename().endsWith(".csv"),
      );
      await go("Ödeme Planı");
      for (const tab of ["Haftalık", "Günlük", "Aylık"]) {
        await p.getByRole("button", { name: tab, exact: true }).click();
        ok(
          "Calendar keeps " + tab + " view",
          (await p
            .getByRole("button", { name: tab, exact: true })
            .getAttribute("aria-pressed")) === "true",
        );
      }
      await go("Araçlarım");
      if (!(await p.locator(".vehicle-card-main").count())) {
        await p.getByRole("button", { name: "Araç ekle", exact: true }).click();
        await p.locator("input[name=plate]").fill("34 QA 120");
        await p.locator("input[name=name]").fill("QA120 araç");
        await p.locator("input[name=year]").fill("2020");
        await p.locator("input[name=km]").fill("12345");
        await p
          .locator(".entry-page")
          .getByRole("button", { name: "Kaydet", exact: true })
          .click();
        await p.locator(".entry-page").waitFor({ state: "hidden" });
      }
      ok(
        "Vehicle list and records retain their distinct data model",
        (await p.locator(".vehicle-card-main").count()) > 0,
      );
      await p.locator(".vehicle-card-main").first().click();
      if (!(await state()).vehicle_records.length) {
        await p
          .getByRole("button", { name: "Araç kaydı ekle", exact: true })
          .click();
        await p
          .getByRole("combobox", { name: "Kayıt türü", exact: true })
          .selectOption("maintenance");
        await p.locator("input[name=title]").fill("QA120 bakım kontrolü");
        await p
          .locator(".entry-dock")
          .getByRole("button", { name: "Kaydet", exact: true })
          .click();
        await p.locator(".entry-dock").waitFor({ state: "hidden" });
      }
      await p.getByRole("button", { name: "İşlemler", exact: true }).click();
      ok(
        "Vehicle records use the shared search with metadata-specific fields",
        (await p.locator(".topbar .smart-search").count()) === 1 &&
          (await p.locator(".vehicle-record").count()) > 0,
      );
      for (const width of [320, 390, 430, 768, 960, 1440, 1920]) {
        await p.setViewportSize({ width, height: width === 320 ? 568 : 900 });
        for (const name of [
          "Cari hesaplar",
          "Hesaplar",
          "Kredi kartları",
          "Raporlar",
          "Ödeme Planı",
          "Araçlarım",
          "Bildirimler",
        ]) {
          await go(name);
          ok(
            name + " fits " + width,
            await p.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
          ok(
            name + " has no obsolete search/filter buttons " + width,
            (await p
              .getByRole("button", {
                name: /^(Filtrele|Ara|Filtreleri sıfırla)$/,
              })
              .count()) === 0,
          );
          if (width === 390) await shot(name.replaceAll(" ", "-") + "-mobile");
        }
        await go("Cari hesaplar");
        await p
          .locator(".party-row")
          .filter({ hasText: customer.name })
          .click();
        const latest = p.locator("[data-ledger-id]").last();
        await latest.click();
        ok(
          "Shared active-row geometry " + width,
          await p
            .locator(".ledger-action-row")
            .evaluate(
              (e) =>
                Math.abs(
                  e.getBoundingClientRect().width -
                    e.previousElementSibling.getBoundingClientRect().width,
                ) < 2,
            ),
        );
        ok(
          "Timestamp occurs once " + width,
          (await latest.locator(".movement-date:visible").count()) === 1,
        );
        if (width <= 430) {
          await p.locator(".ledger-action-row").scrollIntoViewIfNeeded();
          await shot("party-expanded-" + width);
        }
      }
      ok(
        "Local Inter is loaded",
        await p.evaluate(() => document.fonts.check("14px Inter")),
      );
      ok("No browser runtime errors", errors.length === 0);
      results.push({ engine, browser: browser.version(), checks, errors });
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
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
