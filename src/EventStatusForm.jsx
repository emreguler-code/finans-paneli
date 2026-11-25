import { useLayoutEffect, useState } from "react";
import { EntrySurface } from "./EntrySurface";
import { EntryForm } from "./EntryForm";
import { api, requestId } from "./api";
export function EventStatusForm({
  context,
  data: _data,
  onClose,
  onState,
  notify,
}) {
  const item = context.item;
  const [reason, setReason] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [key] = useState(requestId);
  useLayoutEffect(() => {
    const row = document.querySelector(`[data-ledger-id="${item.id}"]`);
    if (!item.cancelled) row?.classList.add("is-delete-preview");
    return () => row?.classList.remove("is-delete-preview");
  }, [item.id, item.cancelled]);
  async function save(ev) {
    ev.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const r = await api("event_status", {
        id: item.id,
        version: item.version,
        cancelled: !item.cancelled,
        reason,
        requestId: key,
      });
      onState(r.state);
      notify(item.cancelled ? "İşlem geri açıldı" : "İşlem iptal edildi");
      onClose();
    } catch (e) {
      setError(e.message);
      document
        .querySelector(`[data-ledger-id="${item.id}"]`)
        ?.classList.remove("is-delete-preview");
    } finally {
      setBusy(false);
    }
  }
  return (
    <EntrySurface
      variant="inline"
      title={item.cancelled ? "İşlemi geri aç" : "İşlemi iptal et"}
      onClose={onClose}
      busy={busy}
      autoFocus={false}
    >
      <EntryForm onSubmit={save} className="status-form">
        <div className="status-action-line">
          <label className="cari-field">
            <span className="sr-only">Gerekçe *</span>
            <input
              name="reason"
              required
              placeholder="Gerekçe yazın"
              aria-label="Gerekçe *"
              value={reason}
              maxLength={1000}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <button
            type="button"
            data-entry-cancel
            className="secondary-button"
            onClick={onClose}
            disabled={busy}
          >
            Vazgeç
          </button>
          <button className="primary-button" disabled={busy}>
            {busy ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
        <p className="cari-hint">
          {item.cancelled
            ? "Kayıt yeniden aktif olur ve hesap etkisi geri uygulanır."
            : "Kayıtlar tamamen ortadan kaldırılmaz; yalnızca hesaba etkisi kaldırılır ve üstü çizili olarak görünmeye devam eder."}
        </p>
        {error && (
          <p role="alert" className="cari-error">
            {error}
          </p>
        )}
      </EntryForm>
    </EntrySurface>
  );
}
