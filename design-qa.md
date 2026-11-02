# Finans 1.15.0 tasarım doğrulaması

final result: passed

2 Kasım 2026. Kaynak: kullanıcının 31 Ekim ve 2 Kasım ekran görüntüleri/düzeltmeleri; docs/TASARIM-ILKELERI.md ve onaylı sonraki sürüm notları. Ortak cari tam sayfası ve tek satır işlem alanı, 1.14.0 kaynaklarının kullanıcı tarafından revize edilmiş devamıdır.

Derlenmiş uygulama kanıtı: `.qa/design-115/party-edit-desktop.png`, `dock-desktop.png`, `calendar-desktop.png`, `calendar-390.png`, `calendar-320.png`, `settings-desktop.png`, `backup-repeat.png`, `reset-confirm.png`. Masaüstü 1440×1024, mobil 390/320×844. Kaynak ve gerçek görüntülerde bölüm/başlık/alan rolleri karşılaştırıldı; sentetik tarih ve ad farklılıkları piksel eşitliği iddiasıyla değerlendirilmedi.

- Cari ekle/düzenle aynı sayfa, aynı başlık ve 1,9:1 ana/yardımcı oran. Önceki bilgiler dolu gelir; gerekçe opsiyoneldir. Başlık eylemleri ve mobil bağlamsal eylemler korunur.
- İşlem alanının üst başlık satırı kaldırıldı. Temel kontroller ile Kaydet/X ortak satırdadır; açıklama geniş alanı kullanır. Tarih 44 px erişilebilir takvim ikonudur. Diğer seçenekler ve finansal etki açılabilir; hatalar gerekli olduğunda görünür.
- Tek aylık takvimde eski iki sütun kalıtımı kaldırıldı. Yedi gün sütunu pencere genişliğini doldurur; 320 px'de de okunur, sayfa kayması/blur yoktur. Takvim kendi ikonuna bağlıdır.
- Kart detayında hedef seçimi yoktur. Kaynak hesap yalnız ödemede ayrı alandır; kasa/banka seçenekleri görüntülenir. Kullanıcı hangi kartta olduğunu sayfa başlığından görür.
- Ayarlar mevcut tam geniş özet ve 1,9:1 düzeni korur. Cron komutu satır kırabilir ve kopyalanabilir. Tekrarlı yedek onayı gerçek silinme etkisini açıklar; fabrika sıfırlama gerçek verilerin kaybını ve korunan yöneticiyi açıkça belirtir. Bu onaylar mevcut bakım onay yüzeyini kullanır; takvim gibi gündelik seçimler blur kullanmaz.
- Mobil alt bar ve klavye boşluğu korunur; X genişliği 44 px, temel alanlar okunabilir iki/tek sütuna akar. 1920/1440/768/390/320 px yeni işlem alanları ve ortak eski sayfalar tarandı. Dokunma hedefleri sıkıştırılarak tek satıra zorlanmadı.

Son tarayıcı kanıtı `.qa/7cc508d1cc7a/browser/checks.json`: 616 kontrol, sıfır çalışma zamanı hatası. Özel QA görselleri/config/oturum/yedekler commit edilmez. Fiziksel iOS/Android, gerçek mobil klavye ve ekran okuyucu testi yapılmadı; Chromium viewport ve visualViewport benzetimiyle doğrulandı. Canlı hosting verisi değiştirilmedi.
