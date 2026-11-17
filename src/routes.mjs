export const routePaths = {
  "Genel bakış": "ozet",
  "Cari hesaplar": "cariler",
  "Tahsilat & Ödeme": "odemeler",
  "Ödeme Planı": "odeme-plani",
  Hesaplar: "hesaplar",
  "Kredi kartları": "kartlar",
  Kampanyalar: "kampanyalar",
  Araçlarım: "araclar",
  Raporlar: "raporlar",
  Kullanıcılar: "kullanicilar",
  Bildirimler: "bildirimler",
  Arama: "arama",
  Ayarlar: "ayarlar",
};
export function readRoute(hash = "") {
  try {
    const [path, query = ""] = hash.replace(/^#\/?/, "").split("?");
    const [slug, record] = path.split("/").map(decodeURIComponent);
    const page =
        Object.keys(routePaths).find((p) => routePaths[p] === slug) ||
        "Genel bakış",
      p = new URLSearchParams(query);
    return {
      page,
      record: record || "",
      tab: p.get("tab") || "",
      event: p.get("islem") || "",
      q: p.get("q") || "",
      category: p.get("kategori") || "all",
      source: p.get("kaynak") || "all",
      statement: p.get("ekstre") || "",
      entry: p.get("kayit") || "",
    };
  } catch {
    return {
      page: "Genel bakış",
      record: "",
      tab: "",
      event: "",
      q: "",
      category: "all",
      source: "all",
    };
  }
}
export function routeHash(r) {
  const p = new URLSearchParams();
  for (const [key, name] of [
    ["tab", "tab"],
    ["event", "islem"],
    ["q", "q"],
    ["category", "kategori"],
    ["source", "kaynak"],
    ["statement", "ekstre"],
    ["entry", "kayit"],
  ])
    if (r[key] && r[key] !== "all") p.set(name, r[key]);
  return (
    "#/" +
    (routePaths[r.page] || "ozet") +
    (r.record ? "/" + encodeURIComponent(r.record) : "") +
    (p.size ? "?" + p.toString() : "")
  );
}
