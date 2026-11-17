import { presetRange } from "./date-utils.mjs";
export const fold = (value) =>
  String(value ?? "")
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .trim();
export const selectedValues = (value) =>
  Array.isArray(value) ? value : [value];
export const matchesChoice = (selection, value, empty = ["all", "Tümü"]) =>
  empty.includes(selection) ||
  selectedValues(selection).some((s) => String(s) === String(value));
export function fieldAlias(label) {
  const s = fold(label);
  if (s === "kart / hesap") return "hesap";
  if (s === "ilgili kayit") return "kayıt";
  if (s === "kayit turu") return "tür";
  if (s.includes("en az tutar")) return "enaz";
  if (s.includes("en fazla tutar")) return "ençok";
  if (s.includes("vade durumu")) return "vadedurumu";
  if (s.includes("kapama")) return "durum";
  if (s.includes("etiket")) return "etiket";
  if (s.includes("islem") && !s.includes("tutar")) return "işlem";
  if (s.includes("ekleyen")) return "ekleyen";
  if (s.includes("tarih")) return "tarih";
  if (s.includes("arsiv")) return "arşiv";
  if (s.includes("iptal")) return "iptal";
  if (s.includes("kapsam")) return "kapsam";
  return label
    .replace(/\s*\([^)]*\)/g, "")
    .toLocaleLowerCase("tr-TR")
    .trim()
    .replace(/\s+/g, "");
}
const aliases = {
  kisi: "ekleyen",
  personel: "ekleyen",
  min: "enaz",
  max: "encok",
  enfazla: "encok",
  kapama: "durum",
  vade_durumu: "vadedurumu",
  arsiv: "arsiv",
  kategori: "kategori",
};
const canonical = (s) => aliases[fold(s)] || fold(s);
export const multiField = (f) =>
  ["etiket", "islem", "ekleyen", "cari", "hesap", "tur", "kayitturu"].includes(
    fold(fieldAlias(f.label)),
  ) && f.options?.length > 0;
export const activeField = (f) =>
  f.range
    ? Boolean(f.value?.from || f.value?.to) &&
      !(
        f.defaultRange &&
        f.value.from === f.defaultRange.from &&
        f.value.to === f.defaultRange.to
      )
    : f.check
      ? f.value !== f.empty
      : !["", "all", "Tümü", String(f.empty)].includes(String(f.value));
export function parseAmount(value) {
  const raw = String(value)
    .trim()
    .replace(/\s*TL$/i, "");
  if (!/^\d[\d.,]*$/.test(raw)) return undefined;
  let normalized = raw;
  if (raw.includes(",")) {
    if (!/^\d{1,3}(?:\.\d{3})*,\d{1,2}$|^\d+,\d{1,2}$/.test(raw))
      return undefined;
    normalized = raw.replaceAll(".", "").replace(",", ".");
  } else if (/^\d{1,3}(?:\.\d{3})+$/.test(raw))
    normalized = raw.replaceAll(".", "");
  else if (!/^\d+(?:\.\d{1,2})?$/.test(raw)) return undefined;
  const n = Number(normalized);
  return Number.isFinite(n) && n * 100 <= Number.MAX_SAFE_INTEGER
    ? String(n)
    : undefined;
}
function validDate(value) {
  const local = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  const iso = local ? `${local[3]}-${local[2]}-${local[1]}` : value;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return undefined;
  try {
    return new Date(iso + "T00:00:00Z").toISOString().slice(0, 10) === iso
      ? iso
      : undefined;
  } catch {
    return undefined;
  }
}
const presets = {
  bugun: "Bugün",
  dun: "Dün",
  "bu ay": "Bu Ay",
  "bu hafta": "Bu Hafta",
  "son 3 ay": "Son 3 Ay",
  "son 1 yil": "Son 1 Yıl",
};
function resolve(field, value, today) {
  if (field.check) {
    return ["evet", "true", "dahil", "hayir", "false", "haric"].includes(
      fold(value),
    )
      ? ["evet", "true", "dahil"].includes(fold(value))
      : undefined;
  }
  if (field.options?.length)
    return field.options.find(
      (o) => fold(o.label) === fold(value) || fold(o.value) === fold(value),
    )?.value;
  if (field.range) {
    if (presets[fold(value)]) return presetRange(presets[fold(value)], today);
    const [start, end = start] = value.split("..");
    const from = validDate(start),
      to = validDate(end);
    return from && to && from <= to ? { from, to } : undefined;
  }
  return parseAmount(value);
}
export function parseSearch(
  text,
  fields,
  { today = new Date().toLocaleDateString("sv-SE") } = {},
) {
  const filters = [],
    plain = [],
    errors = [];
  if ((text.match(/"/g) || []).length % 2)
    return {
      query: "",
      filters,
      errors: ["Tırnak içindeki arama değerini tamamlayın."],
    };
  const tokens = text.match(/[^\s:]+:(?:"[^"]*"|[^\s]*)|"[^"]*"|[^\s]+/g) || [];
  for (const token of tokens) {
    const split = token.indexOf(":");
    if (split < 0) {
      plain.push(token.replace(/^"|"$/g, ""));
      continue;
    }
    const name = token.slice(0, split),
      value = token.slice(split + 1).replace(/^"|"$/g, "");
    if (!value) {
      errors.push(name + " için değer yazın.");
      continue;
    }
    if (canonical(name) === "tutar") {
      const min = fields.find((f) => fieldAlias(f.label) === "enaz"),
        max = fields.find((f) => fieldAlias(f.label) === "ençok");
      if (!min || !max) {
        errors.push("Bu listede tutar filtresi yok.");
        continue;
      }
      let low, high;
      if (value.startsWith(">=")) {
        low = parseAmount(value.slice(2));
        high = "";
      } else if (value.startsWith("<=")) {
        low = "";
        high = parseAmount(value.slice(2));
      } else {
        const [a, b = a] = value.split("..");
        low = parseAmount(a);
        high = parseAmount(b);
      }
      if (
        low === undefined ||
        high === undefined ||
        (low !== "" && high !== "" && Number(low) > Number(high))
      )
        errors.push("Tutar aralığını kontrol edin.");
      else
        filters.push({ field: min, value: low }, { field: max, value: high });
      continue;
    }
    const field = fields.find(
      (f) => canonical(fieldAlias(f.label)) === canonical(name),
    );
    if (!field) {
      errors.push("Bilinmeyen arama alanı: " + name);
      continue;
    }
    const resolved = resolve(field, value, today);
    if (resolved === undefined)
      errors.push("Geçersiz " + field.label + " değeri: " + value);
    else filters.push({ field, value: resolved });
  }
  const valueFor = (alias) => {
    const field = fields.find((f) => fieldAlias(f.label) === alias);
    return field
      ? (filters.findLast((f) => f.field === field)?.value ?? field.value)
      : "";
  };
  const low = valueFor("enaz"),
    high = valueFor("ençok");
  if (
    low !== "" &&
    high !== "" &&
    low !== undefined &&
    high !== undefined &&
    Number(low) > Number(high) &&
    !errors.length
  )
    errors.push("En az tutar, en fazla tutardan büyük olamaz.");
  return { query: plain.join(" "), filters, errors };
}
export function searchSuggestions(text, fields, today) {
  const match = text.match(/(?:^|\s)([\p{L}\d_-]+):(?:"([^"]*)"?|(\S*))$/u),
    name = match?.[1],
    query = fold(match ? (match[2] ?? match[3] ?? "") : text),
    prefix = match ? text.slice(0, match.index).trim() : "";
  const selected = name
    ? fields.filter((f) => canonical(fieldAlias(f.label)) === canonical(name))
    : fields;
  if (!name && !query)
    return [
      ...fields.map((f) => ({
        text: fieldAlias(f.label) + ":",
        label:
          f.label +
          " · " +
          (f.range
            ? "tarih veya aralık yazın"
            : f.options?.length || f.check
              ? "değer seçin"
              : "tutar yazın"),
        hint: true,
        prefix: "",
      })),
      ...(fields.some((f) => fieldAlias(f.label) === "enaz")
        ? [
            {
              text: "tutar:",
              label: "Tutar aralığı · ör. tutar:1.000..5.000",
              hint: true,
              prefix: "",
            },
          ]
        : []),
    ];
  const items = [];
  for (const f of selected) {
    const alias = fieldAlias(f.label),
      q = ["odenmemis", "odenmeyen"].includes(query) ? "acik" : query;
    const choices = f.check
      ? [
          { value: true, label: "Evet" },
          { value: false, label: "Hayır" },
        ]
      : f.range
        ? Object.entries(presets).map(([, label]) => ({
            value: presetRange(label, today),
            label,
          }))
        : f.options || [];
    for (const option of choices) {
      if (!f.check && ["all", "Tümü"].includes(option.value)) continue;
      if (q && !fold((name ? "" : f.label + " ") + option.label).includes(q))
        continue;
      items.push({
        field: f,
        value: option.value,
        label: f.label + ": " + option.label,
        prefix,
      });
    }
    if (!choices.length || (!name && !query))
      items.push({
        text: alias + ":",
        label:
          f.label +
          " · " +
          (f.range
            ? "tarih:2026-01-01..2026-01-31"
            : choices.length
              ? "değer seçin"
              : "tutar yazın"),
        hint: true,
        prefix,
      });
  }
  if (
    !name &&
    "tutar".includes(query) &&
    fields.some((f) => fieldAlias(f.label) === "enaz")
  )
    items.push({
      text: "tutar:",
      label: "Tutar · ör. tutar:1.000..5.000",
      hint: true,
      prefix: "",
    });
  if (name && canonical(name) === "tutar")
    items.push({
      text: text,
      label: "Tutar · 1.000..5.000, >=1.000 veya <=5.000",
      hint: true,
      prefix: "",
    });
  return items.slice(0, 12);
}
