# 1.12.0 doğrulama raporu

28 Ekim 2026. Yerel testler izole sentetik veritabanları ve Chromium üzerinde yürütüldü. Üretim hosting'ine/verisine erişilmedi; finansal API ve şema 11 değiştirilmedi.

- `npm ci --cache /workspace/.npm-cache` tamamlandı; `npm test`: **43 birim + 4 worker kontrolü** geçti. Yeni kontroller hash rotası, güvenli sorgu kodlama, Türkçe eşleşme, sahip/açıklama ayrımı ve arşiv/iptal kapsamını kapsar.
- API: **126** kontrol; migrasyon/kurtarma: **32** kontrol geçti. Kanıt: `.qa/b5bd55e4f0ef`, `.qa/bae9b493ee84`.
- Derlenmiş uygulama tarayıcı turu: **482** kontrol geçti, React çalışma hatası yok. Kanıt: `.qa/e7134b93259e/browser/checks.json`. 2540/1920/1440/1100/768/390/320 px yüzeyler; mevcut muhasebe/form/araç/kampanya kontrolleri ve yeni sürüm senaryoları.
- Yeni senaryolar: varsayılan dönem ile etkin filtre ayrımı, temizleme; tam genişlik cari özeti; F5 ve Geri/İleri; ana menüden temiz liste; alt menü kapanması; genel arama ve çalışan kategori filtresi; Türkçe alan hatası/odak; Esc ile taslağı koruma; kısmi ödeme önizlemesi ve gerçek API kaydı; kompakt mobil kart; masaüstü görünür hücrede kesintisiz seçim çizgisi; zorunlu tarihte ikinci modal açmadan doğrulama.
- Geniş demo: **715 çapraz kontrol**, 624 test hareketi ve 29 haftalık dönem; **105 demo tarayıcı kontrolü** geçti. Kanıt: `.qa/cea2da69034f/demo/`. Yeni sürüm testleri ayrıca kendi izole kayıtlarını oluşturur; bunlar paket içindeki demo üretim koduna veya canlı veriye eklenmez.
- Paketlenmiş uygulama kurulumu/güncelleme: **14 updater kontrolü**, aynı ortamda API/migrasyon/demo uzlaştırması geçti. Kanıt: `.qa/955386021721/package-demo/`. Son ZIP için bu kapı paket üretiminden sonra tekrar çalıştırıldı.
- Tam ve hosting-only ZIP dosya eşleşmesi, SHA-256 ve ZIP bütünlüğü doğrulandı. Hosting ZIP doğrudan web kökü yapısında; config.php, oturum, test verisi ve QA dosyası içermez.

Görsel kontrol `.qa/design-112/` altındadır; 1440/768/390/320 px gerçek çalışan form, kart özeti, cari listesi, genel arama ve iç takvim ekranları incelendi. Son rötuşlar masaüstü form alanlarını mevcut 14 px ana metin rolüne eşitleme ve mobil tutar/TL birlikteliğidir; mobil girişler 16 px kalır. Dar ekran kontrolü Chromium görünüm alanı testidir; fiziksel iOS/Android klavyesi veya tam ekran okuyucu sertifikasyonu değildir.

GitHub Actions, yayın etiketi üzerinden bağımsız olarak derleme, PHP sözdizimi, API, migrasyon, tarayıcı, demo ve paketlenmiş kurulum kontrollerini tekrar çalıştırır. Yerel test raporu bu uzak koşunun henüz yapılmamış sonucunu başarı olarak varsaymaz; yayın durumu Actions ve release-status/v1.12.0 etiketiyle doğrulanır.
