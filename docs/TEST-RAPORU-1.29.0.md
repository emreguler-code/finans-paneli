# 1.29.0 doğrulama

Kontroller yalnız sentetik/izole verilerle yapılır. Node 26.13.1, npm 12.2.2, Python 3.15.2; PHP 8.5.12 / MariaDB 12.3.3. Canlı hosting veya fiziksel iPhone testi değildir.

- ESLint/Stylelint, tüm desteklenen dosyalarda Prettier, derleme; 92 birim ve 4 Sites worker testi başarılı.
- Gerçek API: 206 kontrol; migrasyon: 34; yedekleme/geri yükleme: 77 kontrol başarılı.
- Fazla ödeme: satış/alış, kasa/kart, toplam kaynak etkisi, tekrar istekte tek kayıt çifti, düzenleme, iptal/geri açma, kaldırılmış fazlalığın geri gelmemesi, bağımsız çocuk kaydı düzenleme yasağı ve avans kontrolü.
- Yeni rapor birim kontrolleri: iptal/planlı işlemlerin nete dahil olmaması, satır bakiyelerinin toplanmaması, kart döneminin ve sayısal negatif CSV değerlerinin korunması, fazla ödeme önizlemesinin eski bağlı etkiyi çıkarması.
- Gerçek API ile Chromium masaüstü akışları başarılı. Güncel sentetik arayüz koşucusu `tests/forms129-browser.cjs`; üç cari türü, bağımsız form kartı, tek alış, ödeme anahtarı, yerinde profil, sade geçmiş, silme önizlemesi, kopya ikonları, CSV ve PDF kontrolleri içerir.
- PDF tarayıcıdan indirildi, PDFDocument ile sayfa sayısı doğrulandı; ayrıca `pdftotext` ile Türkçe metin/toplamlar incelendi ve ilk sayfa görüntüye dönüştürülerek kontrol edildi. Test PDF'si 76 kayıt ve üç sayfadır. Arayüz menüleri PDF'ye taşınmaz.
- Güvenlik denetimi bilinen açık bildirmedi. Önceki dar/süreli güvenlik istisnası politikası korunur.

Chromium/WebKit/Firefox sentetik arayüz kabulü tarayıcı başına 79 kontrolle başarılı. Gerçek API ile üç motorlu mobil kabulü ve kapsamlı demo başarılı; 624 olay, 29 hafta ve 715 mutabakat kontrolü. Paket kurulumu, hosting/tam ZIP eşliği ve eski kurulum üzerine config/eski assets koruması doğrulandı. Ekranlar ve sentetik PDF örneği `docs/evidence/1.29.0/` altındadır. Aktif satırın çalışan Chromium ölçümünde son metin/ikon boşluğu yaklaşık 10,2 px, ikon/alt sınır boşluğu 8,5 px; görünür yazı kutusu farkı 2 px altındadır.

## GitHub yayın sonucu

[Windows/Linux kabulü](https://github.com/emreguler-code/finans-paneli/actions/runs/45632961497) başarılı. [v1.29.0 Release](https://github.com/emreguler-code/finans-paneli/releases/tag/v1.29.0) kaynak `34b7ef5a266fe4f1ab3e65f03407237f45346bd7` için yayımlandı. Dört varlık indirildi; hosting/tam ZIP ve SHA-256 dosyaları yerel test çıktısıyla birebir eşleşti. Hosting ZIP ayrıca repo dosyasıyla karşılaştırıldı. Her iki checksum ve tag/kaynak eşliği [yayın kaydında](evidence/1.29.0/publication.json) doğrulandı. Hosting yükleme/inceleme ve cron kurulumu kullanıcıya aittir.
