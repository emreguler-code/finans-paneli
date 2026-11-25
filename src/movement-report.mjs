import { operationLabel } from "./operations.mjs";
export function movementReport({
  title = "Hesap hareketleri",
  subject = "",
  events,
  amount,
  balance = null,
  balanceLabel = "Güncel bakiye",
  party = false,
  period = false,
  scope = "Seçili kayıtlar",
  allEvents = null,
  from = "",
  to = "",
  accountLabel = (e) => e.account_name || e.card_name || "",
}) {
  const columns = [
    "Tarih",
    ...(period ? ["Dönem"] : []),
    "İşlem",
    "Açıklama",
    "Etiket",
    "Tutar (TL)",
    ...(party ? ["Bakiye (TL)"] : []),
    "Durum",
  ];
  const net = events.reduce(
    (sum, e) =>
      sum +
      (e.cancelled || e.scheduled
        ? 0
        : Number(party ? e.party_effect || 0 : amount(e))),
    0,
  );
  const rows = events.map((e) => [
    e.event_date,
    ...(period ? [e.period_date || e.event_date] : []),
    operationLabel(e),
    e.description || "",
    e.tag || "Genel",
    amount(e) / 100,
    ...(party ? [e.party_balance / 100] : []),
    e.cancelled ? "İptal" : e.scheduled ? "Planlı" : "Aktif",
  ]);
  let summary = [
    ["Seçili kayıtların net etkisi", net],
    ...(balance === null ? [] : [[balanceLabel, Number(balance)]]),
  ];
  if (party && allEvents && (from || to) && (!from || !to || from <= to)) {
    const facts = allEvents.filter((e) => !e.cancelled && !e.scheduled);
    const expected = facts.filter(
      (e) => (!from || e.event_date >= from) && (!to || e.event_date <= to),
    );
    const ids = new Set(
      events.filter((e) => !e.cancelled && !e.scheduled).map((e) => e.id),
    );
    if (expected.length === ids.size && expected.every((e) => ids.has(e.id))) {
      const opening = facts
        .filter((e) => from && e.event_date < from)
        .reduce((n, e) => n + Number(e.party_effect || 0), 0);
      summary = [
        ["Devreden bakiye", opening],
        ["Seçili kayıtların net etkisi", net],
        ["Dönem sonu bakiye", opening + net],
        ...(balance === null ? [] : [[balanceLabel, Number(balance)]]),
      ];
    }
  }
  const csvColumns = [
    "Tarih",
    "Saat",
    ...(period ? ["Dönem"] : []),
    "Açıklama",
    "İşlem",
    "Ekleyen",
    "Hesap",
    "Etiket",
    "Tutar (TL)",
    ...(party ? ["Bakiye (TL)"] : []),
    "Durum",
  ];
  const csvRows = events.map((e, index) => [
    e.event_date,
    e.event_time || "",
    ...(period ? [e.period_date || e.event_date] : []),
    e.description || "",
    operationLabel(e),
    e.creator || "",
    accountLabel(e),
    e.tag || "Genel",
    amount(e) / 100,
    ...(party ? [e.party_balance / 100] : []),
    rows[index].at(-1),
  ]);
  return {
    title,
    subject,
    scope,
    columns,
    rows,
    summary,
    csv: { columns: csvColumns, rows: csvRows },
  };
}
export function reportRows(report, detailed = false) {
  if (detailed && report.csv) report = { ...report, ...report.csv };
  return [
    ...report.rows,
    ...report.summary.map(([label, value]) =>
      report.columns.map((_, i) =>
        i === report.columns.indexOf("Açıklama")
          ? label
          : i ===
              (report.columns.includes("Bakiye (TL)") &&
              label !== "Seçili kayıtların net etkisi"
                ? report.columns.indexOf("Bakiye (TL)")
                : report.columns.indexOf("Tutar (TL)"))
            ? value / 100
            : "",
      ),
    ),
  ];
}
export async function downloadReportPdf(name, report) {
  const { exportPdf } = await import("./pdf-export.mjs");
  await exportPdf(name, report);
}
