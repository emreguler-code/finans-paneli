# Finans Paneli 1.13.0

30 Ekim 2026 · Şema 11 korunur.

- Görünüm ve bilgiler satırının üstünde, yalnız yöneticilere açık **Ayarlar** menüsü; mobil Diğer menüsünden erişim ve `#/ayarlar` rotası.
- Ortak sayfa başlığı, tek durum özeti, 1,9:1 ana/sağ içerik oranı; arama, yedek türü/tarih filtresi ve sıralama.
- Elle yedek oluşturma, listeleme ve indirme; yüklenen dosyayı veri değiştirmeden doğrulama; seçilen yedeği mevcut yönetici parolası ve onayla geri yükleme.
- Demo ortamını sıfır iş kaydıyla gerçek veri moduna geçirme; yönetici hesapları/parolaları korunur, diğer kullanıcılar temizlenir. Temizleme öncesi güvenlik yedeği zorunludur; gerçek veri modunda aynı işlem engellenir.
- Günlük/haftalık otomatik yedek, dönem içinde tek dosya, 14 otomatik yedek saklama. Yönetici uygulaması açıkken kontrol ve isteğe bağlı hosting cron desteği.
- Geri yüklemeden önce güvenlik yedeği, uyum/bütünlük kontrolü, InnoDB işlemi ve kayıt kilidi. Mevcut yöneticinin güncel parolası korunur; diğer oturumlar geçersiz kılınır. Aynı veritabanındaki ilişkisiz tablolar kapsam dışıdır.

Yedek dosyaları web kökü dışında saklanır; config.php, gerçek kullanıcı verileri ve yedekler dağıtım paketine girmez. Dosya yükleme sınırı 32 MB veya hostingin daha düşük PHP sınırıdır. Eski güncelleme yedeklerinin formatı ile bu menünün formatı farklıdır; rastgele SQL çalıştırılmaz.

Kurulum: hosting ZIP'i web köküne yükleyin, `api/config.php` dosyanızı koruyun, `update.php` üzerinden şemayı kontrol edin. Ardından Ayarlar'dan yedek alın/indirin ve Demo verilerini temizle akışını uygulayın. Canlı hostingde kendiliğinden temizlik yapılmaz. Ayrıntılar: [Yedekleme ve gerçek veriye geçiş](YEDEKLEME.md).
