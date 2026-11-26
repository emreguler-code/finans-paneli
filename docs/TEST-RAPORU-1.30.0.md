# 1.30.0 doğrulama raporu

26 Kasım 2026. Kaynak değişiklikleri tasarım/ortak arayüz kapsamındadır; API/PHP/şema değiştirilmedi. Yerel inceleme sentetik verilerle ve izole Docker test servisleriyle yapıldı; hosting veya fiziksel cihaz kullanılmadı.

## Yerel sonuçlar

- Node 26.13.1 / npm 12.2.2 ile npm test: lint, proje genelinde Prettier, üretim derlemesi, 92 birim ve 4 worker testi başarılı.
- Finansal API 206, migrasyon 34, yedekleme 77 kontrol başarılı.
- forms130-browser: Chromium ve WebKit'te 87'şer kontrol başarılı. Alan sırası/hattı/yüksekliği, çizgisiz özet, zorunlu kaynak odağı, Radix Escape davranışı, taslak, profil ve mobil metadata kapsanır.
- Yerel geniş browser koşusu Chromium'da başarılı. Demo uzlaştırması 715 kontrol ve tarayıcı kontrolleriyle başarılı.
- Paketli kurulum: 1.25.0 üzerine ZIP bindirme, config/eski varlıkların korunması ve başlangıç referansları başarılı.
- Mobil geniş koşu Chromium/WebKit aşamaları başarılı; yerel Firefox profil sınırı aşağıdadır.
- Güvenlik denetimi: bilinen açık yok.
- Yeniden alınan görseller evidence/1.30.0 altında; görsel karşılaştırma kökte design-qa.md içindedir.

## Platform ve yayın kapısı

Yerel Firefox profili bu ortamda başlatılamadı; bu sonuç bir uygulama testi olarak sayılmaz. Tam mobil/Firefox ve Windows/Linux kabulü GitHub yayın iş akışında zorunludur; başarılı olmadan yayın tamamlandı denmez. Paketli kurulum, mobil ve GitHub sonuçları yayın kaydında güncellenecek. Fiziksel iPhone/Safari testi yapılmadı.
