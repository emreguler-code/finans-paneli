# Tasarım bileşen haritası

Bu belge kodda hangi parçanın nerede olduğunu gösterir; yeni tasarım kuralları tanımlamaz. Tek sözleşme [TASARIM-SOZLESMESI.md](TASARIM-SOZLESMESI.md).

| Sorumluluk                        | Kaynak                                                |
| --------------------------------- | ----------------------------------------------------- |
| Kabuk ve içerik kenarları         | AppShell.jsx, app-shell.css, layout-tokens.css        |
| Renk/ölçü/tipografi rolleri       | theme.css, tokens.css                                 |
| Sayfa kimliği ve metrik grubu     | PageLayout.jsx, PartyHeader.jsx                       |
| Form, zorunluluk, hata odağı      | EntryForm.jsx                                         |
| Taslak ve terk etme koruması      | EntrySurface.jsx                                      |
| Genel seçenek menüsü              | SelectControl.jsx, Radix Select                       |
| Serbest etiket ve banka araması   | TagInput.jsx, BankSelect.jsx                          |
| Finansal giriş ve etki özeti      | PartyEntryForm.jsx, EventForm.jsx                     |
| Kimlik/ayar kayıtları             | EntityDialog.jsx, TrackingDialog.jsx                  |
| Form ızgarası ve genişlik rolleri | inline-editor.css; data-field-width short/normal/wide |
| Tarih, saat ve bağlı katmanlar    | DatePicker.jsx, FloatingPanel.jsx                     |
| Bağlamsal haftalık takvim         | WeekCalendar.jsx, useCurrentDay.jsx                   |
| Liste araçları ve çipler          | SmartSearch.jsx, SortHeader.jsx                       |
| Uyarı/son hareket ve boş durum    | ActivityPanels.jsx, context.css                       |

Kodda ortak bileşeni değiştiren karar sözleşmeyle birlikte güncellenir. Yeni sayfa kendi bağımsız ölçü sistemini üretmez. Aynı primitive bütün görevlerin aynı alanlarını taşıması anlamına gelmez.
