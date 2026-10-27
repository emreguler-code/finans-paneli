# Finans Paneli 1.11.0 doğrulaması

27 Ekim 2026. Testler yalnız Docker ile oluşturulan izole PHP 8.3/MariaDB 11.4 veritabanları ve sentetik kayıtlarla çalıştırıldı. Canlı hosting verisine dokunulmadı.

- Derleme, 40 birim ve 4 worker kontrolü: ziyaret günü/hafta sınırları, açık personel ödeme referansları, eksik/dolmuş bakım aralıkları, poliçe ayı, özel kart adı koruması, taksit gruplama ve müşteri tahsilat hesabı.
- 126 API kontrolü: cari metadata ve finansal etkiler ayrılığı, ziyaret günleri doğrulama, personel ödemesi iki kaleme sayılmaması, hafta ve izin hakları, araç türü doğrulama. Mevcut hesap/ekstre/kart/işlem senaryoları korunur.
- 32 migrasyon kontrolü: eski şemalar ve 10→11; başarısız geçişte yedek/yeniden deneme, finansal kayıtlar ve yönetici parolasının korunması. Yeni alan yalnız parties.profile_json; araç alanları mevcut JSON yapısında.
- 457 Chromium kontrolü: masaüstü, 1100/768/390/320 px; sayfa/arama hizaları, tablo sırası, keyboard erişimi, takvimlerin alana bağlı açılması, mobil seçili satırda meta ve eylemler, tek cari son işlem paneli, bağlamsal cari alanları, ziyaret gününü gerçek UI ile kaydetme, araç türü/bakım kalemi kaydı, süre/km göstergeleri ve yatay araç düzeni.
- Demo: 715 bağımsız uzlaştırma; 624 kontrol hareketi (623 başlangıç + iptal edilen kontrol), 29 hafta. Haftalık/aylık raporlar, hesap/cari/kart bakiyeleri; 4 araç, 48 araç kaydı, ödeme linklerinde çift sayım olmaması. Demo tarayıcı kontrolü 105 adım.
- Hosting-only ZIP: tam paketle dosya eşitliği, sadece web kökü içerikleri, özel config/oturum/yedek bulunmaması; gerçek boş kurulum, migrasyon, API, demo yenileme ve yönetici parolası koruma kontrolleri. ZIP ve SHA-256 doğrulaması.

Görsel karşılaştırma: [design-qa.md](../design-qa.md). Gerçek Chromium kullanıldı; fiziksel telefon, Safari ve ekran okuyucu testi yapılmadı. Aralık göstergeleri bakım aşınması ölçümü değildir. Personel/ziyaret bilgisi finansal hareket üretmez.
