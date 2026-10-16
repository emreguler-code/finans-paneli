# Finans Paneli 1.7.1 doğrulaması

16 Ekim 2026. Sentetik verilerle izole PHP 8.3 / MariaDB 11.4 ortamında çalışıldı; canlı hosting veya üretim veritabanına bağlanılmadı.

- Üretim derlemesi ve 22 birim + 4 Sites worker testi geçti.
- Değişen arayüzde 397 Chromium kontrolü geçti; çalışma zamanı hatası yok. Genel bakış, cari hesaplar, tahsilat/ödeme, ödeme planı, hesaplar, kredi kartları, raporlar ve kullanıcılar 2540/1920/1440/768/390/320 px genişliklerinde kontrol edildi.
- Arama/kontrol hizası, tarih ve kısayolun geri gelmesi, mobil başlık eylemleri, bağımsız hesap/hareket sıralaması ve CSV kapsamları, gezinme hedefleri, gerçekleşmiş hareket ayrımı ve güncelleme ekranının güncel/eski şema durumları doğrulandı.
- Paketlenmiş hosting kurulumu/güncellemesi: 15 migrasyon/kurtarma ve 73 finans API kontrolü ile frontend/updater/font dosyaları geçti.
- Eski görsel ekran yüksekliği önbelleğiyle bile işlem penceresinin güncel ekran sınırlarında kalması doğrulandı.
- Güncelleme PHP dosyası sözdizimi kontrolünden geçti.
- npm audit: 0 güvenlik açığı.
- ZIP içeriği ve SHA-256 doğrulandı. Gerçek config, parola, yedek veya test verisi pakete alınmadı. Veritabanı şeması 7 olarak kaldı.
- Masaüstü/mobil ekran görüntüleri incelendi. Gerçek telefon veya fiziksel trackpad testi yapılmadı; dokunma Chromium emülasyonuyla kontrol edildi.

Kaynak karşılaştırmasının ayrıntıları docs/1.7.0-KAPSAM-KONTROLU.md dosyasındadır. GitHub Actions etiketli yayında testleri tekrar çalıştırır; yayın sonucu ve yüklenen ZIP özeti release-status/v1.7.1 açıklamalı etiketine kaydedilir.
