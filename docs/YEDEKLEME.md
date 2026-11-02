# Yedekleme ve gerçek veriye geçiş

Finans 1.14.0 · Şema 12 · PHP 8.3+ / PDO MySQL.

## Demo verilerini temizleyerek başlamak

1. Hosting ZIP'ini yüklerken `api/config.php` dosyanızı koruyun. `update.php` üzerinden şema durumunu kontrol edin; 1.14.0 için şema 11 → 12 geçişini uygulayın. Güncelleme mevcut verilerin yedeğini alır; finansal kayıtları korur.
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
- Bu sürümün `finans-backup-2` biçimi ve şema 12 desteklenir. Önceki 1.13.x sürümünün şema 11 yedekleri de desteklenir; geri yüklemede yeni kart banka alanı boş başlangıç değeriyle tamamlanır, şema 12 korunur. Güncelleme aracının eski `finans-backup-1` dosyaları veya rastgele SQL dosyaları bu menüden çalıştırılmaz.
- Seçilen satırda **Geri yükle** ile mevcut yönetici parolası ve `GERİ YÜKLE` onayı istenir. Önce mevcut durumun **Geri yükleme öncesi** yedeği oluşturulur.
- Tablo/alan listesi, şema, satır sayıları ve SHA-256 bütünlüğü doğrulanır. Dosya içindeki SQL/DDL çalıştırılmaz; izinli tablolara parametreli veri eklenir.
- Değiştirme InnoDB işlemi içinde ve mevcut kayıt/bakım kilidiyle yapılır. Bozuk ilişki/SQL hatasında tüm veritabanı değişikliği geri alınır. Yabancı anahtar denetimi kapatılmaz.
- Mevcut yöneticinin güncel kullanıcı adı/parolası korunur. Eski yedekte bu yönetici bulunmuyorsa çakışmayan yeni kimlikle korunur. Yedekteki diğer kullanıcılar geri gelir. Diğer açık oturumlar yeniden giriş yapar.
- Yeni biçimde dosya sınırı 32 MB'dır; yüklemede PHP'nin `upload_max_filesize` / `post_max_size` sınırı daha düşükse ekran bunu gösterir. Daha büyük veritabanı için hostingin veritabanı yedekleme araçlarını kullanın.

## Özel sunucu dizini

Varsayılan olarak uygulama web dizininin yanında, uygulamaya özel `.finans-private-...` dizini kullanılır. Uygulama `public_html/finans` gibi alt klasördeyse standart hosting web kökü (`public_html`, `httpdocs`, `htdocs` vb.) belirlenir ve özel dizin onun dışına alınır. Bu çözüm web ve CLI cron için aynıdır. Dizin 0700, dosyalar 0600 izinleriyle oluşturulur. Web kökü, DocumentRoot veya bunların içindeki bir konum kabul edilmez. PHP'nin özel dizine yazabilmesi gerekir.

Standart olmayan bir DocumentRoot kullanılıyorsa veya üst dizin yazılamıyorsa `api/config.php` içinde açıkça web kökü dışında bir konum tanımlayın:

```php
'backup_dir' => '/home/hosting-kullanicisi/finans-private-backups',
```

Bu örneği kendi hosting yolunuza göre değiştirin. Örneğin web kökü `/home/hesabim/public_html` ise `/home/hesabim/finans-private-backups` kullanılabilir. Mevcut config.php içindeki `return [...]` dizisine virgülle ayrılan bir ayar olarak ekleyin; veritabanı bilgilerini değiştirmeyin. Hosting `open_basedir` ile dış dizine erişimi kapatmışsa sağlayıcıdan özel dizine PHP erişimi isteyin; korumayı kaldırıp yedekleri web köküne taşımayın. Ayarı tamamladıktan sonra Ayarlar sayfasında **Yeniden dene** seçin. Yedek klasörünü `public_html` içine koymayın. Yapılandırma dosyasını ve özel klasörü güncellemelerde koruyun. Sunucudaki yönetici dosya izinleri, finansal verilerin korunmasının bir parçasıdır. Git deposu veya hosting ZIP'i yedek dosyalarını içermez.

## Otomatik yedekleme

**Ayarlar → Otomatik yedek al** açıkken her gün **Türkiye saatiyle 03.00** için yedek planlanır. Ayarlar'a girmek, sayfayı yenilemek veya seçeneği açmak yedek oluşturmaz. Tarayıcıdan otomatik yedek başlatılmaz; açık uygulama veya oturum gerekmez.

Zamanında çalışması için hosting panelinde PHP 8.3+ ile bir cron görevi oluşturulmalıdır:

```sh
/usr/bin/php /home/hosting-kullanicisi/public_html/api/backup-cron.php
```

Gerçek PHP yolunu ve uygulama alt klasördeyse o konumu kullanın. Hosting cron saat dilimi **Europe/Istanbul** ise `0 3 * * *`; saat dilimi **UTC** ise `0 0 * * *` seçin. Saat dilimini hosting panelinden doğrulayın. Betik İstanbul saatine göre yalnız 03.00–03.59 aralığında, günde en fazla bir başarılı otomatik yedek oluşturur. Normal görev 03.00 için kurulmalıdır; saat içindeki tekrar denemeler ikinci yedek üretmez. Bu pencere kaçırılırsa gündüz telafi yedeği oluşturulmaz; sonraki gece beklenir.

Son başarılı çalışma günü, yedek dosyalarından ayrı özel bir kayıtla korunur. Günün otomatik dosyası 5 dosya sınırı nedeniyle silinse bile aynı gece ikinci kez otomatik yedek alınmaz. Eski günlük/haftalık seçenekler günlük 03.00 planına dönüşür; açık/kapalı tercihi korunur. Önceden kurulmuş saatte bir cron da yalnız 03.00 kontrolünde çalışır; yeni cron'u günde bir kez kurmak yeterlidir.

Cron URL'si web üzerinden 404 verir. Parola veya anahtar URL'ye konmaz. Bu paket hosting panelinde görevi kendiliğinden kuramaz. Cron kurulmadan yalnız seçeneği açmak otomatik yedekleme sağlamaz. Başarısız cron çalışması sıfır olmayan çıkış kodu üretir.

## En fazla 5 yedek

Sunucuda **tüm türler birlikte en fazla 5 yedek** tutulur: elle alınan, otomatik, yüklenen ve işlem öncesi güvenlik yedekleri aynı sınıra dahildir. Yeni dosya tamamen yazıldıktan/doğrulandıktan sonra en eski dosyalar silinir; yeni tamamlanan dosya korunur. Mevcut 5'ten fazla yedek, sonraki yedek oluşturma/yükleme veya **Ayarları kaydet** işleminde bu sınıra iner. Sayfaya bakmak kendi başına dosya oluşturmaz ya da silmez.

Geri yüklemede seçilmiş kaynak dosya işlem tamamlanana kadar korunur; güvenlik kopyasıyla geçici olarak 6 dosya oluşabilir. İşlem bitince yeniden 5'e indirilir ve yeni güvenlik yedeği korunur. Başarısız yedek üretimi mevcut sağlam kopyaları azaltmaz. Eski dosya silinemiyorsa izin hatası bildirilir; dosya izinleri hostingde düzeltilmelidir.

Uzun süre saklamak istediğiniz yedekleri indirin; indirilmiş kopyalar sunucunun sınırından etkilenmez. Dosya biçimi ve 32 MB sınırı korunmuştur; sıkıştırma bu sürümde eklenmemiştir.

## Eski demo yenileme yolu

`update.php` içindeki mevcut demo yenileme işlevi de, iş verisi varsa yenilemeden önce yeni biçimde özel bir güvenlik yedeği alır. Kayıt tekrarının aynı istek anahtarıyla yeniden denenmesi ikinci temizlik veya gereksiz yeni yedek oluşturmaz.

Cron'u çalıştıran kullanıcı ile web PHP sürecinin özel yedek klasörüne erişebilmesi gerekir. Hosting farklı kullanıcılarla çalıştırıyorsa özel klasörün izinlerini hosting sağlayıcınızla düzenleyin; klasörü web köküne taşımayın.

## 1.15.0 — Tekrarlı yedek ve fabrika sıfırlaması

Ayarlar → Hosting cron kurulumu bölümünde gerçek betik yolu ve düzenlenebilir PHP CLI yoluyla kopyalanabilir komut bulunur. PHP CLI yolu sağlayıcıdan doğrulanmalıdır. İstanbul için `0 3 * * *`, UTC için `0 0 * * *` kullanılır; komutu kopyalamak görevi kurmaz.

İstanbul takvim gününde daha önce yedek varsa yeni elle yedek onay gerektirir. Onay güncel en son kopyaya bağlıdır; başka oturum yeni yedek alırsa tekrar sorulur. Saklama sınırında silinecek kopya tarihi açıklanır. Aynı istek anahtarıyla tekrar deneme dosya sayısını artırmaz. Geri yükleme ve sıfırlama öncesi zorunlu güvenlik yedekleri bu elle yedek onayıyla atlanmaz.

Fabrika ayarlarına sıfırla gerçek veriler dahil tüm uygulama kayıtlarını ve diğer kullanıcıları siler; yalnız işlemi yapan yöneticinin hesabını/parola özetini korur. Yönetici parolası ve `FABRİKA AYARLARINA SIFIRLA` yazılı onayı gerekir. Önce geri yüklenebilir güvenlik yedeği alınır; başarısızsa sıfırlama başlamaz. Mevcut özel yedek dosyaları/config silinmez; ilişkisiz tablolar korunur; diğer oturumlar geçersiz olur. İşlem uygulama tarafından kendiliğinden çalıştırılmaz.
