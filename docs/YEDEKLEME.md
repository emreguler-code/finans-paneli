# Yedekleme ve gerçek veriye geçiş

Finans 1.13.0 · Şema 11 · PHP 8.3+ / PDO MySQL.

## Demo verilerini temizleyerek başlamak

1. Hosting ZIP'ini yüklerken `api/config.php` dosyanızı koruyun. `update.php` üzerinden şema durumunu kontrol edin; şema 11 için yeni geçiş yoktur.
2. Yönetici olarak **Ayarlar → Gerçek veriye başla → Demo verilerini temizle** seçin.
3. Mevcut yönetici parolanızı ve istenen onay metnini girin. Sunucuda geri yüklenebilir bir **Temizleme öncesi** yedeği alınmadan hiçbir iş kaydı silinmez.
4. Cari, hesap, kart, işlem, araç, kampanya ve yönetici olmayan kullanıcı kayıtları temizlenir. Yönetici hesapları, parolaları, uygulama yapılandırması ve yedekler korunur. Finansal çalışma alanı boşalır; temizleme olayı denetim geçmişine kaydedilir.
5. Örnek tarih sabitlemesi kaldırılır, gerçek sunucu tarihi kullanılır. İlk banka/kasa hesaplarınızı ve carilerinizi oluşturabilirsiniz. Örnek mod kapalıyken bu düğme gerçek veriyi silemez.

Örnek ortamda sonradan gerçek kayıt eklenmişse onlar da temizlenir. Temizleme/geri yükleme öncesinde diğer açık sekmeleri kapatın; diğer oturumlar geçersiz kılınır. İşlemi yapan yönetici girişini korur.

Bu işlem bir SQL veritabanını DROP etmez, uygulamaya ait iş verilerini temizler. Aynı veritabanındaki ilişkisiz başka uygulama tablolarına dokunulmaz. Yeni kurulum kendiliğinden demo oluşturmaz.

## Yedek al ve indir

Ayarlar sayfasında **Yedek al**, veritabanındaki uygulamaya ait tabloların tutarlı bir kopyasını oluşturur. Tarih, tür, şema ve boyut listelenir. Satırdaki indirme düğmesi `.jsonl` dosyasını indirir. Dosya finansal verileri ve kullanıcı parola özetlerini içerir; herkese açık paylaşılmamalıdır. Sunucu dışındaki özel bir konumda da saklayın.

Yedek yalnız veritabanı kayıtlarını kapsar; uygulama dosyaları ve `api/config.php` içine alınmaz. Otomatik yedek ayarı ve sunucuda saklanan diğer yedekler geri yükleme sırasında değiştirilmez. Tam site yedeği ayrıca hosting panelinden alınabilir.

## Yedek dosyası yükle ve geri yükle

- **Yedek dosyası yükle** yalnız dosyayı doğrulayıp listeye ekler; mevcut veri değişmez.
- Bu sürümün `finans-backup-2` biçimi ve aynı veritabanı şeması desteklenir. Güncelleme aracının eski `finans-backup-1` dosyaları veya rastgele SQL dosyaları bu menüden çalıştırılmaz.
- Seçilen satırda **Geri yükle** ile mevcut yönetici parolası ve `GERİ YÜKLE` onayı istenir. Önce mevcut durumun **Geri yükleme öncesi** yedeği oluşturulur.
- Tablo/alan listesi, şema, satır sayıları ve SHA-256 bütünlüğü doğrulanır. Dosya içindeki SQL/DDL çalıştırılmaz; izinli tablolara parametreli veri eklenir.
- Değiştirme InnoDB işlemi içinde ve mevcut kayıt/bakım kilidiyle yapılır. Bozuk ilişki/SQL hatasında tüm veritabanı değişikliği geri alınır. Yabancı anahtar denetimi kapatılmaz.
- Mevcut yöneticinin güncel kullanıcı adı/parolası korunur. Eski yedekte bu yönetici bulunmuyorsa çakışmayan yeni kimlikle korunur. Yedekteki diğer kullanıcılar geri gelir. Diğer açık oturumlar yeniden giriş yapar.
- Yeni biçimde dosya sınırı 32 MB'dır; yüklemede PHP'nin `upload_max_filesize` / `post_max_size` sınırı daha düşükse ekran bunu gösterir. Daha büyük veritabanı için hostingin veritabanı yedekleme araçlarını kullanın.

## Özel sunucu dizini

Varsayılan olarak uygulama web dizininin yanında, uygulamaya özel `.finans-private-...` dizini kullanılır. Dizin 0700, dosyalar 0600 izinleriyle oluşturulur. Web kökü, DocumentRoot veya bunların içindeki bir konum kabul edilmez. PHP'nin özel dizine yazabilmesi gerekir.

Alt dizine kurulumda veya üst dizin yazılamıyorsa `api/config.php` içinde açıkça web kökü dışında bir konum tanımlayın:

```php
'backup_dir' => '/home/hosting-kullanicisi/finans-private-backups',
```

Bu örneği kendi hosting yolunuza göre değiştirin. Yedek klasörünü `public_html` içine koymayın. Yapılandırma dosyasını ve özel klasörü güncellemelerde koruyun. Sunucudaki yönetici dosya izinleri, finansal verilerin korunmasının bir parçasıdır. Git deposu veya hosting ZIP'i yedek dosyalarını içermez.

## Otomatik yedekleme

**Ayarlar → Otomatik yedek al** seçeneğinde günlük veya haftalık dönem seçilir. Yönetici uygulamayı açınca ve açıkken 15 dakikada bir kontrol yapılır. Günlükte İstanbul takvim gününde, haftalıkta ISO haftasında en fazla bir otomatik yedek oluşturulur. Elle alınan yedekler bu kontrolün yerine geçmez.

Son **14 otomatik yedek** tutulur; elle alınan, yüklenen, temizleme ve geri yükleme öncesi yedekler otomatik silinmez. Eski günlerde uygulama kapalıysa geriye dönük hayali yedek oluşturulmaz.

Uygulama kapalıyken de yedek için hosting cron görevine PHP 8.3+ ile bu dosyayı ekleyin:

```sh
/usr/bin/php /home/hosting-kullanicisi/public_html/api/backup-cron.php
```

Hostinginizin PHP 8.3+ yolunu ve gerçek kurulum konumunu kullanın. Örneğin saatte bir çalıştırın (`0 * * * *`); betik her çağrıda yalnız Ayarlar'da etkin ve dönemi gelmişse yedek alır. Betik web üzerinden çağrılınca 404 verir, URL'ye parola veya anahtar koymak gerekmez. Cron görevinin kurulumunu bu paket hosting panelinizde kendiliğinden yapamaz. Başarısız cron çalışması sıfır olmayan çıkış kodu üretir.

## Eski demo yenileme yolu

`update.php` içindeki mevcut demo yenileme işlevi de, iş verisi varsa yenilemeden önce yeni biçimde özel bir güvenlik yedeği alır. Kayıt tekrarının aynı istek anahtarıyla yeniden denenmesi ikinci temizlik veya gereksiz yeni yedek oluşturmaz.

Cron'u çalıştıran kullanıcı ile web PHP sürecinin özel yedek klasörüne erişebilmesi gerekir. Hosting farklı kullanıcılarla çalıştırıyorsa özel klasörün izinlerini hosting sağlayıcınızla düzenleyin; klasörü web köküne taşımayın.
