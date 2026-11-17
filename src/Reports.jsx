import { SummaryBar } from "./PageLayout";
import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { fmt, tone } from "./ui";
import { dateLabel } from "./DatePicker";
import { weekStart } from "./list-utils.mjs";
export function reportTotals(events) {
  const active = events.filter((e) => !e.cancelled);
  return {
    incoming: active.reduce((s, e) => s + Math.max(0, e.cash_effect || 0), 0),
    outgoing: active.reduce((s, e) => s - Math.min(0, e.cash_effect || 0), 0),
    card: active.reduce(
      (s, e) =>
        s +
        (e.card_id &&
        !["card_payment", "cash_advance", "card_transfer"].includes(e.operation)
          ? Math.max(0, e.card_effect || 0)
          : 0),
      0,
    ),
  };
}
export function Reports({ events, data, onDay, selectedDay, onClearDay }) {
  const [group, setGroup] = useState("Günlük");
  const { incoming, outgoing, card } = reportTotals(events);
  const buckets = new Map();
  events
    .filter((e) => !e.cancelled && e.cash_effect)
    .forEach((e) => {
      const d = group === "Haftalık" ? weekStart(e.event_date) : e.event_date;
      if (!buckets.has(d)) buckets.set(d, { date: d, Giriş: 0, Çıkış: 0 });
      const row = buckets.get(d);
      row[e.cash_effect > 0 ? "Giriş" : "Çıkış"] +=
        Math.abs(e.cash_effect) / 100;
    });
  const chart = [...buckets.values()].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const distributions = (key) => {
    const totals = new Map();
    events
      .filter((e) => !e.cancelled && e.cash_effect)
      .forEach((e) => {
        const name = e[key] || "Genel";
        totals.set(name, (totals.get(name) || 0) + e.cash_effect);
      });
    return [...totals].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  };
  return (
    <>
      <SummaryBar
        className="report-metrics"
        label="Seçili dönem özeti"
        items={[
          ["Giren para", incoming],
          ["Çıkan para", outgoing],
          ["Net nakit hareketi", incoming - outgoing],
          ["Kartla yapılan ödemeler", card],
        ].map(([label, n]) => ({
          label,
          value: (
            <span
              className={
                "cari-total " +
                (label === "Net nakit hareketi" ? "brand-text" : "")
              }
            >
              {fmt(n)} <small>TL</small>
            </span>
          ),
        }))}
      >
        <p className="summary-note">
          Virman nakit akışına katılmaz. Kartla yapılan ödemeler ayrı
          gösterilir; kart borcu ödemesi gerçekleştiğinde nakit çıkışı bir kez
          sayılır.
        </p>
      </SummaryBar>
      <section className="panel report-flow">
        <div className="panel-heading">
          <div>
            <h2>Nakit akışı</h2>
            <p>Bir sütuna tıklayarak hareketleri incele.</p>
          </div>
          <select
            aria-label="Grafik dönemi"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            <option>Günlük</option>
            <option>Haftalık</option>
          </select>
        </div>
        {chart.length ? (
          <div className="report-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chart}
                onClick={(s) => {
                  const row =
                    s?.activePayload?.[0]?.payload ||
                    chart[s?.activeTooltipIndex];
                  if (row) onDay(row.date, group);
                }}
              >
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => dateLabel(d)}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  width={58}
                  tickFormatter={(n) =>
                    n >= 1000
                      ? new Intl.NumberFormat("tr-TR", {
                          maximumFractionDigits: 1,
                        }).format(n / 1000) + " bin"
                      : n
                  }
                />
                <Tooltip
                  labelFormatter={(d) => dateLabel(d)}
                  formatter={(v) => [Number(v).toLocaleString("tr-TR") + " TL"]}
                />
                <Legend />
                <Bar
                  dataKey="Giriş"
                  fill="var(--brand)"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="Çıkış"
                  fill="var(--muted)"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="empty">Bu kapsamda nakit hareketi yok.</p>
        )}
        {selectedDay && (
          <button className="text-button pad" onClick={onClearDay}>
            {selectedDay.label} · Gün filtresini kaldır
          </button>
        )}
      </section>
      <details className="panel report-breakdown">
        <summary>Hesap ve etiket dağılımları</summary>
        <div className="report-distributions">
          {[
            ["Hesap", distributions("account_name")],
            ["Etiket", distributions("tag")],
          ].map(([title, rows]) => (
            <section key={title}>
              <h2>{title} · Net nakit</h2>
              {rows.map(([name, n]) => (
                <div className="finance-due" key={name}>
                  <span>{name}</span>
                  <strong className={tone(n)}>{fmt(n)} TL</strong>
                </div>
              ))}
              {!rows.length && <p>Kayıt yok.</p>}
            </section>
          ))}
        </div>
      </details>
      <details className="panel report-breakdown">
        <summary>Güncel cari bakiyeler ve avanslar</summary>
        <p className="pad muted">
          Bugünkü açık bakiyeler. Seçilen dönemin kapanış bakiyesi değildir.
        </p>
        {[
          [
            "Açık alacak",
            data.claims
              .filter((c) => c.type === "alacak")
              .reduce((s, c) => s + c.amount_cents, 0),
          ],
          [
            "Açık borç",
            data.claims
              .filter((c) => c.type === "borç")
              .reduce((s, c) => s + c.amount_cents, 0),
          ],
          [
            "Verilen avans",
            data.advances
              .filter((a) => a.kind === "Verilen avans")
              .reduce((s, a) => s + a.amount_cents, 0),
          ],
          [
            "Alınan avans",
            data.advances
              .filter((a) => a.kind === "Alınan avans")
              .reduce((s, a) => s + a.amount_cents, 0),
          ],
        ].map(([k, n]) => (
          <div className="finance-due" key={k}>
            <span>{k}</span>
            <strong>{fmt(n)} TL</strong>
          </div>
        ))}
      </details>
    </>
  );
}
