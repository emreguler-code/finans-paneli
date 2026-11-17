# Finans 1.14.0 doğrulama raporu

30 Ekim 2026 · Şema 12. Gerçek hosting veya kullanıcı verisi değiştirilmeden, izole PHP/MariaDB ve Chromium ortamlarında çalıştırıldı.

| Kontrol                       | Sonuç                              |
| ----------------------------- | ---------------------------------- |
| Üretim derlemesi              | Geçti                              |
| Birim testleri                | 45 geçti                           |
| Sites worker testleri         | 4 geçti                            |
| Finansal API                  | 131 geçti                          |
| Şema/migration kurtarma       | 34 geçti                           |
| Yedekleme ve geri yükleme     | 67 geçti                           |
| Masaüstü/mobil tarayıcı       | 591 geçti; 0 çalışma zamanı hatası |
| Geniş demo çapraz kontrol     | 715 kontrol, 624 işlem, 29 hafta   |
| Demo arayüzü                  | 105 kontrol geçti                  |
| Hazır hosting paketi kurulumu | Geçti; ZIP içerikleri eşleşiyor    |

Komutlar: `npm test`, PHP sözdizimi denetimi, `npm run test:api`, `npm run test:migrations`, `npm run test:backups`, `npm run test:browser`, `npm run test:demo`, `npm run release:package`, `npm run test:package`. Paket kurulumu ayrıca temiz izole ortamda doğrulanır; yayın iş akışı tüm kontrolleri tekrar çalıştırır.

Yeni kapsam: dört tam sayfa oluşturma formu, düzenleme/işlem alt alanı, bankalar arasında arama ve özel banka kaydı, doğru bankaya program önerisi, taslak koruması, Geri/İleri/yenileme, 1,9:1 düzen, 320–1920 px içerik sınırları ve alt bar/klavye çakışmaları. Cari satış ekleme/düzenlemede bakiye/nakit etkisi ve aynı kaydın korunması arayüz üzerinden çapraz kontrol edildi. Otomatik yedeklerin sayfa açılışında oluşmaması, İstanbul 03.00 ve toplam beş kopya sınırı korunur. Önceki sürüm şema-11 yedeği yeni sürümde geri yüklendi ve finansal veriler karşılaştırıldı.

Yerel kanıtlar: API `.qa/d4a8cc59b196`, migration `.qa/784db5788f0b`, yedek `.qa/8611c8f02c5a`, tarayıcı `.qa/cda670b4b084`, demo `.qa/30b9ddb7ee0c`, paket `.qa/e7cb4b9b1211`. Tasarım değerlendirmesi kökteki design-qa.md dosyasında. `.qa` içeriği ve özel yapılandırma paketlenmez.

Sınırlar: Chromium mobil viewport ve visualViewport klavye benzetimi kullanıldı; fiziksel iOS/Android ve canlı hosting cron testi yapılmadı. Güncelleme mevcut kayıtları temizlemez; api/config.php ve özel yedek dizini korunmalı, yükleme sonrası update.php ile şema 12 güncellemesi uygulanmalıdır.
