import { useState, useId } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { partyMonthly } from "./party-monthly.mjs";
import { fmt } from "./ui";
const outerColors = ["var(--accent)", "var(--palette-cae4e7)"];
export function PartyMonthlySummary({ party, data }) {
  const [month, setMonth] = useState(data.today.slice(0, 7)),
    id = useId();
  const summary = partyMonthly(party, data, month),
    staff = party.type === "Personel",
    supplier = party.type === "Tedarikçi";
  const showOuter =
    summary.outer.filter((d) => d.value > 0).length > (staff ? 1 : 0);
  const colors = supplier
    ? ["var(--status-positive)", "var(--muted)", "var(--status-warning)"]
    : ["var(--status-positive)", "var(--status-warning)"];
  const move = (n) => {
    const d = new Date(month + "-01T12:00:00Z");
    d.setUTCMonth(d.getUTCMonth() + n);
    setMonth(d.toISOString().slice(0, 7));
  };
  const title = staff
    ? "Hakediş ve ödeme"
    : supplier
      ? "Alış ve ödeme"
      : "Satış ve tahsilat";
  const ratio = (v, total) =>
    total > 0
      ? new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(
          (v / total) * 100,
        ) + "%"
      : "—";
  return (
    <section className="panel party-monthly" aria-labelledby={id}>
      <header>
        <h2 id={id}>Aylık Özet</h2>
        <div className="month-navigation">
          <button
            className="icon-button"
            aria-label="Önceki ay"
            onClick={() => move(-1)}
          >
            <ChevronLeft size={17} />
          </button>
          <label>
            <span className="sr-only">Özet ayı</span>
            <span className="month-name" aria-hidden="true">
              {new Date(month + "-01T12:00:00Z").toLocaleDateString("tr-TR", {
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </span>
            <input
              type="month"
              value={month}
              min="1900-01"
              max={data.today.slice(0, 7)}
              onChange={(e) => {
                if (
                  /^\d{4}-(0[1-9]|1[0-2])$/.test(e.target.value) &&
                  e.target.value <= data.today.slice(0, 7) &&
                  e.target.value >= "1900-01"
                )
                  setMonth(e.target.value);
              }}
            />
          </label>
          <button
            className="icon-button"
            aria-label="Sonraki ay"
            disabled={month >= data.today.slice(0, 7)}
            onClick={() => move(1)}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </header>
      <h3>{title}</h3>
      <div className="monthly-totals">
        <span>
          {staff ? "Toplam hakediş" : supplier ? "Brüt alış" : "Brüt satış"}
          <b>{fmt(summary.gross)} TL</b>
        </span>
        {!staff && (
          <span>
            İadeler<b>−{fmt(summary.returns)} TL</b>
          </span>
        )}
      </div>
      {summary.net > 0 && summary.inner.length > 0 ? (
        <>
          <div
            className="party-donut"
            role="img"
            aria-label={
              title +
              " dağılımı. " +
              summary.inner
                .map(
                  (d) =>
                    d.name +
                    ": " +
                    fmt(d.value) +
                    " TL, " +
                    ratio(d.value, summary.net),
                )
                .join(". ")
            }
          >
            <PieChart width={208} height={208} accessibilityLayer={false}>
              <Pie
                data={summary.inner.filter((d) => d.value > 0)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={82}
                startAngle={90}
                endAngle={-270}
                isAnimationActive={false}
                stroke="var(--surface-raised)"
                strokeWidth={3}
              >
                {summary.inner
                  .filter((d) => d.value > 0)
                  .map((d) => (
                    <Cell
                      key={d.name}
                      fill={colors[summary.inner.indexOf(d)]}
                    />
                  ))}
              </Pie>
              {showOuter && (
                <Pie
                  data={summary.outer.filter((d) => d.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={88}
                  outerRadius={99}
                  startAngle={90}
                  endAngle={-270}
                  isAnimationActive={false}
                  stroke="var(--surface-raised)"
                  strokeWidth={2}
                >
                  {summary.outer
                    .filter((d) => d.value > 0)
                    .map((d) => (
                      <Cell
                        key={d.name}
                        fill={outerColors[summary.outer.indexOf(d)]}
                      />
                    ))}
                </Pie>
              )}
              <Tooltip formatter={(value) => fmt(value) + " TL"} />
            </PieChart>
            <div className="donut-center">
              <small>
                {staff ? "Hakediş" : supplier ? "Net alış" : "Net satış"}
              </small>
              <strong>{fmt(summary.net)}</strong>
              <small>TL</small>
            </div>
          </div>
          <div className="donut-legend">
            {showOuter && (
              <>
                <h4>
                  {staff ? "Hakediş türü" : "Brüt alış türü · ince halka"}
                </h4>
                {summary.outer
                  .filter((d) => d.value > 0)
                  .map((d) => (
                    <div key={d.name}>
                      <span>
                        <i
                          style={{
                            background: outerColors[summary.outer.indexOf(d)],
                          }}
                        />
                        {d.name}
                      </span>
                      <b>{fmt(d.value)} TL</b>
                      <small>{ratio(d.value, summary.gross)}</small>
                    </div>
                  ))}
              </>
            )}
            <h4>{staff ? "Ödeme durumu" : "Net tutarın dağılımı"}</h4>
            {summary.inner
              .filter((d) => d.value > 0)
              .map((d) => (
                <div key={d.name}>
                  <span>
                    <i
                      style={{ background: colors[summary.inner.indexOf(d)] }}
                    />
                    {d.name}
                  </span>
                  <b>{fmt(d.value)} TL</b>
                  <small>{ratio(d.value, summary.net)}</small>
                </div>
              ))}
          </div>
        </>
      ) : (
        <p className="monthly-empty">
          {summary.notice ||
            (summary.net === 0
              ? "Bu ay için net çalışma hacmi bulunmuyor."
              : "İade veya ödeme kayıtları bu ay için tek bir dağılım oluşturmuyor. Oran yerine tutarları inceleyin.")}
        </p>
      )}
      {!staff && (
        <div className="monthly-foot">
          <span>
            Ay içi net {supplier ? "ödeme" : "tahsilat"}
            <b>{fmt(summary.periodTotal)} TL</b>
          </span>
          <span>
            Devreden / önceki dönem borcuna ait<b>{fmt(summary.old)} TL</b>
          </span>
        </div>
      )}
      {summary.outsideCoverage > 0 && (
        <p className="calendar-hint">
          Dönem dışı ödeme / diğer mahsup: {fmt(summary.outsideCoverage)} TL
        </p>
      )}
      {summary.unassigned > 0 && (
        <p className="calendar-hint">
          Ay içinde {fmt(summary.unassigned)} TL ödemenin maaş / yemek
          bağlantısı tanımlanmamış. Ödeme bağlantılarını personel bilgilerini
          düzenleyerek belirleyin.
        </p>
      )}
      {summary.excess > 0 && (
        <p className="calendar-hint">
          Hakedişi aşan bağlı ödeme: {fmt(summary.excess)} TL
        </p>
      )}
      <p className="calendar-hint">
        {staff
          ? "Maaşla birlikte kaydedilen ödeme ve bu aya açıkça bağlanan diğer maaş / yemek ödemeleri."
          : "Yalnız seçilen aya ait çalışma hacmi. İadeler net tutardan düşülür; geçmiş borç ödemeleri ayrı gösterilir."}
      </p>
    </section>
  );
}
