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
  await scope
    .getByRole("button", { name: "Arama alanlarını düzenle", exact: true })
    .click();
  const panel = p.getByRole("dialog", { name: "Arama alanları", exact: true });
  ok(
    "Advanced search fits the available viewport",
    await panel.evaluate((e) => {
      const r = e.getBoundingClientRect();
      return (
        r.width <= 761 &&
        r.top >= 0 &&
        r.bottom <= innerHeight + 1 &&
        r.height <= 541
      );
    }),
  );
  await panel
    .getByRole("button", { name: "Uygula", exact: true })
    .scrollIntoViewIfNeeded();
  ok(
    "Advanced search actions stay inside panel",
    await panel
      .getByRole("button", { name: "Uygula", exact: true })
      .evaluate((e) => {
        const p = e.closest("[data-floating-panel]").getBoundingClientRect(),
          r = e.getBoundingClientRect();
        return r.top >= p.top && r.bottom <= p.bottom + 1;
      }),
  );
  await shot("advanced-search");
  await p.keyboard.press("Escape");
  await scope
    .getByRole("button", { name: "Aramayı temizle", exact: true })
    .click();
  const composer = p.locator(".persistent-composer");
  ok(
    "Closed form actions align with amount input",
    await composer.evaluate((e) => {
      const a = e.querySelector("input[name=amount]").getBoundingClientRect(),
        b = e
          .querySelector(".sheet-footer .primary-button")
          .getBoundingClientRect();
      return Math.abs(a.bottom - b.bottom) < 2;
    }),
  );
  await composer
    .getByRole("button", { name: "Diğer seçenekler", exact: true })
    .click();
  ok(
    "Additional form fields use the full dock width",
    await composer
      .locator(".dock-options")
      .evaluate(
        (e) =>
          e.getBoundingClientRect().width >=
          e.closest("form").getBoundingClientRect().width - 2,
      ),
  );
  ok(
    "Open composer leaves room for the ledger",
    (await composer.evaluate(
      (e) => e.getBoundingClientRect().height < innerHeight * 0.5,
    )) &&
      (await p.locator(".main-content").evaluate((e) => e.clientHeight > 200)),
  );
  await composer
    .getByRole("button", { name: "İşlemi kaydet", exact: true })
    .scrollIntoViewIfNeeded();
  ok(
    "Save remains reachable in expanded composer",
    await composer
      .getByRole("button", { name: "İşlemi kaydet", exact: true })
      .isVisible(),
  );
  await shot("expanded-composer");
  await composer
    .getByRole("button", { name: "Diğer seçenekler", exact: true })
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
    const toggle = p.locator(".party-compose-toggle");
    await toggle.click();
    await p.locator(".composer-folded").waitFor({ state: "attached" });
    ok(
      "Collapsed dock releases space " + width,
      await p
        .locator("#entry-dock-root")
        .evaluate((e) => e.getBoundingClientRect().height === 0),
    );
    await toggle.click();
  }
  await p.setViewportSize({ width: 1440, height: 1000 });
  assert.ok(await p.locator(".persistent-composer").count());
};
if (require.main === module) require("./party120-browser.cjs");
