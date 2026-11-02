# Finans Paneli 1.15.0

2 Kasım 2026 · Şema 12 (yeni veritabanı geçişi gerektirmez).

- Cari ekleme ve düzenleme ortak **Cari Ekle / Değiştir** tam sayfasını kullanır. Mevcut bilgiler dolu gelir; gerekçe isteğe bağlıdır, değişiklikler kaydedilir. Düzenleme adresi yenilendiğinde aynı kaydı açar.
- İşlem alanları ortak tek yatay temel satıra indirildi. Ayrı bağlam başlığı kaldırıldı, X Kaydet yanına taşındı. Tarih yalnız takvim ikonuyla seçilir; tek aylık takvimin sıkışan yedi gün sütunu düzeltildi. Ayrıntılar ve işlem etkisi Diğer altında korunur; mobilde alanlar taşmadan akar.
- Kredi kartı detayında işlem hedefi görüntülenen karttır. İşlem hesabı/kart değiştirme seçimi yoktur. Ödeme için ayrı Kaynak hesap yalnız kasa/banka hesaplarını sunar; yeni karttan karta aktarım API'de de reddedilir. Eski kayıtlar korunur.
- Ayarlar'da hosting için kopyalanabilir PHP cron komutu ve İstanbul/UTC zamanlama bilgisi. Gece Türkiye saati 03.00 ve toplam beş yedek kuralı korunur.
- Aynı gün yeniden elle yedek alırken onay, son yedek ve varsa silinecek en eski kopyanın zamanı gösterilir. Aynı isteğin tekrarları ek yedek oluşturmaz. Yeni yedek tamamlanmadan eski kopya silinmez.
- **Fabrika ayarlarına sıfırla**, yönetici parolası ve yazılı onayla çalışır. Önce güvenlik yedeği alınır; yalnız işlemi yapan yönetici ve parolası korunur, diğer uygulama verileri/kullanıcıları temizlenir. Mevcut yedekler, hosting yapılandırması ve uygulama dışı tablolar korunur. Demo temizliğinden ayrı, gerçek veri modunda da kullanılabilir.

## Hosting kurulumu

Yalnız web dosyaları için `finans-paneli-1.15.0-hosting.zip` kullanın. `api/config.php` ve özel yedek dizinini koruyun. Mevcut şema 12 kurulumunda ek veritabanı güncellemesi yoktur; daha eski kurulumda `update.php` akışını tamamlayın. Gerçek veriler kendiliğinden temizlenmez veya sıfırlanmaz. Cron görevi hosting panelinden ayrıca kurulmalıdır.
