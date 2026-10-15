# Finans Paneli güncellemesi

Yüklenecek sürüm ZIP dosya adında belirtilir. 1.7.0 sürümü şema 7'yi kullanır; mevcut 1.6.x kayıtları ve yönetici hesapları korunur. Şeması zaten 7 olan kurulumlarda yeni veritabanı migrasyonu gerekmez.

1. Veritabanı ve mevcut dosyaları yedekleyin.
2. ZIP içindeki `hosting/` içeriğini mevcut web dizinine yükleyin. Mevcut `api/config.php` dosyasını koruyun. `api/v2/migrations/` klasörünü de yükleyin.
3. Yönetici olarak `update.php` sayfasını açın; gerekirse güncellemeyi uygulayın. Demo seçeneği kapalı kalmalıdır.
4. Sayfayı yenileyip giriş, hesaplar, cari hareketler ve ödeme planını kontrol edin.

Yeni kurulum için ZIP içindeki `KURULUM.md` belgesini kullanın. Eski kurulumdaki dosyaları rastgele silmeyin; önce yedek alın. Artık kullanılmayan `api/cari.php` ve `api/v2/v15.php`, yedek aldıktan ve yeni dosyaları yükledikten sonra eski kurulumunuzdan kaldırılabilir.
