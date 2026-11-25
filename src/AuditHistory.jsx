import { operations } from "./operations.mjs";
import { dateLabel } from "./DatePicker";
import { useState, useEffect } from "react";
import { api } from "./api";
import { vehicleTypes, rewardTypes } from "./tracking-utils.mjs";
import { fmt, roleName } from "./ui";
import { bankName, PROGRAMS, POS_PROGRAMS } from "./BankCards";
const fieldLabels = {
  salary_cents: "Aylık maaş",
  meal_monthly_cents: "Aylık yemek",
  automation_start_month: "Hakediş başlangıç ayı",
  visit_days: "Ziyaret günleri",
  plate: "Plaka",
  owner: "Ruhsat sahibi",
  vin: "Şasi numarası",
  year: "Model yılı",
  km: "Kilometre",
  km_updated: "Kilometre güncellemesi",
  company: "Şirket / servis",
  policy_no: "Poliçe no",
  vehicle_id: "Araç",
  date: "İşlem tarihi",
  end_date: "Bitiş tarihi",
  start_date: "Başlangıç tarihi",
  next_date: "Sonraki bakım",
  next_km: "Sonraki bakım kilometresi",
  estimated: "Tahmini tutar",
  reminder_days: "Hatırlatma günü",
  installments: "Ödeme planı",
  payment_events: "Bağlı ödemeler",
  participation: "Katılım",
  join_by: "Katılım son günü",
  reward_type: "Kazanç türü",
  reward_value: "Kazanç değeri",
  reward_mode: "Kazanç hesabı",
  per_tx_cap: "İşlem başı üst sınır",
  total_cap: "Toplam üst sınır",
  min_spend_cents: "Asgari tutar",
  required_count: "Gerekli işlem",
  extra_installments: "Ek taksit",
  defer_days: "Erteleme günü",
  card_ids: "Geçerli kartlar",
  party_ids: "Tedarikçiler",
  tags: "Etiketler",
  source_url: "Kaynak",
  campaign_id: "Kampanya",
  event_id: "İşlem",
  received: "Alınan kazanç",
  confirmed: "Kazanç verildi",
  pos_programs: "POS Cihazı",
  operation: "İşlem",
  tag: "Etiket",
  settled_cents: "Peşin tutar",
  excess_payment_cents: "Eski borca ek ödeme",
  period_date: "Kart dönemi",
  scheduled: "Planlanan işlem",
  payment_purpose: "Ödeme amacı",
  return_mode: "İade yöntemi",
  total_cents: "Ekstre toplamı",
  cut_date: "Hesap kesimi",
  kind: "İşlem yönü",
  amount_cents: "Tutar",
  event_date: "İşlem tarihi",
  event_time: "Saat",
  maturity_date: "Hesap vade sonu",
  due_date: "Vade",
  party_id: "Cari",
  account_id: "Hesap",
  target_id: "Hedef hesap",
  card_id: "Kart",
  direction: "Bakiye yönü",
  description: "Açıklama",
  category: "Kategori",
  document_no: "Belge no",
  cancelled: "İptal",
  name: "Ad",
  title: "Unvan",
  type: "Tür",
  phone: "Telefon",
  email: "E-posta",
  tax_no: "Vergi no",
  tax_office: "Vergi dairesi",
  address: "Adres",
  notes: "Notlar",
  active: "Etkin",
  short_name: "Kısa ad",
  username: "Kullanıcı adı",
  role: "Rol",
  limit_cents: "Limit",
  due: "Son ödeme",
  statement_date: "Hesap kesim tarihi",
  cut_day: "Kesim günü",
  last_four: "Son dört hane",
  bank_code: "Banka",
  program_code: "Kart programı",
  network_code: "Ödeme ağı",
  bank: "Banka",
  iban: "IBAN",
  holder: "Hesap sahibi",
  opening_cents: "Açılış",
  opening_debt_cents: "Açılış borcu",
  credit_limit_cents: "KMH limiti",
  daily_interest_rate: "Günlük faiz oranı (%)",
  password_changed: "Parola değiştirildi",
};
function auditValue(k, v, data) {
  if (k.startsWith("work_calendar:"))
    return (
      {
        morning: "Sabah",
        evening: "Akşam",
        weekly_leave: "Haftalık izin",
        annual_leave: "Yıllık izin",
        sick_leave: "Hastalık izni",
      }[v] || "Plan yok"
    );
  if (k === "visit_days")
    return (
      (v || [])
        .map(
          (n) =>
            [
              "Pazartesi",
              "Salı",
              "Çarşamba",
              "Perşembe",
              "Cuma",
              "Cumartesi",
              "Pazar",
            ][n - 1],
        )
        .join(", ") || "Tanımlanmadı"
    );
  if (k === "operation") return operations[v] || "Diğer işlem";
  if (k === "return_mode")
    return v === "later" ? "Sonra öde / tahsil et" : "Cari hesaptan düş";
  if (k === "scheduled") return Number(v) ? "Planlı" : "Gerçekleşmiş";
  if (["event_date", "period_date", "due_date", "date"].includes(k))
    return dateLabel(v) || "—";
  if (k === "type" && vehicleTypes[v]) return vehicleTypes[v];
  if (k === "reward_type") return rewardTypes[v] || v;
  if (k === "participation")
    return (
      {
        required: "Katılım gerekiyor",
        joined: "Katıldım",
        not_required: "Katılım gerekmiyor",
      }[v] || "—"
    );
  if (["estimated", "confirmed"].includes(k)) return v ? "Evet" : "Hayır";
  if (["card_ids", "party_ids", "payment_events"].includes(k)) {
    const source =
      k === "card_ids"
        ? data?.cards
        : k === "party_ids"
          ? data?.parties
          : data?.events;
    return (
      (Array.isArray(v) ? v : [])
        .map(
          (id) =>
            source?.find((r) => r.id === id)?.name ||
            source?.find((r) => r.id === id)?.description ||
            id,
        )
        .join(", ") || "Seçilmedi"
    );
  }
  if (k === "tags") return (v || []).join(", ") || "Tümü";
  if (k === "installments")
    return (
      (v || [])
        .map((r) => r.date + " · " + fmt(r.amount_cents) + " TL")
        .join("; ") || "Yok"
    );
  if (k === "pos_programs") {
    let selected = [];
    try {
      selected = Array.isArray(v) ? v : JSON.parse(v || "[]");
    } catch {
      /* Optional browser storage/response parsing may be unavailable. */
    }
    return (
      selected
        .map(
          (code) =>
            POS_PROGRAMS.find((option) => option.code === code)?.label || code,
        )
        .join(", ") || "Seçilmedi"
    );
  }
  if (k === "bank_code") return bankName(v) || "Belirtilmedi";
  if (k === "program_code") return PROGRAMS[v] || "Yok";
  if (k === "network_code")
    return (
      { visa: "Visa", mastercard: "Mastercard", troy: "Troy" }[v] ||
      "Belirtilmedi"
    );
  if (v === null || v === undefined) return "—";
  if (k.endsWith("_cents")) return fmt(Number(v)) + " TL";
  if (k === "role") return roleName[v] || v;
  if (["cancelled", "password_changed", "statement_needs_review"].includes(k))
    return Number(v) ? "Evet" : "Hayır";
  if (k === "active") return Number(v) ? "Aktif" : "Pasif";
  const rows =
    k === "party_id"
      ? data?.parties
      : k === "card_id"
        ? data?.cards
        : ["account_id", "target_id"].includes(k)
          ? data?.accounts
          : null;
  if (rows)
    return rows.find((x) => String(x.id) === String(v))?.name || String(v);
  return String(v);
}
export function AuditHistory({ entity, id, data }) {
  const [logs, setLogs] = useState(null),
    [err, setErr] = useState("");
  useEffect(() => {
    const c = new AbortController();
    api("audit", undefined, { entity, id }, c.signal)
      .then((r) => setLogs(r.logs))
      .catch((e) => {
        if (e.name !== "AbortError") setErr(e.message);
      });
    return () => c.abort();
  }, [entity, id]);
  return (
    <div className="audit-history">
      <h3>Değişiklik geçmişi</h3>
      {err && <p role="alert">{err}</p>}
      {logs === null && !err && <p>Yükleniyor…</p>}
      {logs?.length === 0 && (
        <p>
          Önceki sürümden aktarılan kayıt; geçmiş düzenleme bilgisi bulunmuyor.
        </p>
      )}
      {logs?.map((l) => {
        const expand = (raw) => {
          const value = JSON.parse(raw) || {};
          const profile = value.profile_json
            ? JSON.parse(value.profile_json)
            : {};
          const calendar = Object.fromEntries(
            Object.entries(profile.work_calendar || {}).map(([date, shift]) => [
              "work_calendar:" + date,
              shift,
            ]),
          );
          return {
            ...profile,
            ...calendar,
            ...(value.data_json ? JSON.parse(value.data_json) : {}),
            ...value,
          };
        };
        const before = expand(l.before_json),
          after = expand(l.after_json);
        return (
          <section key={l.id}>
            <strong>
              {{
                create: "Oluşturuldu",
                edit: "Değiştirildi",
                cancel: "İptal edildi",
                restore: "Geri açıldı",
              }[l.operation] || l.operation}{" "}
              · {l.actor_name}
            </strong>
            <small>
              {new Date(
                l.created_at.replace(" ", "T") +
                  (/[Z+]$|[+-]\d\d:\d\d$/.test(l.created_at) ? "" : "+03:00"),
              ).toLocaleString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Europe/Istanbul",
              })}
            </small>
            {l.reason && <p>Gerekçe: {l.reason}</p>}
            {l.operation !== "create" && (
              <dl>
                {Object.keys({ ...before, ...after })
                  .filter(
                    (k) =>
                      (fieldLabels[k] || k.startsWith("work_calendar:")) &&
                      !(k === "kind" && before.operation === after.operation) &&
                      !(k === "category" && after.tag) &&
                      !(
                        k === "period_date" &&
                        before.period_date === before.event_date &&
                        after.period_date === after.event_date
                      ) &&
                      JSON.stringify(before[k] ?? "") !==
                        JSON.stringify(after[k] ?? ""),
                  )
                  .map((k) => (
                    <div key={k}>
                      <dt>
                        {fieldLabels[k] ||
                          "Çalışma · " +
                            dateLabel(k.slice("work_calendar:".length))}
                      </dt>
                      <dd>
                        <span>{auditValue(k, before[k], data)}</span> →{" "}
                        <strong>{auditValue(k, after[k], data)}</strong>
                      </dd>
                    </div>
                  ))}
              </dl>
            )}
          </section>
        );
      })}
    </div>
  );
}
