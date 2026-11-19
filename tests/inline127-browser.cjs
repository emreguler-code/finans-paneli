const assert = require("node:assert/strict");
module.exports = async function (p, ok, shot, base, original) {
  const data = structuredClone(original);
  data.parties.push({
    ...data.parties[0],
    id: 4,
    name: "Ali",
    type: "Personel",
    tax_no: "10000000146",
    profile: {
      iban: "TR330006100519786457841326",
      salary_cents: 4500000,
      meal_monthly_cents: 500000,
      automation_start_month: "2026-11",
    },
  });
  const handler = async (route) => {
    const a = new URL(route.request().url()).searchParams.get("action");
    if (a === "state") return route.fulfill({ json: data });
    if (a === "parties")
      return route.fulfill({ json: { parties: data.parties } });
    return route.fallback();
  };
  await p.route("**/api/index.php?**", handler);
  const choose = async (name, value) => {
    await p.getByRole("combobox", { name, exact: true }).click();
    await p.getByRole("option", { name: value, exact: true }).click();
  };
  try {
    await p.setViewportSize({ width: 1920, height: 1080 });
    await p.goto(base + "/?qa127=1#/cariler");
    await p
      .getByRole("button", { name: "Yeni kayıt ekle", exact: true })
      .click();
    const form = p.locator('[data-record-inline="true"]');
    await form.waitFor();
    ok(
      "New party lives in its list, without a bottom composer or view modal",
      (await form.evaluate((e) => !!e.closest('[data-form-host="party"]'))) &&
        (await p
          .locator('.persistent-composer:visible,[role="dialog"]:visible')
          .count()) === 0,
    );
    await choose("Cari türü *", "Personel");
    await form.locator('input[name="name"]').fill("Yeni personel");
    await form
      .getByText("Personel ücret ve dönem bilgileri", { exact: true })
      .click();
    await form
      .locator('input[name="staffIban"]')
      .fill("TR330006100519786457841326");
    await form
      .getByRole("textbox", { name: "Aylık maaş (TL)", exact: true })
      .fill("45000");
    ok(
      "Staff profile exposes IBAN and monthly rates with explicit start month",
      (await form.locator('input[type="month"]').count()) >= 1,
    );
    await shot("127-personnel-inline-desktop");
    await p.setViewportSize({ width: 390, height: 844 });
    await form.locator('input[name="staffIban"]').scrollIntoViewIfNeeded();
    await shot("127-personnel-inline-mobile");
    ok(
      "Inline metadata does not overflow at 390px",
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await form.getByRole("button", { name: "Vazgeç", exact: true }).click();
    await p
      .getByRole("button", { name: "Değişikliklerden vazgeç", exact: true })
      .click();
    await form.waitFor({ state: "hidden" });
    ok("Inline metadata uses the shared draft discard guard", true);
    for (const [slug, label, entity] of [
      ["hesaplar", "Hesap ekle", "account"],
      ["kartlar", "Kart ekle", "card"],
    ]) {
      if (entity === "account") await p.goto(base + "/#/" + slug + "/yeni");
      else {
        await p.goto(base + "/#/" + slug);
        await p.getByRole("button", { name: label, exact: true }).click();
      }
      await form.waitFor();
      ok(
        entity + " creation stays inside its own list",
        await form.evaluate(
          (e, entity) =>
            e.closest("[data-form-host]")?.dataset.formHost === entity,
          entity,
        ),
      );
      await form.getByRole("button", { name: "Vazgeç", exact: true }).click();
      await form.waitFor({ state: "hidden" });
    }
    await p.goto(base + "/#/cariler/4");
    await p
      .getByRole("tab", { name: "Durum ve bilgiler", exact: true })
      .click();
    await p.evaluate(() => {
      window.qaCopied = [];
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async (value) => window.qaCopied.push(value) },
      });
    });
    await p.getByRole("button", { name: "IBAN kopyala", exact: true }).click();
    await p.getByRole("button", { name: "TCKN kopyala", exact: true }).click();
    assert.deepEqual(await p.evaluate(() => window.qaCopied), [
      "TR330006100519786457841326",
      "10000000146",
    ]);
    ok("Only populated IBAN and TCKN copy their exact values", true);
    await p.evaluate(() => {
      navigator.clipboard.writeText = async () => {
        throw new Error("QA clipboard denied");
      };
    });
    await p.getByRole("button", { name: "IBAN kopyala", exact: true }).click();
    await p.getByText("Kopyalanamadı", { exact: true }).waitFor();
    ok("Clipboard failure is reported truthfully", true);
    await p.setViewportSize({ width: 1920, height: 1080 });
    await p.goto(base + "/#/cariler");
    const recent = p.locator("[data-activity-id]").first();
    await recent.waitFor();
    const id = await recent.getAttribute("data-activity-id");
    await recent.click();
    await p.waitForURL((url) => url.hash.includes("islem=" + id));
    await p.locator("[data-ledger-id].expanded").waitFor();
    ok(
      "Son 5 işlem opens and selects its exact source row, without a dialog",
      (await p.locator('[role="dialog"]:visible').count()) === 0,
    );
    await shot("127-summary-source-selected");
    await p
      .getByRole("button", { name: "Yeni işlem ekle", exact: true })
      .click();
    await choose("İşlem", "Faturalı Alış");
    await p.locator(".inline-extra > summary").click();
    for (const width of [1920, 1600, 1280, 900, 390]) {
      await p.setViewportSize({ width, height: 900 });
      await p.waitForTimeout(100);
      const layout = await p.locator(".inline-extra-grid").evaluate((grid) => {
        const r = grid.getBoundingClientRect(),
          table = grid.closest("table"),
          cells = [...table.querySelectorAll("tr.is-editing > td[data-label]")];
        const desktop = table.closest(".ledger-view").clientWidth >= 880;
        const starts = cells.map(
          (c) =>
            c.getBoundingClientRect().left +
            parseFloat(getComputedStyle(c).paddingLeft),
        );
        return {
          desktop,
          fields: [...grid.children]
            .filter((e) => getComputedStyle(e).display !== "none")
            .map((e) => {
              const b = e.getBoundingClientRect();
              return {
                width: b.width,
                inside: b.left >= r.left - 1 && b.right <= r.right + 1,
                aligned: starts.some((x) => Math.abs(x - b.left) < 3),
              };
            }),
        };
      });
      ok(
        "Extra fields resize within the shared ledger grid " + width,
        layout.fields.every(
          (f) => f.inside && f.width >= 140 && (!layout.desktop || f.aligned),
        ),
      );
    }
    await p.setViewportSize({ width: 1920, height: 1080 });
    await p.locator(".ledger-new-row").scrollIntoViewIfNeeded();
    await shot("127-aligned-draft-desktop");
    await p
      .getByRole("button", { name: "Yeni işlemi iptal et", exact: true })
      .click();
    const confirmation = p.getByRole("button", {
      name: "Değişikliklerden vazgeç",
      exact: true,
    });
    if (await confirmation.isVisible()) await confirmation.click();
  } finally {
    await p.unroute("**/api/index.php?**", handler);
  }
};
