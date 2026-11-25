import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fontUrl from "./assets/fonts/Inter-400.ttf?url";
const money = (n) =>
  new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
export async function reportPdfBytes(report) {
  const response = await fetch(fontUrl);
  if (!response.ok) throw Error("PDF yazı tipi yüklenemedi.");
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const font = await doc.embedFont(await response.arrayBuffer(), {
    subset: true,
  });
  const ink = rgb(0.125, 0.172, 0.224),
    muted = rgb(0.35, 0.4, 0.47),
    accent = rgb(0.03, 0.5, 0.55);
  const width = 595,
    height = 842,
    margin = 32,
    usable = width - 2 * margin;
  const weights = report.columns.map((name) =>
    name === "Açıklama"
      ? 0.3
      : name.includes("Tutar") || name.includes("Bakiye")
        ? 0.15
        : name === "Etiket"
          ? 0.1
          : 0.12,
  );
  const total = weights.reduce((a, b) => a + b, 0),
    sizes = weights.map((w) => (usable * w) / total);
  let page, y;
  const draw = (text, x, top, size = 9, color = ink) =>
    page.drawText(String(text), { x, y: top, size, font, color });
  function wrap(text, max, size = 8) {
    const lines = [];
    let line = "";
    for (const letter of String(text).replace(/[\r\n\t]+/g, " ")) {
      if (line && font.widthOfTextAtSize(line + letter, size) > max) {
        lines.push(line);
        line = "";
      }
      line += letter;
    }
    lines.push(line);
    return lines;
  }
  function header() {
    page = doc.addPage([width, height]);
    y = height - margin;
    draw("finans. · " + report.title, margin, y, 15, accent);
    y -= 24;
    for (const line of wrap(report.subject || "", usable, 10)) {
      draw(line, margin, y, 10);
      y -= 14;
    }
    for (const line of wrap(report.scope || "", usable, 9)) {
      draw(line, margin, y, 9, muted);
      y -= 13;
    }
    if (doc.getPageCount() === 1) {
      y -= 8;
      for (const [label, value] of report.summary) {
        draw(label + ": " + money(value / 100) + " TL", margin, y, 9, accent);
        y -= 14;
      }
    }
    y -= 12;
    let x = margin;
    report.columns.forEach((c, i) => {
      for (const [n, line] of wrap(c, sizes[i] - 6, 8).entries())
        draw(line, x, y - n * 10, 8, muted);
      x += sizes[i];
    });
    y -= 28;
  }
  header();
  for (const row of report.rows) {
    const cells = row.map((v, i) =>
      wrap(typeof v === "number" ? money(v) : v, sizes[i] - 8),
    );
    const lineCount = Math.max(...cells.map((x) => x.length));
    // Long entries continue on subsequent pages rather than clipping the row.
    for (let offset = 0; offset < lineCount;) {
      if (y < margin + 54) header();
      const capacity = Math.max(1, Math.floor((y - margin - 42) / 11));
      const count = Math.min(capacity, lineCount - offset);
      let x = margin;
      cells.forEach((lines, i) => {
        for (let k = 0; k < count; k++)
          if (lines[offset + k] !== undefined) {
            const value = lines[offset + k];
            const numeric = typeof row[i] === "number";
            draw(
              value,
              numeric ? x + sizes[i] - 8 - font.widthOfTextAtSize(value, 8) : x,
              y - k * 11,
              8,
              row.at(-1) === "İptal" ? muted : ink,
            );
          }
        x += sizes[i];
      });
      if (row.at(-1) === "İptal")
        page.drawLine({
          start: { x: margin, y: y - 3 },
          end: { x: width - margin, y: y - 3 },
          color: muted,
          thickness: 0.5,
        });
      y -= count * 11 + 8;
      offset += count;
    }
    page.drawLine({
      start: { x: margin, y: y + 2 },
      end: { x: width - margin, y: y + 2 },
      color: rgb(0.86, 0.89, 0.91),
      thickness: 0.4,
    });
  }
  for (const [label, cents] of report.summary) {
    if (y < margin + 70) header();
    y -= 20;
    draw(label, margin, y, 10);
    const text = money(cents / 100) + " TL";
    draw(
      text,
      width - margin - font.widthOfTextAtSize(text, 10),
      y,
      10,
      accent,
    );
  }
  const stamp = new Date().toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
  });
  doc.getPages().forEach((p, i) => {
    page = p;
    draw("Tutarlar TL · " + stamp, margin, 20, 8, muted);
    draw(`Sayfa ${i + 1} / ${doc.getPageCount()}`, width - 100, 20, 8, muted);
  });
  return doc.save();
}
export async function exportPdf(name, report) {
  const bytes = await reportPdfBytes(report);
  const url = URL.createObjectURL(
    new Blob([bytes], { type: "application/pdf" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name + ".pdf";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
