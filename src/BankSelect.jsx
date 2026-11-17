import { useMemo, useRef, useState } from "react";
import { Search, Plus } from "lucide-react";
import { bankDirectory, bankKey } from "./bank-directory.mjs";
import { FloatingPanel } from "./FloatingPanel";
export function BankSelect({ data, code, name, onChange }) {
  const button = useRef(null);
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(""),
    [error, setError] = useState("");
  const banks = useMemo(() => bankDirectory(data), [data]);
  const selected = banks.find((b) =>
    code ? b.code === code : bankKey(b.name) === bankKey(name || ""),
  );
  const matches = banks.filter((b) => bankKey(b.name).includes(bankKey(query)));
  const choose = (bank) => {
    onChange(bank);
    setOpen(false);
    setQuery("");
    setError("");
  };
  function add() {
    const clean = query.trim().replace(/\s+/g, " ");
    if (!clean || clean.length > 160) {
      setError("Banka adı 1–160 karakter olmalı.");
      return;
    }
    choose(
      banks.find((b) => bankKey(b.name) === bankKey(clean)) || {
        code: "",
        name: clean,
        programs: [],
      },
    );
  }
  return (
    <div className="cari-field bank-picker">
      <span>Banka</span>
      <button
        type="button"
        className="date-trigger"
        ref={button}
        aria-label="Banka seç"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <Search size={16} />
        <span>{selected?.name || name || "Banka seçin veya ekleyin"}</span>
      </button>
      <input
        type="hidden"
        data-draft-value="true"
        name="bank-selection"
        value={code || name || ""}
      />
      {!code && name && !selected && (
        <small>
          Yeni banka, bu kayıt kaydedildiğinde ortak listeye eklenir.
        </small>
      )}
      {open && (
        <FloatingPanel
          anchor={button.current}
          onClose={() => setOpen(false)}
          title="Banka seçimi"
        >
          <div className="bank-options">
            <label>
              Banka ara
              <input
                autoFocus
                aria-label="Banka ara"
                value={query}
                maxLength={160}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError("");
                }}
              />
            </label>
            <div className="bank-results">
              {matches.map((bank) => (
                <button
                  type="button"
                  key={bank.code || bank.name}
                  onClick={() => choose(bank)}
                >
                  {bank.name}
                </button>
              ))}
            </div>
            {query.trim() && (
              <button type="button" className="text-button" onClick={add}>
                <Plus size={16} />
                {matches.some((b) => bankKey(b.name) === bankKey(query))
                  ? "Bankayı seç"
                  : "Yeni banka ekle: " + query.trim()}
              </button>
            )}
            <button
              type="button"
              className="text-button"
              onClick={() => choose({ code: "", name: "", programs: [] })}
            >
              Banka seçimini temizle
            </button>
            {error && (
              <p role="alert" className="cari-error">
                {error}
              </p>
            )}
          </div>
        </FloatingPanel>
      )}
    </div>
  );
}
