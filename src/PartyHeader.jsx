import { useId, useState } from "react";
import { ArrowLeft, ChevronDown, Pencil } from "lucide-react";
import { can, fmt, tone } from "./ui";
import { dateLabel } from "./DatePicker";
import { partyBalanceLabel } from "./party-ledger.mjs";

export function PartyHeader({
  party,
  data,
  latest,
  count,
  back,
  create,
  edit,
}) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const fields = [
    [
      "Ticari unvan",
      party.title && party.title !== party.name ? party.title : "",
    ],
    ["Telefon", party.phone],
    ["E-posta", party.email],
    ["Vergi / kimlik no", party.tax_no],
    ["Vergi dairesi", party.tax_office],
    ["Adres", party.address],
    ["Notlar", party.notes],
  ].filter(([, value]) => value);
  return (
    <section
      className="panel party-detail-header party-identity-summary summary-section summary-band"
      data-region="4"
      aria-label="Cari hesap"
    >
      <div className="party-heading-row">
        <button
          className="list-icon page-back"
          aria-label="Cari hesaplar"
          title="Cari hesaplara dön"
          onClick={back}
        >
          <ArrowLeft size={18} />
        </button>
        <div className="party-heading-name">
          <h1>{party.name}</h1>
          <span className="cari-type" data-type={party.type}>
            {party.type}
            {!party.active ? " · Arşiv" : ""}
          </span>
        </div>
        <div className="party-balance-and-actions">
          <div
            className="party-current-balance summary-primary"
            data-region="5"
          >
            <span>Güncel cari bakiye</span>
            <div className={"summary-value " + tone(party.balance_cents)}>
              {party.balance_cents > 0 ? "+" : ""}
              {fmt(party.balance_cents)} <small>TL</small>
            </div>
            <small>{partyBalanceLabel(party)}</small>
          </div>
          <div
            className="party-heading-actions"
            role="group"
            aria-label="Cari hesap işlemleri"
          >
            <button
              className={"list-icon " + (expanded ? "active" : "")}
              aria-label="Cari bilgileri"
              title={
                expanded ? "Cari bilgilerini kapat" : "Cari bilgilerini göster"
              }
              aria-expanded={expanded}
              aria-controls={detailsId}
              onClick={() => setExpanded(!expanded)}
            >
              <ChevronDown size={18} className={expanded ? "is-open" : ""} />
            </button>
            {can(data.user, "edit") && (
              <button
                className="list-icon"
                aria-label="Düzenle"
                title="Cari hesabı düzenle"
                onClick={edit}
              >
                <Pencil size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
      {expanded && (
        <div className="party-inline-info" id={detailsId}>
          <div className="party-history-meta">
            <span>{count} gerçekleşmiş hareket</span>
            <span>
              Son hareket:{" "}
              {latest ? dateLabel(latest.event_date) : "Henüz hareket yok"}
            </span>
          </div>
          {fields.length ? (
            <dl>
              {fields.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="muted">Ek cari bilgisi girilmemiş.</p>
          )}
        </div>
      )}
    </section>
  );
}
