import { fmt } from "./ui";
import { transactionPreview } from "./transaction-preview.mjs";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { EntrySurface } from "./EntrySurface";
import { EntryForm } from "./EntryForm";
import { SelectControl } from "./SelectControl";
import { TagInput } from "./TagInput";
import { MoneyInput } from "./MoneyInput";
import { DatePicker } from "./DatePicker";
import { operations } from "./operations.mjs";
export function PartyEntryForm({
  context,
  data,
  party,
  e,
  f,
  formId,
  ready,
  change,
  choose,
  setF,
  paymentMode,
  setPaymentMode,
  save,
  onClose,
  busy,
  error,
  invoice,
  invoiceReturn,
  borcland,
  needsAccount,
  opts,
  effect,
}) {
  const [expanded, setExpanded] = useState(false),
    [attention, setAttention] = useState(false),
    [dateSelected, setDateSelected] = useState(
      Boolean(e.id || context.initial?.date),
    );
  const previousOperation = useRef(null);
  useEffect(() => {
    setDateSelected(Boolean(e.id || context.initial?.date));
    setExpanded(false);
    previousOperation.current = null;
  }, [f.requestId]);
  const transfer = ["transfer", "card_payment", "cash_advance"].includes(
    f.operation,
  );
  const salary = f.operation === "salary",
    staff = party?.type === "Personel",
    hasDue = invoice || salary || f.scheduled || Boolean(f.linkedId),
    accountRequired = needsAccount && !salary;
  const partialRequired = invoice && f.immediate && paymentMode === "partial";
  const requiredSignature = [
    accountRequired ? "account" : "",
    transfer ? "target" : "",
    partialRequired ? "settled" : "",
  ].join("|");
  const missing =
    (accountRequired && !f.account && !f.cardId) ||
    (partialRequired && !f.settled) ||
    (transfer && (f.operation === "transfer" ? !f.target : !f.account));
  const hasExtras = Boolean(
    f.operation &&
    (hasDue ||
      (f.cardId && invoice) ||
      (f.cardId && !e.id) ||
      (!party && !context.lockedCardId) ||
      !staff),
  );
  useLayoutEffect(() => {
    const changed = previousOperation.current !== f.operation;
    previousOperation.current = f.operation;
    if (changed) setExpanded(false);
    setAttention(Boolean(missing));
    const timer = setTimeout(() => setAttention(false), 750);
    return () => clearTimeout(timer);
  }, [f.operation, requiredSignature]);
  const accountOptions = [
    ["", "Hesap seçin"],
    ...data.accounts.filter((a) => a.active).map((a) => [a.id, a.name]),
    ...data.cards
      .filter((c) => c.active)
      .map((c) => ["card:" + c.id, c.name + " · Kart"]),
  ];
  const control = (label, value, options, onChange, required = false, name) => (
    <label
      className="cari-field"
      data-attention={attention && required && !value ? "true" : undefined}
    >
      {label}
      {required && !label.includes("*") ? " *" : null}
      <SelectControl
        modern
        aria-label={label}
        name={name}
        value={String(value ?? "")}
        required={required}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </SelectControl>
    </label>
  );
  const money = (
    key,
    label,
    value,
    onValueChange,
    required = false,
    disabled = false,
  ) => (
    <label
      className="cari-field"
      data-attention={attention && required && !value ? "true" : undefined}
    >
      {label}
      {required && !label.includes("*") ? " *" : null}
      <MoneyInput
        name={key}
        aria-label={label}
        value={value}
        onValueChange={onValueChange}
        required={required}
        disabled={disabled}
        placeholder="0,00"
      />
    </label>
  );
  const setAccount = (value) =>
    setF((s) => ({
      ...s,
      account: value.startsWith("card:") ? "" : value,
      cardId: value.startsWith("card:") ? Number(value.slice(5)) : "",
    }));
  const rank = [
    "payment",
    "collection",
    "employee_purchase",
    "employee_expense",
  ];
  const options = (
    staff
      ? [...opts].sort(
          (a, b) =>
            (rank.includes(a) ? rank.indexOf(a) : 4) -
            (rank.includes(b) ? rank.indexOf(b) : 4),
        )
      : opts
  ).filter((op) => op !== "employee_expense");
  if (borcland && !options.includes("employee_purchase"))
    options.push("employee_purchase");
  const tagControl = (
    <label className="cari-field">
      <span className="sr-only">Etiket (isteğe bağlı)</span>
      <TagInput
        value={f.tag}
        selectOnFocus={Boolean(e.id)}
        onChange={(v) => change("tag", v)}
        options={[
          ...new Set([
            "Genel",
            "Gıda",
            "Kırtasiye",
            "Otomotiv",
            ...data.events.map((event) => event.tag || "Genel"),
          ]),
        ]}
      />
    </label>
  );
  const conditions = f.operation && (
    <div className="transaction-conditions">
      {salary &&
        control(
          "Ödeme",
          f.immediate ? f.account : "",
          [
            ["", "Ödeme yapılmadı"],
            ...data.accounts.filter((a) => a.active).map((a) => [a.id, a.name]),
          ],
          (value) => {
            setPaymentMode("full");
            setF((s) => ({
              ...s,
              immediate: Boolean(value),
              account: value,
              cardId: "",
              settled: "0",
            }));
          },
          false,
          "salaryAccount",
        )}
      {salary &&
        money(
          "settled",
          "Ödenen tutar (TL)",
          f.immediate ? (paymentMode === "full" ? f.amount : f.settled) : "",
          (v) => {
            setPaymentMode("partial");
            change("settled", v);
          },
          Boolean(f.immediate),
          !f.immediate,
        )}
      {accountRequired &&
        !context.lockedCardId &&
        !["card_payment", "cash_advance"].includes(f.operation) &&
        control(
          "İşlem hesabı *",
          f.cardId ? "card:" + f.cardId : f.account,
          transfer
            ? accountOptions.filter(([v]) => !String(v).startsWith("card:"))
            : accountOptions,
          setAccount,
          true,
          "account",
        )}
      {partialRequired &&
        money(
          "settled",
          f.operation === "sale" || f.operation === "supplier_return"
            ? "Şimdi tahsil edilen (TL) *"
            : "Şimdi ödenen (TL) *",
          f.settled,
          (v) => change("settled", v),
          true,
        )}
      {borcland &&
        control(
          "Borçlandırma şekli",
          f.operation,
          [
            ["employee_purchase", "İşletmeden alışveriş"],
            ["employee_expense", "Personel adına ödeme"],
          ],
          choose,
        )}
      {staff &&
        f.operation === "payment" &&
        control(
          "Ödeme amacı",
          f.paymentPurpose,
          [
            ["Maaş", "Maaş"],
            ["Avans", "Avans"],
            ["Diğer", "Diğer"],
          ],
          (v) => change("paymentPurpose", v),
        )}
      {f.operation === "opening" &&
        control(
          "Bakiye yönü",
          f.direction,
          [
            ["Alacak", "Alacak"],
            ["Borç", "Borç"],
          ],
          (v) => change("direction", v),
        )}
      {transfer &&
        control(
          f.operation === "cash_advance"
            ? "Paranın gireceği hesap *"
            : f.operation === "card_payment"
              ? "Ödeme kaynağı *"
              : "Hedef hesap *",
          f.operation === "transfer" ? f.target : f.account,
          [
            ["", "Hesap seçin"],
            ...data.accounts
              .filter(
                (a) =>
                  a.active &&
                  (f.operation !== "transfer" || a.id !== f.account),
              )
              .map((a) => [a.id, a.name]),
          ],
          (v) => change(f.operation === "transfer" ? "target" : "account", v),
          true,
        )}
      {!party &&
        !context.lockedCardId &&
        control(
          "Cari (isteğe bağlı)",
          f.partyId,
          [
            ["", "Bağımsız işlem"],
            ...data.parties.filter((p) => p.active).map((p) => [p.id, p.name]),
          ],
          (v) =>
            setF((s) => ({
              ...s,
              partyId: v,
              operation: "",
              immediate: false,
            })),
          false,
          "partyId",
        )}
    </div>
  );
  return (
    <EntrySurface
      variant="inline"
      externalFormId={formId}
      resetKey={f.requestId + String(ready)}
      title={e.id ? "İşlemi düzenle" : "Yeni işlem"}
      onClose={onClose}
      busy={busy}
      autoFocus={false}
    >
      <EntryForm id={formId} onSubmit={save} className="transaction-form">
        <div className="sheet-scroll">
          <div className="transaction-main">
            <div className="transaction-heading">
              <h2>{e.id ? "İşlemi düzenle" : "Yeni işlem"}</h2>
              <div
                className="operation-choices"
                role="group"
                aria-label="İşlem"
              >
                {options
                  .filter((op) => op !== "purchase_no_invoice")
                  .map((op) => (
                    <button
                      key={op}
                      type="button"
                      aria-pressed={
                        f.operation === op ||
                        (op === "purchase_invoice" &&
                          f.operation === "purchase_no_invoice")
                      }
                      onClick={() => choose(op)}
                    >
                      {op === "purchase_invoice" ? "Alış" : operations[op]}
                    </button>
                  ))}
              </div>
            </div>
            {["purchase_invoice", "purchase_no_invoice"].includes(
              f.operation,
            ) && (
              <div
                className="operation-choices purchase-type"
                role="group"
                aria-label="Alış türü"
              >
                {["purchase_invoice", "purchase_no_invoice"].map((op) => (
                  <button
                    key={op}
                    type="button"
                    aria-pressed={f.operation === op}
                    onClick={() => choose(op)}
                  >
                    {operations[op]}
                  </button>
                ))}
              </div>
            )}
            <input
              type="hidden"
              name="operation"
              value={f.operation}
              data-draft-value={f.operation}
            />
            <div className="transaction-values">
              {money(
                "amount",
                "Tutar (TL)",
                f.amount,
                (v) => change("amount", v),
                true,
              )}
              <label className="cari-field">
                Açıklama (isteğe bağlı)
                <input
                  name="description"
                  aria-label="Açıklama (isteğe bağlı)"
                  value={f.description}
                  placeholder="Açıklama ekleyin"
                  maxLength={1000}
                  onChange={(ev) => change("description", ev.target.value)}
                />
              </label>
            </div>
            {!invoice && conditions}
            {f.operation === "card_transfer" &&
              control(
                "Hedef kredi kartı *",
                f.targetCardId,
                [
                  ["", "Kart seçin"],
                  ...data.cards
                    .filter((c) => c.active && c.id !== Number(f.cardId))
                    .map((c) => [c.id, c.name]),
                ],
                (v) => change("targetCardId", v),
                true,
              )}
            <div className="transaction-meta">
              {invoice &&
                control(
                  invoiceReturn ? "İade bedeli" : "Ödeme / tahsilat",
                  f.immediate
                    ? paymentMode
                    : invoiceReturn && f.returnMode === "later"
                      ? "later"
                      : "open",
                  [
                    [
                      "open",
                      invoiceReturn ? "Cari hesaptan düş" : "Açık hesaba ekle",
                    ],
                    [
                      "full",
                      f.operation === "sale" ||
                      f.operation === "supplier_return"
                        ? "Tamamını tahsil et"
                        : "Tamamını öde",
                    ],
                    [
                      "partial",
                      f.operation === "sale" ||
                      f.operation === "supplier_return"
                        ? "Kısmen tahsil et"
                        : "Kısmen öde",
                    ],
                    ...(invoiceReturn
                      ? [
                          [
                            "later",
                            f.operation === "supplier_return"
                              ? "Sonra tahsil et"
                              : "Sonra geri öde",
                          ],
                        ]
                      : []),
                  ],
                  (value) => {
                    setPaymentMode(value === "partial" ? "partial" : "full");
                    setF((s) => ({
                      ...s,
                      immediate: ["full", "partial"].includes(value),
                      returnMode: value === "later" ? "later" : "offset",
                      settled: value === "partial" ? "" : "0",
                    }));
                  },
                )}

              <div className="cari-field compact-date">
                <DatePicker
                  value={f.date}
                  today={data.today}
                  max={f.scheduled ? undefined : data.today}
                  required
                  label="İşlem tarihi"
                  iconOnly={!dateSelected}
                  textOnly={dateSelected}
                  displayText={
                    dateSelected
                      ? new Date(f.date + "T12:00:00Z").toLocaleDateString(
                          "tr-TR",
                          { day: "numeric", month: "short", timeZone: "UTC" },
                        )
                      : undefined
                  }
                  timeValue={f.time}
                  onTimeChange={(v) => change("time", v)}
                  onChange={(v) => {
                    setDateSelected(true);
                    setF((s) => ({
                      ...s,
                      date: v,
                      periodDate: s.periodDate === s.date ? v : s.periodDate,
                    }));
                  }}
                />
              </div>
              {tagControl}
              {hasExtras && (
                <details
                  className="transaction-more"
                  open={expanded}
                  onToggle={(ev) => setExpanded(ev.currentTarget.open)}
                >
                  <summary>Diğer bilgiler</summary>
                  <div className="transaction-option-fields">
                    {hasDue && (
                      <label className="cari-field compact-date">
                        Vade (isteğe bağlı)
                        <DatePicker
                          value={f.due}
                          today={data.today}
                          label="Vade"
                          onChange={(v) => change("due", v)}
                        />
                      </label>
                    )}
                    {f.cardId && invoice && (
                      <label className="cari-field compact-date">
                        Kart dönem tarihi
                        <DatePicker
                          value={f.periodDate}
                          today={data.today}
                          label="Kart dönem tarihi"
                          onChange={(v) => change("periodDate", v)}
                        />
                      </label>
                    )}
                    {f.cardId &&
                      !e.id &&
                      control(
                        "Taksit sayısı",
                        f.installments,
                        Array.from({ length: 36 }, (_, i) => [
                          i + 1,
                          i ? i + 1 + " taksit" : "Tek çekim",
                        ]),
                        (v) => change("installments", Number(v)),
                      )}
                    {!party && !context.lockedCardId && (
                      <label className="check-label">
                        <input
                          type="checkbox"
                          checked={f.scheduled}
                          onChange={(e) =>
                            change("scheduled", e.target.checked)
                          }
                        />
                        Planlı işlem
                      </label>
                    )}
                    {!staff && (
                      <label className="cari-field">
                        Belge / fatura no
                        <input
                          name="document"
                          value={f.document}
                          maxLength={160}
                          onChange={(event) =>
                            change("document", event.target.value)
                          }
                        />
                      </label>
                    )}
                  </div>
                </details>
              )}
            </div>
            {invoice && conditions}
            {e.id && (
              <label className="cari-field edit-reason">
                Değişiklik gerekçesi *
                <input
                  name="reason"
                  required
                  value={f.reason}
                  maxLength={1000}
                  onChange={(ev) => change("reason", ev.target.value)}
                />
              </label>
            )}
            {error && (
              <p className="cari-error" role="alert">
                {error}
              </p>
            )}{" "}
            <div className="sheet-footer">
              <button
                type="button"
                data-entry-cancel
                className="secondary-button"
                aria-label={
                  e.id ? "Düzenlemeyi iptal et" : "Yeni işlemi iptal et"
                }
                disabled={busy}
                onClick={onClose}
              >
                Vazgeç
              </button>
              <button
                type="submit"
                form={formId}
                className="primary-button"
                disabled={
                  busy ||
                  !f.operation ||
                  !f.amount ||
                  Number(f.amount.replaceAll(".", "").replace(",", ".")) <= 0
                }
              >
                {busy ? (
                  <LoaderCircle className="loading-spinner" size={16} />
                ) : (
                  <Check size={18} />
                )}
                {e.id ? "Değişiklikleri kaydet" : "İşlemi kaydet"}
              </button>
            </div>
          </div>
          <aside
            className="transaction-preview"
            aria-label="İşlemin etkisi"
            role="status"
          >
            <h3>İşlemin etkisi</h3>
            {party && (
              <BalancePreview
                party={party}
                event={e}
                form={f}
                paymentMode={paymentMode}
              />
            )}
            <p>{f.operation ? effect() : "Başlamak için işlem seçin."}</p>
            <small>Önizleme · Kaydedilmedi</small>
          </aside>
        </div>
      </EntryForm>
    </EntrySurface>
  );
}
function BalancePreview({ party, event, form, paymentMode }) {
  const result = transactionPreview(party, event, form, paymentMode);
  return (
    <dl>
      <div>
        <dt>Mevcut bakiye</dt>
        <dd>{fmt(party.balance_cents)} TL</dd>
      </div>
      {result && (
        <>
          <div>
            <dt>{event.id ? "Değişiklik" : "Cari etki"}</dt>
            <dd>{fmt(result.delta)} TL</dd>
          </div>
          <div className="preview-result">
            <dt>Kayıttan sonra</dt>
            <dd>{fmt(result.balance)} TL</dd>
          </div>
        </>
      )}
    </dl>
  );
}
