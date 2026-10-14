export const TODAY = "2026-10-09";
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
export const accountsSeed = [
  { id: "bank", name: "Günlük hesap", type: "Banka hesabı", balance: 96750 },
  {
    id: "saving",
    name: "Birikim hesabı",
    type: "Banka hesabı",
    balance: 15550,
  },
  { id: "cash", name: "Nakit kasa", type: "Kasa", balance: 12500 },
];
export const txSeed = [
  [
    "2026-10-09",
    "14:32",
    "Atlas Danışmanlık",
    "Proje ödemesi",
    18500,
    "Hizmet",
  ],
  [
    "2026-10-09",
    "11:06",
    "Ofis malzemeleri",
    "Kırtasiye ve sarf malzemesi",
    -3200,
    "Ofis",
  ],
  ["2026-10-08", "16:18", "Deniz Yapı", "Fatura tahsilatı", 24000, "Hizmet"],
  [
    "2026-10-08",
    "10:40",
    "Yıldız Tedarik",
    "Malzeme ödemesi",
    -12400,
    "Malzeme",
  ],
  [
    "2026-10-07",
    "09:15",
    "Ofis kirası",
    "Ekim ayı kira ödemesi",
    -15000,
    "Kira",
  ],
  ["2026-10-06", "15:24", "Ece Demir", "Danışmanlık ödemesi", 12500, "Hizmet"],
  [
    "2026-10-06",
    "10:10",
    "İnternet ve elektrik",
    "Aylık faturalar",
    -2800,
    "Faturalar",
  ],
  [
    "2026-10-05",
    "12:10",
    "Ulaşım giderleri",
    "Akaryakıt ve ulaşım",
    -4400,
    "Ulaşım",
  ],
  ["2026-10-03", "17:30", "Ada Tasarım", "Proje tahsilatı", 21400, "Hizmet"],
  [
    "2026-10-03",
    "13:05",
    "Ekipman alımı",
    "Çalışma ekipmanları",
    -10000,
    "Ekipman",
  ],
  ["2026-09-24", "14:10", "Eylül tahsilatı", "Önceki dönem", 42000, "Hizmet"],
  ["2026-09-18", "11:00", "Eylül giderleri", "Önceki dönem", -26700, "Ofis"],
].map(([date, time, name, desc, amount, category], id) => ({
  id,
  date,
  time,
  name,
  desc,
  amount,
  category,
  account: "bank",
  kind: amount > 0 ? "Tahsilat" : "Ödeme",
}));
export const claimsSeed = [
  {
    id: 1,
    name: "Mavi Atölye",
    amount: 8500,
    due: "2026-10-05",
    type: "alacak",
    desc: "Danışmanlık faturası",
  },
  {
    id: 2,
    name: "Atlas Danışmanlık",
    amount: 18500,
    due: "2026-10-12",
    type: "alacak",
    desc: "İkinci proje ödemesi",
  },
  {
    id: 3,
    name: "Ada Tasarım",
    amount: 21500,
    due: "2026-10-23",
    type: "alacak",
    desc: "Proje teslimi",
  },
  {
    id: 4,
    name: "Deniz Yapı",
    amount: 20000,
    due: "2026-10-30",
    type: "alacak",
    desc: "Kalan proje bedeli",
  },
  {
    id: 5,
    name: "Yıldız Tedarik",
    amount: 15000,
    due: "2026-10-13",
    type: "borç",
    desc: "Malzeme faturası",
  },
  {
    id: 6,
    name: "Teknik servis",
    amount: 3000,
    due: "2026-10-28",
    type: "borç",
    desc: "Bakım bedeli",
  },
];
export const cardsSeed = [
  {
    id: 1,
    name: "Günlük kart",
    debt: 18300,
    statement: 12300,
    limit: 100000,
    due: "2026-10-15",
  },
  {
    id: 2,
    name: "Online kart",
    debt: 6000,
    statement: 4000,
    limit: 20000,
    due: "2026-10-23",
  },
];
