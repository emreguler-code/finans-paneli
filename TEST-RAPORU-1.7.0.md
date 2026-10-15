# Finans Paneli 1.7.0 doğrulaması

15 Ekim 2026. Node.js 24.22.0; PHP 8.3 ve MariaDB 11.4 üzerinde izole, sentetik verilerle doğrulandı. Canlı hosting veya üretim veritabanına bağlanılmadı.

| Kontrol | Sonuç |
| --- | --- |
| Temiz npm ci ve üretim derlemesi | Başarılı |
| Birim / Sites worker testleri | 22 + 4 geçti |
| Finans API entegrasyonu | 73 geçti |
| Migrasyon / kesinti sonrası kurtarma | 15 geçti |
| Derlenmiş arayüzde Chromium kabul testleri | 145 geçti; çalışma zamanı hatası yok |
| Paketlenmiş hosting kurulum/güncelleme testi | 73 API kontrolü, migrasyon/kurtarma ve frontend/updater/font dosya kontrolleri geçti |
| PHP sözdizimi | 8 dosya geçti |
| npm audit | 0 güvenlik açığı |
| ZIP ve SHA-256 | Doğrulandı |

Ekranlar 1440, 768, 390 ve 320 px genişliklerinde kontrol edildi. Ortak aramanın uygulanmayı beklemesi, Esc ile iptal, sayfalara ayrı arama hafızası, kullanıcı filtreleri, hesap/hareket kapsamı, gerçek bakiyenin aramadan etkilenmemesi, fare sürükleme ve emüle dokunma, kart sığması, 4/2/1 rapor sütunları ve büyük tutarların bölünmemesi doğrulandı. Takvimde gün seçimi, haftalık/aylık geçişte tarih korunması, altı haftalı ay, mobil ayrıntı alanı ve arama genişliğinde filtre paneli kontrol edildi. Genel bakış ve diğer sayfalarda ekle düğmesi 44 × 44 px olarak doğrulandı.

Masaüstü takvim, seçili gün paneli, mobil hesaplar ve filtre ekranları otomatik test ekran görüntülerinden incelendi. Test çıktıları `.qa/` altında tutulur ve sürüm paketine girmez. Gerçek iOS/Android cihaz veya fiziksel trackpad testi yapılmadı; dokunma Chromium emülasyonuyla doğrulandı.

Veritabanı şeması 7'dir; bu sürüm yeni migrasyon eklemez. Yönetici ve işlem verilerini sıfırlayan bir işlem eklenmedi. Hosting paketi yerel config, şifre, çalışma zamanı verileri ve test fixture'larını içermez. Embla ve Inter lisansları pakete dahildir.

GitHub yayını `v1.7.0` etiketiyle mevcut Hosting release iş akışından yapılır. Sunucudaki test ve paket yükleme sonucu `release-status/v1.7.0` açıklamalı etikette, iş akışı bağlantısı ve yayınlanan varlıklarla birlikte kaydedilir.
