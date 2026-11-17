import { useState } from "react";
import { weekDates } from "./party-monthly.mjs";
import { shiftLabels } from "./WeekCalendar";
import { weekdays, weekStart } from "./profile-utils.mjs";
import { dateLabel } from "./DatePicker";
import { fmt } from "./ui";
export function PartyProfileFields({ form, change, data }) {
  const [planWeek, setPlanWeek] = useState(weekStart(data.today));
  const p = form.profile || {},
    set = (key, value) => change("profile", { ...p, [key]: value });
  if (form.type === "Tedarikçi")
    return (
      <fieldset className="profile-fields">
        <legend>Ziyaret günleri</legend>
        <p className="muted">
          Düzenli geliş günlerini seçin. Gerçekleşme takibi yapılmaz.
        </p>
        {weekdays.map((name, i) => (
          <label className="check-label" key={name}>
            <input
              type="checkbox"
              checked={(p.visit_days || []).includes(i + 1)}
              onChange={(e) =>
                set(
                  "visit_days",
                  e.target.checked
                    ? [...(p.visit_days || []), i + 1]
                    : (p.visit_days || []).filter((d) => d !== i + 1),
                )
              }
            />
            {name}
          </label>
        ))}
      </fieldset>
    );
  if (form.type !== "Personel") return null;
  const month = p.staff_month || data.today.slice(0, 7);
  const payments = data.events.filter(
    (e) =>
      (p.salary_payments || []).includes(e.id) ||
      (p.meal_payments || []).includes(e.id) ||
      (e.party_id === form.id &&
        !e.cancelled &&
        !e.scheduled &&
        e.event_date.startsWith(month) &&
        e.event_date <= data.today &&
        ["payment", "employee_expense"].includes(e.operation)),
  );
  return (
    <details className="cari-fold">
      <summary>Personel dönem bilgileri</summary>
      <fieldset className="profile-fields work-plan-editor">
        <legend>Çalışma takvimi</legend>
        <p className="muted">
          Tarih bazlı plan. Başka haftaya tekrarlanmaz; ücret veya devam kaydı
          oluşturmaz.
        </p>
        <label className="cari-field">
          Plan haftası
          <input
            type="date"
            value={planWeek}
            onChange={(e) => {
              if (e.target.value) setPlanWeek(weekStart(e.target.value));
            }}
          />
        </label>
        <div className="work-plan-days">
          {weekDates(planWeek).map((date, i) => (
            <label className="cari-field" key={date}>
              {weekdays[i]} · {dateLabel(date)}
              <select
                aria-label={weekdays[i] + " planı"}
                value={p.work_calendar?.[date] || ""}
                onChange={(e) => {
                  const plan = { ...(p.work_calendar || {}) };
                  if (e.target.value) plan[date] = e.target.value;
                  else delete plan[date];
                  set("work_calendar", plan);
                }}
              >
                <option value="">Plan yok</option>
                {Object.entries(shiftLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </fieldset>
      <p className="cari-hint">
        Maaş hak edişi kayıtlı maaş işlemlerinden gelir. Avans veya diğer
        ödemeler yalnız burada seçilirse ilgili kaleme sayılır; yeni finansal
        işlem oluşturulmaz.
      </p>
      <label className="cari-field">
        Ödeme ayı
        <input
          type="month"
          value={month}
          onChange={(e) =>
            change("profile", {
              ...p,
              staff_month: e.target.value,
              salary_payments: [],
              meal_payments: [],
              meal_due_cents: 0,
            })
          }
        />
      </label>
      <label className="cari-field">
        Aylık yemek ücreti (TL)
        <input
          type="number"
          min="0"
          step="0.01"
          value={(p.meal_due_cents || 0) / 100}
          onChange={(e) =>
            change("profile", {
              ...p,
              staff_month: month,
              meal_due_cents: Math.round(Number(e.target.value) * 100),
            })
          }
        />
      </label>
      {[
        ["salary_payments", "Maaş / avans ödemeleri"],
        ["meal_payments", "Yemek ödemeleri"],
      ].map(([key, label]) => (
        <fieldset className="profile-fields" key={key}>
          <legend>{label}</legend>
          {payments.length ? (
            payments.map((e) => (
              <label className="check-label" key={e.id}>
                <input
                  type="checkbox"
                  checked={(p[key] || []).includes(e.id)}
                  onChange={(event) =>
                    change("profile", {
                      ...p,
                      staff_month: month,
                      [key]: event.target.checked
                        ? [...(p[key] || []), e.id]
                        : (p[key] || []).filter((id) => id !== e.id),
                    })
                  }
                />
                <span>
                  {dateLabel(e.event_date)} · {e.description || e.kind}
                  <small>
                    {fmt(e.amount_cents)} TL
                    {e.cancelled ? " · İptal edildi, özete katılmaz" : ""}
                    {e.party_id !== form.id
                      ? " · Cari değişmiş, özete katılmaz"
                      : ""}
                  </small>
                </span>
              </label>
            ))
          ) : (
            <p className="muted">Bu ay seçilebilecek gerçekleşmiş ödeme yok.</p>
          )}
        </fieldset>
      ))}
      <label className="cari-field">
        Haftalık izin · hafta başlangıcı
        <input
          type="date"
          value={p.leave_week || weekStart(data.today)}
          onChange={(e) => set("leave_week", e.target.value)}
        />
      </label>
      <p className="muted">Pazartesi tarihini girin. Yıllık izin değildir.</p>
      {[
        ["leave_used", "Kullanılan gün"],
        ["leave_total", "Haftalık hak (gün)"],
      ].map(([key, label]) => (
        <label className="cari-field" key={key}>
          {label}
          <input
            type="number"
            min="0"
            max="7"
            step="0.5"
            value={p[key] ?? ""}
            onChange={(e) =>
              change("profile", {
                ...p,
                leave_week: p.leave_week || weekStart(data.today),
                [key]: e.target.value === "" ? null : Number(e.target.value),
              })
            }
          />
        </label>
      ))}
    </details>
  );
}
