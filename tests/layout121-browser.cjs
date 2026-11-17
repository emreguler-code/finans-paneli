// Geometry acceptance for the reported Firefox desktop cases. Called by the shared fixture.
const assert = require("node:assert/strict");
module.exports = async function layoutAcceptance(p, ok, shot) {
  await p.emulateMedia({ reducedMotion: "reduce" });
  const setSidebar = async (value) => {
    for (
      let n = 0;
      n < 3 && (await p.locator(".app").getAttribute("data-sidebar")) !== value;
      n++
    )
      await p.locator(".shell-menu-button").click();
  };
  for (const width of [1024, 1280, 1365, 1440, 1564, 1565, 1600, 1920, 2048]) {
    await p.setViewportSize({ width, height: 768 });
    for (const mode of ["full", "compact", "hidden"]) {
      await setSidebar(mode);
      const g = await p.evaluate(() => {
        const ledger = document.querySelector(".ledger-view"),
          aside = document.querySelector(".context-aside"),
          cols = document.querySelector(".workspace-columns");
        const r = ledger.getBoundingClientRect(),
          a = aside?.getBoundingClientRect(),
          c = cols?.getBoundingClientRect();
        return {
          width: r.width,
          aside: a && { x: a.x, y: a.y, width: a.width },
          ledger: { x: r.x, y: r.y, right: r.right },
          cols: c && { width: c.width },
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      ok(
        "Primary-region contract " + width + " " + mode,
        !g.overflow &&
          (!g.aside || g.aside.x < g.ledger.right - 2 || g.width >= 880),
      );
      if (g.aside && g.aside.x < g.ledger.right - 2)
        ok(
          "Stacked information fills content " + width + " " + mode,
          Math.abs(g.aside.width - g.cols.width) < 3,
        );
    }
  }
  await p.setViewportSize({ width: 1365, height: 768 });
  await setSidebar("compact");
  const scope = p.locator(".inline-list-tools"),
    input = scope.locator("input");
  await input.fill("ekleyen:Test etiket:otomotiv");
  await input.press("Enter");
  ok(
    "Filter labels remain on one line",
    await scope
      .locator(".search-token > span")
      .evaluateAll(
        (es) =>
          es.length === 2 &&
          es.every(
            (e) =>
              e.getBoundingClientRect().height < 24 &&
              getComputedStyle(e).whiteSpace === "nowrap",
          ),
      ),
  );
  ok(
    "Search icons are vertically centered",
    await scope.locator(".smart-search-box").evaluate((box) => {
      const b = box.getBoundingClientRect();
      return [
        ...box.querySelectorAll(":scope > svg,.smart-search-controls svg"),
      ].every((e) => {
        const r = e.getBoundingClientRect();
        return Math.abs(r.y + r.height / 2 - b.y - b.height / 2) < 2;
      });
    }),
  );
  await input.scrollIntoViewIfNeeded();
  await shot("firefox-reported-filter-layout");
  ok(
    "No filter form or disclosure arrow",
    (await scope
      .getByRole("button", { name: "Arama alanlarını düzenle", exact: true })
      .count()) === 0 &&
      (await p
        .getByRole("dialog", { name: "Arama alanları", exact: true })
        .count()) === 0,
  );
  await input.fill("tutar:50..500 tarih:2026-05-01..2026-07-31 iptal:hayır");
  await input.press("Enter");
  ok(
    "Numeric date and cancellation filters are search tokens",
    (await scope.locator(".search-token").count()) === 6,
  );
  await input.scrollIntoViewIfNeeded();
  await shot("search-only-filters");
  await scope
    .getByRole("button", { name: "Aramayı temizle", exact: true })
    .click();
  await p.getByRole("button", { name: "Yeni işlem ekle", exact: true }).click();
  const rowDraft = p.locator(".ledger-new-row");
  const beforeCells = await rowDraft.locator("td").evaluateAll((es) =>
    es.map((e) => {
      const r = e.getBoundingClientRect();
      return { x: r.x, width: r.width };
    }),
  );
  await p.locator(".inline-extra > summary").click();
  const afterCells = await rowDraft.locator("td").evaluateAll((es) =>
    es.map((e) => {
      const r = e.getBoundingClientRect();
      return { x: r.x, width: r.width };
    }),
  );
  ok(
    "Optional information preserves primary column positions and widths",
    beforeCells.every(
      (r, i) =>
        Math.abs(r.x - afterCells[i].x) < 1 &&
        Math.abs(r.width - afterCells[i].width) < 1,
    ),
  );
  ok(
    "Optional fields stop before balance/action rail",
    await p.locator(".inline-extra").evaluate((e) => {
      const a = e.getBoundingClientRect();
      const b = e
        .closest("tbody")
        .querySelector('.ledger-new-row [data-label="Bakiye"]')
        .getBoundingClientRect();
      return a.right <= b.left + 1;
    }),
  );
  await shot("expanded-inline-draft");
  await p
    .getByRole("button", { name: "Yeni işlemi iptal et", exact: true })
    .click();
  await p
    .locator(".main-content")
    .evaluate((e) => (e.scrollTop = e.scrollHeight));
  const month = p.locator(".ledger-month-summary").last();
  await month.scrollIntoViewIfNeeded();
  ok(
    "Last monthly reconciliation is fully reachable",
    await month.evaluate((e) => {
      const r = e.getBoundingClientRect(),
        m = e.closest(".main-content").getBoundingClientRect();
      return r.top >= m.top - 1 && r.bottom <= m.bottom + 1;
    }),
  );
  const row = p.locator("[data-ledger-id]").last();
  if ((await row.getAttribute("aria-expanded")) !== "true") await row.click();
  await p.getByRole("button", { name: "İşlemi düzenle", exact: true }).click();
  for (const width of [320, 768, 1365, 2048]) {
    await p.setViewportSize({ width, height: 768 });
    const save = p.getByRole("button", {
      name: "Değişiklikleri kaydet",
      exact: true,
    });
    await save.scrollIntoViewIfNeeded();
    ok(
      "Inline save is an icon, never a stretched bar " + width,
      await save.evaluate((e) => {
        const r = e.getBoundingClientRect();
        return r.width <= 45 && r.height <= 45 && r.width >= 35;
      }),
    );
    ok(
      "Inline fields do not overflow " + width,
      await p
        .locator(".entry-inline")
        .evaluate((e) => e.scrollWidth <= e.clientWidth + 1),
    );
    if (width === 1365 || width === 320) await shot("inline-" + width);
  }
  await p
    .getByRole("button", { name: "Düzenlemeyi iptal et", exact: true })
    .click();
  await p.setViewportSize({ width: 1440, height: 900 });
  const head = p.locator(".ledger-view thead");
  for (const label of [
    "Açıklama",
    "Etiket",
    "İşlem",
    "Ekleyen",
    "Tutar",
    "Bakiye",
    "Tarih",
  ]) {
    await head
      .getByRole("button", { name: label + " sıralaması", exact: true })
      .click();
    ok(
      "Exactly one active header: " + label,
      (await head.locator("th[aria-sort]").count()) === 1 &&
        (await head.locator("svg").count()) === 1,
    );
    const before = await head
      .locator("th[aria-sort]")
      .getAttribute("aria-sort");
    await head
      .getByRole("button", { name: label + " sıralaması", exact: true })
      .click();
    ok(
      "Header toggles direction: " + label,
      (await head.locator("th[aria-sort]").getAttribute("aria-sort")) !==
        before,
    );
  }
  await head
    .getByRole("button", { name: "Ekleyen sıralaması", exact: true })
    .click();
  ok(
    "Creator sorting includes older records not yet rendered",
    (await p
      .locator("[data-ledger-id]")
      .first()
      .getAttribute("data-ledger-id")) === "2",
  );
  await head
    .getByRole("button", { name: "Tutar sıralaması", exact: true })
    .click();
  ok(
    "Signed amount sorting covers the full result set",
    (await p
      .locator("[data-ledger-id]")
      .first()
      .getAttribute("data-ledger-id")) === "2",
  );
  await p.setViewportSize({ width: 390, height: 844 });
  await p.locator(".ledger-mobile-sort").scrollIntoViewIfNeeded();
  await p
    .locator(".ledger-mobile-sort")
    .getByRole("button", { name: "Tarih sıralaması", exact: true })
    .click();
  ok(
    "Mobile sorting uses the same direct column labels",
    (await p.locator(".ledger-mobile-sort").isVisible()) &&
      (await p.getByRole("button", { name: "Sırala", exact: true }).count()) ===
        0,
  );
  await shot("column-sort-mobile");
  await p.setViewportSize({ width: 1440, height: 900 });
  const back = p.locator(".party-heading-row .page-back");
  await back.click();
  await p.locator(".party-directory").waitFor();
  const tools = p.locator(".party-directory > .inline-list-tools");
  ok(
    "Directory search and CSV share one aligned row",
    await tools.evaluate((e) => {
      const a = e.querySelector(".smart-search-box").getBoundingClientRect(),
        b = e.querySelector('[aria-label="CSV indir"]').getBoundingClientRect();
      return (
        Math.abs(a.y + a.height / 2 - b.y - b.height / 2) < 2 &&
        b.x >= a.right &&
        a.x > e.getBoundingClientRect().x
      );
    }),
  );
  await p
    .getByRole("button", { name: "Net bakiye sıralaması", exact: true })
    .click();
  ok(
    "Directory balance is sortable without a menu",
    await p
      .locator(".party-directory .party-row")
      .first()
      .innerText()
      .then((t) => t.includes("Ada Tasarım")),
  );
  await shot("directory-toolbar");
  await p.locator(".party-row").filter({ hasText: "Poyraz Gıda" }).click();
  await p
    .getByRole("button", { name: "Yeni işlem ekle", exact: true })
    .waitFor();
  // Effective viewport tests represent the space left by zoom. They do not pretend to set browser chrome zoom.
  for (const [width, height] of [
    [1092, 614],
    [910, 512],
    [683, 384],
    [320, 568],
  ]) {
    await p.setViewportSize({ width, height });
    ok(
      "Zoom-equivalent viewport " + width + "x" + height,
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await p
      .getByRole("button", { name: "Yeni işlem ekle", exact: true })
      .click();
    const save = p.getByRole("button", { name: "İşlemi kaydet", exact: true });
    await save.scrollIntoViewIfNeeded();
    ok(
      "Inline action remains compact and reachable " + width,
      await save.evaluate((e) => e.getBoundingClientRect().width <= 45),
    );
    await p
      .getByRole("button", { name: "Yeni işlemi iptal et", exact: true })
      .click();
  }
  await p.setViewportSize({ width: 1440, height: 1000 });
  assert.ok(
    await p
      .getByRole("button", { name: "Yeni işlem ekle", exact: true })
      .count(),
  );
};
if (require.main === module) require("./party120-browser.cjs");
