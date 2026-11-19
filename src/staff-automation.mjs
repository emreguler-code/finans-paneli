export function missingAccruals(data) {
  const month = data.today.slice(0, 7);
  const active = (data.parties || []).filter(
    (p) => p.active && p.type === "Personel",
  );
  const due = Array.isArray(data.staff_accrual_plan)
    ? data.staff_accrual_plan.flatMap((item) => {
        const party = active.find((p) => Number(p.id) === Number(item.party));
        return party
          ? [{ party, operation: item.operation, amount: item.cents }]
          : [];
      })
    : active
        .filter(
          (p) =>
            p.profile?.automation_start_month &&
            p.profile.automation_start_month <= month,
        )
        .flatMap((p) =>
          ["salary", "meal"].flatMap((operation) => {
            const amount =
              p.profile[
                operation === "salary" ? "salary_cents" : "meal_monthly_cents"
              ] || 0;
            return amount > 0 ? [{ party: p, operation, amount }] : [];
          }),
        );
  // A cancelled accrual still owns its period: cron never silently recreates it.
  return due.filter(
    (item) =>
      !data.events.some(
        (e) =>
          Number(e.party_id) === Number(item.party.id) &&
          e.operation === item.operation &&
          e.automation_period === month &&
          !e.scheduled,
      ),
  );
}

export function staffAccrualAlerts(
  data,
  time = new Date().toLocaleTimeString("en-GB", {
    hour12: false,
    timeZone: "Europe/Istanbul",
  }),
) {
  const deadline = data.today.slice(0, 7) + "-03";
  if (data.today < deadline || (data.today === deadline && time < "12:00:00"))
    return [];
  const missing = missingAccruals(data);
  return missing.length
    ? [
        {
          id: "staff-accrual-" + data.today.slice(0, 7),
          page: "Cari hesaplar",
          level: "danger",
          date: deadline,
          partyId: missing[0].party.id,
          title: "Aylık personel hakedişleri tamamlanamadı",
          detail:
            missing.length +
            " maaş/yemek kalemi eksik. Cron çalışmasını kontrol edin; aynı dönem için kayıtları tekrar oluşturmayın.",
        },
      ]
    : [];
}
