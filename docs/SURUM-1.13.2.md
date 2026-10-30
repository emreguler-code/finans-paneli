# Finans Paneli 1.13.2

30 Ekim 2026 · Şema 11 korunur.

- Tarayıcı açılışı, Ayarlar'a giriş, sayfa yenileme ve ayar kaydetme artık otomatik yedek oluşturmaz.
- Otomatik yedekleme yalnız hosting CLI cron ile her gün Türkiye saatiyle 03.00'te bir kez çalışır. Hosting saat dilimi İstanbul ise `0 3 * * *`, UTC ise `0 0 * * *`; cron kurulmalıdır.
- Sunucudaki tüm türler birlikte en fazla 5 yedek tutulur. Yeni kopya tamamlandıktan sonra en eskiler temizlenir; indirilmiş kopyalar etkilenmez.
- Geri yükleme kaynağı işlem sırasında, yeni güvenlik yedeği işlem sonrasında korunur. Günlük çalışma kaydı dosya rotasyonundan bağımsızdır.
- Eski günlük/haftalık seçenekler günlük 03.00'e dönüşür; açık/kapalı tercihi korunur. Sayfa sadece okunurken yedek silinmez; mevcut fazlalıklar bir sonraki yedek veya Ayarları kaydet işleminde temizlenir.
- Mevcut geri yükleme biçimi ve 32 MB sınırı korunur; sıkıştırma eklenmedi. Finansal model veya veritabanı şeması değişmedi.

Hosting ZIP'i yüklenirken api/config.php ve özel yedek klasörü korunmalıdır. [Yedekleme kılavuzu](https://github.com/emreguler-code/finans-paneli/blob/main/docs/YEDEKLEME.md).
