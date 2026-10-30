# 1.13.1 doğrulama raporu

30 Ekim 2026. Canlı hostinge veya veritabanına erişilmedi; testler izole sentetik ortamlarda çalıştırıldı.

- npm ci ve npm test: derleme, 43 birim ve 4 worker kontrolü geçti.
- PHP özel dizin çözümleyicisi sözdizimi kontrolü geçti.
- Yedekleme/geri yükleme: 56 kontrol geçti (`.qa/0517a036f291`). Yeni senaryolar gerçek dosya ağacında public_html/finans alt klasör kurulumu, HTTP/CLI aynı özel yol, CLI'dan güvensiz dizin reddi ve reddetmeden önce klasör oluşturulmamasını kapsar.
- Tarayıcı: 502 kontrol, sıfır çalışma hatası (`.qa/632abd4f3aba/browser/checks.json`). Yapılandırma hatası, yükleme durumunun bitmesi, Yeniden dene ile başarılı yeniden bağlantı ve 1440/390/320 px hata rehberi test edildi. Mobil ekran görüntüsü incelendi. Önceki yedek alma, indirme, yükleme, otomatik seçenek, demo temizliği ve geri yükleme senaryoları geçti.

- Hosting ZIP kurulumu/güncellemesi ve demo yenileme testi geçti (`.qa/11dae0e2876c`); paket içinde gerçek config veya kullanıcı yedeği bulunmaz. İlk yerel paket koşusunda Playwright varsayılan tarayıcısı yüklü olmadığından test başlamadı; sistem Chromium yolu verilerek tekrar koşuldu ve geçti.

Hosting izinleri ve open_basedir yerel ortamdan değiştirilemez. Standart dışı web kökü veya yazma kısıtı bulunan hostingde backup_dir ayrıca ayarlanmalıdır. Web kökü koruması kaldırılmadı. Gerçek finansal kayıtlar temizlenmedi.
