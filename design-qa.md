# Finans 1.14.0 tasarım doğrulaması

final result: passed

30 Ekim 2026. Kaynak: onaylı tam sayfa kart oluşturma ve kompakt alt işlem alanı görselleri; docs/TASARIM-ILKELERI.md ve docs/SONRAKI-SURUM-NOTLARI.md.

Kaynaklar: `/workspace/generated_images/exec-4879f0ae-5724-4e29-9ffe-066582705cdd.png` ve `/workspace/generated_images/exec-84adf05e-3da6-4468-be85-e961c3431f3f.png` (1487×1058). Gerçek derlenmiş uygulama görüntüleri `.qa/design-114/card-create-desktop.png`, `dock-desktop.png` (1440×1024), `dock-768.png`, `dock-390.png`, `dock-320.png`. Kaynak ve uygulama birlikte görsel olarak incelendi; kıyaslama ortak içerik sınırları ve bileşen rolleri üzerinden yapıldı, farklı viewportlar piksel eşitliği olarak değerlendirilmedi. Onaylı proje oranı 1,9:1, mevcut Inter/Lucide, renk ve boşluk tokenları yaklaşık görsel ölçülerinin önündedir. Sentetik veri ve tarih farklılıkları tasarım farkı sayılmadı.

- Kart, hesap, cari, araç oluşturma: ortak başlık, Kaydet/Vazgeç, ana bilgi ve isteğe bağlı yardımcı bölüm. Desktop 1,9:1, dar ekranda tek sütun. Giriş ekranında içeriksiz filtre düğmesi yok; genel arama erişilebilir.
- Ekleme/düzenleme alt alanı ana ve yardımcı sütunların ortak kenarlarında biter; sol menüye veya dış boşluklara yayılmaz. Masaüstü temel alanlar yatay, Diğer seçenekler açıkça etiketli; mobil iki sütun ve açıklama tam satır. Arka plan blur/karartma yok.
- Mobil alt gezinme 56 px + safe-area; dört hedef, en az 44 px dokunma alanı. Yeni kayıt sayfasında aynı bölgede bağlamsal Kaydet/Vazgeç. Klavye görünümünde gezinme gizlenir; form görünür viewport içinde kalır.
- İncelemede saptanıp giderilenler: alt formdaki gereksiz 20 px alan marjları; cari tablosunun eski 1000 px minimum genişliğinden taşması; Genel etiketinin kırılması; dar ekranda kesilen tarih; form açılışında gecikmeli odağın hızlı veri girişini bozabilmesi.
- Türkçe doğrulama, kapalı ayrıntıları açan hata odağı, görünür fokus, taslak iptali onayı, gerçek tarayıcı Geri/İleri ve sayfa yenileme kontrol edildi. Banka araması 320/390 px içinde kalır.

Son kanıt: `.qa/cda670b4b084/browser/checks.json`; 591 kontrol, sıfır çalışma zamanı hatası. 1920/1440/1100/768/390/320 px senaryoları. Fiziksel iOS/Android, gerçek mobil klavye ve ekran okuyucu testi yapılmadı; klavye visualViewport benzetimiyle doğrulandı. Görseller ve test verisi sentetiktir; özel oturum/config/yedek dosyaları depoya eklenmez.
