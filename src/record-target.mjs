// One source destination per record, independent of the summary that linked to it.
export function recordTarget(context, data) {
  const e = context.item;
  if (!e) return null;
  if (context.entity === "event") {
    if (
      context.lockedPartyId ||
      (e.party_id && !context.lockedCardId && !context.accountId)
    )
      return {
        page: "Cari hesaplar",
        record: String(context.lockedPartyId || e.party_id),
        event: String(e.id),
      };
    const cardId = context.lockedCardId || e.card_id || e.target_card_id;
    if (cardId && !context.accountId) {
      const card = data.cards.find((c) => String(c.id) === String(cardId));
      const linked = (card?.statements || []).find(
        (s) => String(s.id) === String(e.linked_id),
      );
      const statement =
        linked ||
        [...(card?.statements || [])]
          .sort((a, b) => a.cut_date.localeCompare(b.cut_date))
          .find((s) => (e.period_date || e.event_date) <= s.cut_date);
      return {
        page: "Kredi kartları",
        record: String(cardId),
        event: String(e.id),
        tab: e.scheduled
          ? "Gelecek Dönem"
          : statement
            ? "Ekstre"
            : "Dönem içi işlemler",
        statement: statement ? String(statement.id) : "",
      };
    }
    const id = context.accountId || e.account_id || e.target_id;
    return id
      ? {
          page: "Hesaplar",
          record: String(id),
          event: String(e.id),
          tab: e.scheduled ? "Gelecek dönem hareketleri" : "Hesap hareketleri",
        }
      : { page: "Tahsilat & Ödeme", event: String(e.id) };
  }
  if (context.entity === "party")
    return { page: "Cari hesaplar", record: String(e.id) };
  if (["account", "card"].includes(context.entity))
    return {
      page: context.entity === "card" ? "Kredi kartları" : "Hesaplar",
      record: String(e.id),
    };
  if (context.entity === "vehicle_record")
    return {
      page: "Araçlarım",
      record: String(e.vehicle_id),
      entry: String(e.id),
      tab: "İşlemler",
    };
  if (context.entity === "vehicle")
    return { page: "Araçlarım", record: String(e.id) };
  if (context.entity === "campaign")
    return { page: "Kampanyalar", entry: String(e.id) };
  return null;
}
