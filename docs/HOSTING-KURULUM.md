# Finans Paneli — paylaşılan hosting kurulumu

PHP 8.3+, pdo_mysql, MySQL/MariaDB ve HTTPS gerekir. Yeni kurulumlar için MySQL 8.4 LTS veya MariaDB 11.4 LTS önerilir. Hostingde Node.js gerekmez.

## Hangi ZIP?

- `finans-paneli-<sürüm>-hosting.zip`: doğrudan web dizinine açılacak dosyalar. Üstte `hosting/` klasörü yoktur. Kurulum belgeleri ve bağımsız SQL dosyaları dahil değildir; çalışmak için gereken API migrasyonları ve font lisansı dahildir. Mevcut siteyi güncellemek için bu paketi kullanabilirsiniz.
- `finans-paneli-<sürüm>.zip`: yeni kurulum için belgeler ve `database/schema.sql` içeren tam paket. Uygulama dosyaları `hosting/` altındadır. İki paket aynı uygulamayı içerir; ikisini de yüklemek gerekmez.

Hosting ZIP'ini açarken `api/config.php` dosyanızı koruyun; bu dosya pakette bulunmaz. Yeni boş veritabanı kurulumunda şema SQL'i tam paketten veya GitHub'daki `database/schema.sql` dosyasından ayrıca alınmalıdır. Demo yenileme hosting ZIP'inde de vardır; isteğe bağlıdır.

## Yeni kurulum

1. ZIP içindeki `hosting/` klasörünün **içeriğini** web dizininize yükleyin. `database/`, bu belge ve lisanslar web dizininin dışında kalmalıdır.
2. Boş bir veritabanı ve yalnızca bu veritabanına erişen bir kullanıcı oluşturun. `database/schema.sql` dosyasını phpMyAdmin veya hosting panelinizden içe aktarın.
3. Sunucuda `api/config.example.php` dosyasını `api/config.php` olarak kopyalayın. Veritabanı bilgilerini girin. En az 32 karakterlik kriptografik rastgele bir `setup_token` üretin; `require_https=true` kalsın. Gerçek config dosyasını GitHub'a yüklemeyin.
4. HTTPS üzerinden uygulamayı açın. İlk yönetici kurulumunda kullanıcı adı, en az 12 karakterlik parola ve kurulum anahtarını girin.
5. Yönetici olarak giriş yapın, aynı dizindeki `update.php` sayfasını açıp güncellemeyi uygulayın. Hedef şema sürümü 11'dur.
6. Uygulamaya dönün. Giriş, boş hesap listeleri ve hesap oluşturma işlemini kontrol edin. Bu paket gerçek kullanıcı/işlem verisi veya demo kayıtları içermez.

## Mevcut kurulumun güncellenmesi

Önce veritabanını ve dosyaları yedekleyin. `-hosting.zip` içeriğini doğrudan mevcut web dizinine açın (tam paket kullanıyorsanız `hosting/` içeriğini yükleyin); mevcut `api/config.php` dosyanızı koruyun. Yönetici olarak `update.php` üzerinden güncellemeyi uygulayın. Demo yenileme seçeneğini kapalı bırakın. Ayrıntılar `GUNCELLEME.md` dosyasındadır.

## Paketi doğrulama

ZIP ve `.sha256` dosyasını birlikte indirin; bulunduğunuz dizinde `sha256sum -c finans-paneli-1.11.0.zip.sha256` çalıştırın. Yeni sürümlerde dosya adındaki sürümü değiştirin.

## 1.13.0: yedekleme ve gerçek veriye geçiş

Ayarlar menüsü yöneticiye yedek al/indir/yükle/geri yükle ve demo temizliği sunar. Şema 11 korunur. Özel yedek klasörü web kökünün dışında ve PHP için yazılabilir olmalıdır; alt dizine kurulumda veya üst dizin yazılamıyorsa config.php içinde backup_dir için mutlak, özel bir yol tanımlayın. Yapılandırma dosyasını ve özel yedek klasörünü güncellemede koruyun.

Hosting ZIP'ini yüklemek kayıtları silmez. Gerçek veriye başlamak için Ayarlar → Demo verilerini temizle adımını yönetici parolasıyla uygulayın. Önce otomatik bir güvenlik yedeği alınır; yönetici olmayan kullanıcılar ve iş kayıtları temizlenir, yönetici hesapları korunur. Günlük/haftalık yedek Ayarlar'dan açılır. Uygulama kapalıyken de çalışması için hosting cron görevinde PHP 8.3+ ile api/backup-cron.php çalıştırılır; görev kendiliğinden kurulmaz.
