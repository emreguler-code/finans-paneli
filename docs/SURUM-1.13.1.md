# Finans Paneli 1.13.1

30 Ekim 2026 · Şema 11 korunur.

- Alt klasöre (`public_html/finans` vb.) kurulumda varsayılan özel yedek dizini web kökü dışına seçilir. HTTP ve CLI cron aynı yolu kullanır.
- Açıkça tanımlanan backup_dir korunur ve güvenliği klasör oluşturulmadan kontrol edilir. Web kökünde yedek saklamaya izin verilmez.
- Ayarlar yüklenemezse yükleniyor durumu sonlanır; yapılandırma açıklaması ve Yeniden dene gösterilir. Başarısız bağlantıda sıfır yedek varmış gibi davranılmaz.
- Veritabanı, hesaplar ve finansal model değiştirilmez. Hosting ZIP'i yüklenirken api/config.php korunur. Özel dizine yazma izni yoksa hostingde yapılandırma gerekir; uygulama izinleri kendiliğinden değiştiremez.
