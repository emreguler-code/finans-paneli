export const money = (n, d = 0) =>
  new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(n);
export const day = (d) =>
  new Date(d + "T12:00:00").toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
  });
