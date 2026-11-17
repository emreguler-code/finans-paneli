import { CalendarDays } from "lucide-react";
import { weekDates } from "./party-monthly.mjs";
import { weekdays } from "./profile-utils.mjs";
const short = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pa"];
export const shiftLabels = {
  morning: "Sabah",
  evening: "Akşam",
  weekly_leave: "Haftalık izin",
  annual_leave: "Yıllık izin",
  sick_leave: "Hastalık izni",
};
export function WeekCalendar({ party, data }) {
  const staff = party.type === "Personel",
    supplier = party.type === "Tedarikçi";
  const dates = weekDates(data.today),
    plan = party.profile?.work_calendar || {};
  const posted = new Set(
    data.events
      .filter(
        (e) =>
          e.party_id === party.id &&
          !e.cancelled &&
          !e.scheduled &&
          e.event_date <= data.today,
      )
      .map((e) => e.event_date),
  );
  const title = staff
    ? "Çalışma takvimi"
    : supplier
      ? "Ziyaret günleri"
      : "Alışveriş günleri";
  return (
    <section className="week-section">
      <h3>
        <CalendarDays size={17} />
        {title}
      </h3>
      <p className="week-period">
        {new Date(dates[0] + "T12:00:00Z").toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          timeZone: "UTC",
        })}{" "}
        –{" "}
        {new Date(dates[6] + "T12:00:00Z").toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        })}
      </p>
      <div className="week-calendar" aria-label={title}>
        {dates.map((date, i) => {
          const status = staff
            ? plan[date] || ""
            : supplier
              ? (party.profile?.visit_days || []).includes(i + 1)
                ? date < data.today
                  ? "past-visit"
                  : "visit"
                : ""
              : posted.has(date)
                ? "visit"
                : "";
          const label = staff
            ? shiftLabels[status] || "Plan yok"
            : status
              ? supplier
                ? "Planlı ziyaret"
                : "Cari işlem var"
              : "İşaretli gün yok";
          return (
            <div
              key={date}
              className={
                "week-day " + status + (date === data.today ? " is-today" : "")
              }
              title={weekdays[i] + ": " + label}
              aria-label={
                weekdays[i] +
                " " +
                date +
                " · " +
                label +
                (date === data.today ? " · Bugün" : "")
              }
            >
              <span>{short[i]}</span>
              <strong>{Number(date.slice(-2))}</strong>
              <small>
                {status === "annual_leave" ? (
                  "Yıllık"
                ) : status === "sick_leave" ? (
                  "Hastalık"
                ) : status === "weekly_leave" ? (
                  "İzin"
                ) : (
                  <span className="day-dot" />
                )}
              </small>
            </div>
          );
        })}
      </div>
      {staff ? (
        <div className="week-legend" aria-label="Takvim açıklaması">
          <span>
            <i className="morning" />
            Sabah
          </span>
          <span>
            <i className="evening" />
            Akşam
          </span>
          <span>
            <i className="weekly_leave" />
            Haftalık izin
          </span>
          <span>
            <i className="annual_leave" />
            Yıllık/Hastalık
          </span>
          <span>
            <i className="is-today" />
            Bugün
          </span>
        </div>
      ) : (
        <p className="calendar-hint">
          {supplier
            ? "Planlı ziyaretler · Geçmiş günler pasif gösterilir."
            : "Gerçekleşmiş cari işlemlerin günleri."}
        </p>
      )}
    </section>
  );
}
