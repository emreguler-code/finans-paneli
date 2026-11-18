const assert = require("node:assert/strict");
module.exports = async function (p, ok, shot, base, original) {
  const data = structuredClone(original);
  data.accounts = [
    { id: "cash", name: "Merkez Kasa", active: true, type: "Nakit" },
  ];
  data.parties.push({
    ...data.parties[0],
    id: 4,
    type: "Personel",
    name: "Ali",
    profile: {},
  });
  let submissions = [];
  const handler = async (route) => {
    const action = new URL(route.request().url()).searchParams.get("action");
    if (action === "state") return route.fulfill({ json: data });
    if (action === "parties") {
      await new Promise((r) => setTimeout(r, 800));
      return route.fulfill({ json: { parties: data.parties } });
    }
    if (action === "event_save") {
      submissions.push(route.request().postDataJSON());
      return route.fulfill({ json: { id: 900, state: data } });
    }
    return route.fallback();
  };
  await p.route("**/api/index.php?**", handler);
  const choose = async (label, text) => {
    await p.getByRole("combobox", { name: label, exact: true }).click();
    await p.getByRole("option", { name: text, exact: true }).click();
  };
  const discard = async () => {
    await p
      .getByRole("button", { name: "Yeni işlemi iptal et", exact: true })
      .click();
    const confirm = p.getByRole("button", {
      name: "Değişikliklerden vazgeç",
      exact: true,
    });
    if (await confirm.isVisible()) await confirm.click();
  };
  try {
    await p.setViewportSize({ width: 1920, height: 1080 });
    await p.emulateMedia({ reducedMotion: "no-preference" });
    // A fresh document installs this fixture once. Two consecutive reloads can
    // cancel an in-flight state fetch and produce a WebKit document-load error.
    await p.goto(base + "/?qa126=1#/cariler/4");
    await p.locator(".party-heading-name").waitFor();
    ok(
      "Empty staff week is explicit and hides meaningless legend",
      (await p
        .getByText("Bu haftanın çalışma planı tanımlanmamış.", { exact: true })
        .isVisible()) && (await p.locator(".week-legend").count()) === 0,
    );
    await p
      .getByRole("button", { name: "Yeni işlem ekle", exact: true })
      .click();
    const draft = p.locator(".ledger-new-row");
    ok(
      "No operation means no extra-information affordance",
      (await p.locator(".inline-extra").count()) === 0,
    );
    const tag = draft.getByRole("combobox", {
      name: "Etiket (isteğe bağlı)",
      exact: true,
    });
    ok(
      "Default Genel is an empty placeholder",
      (await tag.inputValue()) === "" &&
        (await tag.getAttribute("placeholder")) === "Genel",
    );
    await tag.fill("Yeni etiket");
    ok(
      "Typing a new tag needs no deletion",
      (await tag.inputValue()) === "Yeni etiket",
    );
    await tag.press("Escape");
    const date = draft.getByRole("button", {
      name: "İşlem tarihi",
      exact: true,
    });
    ok(
      "Untouched date has only a compact icon",
      (await date.locator(".sr-only").count()) === 1 &&
        (await date.boundingBox()).width <= 45,
    );
    await date.click();
    const calendar = p.getByRole("dialog", {
      name: "İşlem tarihi",
      exact: true,
    });
    await calendar.locator('[data-day="' + data.today + '"]').click();
    await calendar.locator('input[type="time"]').fill("09:15:30");
    await calendar.getByRole("button", { name: "Uygula", exact: true }).click();
    ok(
      "Selected date is text without an icon",
      (await date.locator("svg").count()) === 0 &&
        /\d/.test(await date.innerText()),
    );
    await p.evaluate(() => {
      window.requiredCueSeen = false;
      window.requiredCueObserver = new MutationObserver(() => {
        if (document.querySelector('[data-attention="true"]'))
          window.requiredCueSeen = true;
      });
      window.requiredCueObserver.observe(document.body, {
        subtree: true,
        attributes: true,
        childList: true,
      });
    });
    await choose("İşlem", "Ödeme");
    await p.waitForFunction(
      () =>
        document.querySelector(".inline-extra")?.open && window.requiredCueSeen,
    );
    await p.evaluate(() => window.requiredCueObserver.disconnect());
    ok("Required account opens extras and receives a one-shot cue", true);
    await choose("İşlem hesabı *", "Merkez Kasa");
    await p.waitForTimeout(800);
    ok(
      "Completing required data does not close the panel or repeat glow",
      (await p.locator(".inline-extra").evaluate((e) => e.open)) &&
        (await p.locator('[data-attention="true"]').count()) === 0,
    );
    ok(
      "All personnel operations hide invoice number and separate time field",
      (await p.locator('.entry-inline input[name="document"]').count()) === 0 &&
        (await p.locator('.inline-extra input[type="time"]').count()) === 0,
    );
    await choose("İşlem", "Maaş Ekle");
    await p.waitForFunction(
      () => document.querySelector(".inline-extra")?.open === false,
    );
    ok(
      "Optional salary information starts closed",
      !(await p.locator(".inline-extra").evaluate((e) => e.open)),
    );
    await p.locator(".inline-extra > summary").click();
    await draft.locator('input[name="amount"]').fill("10000");
    ok(
      "Salary unpaid amount is disabled",
      await p.locator('input[name="settled"]').isDisabled(),
    );
    await choose("Ödeme", "Merkez Kasa");
    ok(
      "Choosing a salary payment account fills the full salary",
      (await p.locator('input[name="settled"]').inputValue()) === "10.000",
    );
    await p.locator('input[name="settled"]').fill("2500");
    await draft.locator('input[name="amount"]').fill("12000");
    ok(
      "A manual partial amount survives later salary changes",
      (await p.locator('input[name="settled"]').inputValue()) === "2.500",
    );
    await shot("126-salary-partial-desktop");
    await p.getByRole("button", { name: "İşlemi kaydet", exact: true }).click();
    await p.waitForFunction(
      () =>
        !document.querySelector(".ledger-new-row") ||
        document.querySelector('.ledger-new-row input[name="amount"]')
          ?.value === "0,00",
    );
    assert.equal(submissions.length, 1);
    assert.equal(submissions[0].settled, "2500");
    assert.equal(submissions[0].time, "09:15:30");
    ok(
      "Salary form sends one gross event with its exact partial settlement",
      submissions[0].operation === "salary" &&
        submissions[0].amount === "12000",
    );
    // A new persistent draft has a clean date and no operation.
    if (await draft.count()) {
      ok(
        "Successful save resets the draft without leaking chosen date",
        (await draft
          .getByRole("button", { name: "İşlem tarihi", exact: true })
          .locator("svg")
          .count()) === 1,
      );
      await discard();
    }
    await p.goto(base + "/#/cariler");
    await p.locator(".party-column-head").waitFor();
    const top = (await p.locator(".party-column-head").boundingBox()).y;
    await p.waitForTimeout(350);
    ok(
      "Slow directory loading preserves header geometry",
      Math.abs((await p.locator(".party-column-head").boundingBox()).y - top) <
        1,
    );
    await p.locator(".party-row").first().click();
    await p.waitForTimeout(30);
    ok(
      "Record navigation uses a 350ms content-only transition",
      await p
        .locator(".content-frame")
        .evaluate((e) =>
          e.getAnimations().some((a) => a.effect.getTiming().duration === 350),
        ),
    );
    await p.waitForTimeout(400);
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.goto(base + "/#/cariler/4");
    await p
      .getByRole("button", { name: "Yeni işlem ekle", exact: true })
      .click();
    await choose("İşlem", "Ödeme");
    await shot("126-required-desktop");
    await p.setViewportSize({ width: 390, height: 844 });
    await p.locator(".inline-extra").scrollIntoViewIfNeeded();
    await shot("126-required-mobile");
    ok(
      "Required fields remain usable at 390px",
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await discard();
    // A broken module must show recovery text, never an empty root.
    const broken = await p.context().newPage();
    await broken.route("**/assets/index-*.js", (route) => route.abort());
    await broken.goto(base + "/");
    await broken.waitForFunction(
      () => document.getElementById("boot-retry")?.hidden === false,
    );
    ok(
      "Missing entry bundle provides visible recovery",
      await broken
        .getByRole("button", { name: "Sayfayı yenile", exact: true })
        .isVisible(),
    );
    await broken.close();
  } finally {
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.unroute("**/api/index.php?**", handler);
  }
};
