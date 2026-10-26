# Finans Paneli — paylaşılan hosting kurulumu

PHP 8.3+, pdo_mysql, MySQL/MariaDB ve HTTPS gerekir. Yeni kurulumlar için MySQL 8.4 LTS veya MariaDB 11.4 LTS önerilir. Hostingde Node.js gerekmez.

## Yeni kurulum

1. ZIP içindeki `hosting/` klasörünün **içeriğini** web dizininize yükleyin. `database/`, bu belge ve lisanslar web dizininin dışında kalmalıdır.
2. Boş bir veritabanı ve yalnızca bu veritabanına erişen bir kullanıcı oluşturun. `database/schema.sql` dosyasını phpMyAdmin veya hosting panelinizden içe aktarın.
3. Sunucuda `api/config.example.php` dosyasını `api/config.php` olarak kopyalayın. Veritabanı bilgilerini girin. En az 32 karakterlik kriptografik rastgele bir `setup_token` üretin; `require_https=true` kalsın. Gerçek config dosyasını GitHub'a yüklemeyin.
4. HTTPS üzerinden uygulamayı açın. İlk yönetici kurulumunda kullanıcı adı, en az 12 karakterlik parola ve kurulum anahtarını girin.
5. Yönetici olarak giriş yapın, aynı dizindeki `update.php` sayfasını açıp güncellemeyi uygulayın. Hedef şema sürümü 7'dir.
6. Uygulamaya dönün. Giriş, boş hesap listeleri ve hesap oluşturma işlemini kontrol edin. Bu paket gerçek kullanıcı/işlem verisi veya demo kayıtları içermez.

## Mevcut kurulumun güncellenmesi

Önce veritabanını ve dosyaları yedekleyin. `hosting/` içeriğini mevcut web dizinine yükleyin; mevcut `api/config.php` dosyanızı koruyun. Yönetici olarak `update.php` üzerinden güncellemeyi uygulayın. Demo yenileme seçeneğini kapalı bırakın. Ayrıntılar `GUNCELLEME.md` dosyasındadır.

## Paketi doğrulama

ZIP ve `.sha256` dosyasını birlikte indirin; bulunduğunuz dizinde `sha256sum -c finans-paneli-1.9.0.zip.sha256` çalıştırın. Yeni sürümlerde dosya adındaki sürümü değiştirin.
