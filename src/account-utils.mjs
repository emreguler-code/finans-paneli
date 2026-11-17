// Signed gross transaction value and net running balance are different projections.
export const operationDirection = (
  operation,
  party = false,
  direction = "Alacak",
) => {
  if (operation === "opening") return direction === "Borç" ? -1 : 1;
  if (party)
    return [
      "sale",
      "supplier_return",
      "employee_purchase",
      "employee_expense",
      "payment",
      "return_payment",
    ].includes(operation)
      ? 1
      : -1;
  if (["transfer", "card_payment", "card_transfer"].includes(operation))
    return 0;
  return [
    "income",
    "collection",
    "refund",
    "supplier_return",
    "cash_advance",
  ].includes(operation)
    ? 1
    : -1;
};
export function grossPartyAmount(e) {
  if (!e.party_id) return 0;
  const sign =
    e.kind === "Açılış"
      ? e.direction === "Borç"
        ? -1
        : 1
      : ["Alacak", "Ödeme"].includes(e.kind)
        ? 1
        : -1;
  return sign * e.amount_cents;
}
export const isKmh = (a) => a?.type === "Kredili Mevduat Hesabı";
export const hasMaturity = (a) =>
  ["Vadeli hesap", "Birikim hesabı"].includes(a?.type) &&
  Boolean(a.maturity_date);
export function kmhUsage(a) {
  const limit = Number(a.credit_limit_cents) || 0;
  const used = Math.max(0, -Number(a.balance_cents || 0));
  const available = Math.max(0, limit - used);
  const rate =
    a.daily_interest_rate === null ||
    a.daily_interest_rate === undefined ||
    a.daily_interest_rate === ""
      ? null
      : Number(a.daily_interest_rate);
  return {
    limit,
    used,
    available,
    percent: limit ? Math.min(100, (used / limit) * 100) : 0,
    dailyInterest: rate === null ? null : Math.round((used * rate) / 100),
  };
}
