# Finans Paneli güncellemesi

Yüklenecek sürüm ZIP dosya adında belirtilir. 1.11.0 sürümü şema 11'i kullanır. Mevcut kayıtlar ve yönetici hesapları korunur. Şema 10 kurulumuna isteğe bağlı cari bilgi alanı eklenir; şema 9 kurulumunda ayrıca kart hesap bağlantısı tamamlanır; daha eski sürümler önce gerekli ara geçişleri tamamlar. Dosyaları yükledikten sonra yöneticiyle update.php üzerinden veritabanını güncelleyin.

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
