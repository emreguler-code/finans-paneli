import { operationLabel } from "./operations.mjs";
const collator = new Intl.Collator("tr-TR", {
  numeric: true,
  sensitivity: "base",
});
export const sortKey = (sort) => sort.replace(/-(asc|desc)$/, "");
export const sortDirection = (sort) =>
  sort.endsWith("-asc") ? "ascending" : "descending";
export function nextSort(sort, key) {
  return sortKey(sort) === key
    ? key + (sortDirection(sort) === "ascending" ? "-desc" : "-asc")
    : key + (["date", "amount", "balance"].includes(key) ? "-desc" : "-asc");
}
export function sortLedgerEvents(
  events,
  sort,
  {
    amount = (e) => e.amount_cents,
    accountLabel = (e) => e.account_name || e.card_name || "",
    date = (e) => e.event_date,
  } = {},
) {
  const key = sortKey(sort),
    direction = sortDirection(sort) === "ascending" ? 1 : -1;
  const get = (e) =>
    key === "date"
      ? date(e) + "T" + (e.event_time || "00:00:00")
      : key === "description"
        ? e.description || ""
        : key === "tag"
          ? e.tag || "Genel"
          : key === "operation"
            ? operationLabel(e)
            : key === "creator"
              ? e.creator || "Önceki kayıt"
              : key === "account"
                ? accountLabel(e)
                : key === "amount"
                  ? amount(e)
                  : key === "balance"
                    ? e.party_balance
                    : date(e) + "T" + (e.event_time || "00:00:00");
  return [...events].sort((a, b) => {
    const result = ["amount", "balance"].includes(key)
      ? Number(get(a) || 0) - Number(get(b) || 0)
      : collator.compare(String(get(a)), String(get(b)));
    return (
      result * direction ||
      (a.event_date + (a.event_time || "")).localeCompare(
        b.event_date + (b.event_time || ""),
      ) ||
      Number(a.id) - Number(b.id)
    );
  });
}
