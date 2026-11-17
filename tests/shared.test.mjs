import test from "node:test";
import assert from "node:assert/strict";
import { csvText } from "../src/csv.mjs";
import { planItems } from "../src/list-utils.mjs";
import { readdir, access } from "node:fs/promises";
import { spawn } from "node:child_process";
test("CSV preserves Turkish text, cents and multiline cells and escapes formulas", () => {
  const text = csvText(
    ["Ad", "Tutar"],
    [
      ['İşlem "A"', 123.45],
      ["=1+1", "line\nnext"],
      ["\t=CMD()", null],
    ],
  );
  assert.equal(
    text,
    '\ufeff"Ad";"Tutar"\r\n"İşlem ""A""";"123.45"\r\n"\'=1+1";"line\nnext"\r\n"\'\t=CMD()";""',
  );
});
test("Calendar shares maturity rules with account cards and alerts", () => {
  const data = {
    events: [],
    claims: [],
    cards: [],
    accounts: [
      {
        id: "bank",
        active: true,
        type: "Banka hesabı",
        maturity_date: "2026-10-20",
      },
      {
        id: "term",
        active: true,
        type: "Vadeli hesap",
        maturity_date: "2026-10-20",
      },
      {
        id: "kmh",
        active: true,
        type: "Kredili Mevduat Hesabı",
        maturity_date: "2026-10-20",
      },
    ],
  };
  assert.deepEqual(
    planItems(data).map((item) => item.recordId),
    ["term"],
  );
});
test("Static build contains no PHP, local configuration or runtime files", async () => {
  const files = await readdir(new URL("../dist/client/", import.meta.url), {
    recursive: true,
  });
  assert.ok(
    !files.some(
      (name) =>
        name.endsWith(".php") ||
        name.startsWith("api/") ||
        name.includes(".env"),
    ),
  );
  await access(new URL("../dist/client/assets/fonts.css", import.meta.url));
});
test(
  "Development helper reports child startup failure as failure",
  { timeout: 5000 },
  async () => {
    const code = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ["scripts/dev.mjs"], {
        env: { ...process.env, PHP_BIN: "/bin/false" },
        stdio: "ignore",
      });
      child.once("error", reject);
      child.once("exit", resolve);
    });
    assert.notEqual(code, 0);
  },
);
