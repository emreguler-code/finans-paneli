# Finans Paneli 1.9.0 doğrulaması

26 Ekim 2026. Yalnız sentetik verili izole PHP 8.3/MariaDB 11.4 ortamları kullanıldı; canlı hosting ve gerçek veriler değiştirilmedi.

- `npm ci`, üretim derlemesi, 29 birim ve 4 Sites worker testi.
- PHP söz dizimi: değişen API dosyaları geçti.
- 117 finans/API kontrolü: kredi kartı hesap bağlantısının ayarlanması/temizlenmesi/geçersiz hesap reddi; finansal hareket ve bakiyelerin değişmemesi dahil.
- 27 migrasyon kontrolü: 1/7/8/9 → 10; yedek, başarısız geçiş ve tekrar deneme, mevcut yönetici ve kayıtların korunması, isteğe bağlı bağlantı alanı ve tekrar çalıştırma.
- Gerçek Chromium üzerinde masaüstü ve 320/390/768 px ekranlar; ortak arama/başlık, grid/detay, klavye, hesap uyarıları, formlar, iç içe takvim, POS, kampanya ve araç akışları. Tarayıcı senaryosu yeni tasarım kontrolleri dahil 414 kontrolü geçti; sonuç CI'dan da doğrulanır.
- Kapsamlı demo: 588 başlangıç finansal hareketi; geçmiş ekstreler, gelecek taksitler, 4 banka/kasa/KMH hesabı, 10 cari, 3 kart, araç ve kampanya örnekleri. 641 bağımsız finans uzlaştırması ve 105 demo tarayıcı kontrolü: aylık/haftalık raporlar, hesap hareketleri, ekstre toplamı/kalan ve son işlemler.
- Kurulum ZIP'iyle boş kurulum ve eski sürüm geçişi, güncelleme sayfası, font/arayüz/API erişimi; paket içindeki demo verilerini iki kez yenileme, eski deneme işlemlerinin kaldırılması ve yönetici şifresinin korunması.
- Taslaklar ile çalışan cari/kart detayları yan yana karşılaştırıldı; düzen, tipografi, renk, varlıklar ve metin kontrolü `design-qa.md` içindedir. Ek tasarım ekranları 1487/1100/390/320 px olarak incelendi; yatay sayfa taşması ve React hatası yok.

Yerel kanıtlar Git dışında `.qa/` içindedir. Finansal tablo sütun sırası, işaretler, cari/nakit/kart etkisi değiştirilmedi. Yeni hesap bağlantısı bilgi amaçlıdır; otomatik ödeme yapmaz. Sonraki kart tarihleri ayarlara dayalı tahmindir. Fiziksel telefon ve ekran okuyucu testi yapılmadı.

Yayın: GitHub `Hosting release` iş akışı aynı kontrolleri etiketli commit üzerinde tekrar çalıştırır; başarılı sonuçta ZIP ve SHA-256 dosyası GitHub Release'e eklenir. Canlı hosting kurulumu ayrıca kullanıcı tarafından yapılır.
