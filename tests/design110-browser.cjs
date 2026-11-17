module.exports = async ({ p, go, ok, out }) => {
  await p.setViewportSize({ width: 1440, height: 1000 });
  const nav = async (name) => {
    await p
      .locator(".sidebar")
      .getByRole("button", { name, exact: true })
      .click();
    if (await p.locator(".page-back").count())
      await p.locator(".page-back").click();
    await p.locator("main h1").waitFor();
  };
  await nav("Hesaplar");
  ok(
    "Horizontal account list removes redundant heading",
    (await p
      .getByRole("heading", { name: "Hesap listesi", exact: true })
      .count()) === 0,
  );
  ok(
    "Account list icons are removed, each row remains keyboard accessible",
    (await p.locator(".account-grid-item .account-card-actions").count()) ===
      0 && (await p.locator(".account-open").count()) === 4,
  );
  const rect = await p.locator(".account-grid-item").first().boundingBox();
  ok(
    "Account rows occupy the full content panel",
    Math.abs(
      rect.width - (await p.locator(".account-grid").boundingBox()).width + 40,
    ) < 2,
  );
  ok(
    "Account warnings cap at five and provide scoped full list",
    (await p.locator(".account-alerts .alert-notice").count()) <= 5 &&
      (await p.locator(".account-alerts .preview-all").isVisible()),
  );
  await p.locator(".account-alerts .preview-all").click();
  await p
    .getByRole("heading", { name: "Bildirimler", exact: true })
    .first()
    .waitFor();
  ok(
    "Full notifications preserve incoming account scope",
    (await p.locator(".search-chips").innerText()).includes("Hesaplar"),
  );
  await p
    .locator(".topbar")
    .getByRole("button", { name: "Filtrele", exact: true })
    .click();
  ok(
    "Central notification filters cover source and severity",
    (await p
      .getByRole("combobox", { name: "Bölüm", exact: true })
      .inputValue()) === "accounts" &&
      (await p.getByRole("combobox", { name: "Önem", exact: true }).count()) ===
        1,
  );
  await p
    .getByRole("combobox", { name: "Önem", exact: true })
    .selectOption("info");
  await p
    .locator(".search-filter-panel")
    .getByRole("button", { name: "Ara", exact: true })
    .click();
  ok(
    "Severity filter shows informational alerts only",
    (await p.locator(".notification-list-item").count()) > 0 &&
      (await p
        .locator(".notification-list-item .notification-severity")
        .evaluateAll((els) =>
          els.every((el) => el.classList.contains("info")),
        )),
  );
  await p
    .locator(".search-chips")
    .getByRole("button", { name: "Temizle", exact: true })
    .click();
  ok(
    "Clearing central filters restores card and party alerts",
    (await p.locator(".notification-list").innerText()).includes(
      "Kredi kartları",
    ) &&
      (await p.locator(".notification-list").innerText()).includes(
        "Cari hesaplar",
      ),
  );
  await p.locator("#search").fill("hiçbir-bildirim-eşleşmez");
  await p.locator("#search").press("Enter");
  await p.getByText("Bu kapsamda bildirim yok.", { exact: true }).waitFor();
  ok("Central notification empty state is explicit", true);
  await nav("Kredi kartları");
  ok(
    "Cards share the horizontal list without list edit icons",
    (await p.locator(".account-open").count()) === 3 &&
      (await p.locator(".account-card-actions").count()) === 0 &&
      (await p.locator(".context-aside .recent-activity").count()) === 1,
  );
  await p.locator(".account-open").first().click();
  ok(
    "Card editing remains in detail",
    await p
      .getByRole("button", { name: "Kartı düzenle", exact: true })
      .isVisible(),
  );
  await nav("Cari hesaplar");
  const state = await (
    await p.request.get(new URL("/api/index.php?action=state", p.url()).href)
  ).json();
  const expected = state.events
    .filter(
      (e) =>
        e.party_id &&
        !e.cancelled &&
        !e.scheduled &&
        e.event_date <= state.today,
    )
    .sort(
      (a, b) =>
        (b.event_date + b.event_time).localeCompare(
          a.event_date + a.event_time,
        ) || b.id - a.id,
    )
    .slice(0, 5)
    .map((e) => e.id);
  const ids = await p
    .getByRole("region", { name: "Son 5 işlem", exact: true })
    .locator("[data-activity-id]")
    .evaluateAll((els) => els.map((e) => Number(e.dataset.activityId)));
  ok(
    "Party list has one chronological recent panel",
    JSON.stringify(ids) === JSON.stringify(expected),
  );
  await nav("Araçlarım");
  await p.locator(".vehicle-card-main").first().click();
  ok(
    "Vehicle opens on overview with only two tabs",
    (await p
      .getByRole("button", { name: "Özet", exact: true })
      .getAttribute("aria-pressed")) === "true" &&
      (await p.locator(".vehicle-main-tabs button").count()) === 2,
  );
  ok(
    "Vehicle overview groups policies and keeps other categories",
    (await p.locator(".vehicle-policies").isVisible()) &&
      (await p.locator(".vehicle-overview-section").count()) === 4,
  );
  await p.getByRole("button", { name: "İşlemler", exact: true }).click();
  await p.locator(".vehicle-record-row").first().click();
  ok(
    "Vehicle transaction expands inline without modal",
    (await p.locator(".vehicle-record-expanded").isVisible()) &&
      (await p.getByRole("dialog").count()) === 0,
  );
  ok(
    "Expanded vehicle row exposes edit, history and payment link",
    (await p
      .getByRole("button", { name: "Araç kaydını düzenle", exact: true })
      .count()) === 1 &&
      (await p
        .getByRole("button", { name: "Araç kaydı geçmişi", exact: true })
        .count()) === 1 &&
      (await p
        .getByRole("button", { name: "Ödeme bağla", exact: true })
        .count()) === 1,
  );
  await p.screenshot({
    path: out + "/vehicle-unified-records.png",
    fullPage: true,
  });
  for (const width of [1100, 390, 320]) {
    await p.setViewportSize({ width, height: 900 });
    ok(
      "Vehicle record layout fits " + width,
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await p.screenshot({
      path: out + "/vehicle-unified-records-" + width + ".png",
      fullPage: true,
    });
  }
  await p.setViewportSize({ width: 1440, height: 1000 });
};
