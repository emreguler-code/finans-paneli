# Finans Paneli güncellemesi

Yüklenecek sürüm ZIP dosya adında belirtilir. 1.14.0 sürümü şema 12'yi kullanır. Şema 11'e yalnız kartın banka adı alanı eklenir. Mevcut kayıtlar ve yönetici hesapları korunur. Şema 10 kurulumuna isteğe bağlı cari bilgi alanı eklenir; şema 9 kurulumunda ayrıca kart hesap bağlantısı tamamlanır; daha eski sürümler önce gerekli ara geçişleri tamamlar. Dosyaları yükledikten sonra yöneticiyle update.php üzerinden veritabanını güncelleyin.

1. Veritabanı ve mevcut dosyaları yedekleyin.
2. `-hosting.zip` içeriğini doğrudan mevcut web dizinine yükleyin (tam ZIP kullanıyorsanız `hosting/` içeriğini yükleyin). Mevcut `api/config.php` dosyasını koruyun. `api/v2/migrations/` klasörünü de yükleyin.
3. Yönetici olarak `update.php` sayfasını açın; gerekirse güncellemeyi uygulayın. Veritabanı güncelse güncelleme düğmesi gösterilmez; bu normaldir. Uygulama dosyaları ikinci adımda yüklenmiş olur. Demo seçeneği kapalı kalmalıdır.
4. Sayfayı yenileyip giriş, hesaplar, cari hareketler ve ödeme planını kontrol edin.

Yeni kurulum için ZIP içindeki `KURULUM.md` belgesini kullanın. Eski kurulumdaki dosyaları rastgele silmeyin; önce yedek alın. Artık kullanılmayan `api/cari.php` ve `api/v2/v15.php`, yedek aldıktan ve yeni dosyaları yükledikten sonra eski kurulumunuzdan kaldırılabilir.

## Eski demoyu silip kapsamlı demoyu yüklemek

1. Önce dosya ve veritabanı yedeğinizi alın; `hosting/` dosyalarını yükleyip mevcut `api/config.php` dosyasını koruyun.
2. Yönetici olarak `update.php` sayfasına girin. Şema 9 güncelse **Veritabanını güncelle** düğmesinin görünmemesi normaldir; **Demo verilerini yenile** düğmesi kullanılabilir.
3. **Mevcut cari, hesap, kart ve işlem kayıtlarını silip kapsamlı demo verilerini oluştur** kutusunu işaretleyin ve **Demo verilerini yenile** düğmesine basın.
4. Başarı mesajını bekleyip uygulamaya dönün ve sayfayı yenileyin.

Bu işlem mevcut finansal kayıtları, araç ve kampanya takip kayıtlarını siler; gerçek verileriniz varsa demo seçeneğini kullanmayın. Yönetici hesapları, mevcut şifreleri ve kurulum yapılandırması korunur. Yönetici dışındaki demo kullanıcıları da temizlenir. Paket yedi aylık, 623 kayıtlı kapsamlı demoyu üreten kodu içerir: 4 hesap, 10 cari, 3 kredi kartı, geçmiş ekstreler, iadeler, kısmi ödemeler, planlı hareketler ve gelecek taksitler. Aynı işlem tekrar yapılırsa önceki demo değiştirilir; kayıtlar çoğaltılmaz. Demoda ayrıca 4 araç, 48 geçmiş/güncel araç kaydı, prim taksitleri ve 2 kampanya bulunur. Bu ek takip kayıtları 623 finansal kayda ilave bakiye hareketi oluşturmaz. Demo günü 13 Ekim 2026'dır.

Demo ayrı bir SQL dökümünü elle yüklemeyi gerektirmez; paket içindeki API oluşturur. Normal dosya güncellemesi demoyu kendiliğinden yüklemez.

## 1.13.0: yedekleme ve gerçek veriye geçiş

Ayarlar menüsü yöneticiye yedek al/indir/yükle/geri yükle ve demo temizliği sunar. 1.14.0 ile şema 12 kullanılır; şema 11 yedekleri geri yüklenebilir. Özel yedek klasörü web kökünün dışında ve PHP için yazılabilir olmalıdır; alt dizine kurulumda veya üst dizin yazılamıyorsa config.php içinde backup_dir için mutlak, özel bir yol tanımlayın. Yapılandırma dosyasını ve özel yedek klasörünü güncellemede koruyun.

Hosting ZIP'ini yüklemek kayıtları silmez. Gerçek veriye başlamak için Ayarlar → Demo verilerini temizle adımını yönetici parolasıyla uygulayın. Önce otomatik bir güvenlik yedeği alınır; yönetici olmayan kullanıcılar ve iş kayıtları temizlenir, yönetici hesapları korunur. Günlük/haftalık yedek Ayarlar'dan açılır. Uygulama kapalıyken de çalışması için hosting cron görevinde PHP 8.3+ ile api/backup-cron.php çalıştırılır; görev kendiliğinden kurulmaz.

## 1.14.0 kurulumu

Mevcut api/config.php ve özel yedek klasörünü koruyarak hosting ZIP'ini yükleyin. Yöneticiyle update.php üzerinden şema 12 geçişini uygulayın. Güncelleme öncesi sunucu yedeği alınır; yalnız kart banka adı metadatası eklenir, finansal kayıtlar ve yönetici hesabı korunur. Demo yenileme/temizleme seçeneğini kullanmayın. Önceki 1.13.x şema-11 Finans yedekleri yeni sürümde desteklenir. Otomatik yedek yalnız Türkiye saatiyle 03.00 cron ile, tüm türlerde toplam 5 kopya kuralıyla sürer.

## 1.15.0 güncellemesi

Yalnız web dosyaları içeren 1.15.0 hosting ZIP'ini kullanabilirsiniz. Mevcut `api/config.php` ve özel yedek dizinini koruyun. Şema 12 değişmedi; 1.14.0'dan geçişte ek migrasyon yoktur. Daha eski şemalarda `update.php` gereklidir. Yeni fabrika sıfırlama düğmesi yalnız açık parola/yazılı onayla çalışır; güncelleme herhangi bir veriyi kendiliğinden temizlemez. Cron komutu Ayarlar → Hosting cron kurulumu bölümünden alınabilir; sağlayıcınızın PHP CLI yolu/saat dilimini doğrulayın.

## 1.26.0 — Dosyaları eksiksiz yükleme

Mevcut config.php, özel yedekler ve kullanıcı verileri korunur. Yeni assets dosyalarını ve API kaynaklarını eksiksiz yükledikten sonra index.html dosyasını güncelleyin. Yeni paketi eski index veya eksik assets ile karıştırmayın. Önceki hashli assets dosyalarını hemen silmemek, açık tarayıcı sekmelerinin yüklemesini tamamlamasına izin verir. Yükleme sorunu varsa görünen yenileme ekranı tanılama içindir; verileri sıfırlama veya demo kurma gerektirmez.

## 1.27.0 — Personel hakedişi ve satır içi kayıt

Şema 12 korunur. Hosting ZIP içindeki yeni `api/staff-cron.php`, `api/v2/staff-automation.php` ve `api/v2/fields.php` dahil tüm API dosyalarını eksiksiz yükleyin; config ve özel yedek dizinini koruyun. Yeni personel tutarları profilde, dönem planı mevcut audit kaydında tutulur. Maaş/yemek otomasyonu için ayrıca cron kurulumu gerekir; dosya yüklemek tek başına zamanlanmış görev kurmaz. Başlangıç ayı varsayılan olarak sonraki aydır. Kurulum adımları tam paketteki `PERSONEL-CRON.md` içindedir. Eski yedekleme cron görevini personel göreviyle değiştirmeyin.
