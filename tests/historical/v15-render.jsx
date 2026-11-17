import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { FinanceHub } from "../../src/Finance";
import { EventForm } from "../../src/EventForm";
import { AccountFace } from "../../src/AccountCarousel";
const data = JSON.parse(readFileSync(".local-runtime/qa-state.json", "utf8"));
let count = 0;
const ok = (name, test) => {
  assert.ok(test, name);
  count++;
  console.log("PASS " + name);
};
const props = {
  data,
  onState() {},
  notify() {},
  open() {},
  onClose() {},
  onLabel() {},
};
for (const page of [
  "Cari hesaplar",
  "Tahsilat & Ödeme",
  "Ödeme Planı",
  "Hesaplar",
  "Kredi kartları",
  "Kullanıcılar",
  "Raporlar",
]) {
  const html = renderToStaticMarkup(<FinanceHub {...props} page={page} />);
  ok(page + " renders without runtime errors", html.length > 100);
  if (page === "Kredi kartları") {
    ok(
      "Default tab is current period",
      /aria-pressed="true"[^>]*>Dönem içi işlemler/.test(html),
    );
    ok(
      "Card carousel has arrows",
      html.includes("Önceki hesap") && html.includes("Sonraki hesap"),
    );
  }
  if (page === "Hesaplar")
    ok(
      "Bank future ledger tab exists",
      html.includes("Gelecek dönem hareketleri"),
    );
}
for (const type of ["Tedarikçi", "Müşteri", "Personel"]) {
  const p = data.parties.find((p) => p.type === type);
  const html = renderToStaticMarkup(
    <EventForm {...props} context={{ entity: "event", lockedPartyId: p.id }} />,
  );
  ok(type + " form renders", html.includes(p.name));
  ok(type + " is locked", !html.includes("Cari (isteğe bağlı)"));
  ok(type + " has no transfer option", !html.includes(">Virman<"));
  ok(
    type + " uses only tag",
    html.includes("Etiket (isteğe bağlı)") && !html.includes("Kategori"),
  );
  if (type === "Tedarikçi")
    ok(
      "Supplier invoice choices visible without collection box",
      html.includes("Faturalı Alış") &&
        html.includes("Faturasız Alış") &&
        !html.includes(">Tahsilat</button>"),
    );
}
const card = renderToStaticMarkup(<AccountFace isCard item={data.cards[0]} />);
ok(
  "Masked card number and holder render",
  card.includes("**** **** ****") && card.includes("Örnek Kullanıcı"),
);
ok(
  "Limit has three parts",
  card.includes('class="statement"') &&
    card.includes('class="period"') &&
    card.includes('class="available"'),
);
console.log(
  JSON.stringify({
    passed: count,
    failed: 0,
    scope: "server rendering; not browser screenshot validation",
  }),
);
