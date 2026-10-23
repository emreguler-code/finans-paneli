# Finans Paneli 1.8.0 doğrulaması

23 Ekim 2026. Testler yalnız bu çalışma ortamında oluşturulan bağımsız PHP 8.3 / MariaDB 11.4 veritabanlarında sentetik kayıtlarla yürütüldü. Canlı hosting ve gerçek kullanıcı verileri değiştirilmedi.

- Node 24 ile npm ci ve üretim derlemesi; 28 birim ve 4 Sites worker testi geçti.
- Değişen altı PHP dosyasının sözdizimi kontrolü geçti.
- 113 gerçek API kontrolü: finans hesapları, POS seçimleri, opsiyonel cari gerekçesi, araç kayıtları, ödeme bağlantısı/tekilleştirme, kampanya koşulları/ödüller, sürüm çakışması, rol yetkileri ve denetim kaydı.
- 23 migrasyon/kurtarma kontrolü: eski şemadan 9'a geçiş, yedekten geri kurma, hatalı kaydı düzeltip yeniden deneme, şema 7/8 geçişinde bakiye ve POS bilgilerinin korunması.
- 422 Chromium tarayıcı kontrolü: masaüstü, 1100/768/390/320 px; arama, filtre, tarih aralığı, hesap/kart/cari hareketi, ödeme takvimi, kampanya ve araç oluşturma/düzenleme, alınan puan ayrımı, bağlı pencere davranışı ve hedef carinin tarihine geçiş. React çalışma zamanı hatası yok.
- Kapsamlı demoda 641 bağımsız finans uzlaştırması: bakiye = açılış + gerçek hareketler, cari etkileri, kart borcu/ekstre devirleri, yedi aylık ve 29 haftalık rapor dilimleri. İptal testi eklenince 589 kayıt; paket demosunun temelinde 588 kayıt vardır.
- Yoğun demo ile 105 ilave tarayıcı kontrolü.
- ZIP içinden gerçek kurulum, aynı API kontrolleri ve demo uzlaştırması; güncelleme ekranından iki defa demo yenileme geçti. Yönetici/parola korunur; yeni 2 araç, 7 araç kaydı ve 2 kampanya oluşturulur; eski demo çoğaltılmaz.
- ZIP bütünlüğü kontrol edildi. tracking.php ve yeni şema akışı pakettedir; gerçek config, oturum, yedek, test veritabanı ve node_modules pakette değildir.

Yerel kanıtlar (Git dışında): .qa/3b15c2403837/browser/, .qa/b62d6f693081/demo/, .qa/eb690ccdf54b/package-demo/. Masaüstü ve dar ekran ekran görüntüleri incelendi. Fiziksel telefon testi yapılmadı. GitHub Chromium 156 kontrolünde bulunan hesap bildirimi/arama eşitleme yarışı, hedef ve arama metnini ekrana çizimden önce eşitleyerek giderildi. GitHub CI kontrolleri etiket üzerinde tekrar çalıştırır; yayın sonucu release-status/v1.8.0 etiketiyle ayrıca doğrulanır.

Kampanyalar elle tanımlanır; banka verisi otomatik indirilmez. Beklenen kazanç tahmindir, alınan ödül ayrıca kaydedilir. Puan nakit bakiyesine eklenmez. Araç kaydını mevcut ödemeye bağlamak ikinci bir finans hareketi yaratmaz. Normal güncelleme demo yenilemez; şema 9'a geçiş için dosya yüklemesinin ardından update.php kullanılır.
