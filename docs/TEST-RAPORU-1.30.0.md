# 1.30.0 doğrulama raporu

26 Kasım 2026. Kaynak değişiklikleri tasarım/ortak arayüz kapsamındadır; API/PHP/şema değiştirilmedi. Yerel inceleme sentetik verilerle ve izole Docker test servisleriyle yapıldı; hosting veya fiziksel cihaz kullanılmadı.

## Yerel sonuçlar

- Node 26.13.1 / npm 12.2.2 ile npm test: lint, proje genelinde Prettier, üretim derlemesi, 92 birim ve 4 worker testi başarılı.
- Finansal API 206, migrasyon 34, yedekleme 77 kontrol başarılı.
- forms130-browser: Chromium ve WebKit'te 92'şer kontrol başarılı. Alan sırası/hattı/yüksekliği, çizgisiz özet, zorunlu kaynak odağı, Radix Escape davranışı, taslak, profil ve mobil metadata kapsanır.
- Yerel geniş browser koşusu Chromium'da başarılı. Demo uzlaştırması 715 kontrol ve tarayıcı kontrolleriyle başarılı.
- Paketli kurulum: 1.25.0 üzerine ZIP bindirme, config/eski varlıkların korunması ve başlangıç referansları başarılı.
- Mobil geniş koşu Chromium/WebKit aşamaları başarılı; yerel Firefox profil sınırı aşağıdadır.
- Güvenlik denetimi: bilinen açık yok.
- Yeniden alınan görseller evidence/1.30.0 altında; görsel karşılaştırma kökte design-qa.md içindedir.

## Platform ve yayın sonucu

Windows Firefox/Chromium ve Linux Chromium/WebKit/Firefox kabulü başarılıdır. Linux iş akışı lint/Prettier/derleme/birim, güvenlik, PHP sözdizimi, API/migrasyon/yedek, ortak form, geniş tarayıcı, mobil, demo, paketli kurulum ve ZIP eşliği kontrollerini tamamladı.

- Kaynak: `12f423d99e19fcec68289afef8f9b149ffd2136e`.
- Kabul: https://github.com/emreguler-code/finans-paneli/actions/runs/45826515683
- Yayın: https://github.com/emreguler-code/finans-paneli/releases/tag/v1.30.0
- Dört Release varlığı yeniden indirildi; tüm dosyalar yerel test paketiyle, hosting ZIP ayrıca depodaki dosyayla birebir eşleşti. SHA-256 ve tag/kaynak eşliği evidence/1.30.0/publication.json içindedir.
- Yerel Firefox profil sınırı GitHub Windows/Linux Firefox kabulüyle karşılandı. Fiziksel iPhone/Safari testi yapılmadı. Hosting/cron kurulumu yapılmadı.

Yayın sonrası belge/kanıt commitleri uygulama kaynağını veya Release paketini değiştirmez.
