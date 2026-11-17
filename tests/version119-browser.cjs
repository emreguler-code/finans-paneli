// Persistent composer acceptance against the actual PHP/database, no API mocking.
const { add, saved, close } = require("./entry-helpers.cjs");
module.exports = async ({ p, go, ok, out }) => {
  await p.setViewportSize({ width: 1440, height: 1000 });
  await go("Cari hesaplar");
  await p.locator(".party-row").filter({ hasText: "Ada Tasarım" }).click();
  await add(p);
  const requests = [];
  const track = (r) => {
    if (r.url().includes("action=event_save"))
      requests.push(JSON.parse(r.postData() || "{}").requestId);
  };
  p.on("request", track);
  for (const [description, amount] of [
    ["QA119 birinci kayıt", "1"],
    ["QA119 ikinci kayıt", "2"],
  ]) {
    await p
      .locator(".persistent-composer input[name=description]")
      .fill(description);
    await p.locator(".persistent-composer input[name=amount]").fill(amount);
    await p.getByRole("button", { name: "İşlemi kaydet", exact: true }).click();
    await saved(p);
  }
  p.off("request", track);
  const data = await (
    await p.request.get(
      new URL("api/index.php?action=state", p.url().split("#")[0]).href,
    )
  ).json();
  ok(
    "119 consecutive saves use independent idempotency keys",
    requests.length === 2 &&
      requests.every(Boolean) &&
      new Set(requests).size === 2,
  );
  ok(
    "119 consecutive saves each post exactly once with correct cents",
    data.events.filter((e) => e.description === "QA119 birinci kayıt")
      .length === 1 &&
      data.events.find((e) => e.description === "QA119 birinci kayıt")
        .party_effect === 100 &&
      data.events.filter((e) => e.description === "QA119 ikinci kayıt")
        .length === 1 &&
      data.events.find((e) => e.description === "QA119 ikinci kayıt")
        .party_effect === 200,
  );
  await p
    .locator(".persistent-composer input[name=description]")
    .fill("119 gizli taslak");
  await p.locator(".persistent-composer input[name=amount]").fill("1250");
  const toggle = p.locator(".party-compose-toggle"),
    a = await toggle.boundingBox();
  await toggle.click();
  const b = await toggle.boundingBox();
  ok(
    "119 collapsed composer keeps its exact viewport anchor",
    Math.abs(a.x - b.x) < 1 && Math.abs(a.y - b.y) < 1,
  );
  await p
    .locator(".sidebar")
    .getByRole("button", { name: "Hesaplar", exact: true })
    .click();
  await p.getByRole("alertdialog").waitFor();
  await p.getByRole("button", { name: "Düzenlemeye dön", exact: true }).click();
  ok(
    "119 hidden draft still guards navigation",
    (await p
      .locator(".persistent-composer")
      .getAttribute("class")
      .then((c) => c.includes("is-collapsed"))) &&
      (await p.locator("input[name=description]").inputValue()) ===
        "119 gizli taslak",
  );
  await toggle.click();
  ok(
    "119 reopening restores all entered values",
    (await p.locator("input[name=amount]").inputValue()) === "1.250" &&
      (await p.locator("input[name=description]").inputValue()) ===
        "119 gizli taslak",
  );
  await close(p);
  await p.screenshot({ path: out + "/119-tested-composer.png" });
  await go("Cari hesaplar");
};
