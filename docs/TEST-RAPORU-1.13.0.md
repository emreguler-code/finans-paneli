# 1.13.0 doğrulama raporu

30 Ekim 2026. Tüm veri değiştiren kontroller koşucunun oluşturduğu izole PHP/MariaDB ortamlarında ve sentetik verilerle yapıldı; canlı hostinge/veritabanına erişilmedi.

- `npm ci --cache /workspace/.npm-cache`; `npm test`: **43 birim + 4 worker kontrolü** geçti.
- Finansal API: **126**; eski şema geçişi/kurtarma: **32** kontrol geçti. Kanıt: `.qa/08da7a0aa4ca`, `.qa/6b190c054b4b`.
- Yeni `npm run test:backups`: **53** kontrol geçti. Kanıt: `.qa/b5e6d0084b3d/backup-checks.json`.
- Gerçek derlenmiş arayüz: **498** kontrol, çalışma hatası yok. Kanıt: `.qa/2e36f7bae663/browser/checks.json`. Ayarlar yerleşimi, özel menü konumu, yedek indirme/yükleme, otomatik seçenek, 768/390/320 px taşma/dokunma ölçüleri, parolalı demo temizliği ve geri yükleme dahil.
- Geniş demo: **715** bağımsız uzlaştırma; **105** demo ekran kontrolü geçti. Kanıt: `.qa/cb9fedc0a6bb/demo/`. Ardından aynı kapsamlı veride yeni Ayarlar akışı ayrıca çalıştırıldı: hesap, kart, cari, işlem/alacak, araç/kayıt, kampanya/katılım dizileri geri yüklemeden sonra birebir karşılaştırıldı. Kanıt: `.qa/design-113/`, yerel çalıştırma `.qa/settings113.cjs`.
- Paketlenmiş hosting kurulumu/güncellemesi: **14 updater kontrolü**, paket ortamında finansal API/migrasyon/demo uzlaştırması geçti. Kanıt: `.qa/b22f940b90da/package-demo/`. Son dağıtım ZIP'i için kapı paket üretiminden sonra yeniden çalıştırıldı.
- Değişen PHP dosyaları sözdizimi kontrolünden geçti. ZIP içerik eşliği, SHA-256 ve arşiv bütünlüğü kontrol edilir; config.php, yedek, test verisi veya oturum bilgisi paketlenmez.

## Yeni yedekleme senaryoları

Kimlik doğrulama, yönetici yetkisi, CSRF, HTTP yöntemi ve kimlik/yol geçişi; özel klasör/dosya izinleri; web kökünde saklamayı reddetme; dosya/fonksiyon şeması ve SHA-256; kesik/değiştirilmiş/beklenmeyen tablo içeren dosya; yüklemenin mevcut veriyi değiştirmemesi; günlük/haftalık dönemde tekrar almama; 14 otomatik yedek saklayıp elle alınanı koruma; yanlış parola/onay ile temizliği engelleme; zorunlu temizleme/geri yükleme yedeği; sıfır iş kaydıyla gerçek tarihe geçiş ve yeni gerçek kayıt açabilme; güncel yönetici parolasını koruma; eski yedekte olmayan yöneticiyi çakışmayan kimlikle koruma; diğer oturumları geçersiz kılma; geçersiz FK ile tam rollback ve kilit bırakma; ilişkisiz tabloları koruma; başka tablo/veritabanına cascade ilişkisi varsa işlemi önceden reddetme; CLI cron/HTTP engeli ve API ile aynı zaman dilimi; eski updater demo yenileme yolunda güvenlik yedeği.

## Sınırlar ve mevcut ortam

Yerel geniş demo, son doğrulamadan sonra güvenlik yedeği alınarak boş gerçek veri modunda bırakıldı: hesap, cari ve işlem sayısı sıfır; yönetici hesabı korunuyor. Bu durum kullanıcının canlı hosting verisinin temizlendiği anlamına gelmez. Hosting ZIP'i yükledikten sonra kullanıcı Ayarlar'dan temizleme adımını uygular.

Mobil kontroller Chromium görünüm alanı testidir; fiziksel telefon klavyesi ve tam ekran okuyucu sertifikasyonu değildir. Hosting cron görevi bu ortamdan kullanıcının hosting paneline kurulmadı; yalnız çalıştırılacak CLI betiği ve kılavuz sağlandı. GitHub Actions yayın kapısı PHP/API/migrasyon/yedek/tarayıcı/demo/paket testlerini ayrıca çalıştırır; uzak koşu tamamlanmadan başarı varsayılmaz.
