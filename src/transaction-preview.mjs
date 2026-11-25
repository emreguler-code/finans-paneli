import { operationDirection } from "./account-utils.mjs";
import { isInvoice } from "./operations.mjs";
const cents = (value) =>
  Math.round(
    Number(
      String(value || "0")
        .replaceAll(".", "")
        .replace(",", "."),
    ) * 100,
  );
// Preview only: the API remains authoritative and validates settlement limits.
export function transactionPreview(party, event, form, paymentMode) {
  const amount = cents(form.amount);
  if (!form.operation || !Number.isSafeInteger(amount) || amount <= 0)
    return null;
  const settles = isInvoice(form.operation) || form.operation === "salary";
  const paid =
    settles && form.immediate
      ? paymentMode === "full"
        ? amount
        : cents(form.settled)
      : 0;
  if (
    !Number.isSafeInteger(paid) ||
    paid < 0 ||
    (paid > amount &&
      !["sale", "purchase_invoice", "purchase_no_invoice"].includes(
        form.operation,
      ))
  )
    return null;
  const next = form.scheduled
    ? 0
    : operationDirection(form.operation, true, form.direction) *
      (amount - paid);
  const old =
    event.id && !event.cancelled && !event.scheduled
      ? (Number(event.party_effect) || 0) -
        operationDirection(event.operation, true, event.direction) *
          (Number(event.excess_payment_cents) || 0)
      : 0;
  const delta = next - old;
  return { delta, balance: Number(party.balance_cents) + delta };
}
