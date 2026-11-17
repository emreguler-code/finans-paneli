# 1.22.0 — Aramadan filtreleme, başlıktan sıralama

- Ayrı filtre formu ve açma oku kaldırıldı. Tüm filtreler arama komutları, öneriler ve kaldırılabilir çiplerle yönetilir; tarih, TL aralığı, vade, arşiv ve iptal dahil.
- Sıralama ikonu ve penceresi kaldırıldı. Sütun başlığı sıralar, tekrar tıklama yönü değiştirir; yalnız etkin başlıkta yön oku görünür. Tüm sonuçlar sıralanır, kayıtların işlem sonrası bakiyeleri korunur.
- Cari dizinde arama ve CSV aynı satırda hizalanır. Genel bakış panel aralıkları ve yaklaşan ödemelerde tutar/TL satırı düzeltildi.
- Windows Firefox/Chromium ve Linux Chromium/WebKit/Firefox kontrolleri, gerçek PHP/MariaDB akışları, API, migrasyon, yedekleme, demo mutabakatı ve ZIP kurulumu başarılı.

Şema 12 ve mali model korunur. Hosting ZIP'i mevcut api/config.php korunarak yüklenir; canlı hosting'e otomatik kurulum yapılmaz. Ayrıntılar docs/SURUM-1.22.0.md ve docs/TEST-RAPORU-1.22.0.md.

---

# 1.21.0 — Yerleşim ve kod sağlığı

- Cari, hesap/kart ve ortak listelerde ana/yardımcı sütun geçişleri tablonun kullanılabilir genişliğiyle uyumlu hale getirildi.
- Arama ikonlarının dikey hizası, filtre etiketlerinin harf harf bölünmesi ve genişleyen arama alanları düzeltildi.
- Ek işlem alanları tüm form genişliğini kullanır; satır içi kaydet/iptal ikonları genişlemez. Son ay bakiyesine kaydırarak erişim doğrulanır.
- Sürüm bazlı iki CSS yama dosyası kaldırılıp bileşen sahiplerine ayrıldı; kullanılmayan import/değişkenler ve eski filtre kodu temizlendi.
- ESLint, Stylelint, biçim ve bağımlılık açık denetimi eklendi; Vite güvenlik yaması uygulandı.
- Windows Firefox/Chromium, Linux Chromium/WebKit/Firefox kabulü, finansal API, migrasyon, yedekleme, demo mutabakatı ve ZIP kurulumu geçti.

Şema 12 ve mali model değişmedi. Mevcut api/config.php korunarak hosting ZIP'i ile güncellenir; canlı hosting'e otomatik kurulum yapılmaz. Ayrıntılar docs/SURUM-1.21.0.md ve docs/TEST-RAPORU-1.21.0.md.

---

# Finans Paneli 1.20.0

Onaylanan son notlar ve uygun ortak davranışlar cari dışındaki bölümlere uygulandı. Arama/filtre aynı çubukta öneriler ve kaldırılabilir etiketlerle çalışır. Finansal hareketler işlem türü dahil kendi satırında düzenlenir. Son 30 hareket gösterilir, önceki kayıtlar sayfa numarası olmadan konum korunarak yüklenir. Aktif satırda iki satırlı tek ayrıntılı tarih vardır.

Cari ve banka ay satırları devreden/artış/azalış/Net bakiyeyi gösterir; filtreler gerçek ay sonunu değiştirmez. Gizli işlem girişi içerikte boşluk bırakmaz. Banka/kart/ödeme girişleri aynı varsayılan form ve yüzer + davranışını paylaşır. Ekstre, rapor, araç ve takvim kendi finansal anlamlarını korur.

Şema 12; gerçek veri/hesaplama modeli değişmez. [Bölüm bazında analiz ve kapsam](SURUM-1.20.0.md). GitHub yayını hosting kurulumu değildir.

