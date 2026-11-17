import { ArrowLeft } from "lucide-react";
export function PageHeading({
  title,
  subtitle,
  back,
  backLabel,
  actions,
  className = "",
}) {
  return (
    <div data-region="4" className={"page-title " + className}>
      <div className="page-heading-identity">
        {back && (
          <button
            className="list-icon page-back"
            aria-label={backLabel}
            title={backLabel}
            onClick={back}
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="cari-actions">{actions}</div>}
    </div>
  );
}
export function SummaryBar({
  label,
  items,
  actions,
  identity,
  children,
  className = "",
}) {
  return (
    <section
      data-region="5"
      className={"summary-section " + className}
      aria-label={label}
    >
      {label && <h2 className="summary-label">{label}</h2>}
      <div className="panel summary-band">
        {(identity || actions) && (
          <header className="summary-band-heading">
            <div className="summary-identity">{identity}</div>
            <div className="card-local-actions">{actions}</div>
          </header>
        )}
        <div
          className="summary-fields"
          style={{ "--summary-count": items.length }}
        >
          {items.map(({ label, value, help, tone = "", primary = false }) => (
            <div
              className={"summary-field " + (primary ? "summary-primary" : "")}
              key={label}
            >
              <span>{label}</span>
              <div className={"summary-value " + tone}>{value}</div>
              {help && <small>{help}</small>}
            </div>
          ))}
        </div>
        {children}
      </div>
    </section>
  );
}
