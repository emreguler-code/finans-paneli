import { ArrowLeft } from "lucide-react";
import { fmt, tone } from "./ui";
import { partyBalanceLabel } from "./party-ledger.mjs";

export function PartyHeader({ party, back }) {
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
        </div>
      </div>
    </section>
  );
}
