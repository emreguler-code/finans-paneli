export function istanbulDay(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (key) => parts.find((p) => p.type === key).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
