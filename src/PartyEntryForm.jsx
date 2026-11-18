import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, X, LoaderCircle } from "lucide-react";
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
  place,
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
  const salary = f.operation === "salary",
    staff = party.type === "Personel",
    hasDue = invoice || salary || Boolean(f.linkedId),
    accountRequired = needsAccount && !salary;
  const partialRequired = invoice && f.immediate && paymentMode === "partial";
  const requiredSignature = [
    accountRequired ? "account" : "",
    partialRequired ? "settled" : "",
  ].join("|");
  const missing =
    (accountRequired && !f.account && !f.cardId) ||
    (partialRequired && !f.settled);
  const hasExtras = Boolean(
    f.operation &&
    (invoice ||
      salary ||
      accountRequired ||
      hasDue ||
      borcland ||
      !staff ||
      f.operation === "opening" ||
      (staff && f.operation === "payment")),
  );
  useLayoutEffect(() => {
    const changed = previousOperation.current !== f.operation;
    previousOperation.current = f.operation;
    if (changed) setExpanded(Boolean(missing));
    else if (missing) setExpanded(true);
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
  const options = opts.filter((op) => op !== "employee_expense");
  if (borcland && !options.includes("employee_purchase"))
    options.push("employee_purchase");
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
      <EntryForm id={formId} onSubmit={save} className="party-entry-form">
        <div className="sheet-scroll">
          {place(
            "date",
            <div className="cari-field compact-date">
              <DatePicker
                value={f.date}
                today={data.today}
                max={data.today}
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
            </div>,
          )}
          {place(
            "description",
            <label className="cari-field">
              Açıklama (isteğe bağlı)
              <input
                name="description"
                aria-label="Açıklama (isteğe bağlı)"
                value={f.description}
                placeholder="Açıklama ekleyin"
                maxLength={1000}
                onChange={(event) => change("description", event.target.value)}
              />
            </label>,
          )}
          {place(
            "tag",
            <label className="cari-field">
              Etiket (isteğe bağlı)
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
            </label>,
          )}
          {place(
            "operation",
            control(
              "İşlem",
              borcland ? "employee_purchase" : f.operation,
              [
                ...(!e.id ? [["", "İşlem seç"]] : []),
                ...options.map((op) => [op, operations[op]]),
              ],
              choose,
              true,
              "operation",
            ),
          )}
          {place(
            "amount",
            money(
              "amount",
              "Tutar (TL) *",
              f.amount,
              (v) => change("amount", v),
              true,
            ),
          )}
          {hasExtras && (
            <details
              className="inline-extra"
              open={expanded}
              onToggle={(event) => setExpanded(event.currentTarget.open)}
            >
              <summary>Ek bilgiler</summary>
              <div className="inline-extra-grid">
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
                        invoiceReturn
                          ? "Cari hesaptan düş"
                          : "Açık hesaba ekle",
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
                {salary &&
                  control(
                    "Ödeme",
                    f.immediate ? f.account : "",
                    [
                      ["", "Ödeme yapılmadı"],
                      ...data.accounts
                        .filter((a) => a.active)
                        .map((a) => [a.id, a.name]),
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
                    f.immediate
                      ? paymentMode === "full"
                        ? f.amount
                        : f.settled
                      : "",
                    (v) => {
                      setPaymentMode("partial");
                      change("settled", v);
                    },
                    Boolean(f.immediate),
                    !f.immediate,
                  )}
                {accountRequired &&
                  control(
                    "İşlem hesabı *",
                    f.cardId ? "card:" + f.cardId : f.account,
                    accountOptions,
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
          {f.operation &&
            Number(f.amount.replaceAll(".", "").replace(",", ".")) > 0 && (
              <p className="inline-effect-preview" role="status">
                {effect()}
              </p>
            )}
          {e.id && (
            <label className="cari-field edit-reason">
              Değişiklik gerekçesi *
              <input
                name="reason"
                required
                value={f.reason}
                maxLength={1000}
                onChange={(event) => change("reason", event.target.value)}
              />
            </label>
          )}
          {error && (
            <p className="cari-error" role="alert">
              {error}
            </p>
          )}
        </div>
        {place(
          "actions",
          <div className="sheet-footer">
            <button
              type="button"
              data-entry-cancel
              className="secondary-button"
              title="Vazgeç"
              aria-label={
                e.id ? "Düzenlemeyi iptal et" : "Yeni işlemi iptal et"
              }
              disabled={busy}
              onClick={onClose}
            >
              <X size={18} />
            </button>
            <button
              type="submit"
              form={formId}
              className="primary-button"
              aria-label={e.id ? "Değişiklikleri kaydet" : "İşlemi kaydet"}
              title="Kaydet"
              disabled={
                busy ||
                !f.operation ||
                Number(f.amount.replaceAll(".", "").replace(",", ".")) <= 0 ||
                !f.amount
              }
            >
              {busy ? (
                <LoaderCircle className="loading-spinner" size={16} />
              ) : (
                <Check size={18} />
              )}
            </button>
          </div>,
        )}
      </EntryForm>
    </EntrySurface>
  );
}
