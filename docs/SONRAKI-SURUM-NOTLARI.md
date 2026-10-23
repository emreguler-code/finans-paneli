# Onaylı değişiklikler — 1.8.0

23 Ekim 2026. Kullanıcının toplu uygulama ve GitHub yayını onayıyla bu maddeler 1.8.0 kapsamında kodlandı. Yayın sonucu GitHub Release ve CI kaydından doğrulanır; canlı hosting kurulumu bu çalışmanın kapsamında değildir.

1. **Bildirimler:** Zile bağlı kompakt pencere; sayfa kayması/blur yok. Gecikmiş, Bugün, Yaklaşan, Diğer grupları; aynı carinin açık tutarları özetlenir. Hedef hesaba/cariye/takibe geçiş; Esc ve dışarı tıklama. Hesaplar sağ uyarı sütunu korunur.
2. **Filtreler:** Arama alanından içeriğin üzerine açılır. Taslak Uygula/Enter ile uygulanır; Vazgeç/Esc/dışarı tıklama iptal eder. Temizle önce taslağı temizler. Hareket/rapor ekranlarında cari/etiket/tutar, hesap hareketlerinde etiket/tutar ve mevcut hesap/tarih/ekleyen seçenekleri. AJAX/fetch ve 3 karakter/300 ms arama korunur. Filtreler gerçek bakiyeyi değiştirmez.
3. **Tarih aralıkları:** Paylaşılan tüm aralık takvimleri bağlı pencere; ekran sınırına uyar, arka plan bulanmaz, içerik kaymaz. Tek gün alanlarının mevcut penceresi korunur.
4. **Cari hareketi:** Açılmış bilgi ve eylem alanı tek yüzey, iç çizgi yok; dış ayırıcı ve sol vurgu korunur.
5. **Genel kart kuralı:** Karta ait bilgi/ayar/düzenleme ikonları kendi kartı üzerinde birlikte bulunur. Liste sıralama/CSV/ekle kontrolleri kendi listesinin kapsamındadır. Yeni araç kartları da bu kurala uyar.
6. **Cari gerekçesi:** Temel cari bilgileri için opsiyonel; kim/zaman/önceki/sonraki değerler denetim geçmişinde. Finansal hareket gerekçeleri değişmedi.
7. **Tedarikçi POS:** Opsiyonel özellikler → POS Cihazı; Garanti Bonus, Akbank Axess, Yapı Kredi World çoklu seçim. Sabit kodlar garanti:bonus, akbank:axess, yapikredi:world. Tür değişiminde temizlenir; eski istemcinin göndermediği alan korunur. Otomatik ödeme/komisyon/taksit işlemi üretmez.
8. **Kampanyalar:** Kredi kartları alt menüsü. Elle tanımlanan koşullar, kaynak bağlantısı, tarih/katılım hatırlatmaları; kart/POS/tedarikçi/etiket/tutar/işlem sayısı kısıtları ve kazanç sınırları. Taksitli alışveriş tek sayılır. Beklenen ve banka tarafından verilen ödül ayrıdır. Puan TL'ye çevrilmez; finansal bakiye otomatik değiştirilmez. Tedarikçi, tutar ve etikete göre olası uygun kart karşılaştırılır; bankadan veri çekilmez.
9. **Araçlarım:** Ana menü; araç kartı, km güncellemesi, sigorta/kasko poliçe geçmişi, MTV, muayene, bakımda tarih veya km hatırlatması. Tahmini ve kesin tutar ayrımı, prim taksitleri; mevcut gerçek ödemeye bağlantı ve ödeme takvimi. Finansal hareket çoğaltılmaz; aynı ödeme başka araç kaydına yeniden bağlanamaz.

## Teknik geçiş

1.7.2 şema 7 → POS alanı şema 8 → kampanya/araç tabloları şema 9. Güncelleme yöneticiyi ve mevcut finansal kayıtları korur, yedekleme akışını kullanır. Demo yenilemesi yalnız yöneticinin açık seçimiyle kayıtları siler; yeni örnek araç/kampanyalar paketteki üretici kodundadır. Şifreler, canlı veritabanı ve config Git'e/pakete alınmaz.

Önceki sürümlerde tamamlanan Embla, ortak arama, sağ üst tarih, hesap uyarı sütunu, takvim görünümü ve kapsamlı finans demosu korunur. Kanban iptal kararı sürer.
