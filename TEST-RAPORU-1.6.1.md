# Finans Paneli 1.6.1 — yerel doğrulama

Bu rapor bulut geliştirme ortamında yapılan kontrolleri kapsar. GitHub Actions sonucu ve gerçek paylaşılan hosting dağıtımı ayrı doğrulamalardır.

- Derleme: Node.js 22 ile başarılı.
- Birim/regresyon testleri: 22 geçti. Para, tarih, cari yönü, KMH, CSV, statik dosya güvenliği ve geliştirme betiğinin hata kodu kapsanır.
- Sites worker testleri: 4 geçti. API/PHP yolları statik uygulama kabuğuna yönlendirilmez.
- Finans API: 73 kontrol geçti. Kısmi kapama, iadeler, avanslar, taksitler, ekstre uzlaştırması, tekrar istek, iptal, KMH ayarları ve cari araması kapsanır.
- Migrasyon/kurtarma: 15 kontrol geçti. Şema 1'den 7'ye geçiş, yönetici ve bakiyelerin korunması, bozuk transferde rollback, yedekten geri kurma ve tekrar deneme kapsanır.
- Hosting ZIP'i üzerinden aynı 15 migrasyon ve 73 API kontrolü ile arayüz, güncelleme sayfası ve yerel font erişimi doğrulandı.
- Chromium tarayıcı kontrolleri: 62 geçti. Masaüstü, 768/390/320 px genişlikler, form kaydı, CSV indirme, mouse ve emüle dokunma hareketleri, modal ve takvim akışları kapsanır. Fiziksel cihaz/iOS testi yapılmadı.
- Önceki 1.6.0 frontend ile aynı API verisinde 7 ekran, 1440/390/320 px karşılaştırıldı. Sürüm metni normalize edilir; Chromium'un yuvarlatılmış kenar çiziminde en fazla 16 piksel farkına izin verilir, daha büyük fark başarısız olur.
- PHP dosyalarının sözdizimi kontrolleri geçti. ZIP'te gerçek config dosyası, eski cari API veya çalışma zamanı verisi bulunmaz. Migrasyon SQL'i tek kaynakla eşleşir; SHA-256 kontrolü geçer.

Test koşucusu ayrı Docker konteynerleri ve rastgele kimlik bilgileri kullanır; mevcut geliştirme config/veritabanını değiştirmez. Test çıktı ve ekran görüntüleri `.qa/` altında Git dışında tutulur. Şema sürümü 7 olarak korunmuştur.
