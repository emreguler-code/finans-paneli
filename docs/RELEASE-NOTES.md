# Finans Paneli 1.14.0

30 Ekim 2026 · Şema 12.

- Kredi kartı, hesap, cari ve araç oluşturma: ortak başlık/eylemler ve 1,9:1 ana/yardımcı alanlarla tam sayfa.
- İşlem ekleme ve kayıt düzenleme: ana/yardımcı sütunların ortak sınırına hizalı kompakt alt alan; gerekli bilgiler açık, diğer seçenekler erişilebilir. Mevcut alan ve finansal anlamlar korunur.
- 25 bankalık aranabilir ortak liste; aynı form içinde özel banka adı girişi. Banka adı hesap/kartla birlikte kaydedilir, diğer menüde seçilebilir; büyük/küçük harf ve boşluk farklılıkları yinelenmez. Programlar bankaya göre önerilir ve isteğe bağlıdır.
- Mobilde kompakt dört hedefli gezinme; oluşturma sayfasında bağlamsal Kaydet/Vazgeç, işlem alanında gezinme ve klavye için uygun boşluk.
- Türkçe doğrulama, kapalı alanları açan hata odağı, kaydedilmemiş taslak koruması, mevcut değerlerle düzenleme ve idempotent kayıt istekleri.
- Şema 11 → 12, yalnız kart banka adı metadatasını ekler. Güncelleme yedek alır; kullanıcı ve finansal kayıtları temizlemez. 1.13.x şema-11 yedekleri geri yüklenebilir. Gece 03.00 cron ve toplam 5 yedek kuralı korunur.

Hosting paketini yüklerken api/config.php ve özel yedek klasörünüzü koruyun. Ardından update.php üzerinden Veritabanını güncelle işlemini uygulayın. Hostingde kendiliğinden dağıtım veya veri temizliği yapılmaz.
