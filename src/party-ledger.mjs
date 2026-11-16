// Display projections only: the API remains the authority for financial effects.
export function partyBalanceLabel(party) {
  const balance = Number(party.balance_cents) || 0;
  if (!balance) return 'Hesap dengede';
  const subject = {'Tedarikçi': ['Tedarikçiden alacağımız', 'Tedarikçiye borcumuz'], 'Müşteri': ['Müşteriden alacağımız', 'Müşteriye borcumuz'], 'Personel': ['Personelden alacağımız', 'Personele borcumuz']}[party.type];
  return subject ? subject[balance > 0 ? 0 : 1] : balance > 0 ? 'Alacağımız' : 'Borcumuz';
}

export function listedPartyEffect(events) {
  return events.filter(e => !e.cancelled && !e.scheduled).reduce((sum, e) => sum + (Number(e.party_effect) || 0), 0);
}
