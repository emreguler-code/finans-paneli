# 1.19.0 — Onaylanan cari görünümü ve etkileşimler

Kullanıcının 1.18.1 sonrasında verdiği notların toplu kodlama ve çalışan sürümde test onayıdır. Yeni finansal model, veri temizliği veya hosting kurulumu içermez. Şema 12 ve API'nin finansal yönleri değişmez.

- Açılan hareketin ikinci satırı tarih/saat, yalnız gerekli kısmi ödeme/net etki ve eylemlerden oluşur. Ana satırdaki tutar/bakiye tekrarlanmaz. Mobil bakiye ayrıntıda bir kez görünür; dokunma hedefi 44 px.
- İşlem ve Ekleyen ayrıldı. Cari sıra: Tarih / Açıklama / Etiket / İşlem / Ekleyen / Tutar / Bakiye.
- Tutar rakamları nötr; yalnız +/− işareti yön renginde. Satır bakiyesi kendi işaretine göre yeşil/kırmızı, sıfır nötr. Mevcut işlem etiketleri korunur.
- Tarihe göre sıralamada aylık pozitif/negatif/net etki özeti; API party_effect tutarlarından, sayfa sınırından bağımsız tüm filtrelenmiş ay için hesaplanır. İptal/plan dahil değil. Tek ay iki sayfaya bölünürse aynı tam ay özeti her sayfada gösterilir. Tutar sıralamasında ay blokları oluşturulmaz.
- İşlem tarihi Bugün/Dün/planlanan Yarın; ±7 gün içinde gün/ay/saat, eski kayıtlarda gün/ay, farklı yılda yıl; açılan satırda tam tarih/saat. Demo için uygulamanın today değeri referanstır, oluşturma tarihi kullanılmaz.
- Cari listesinde üçlü kompakt özet, Net sağda; yerel ortak araç çubuğu; tek satır bakiye önünde Lucide ArrowUpRight (alacak), ArrowDownLeft (borç), Dot (sıfır). Erişilebilir ad yönü korur. Liste satırları ve Tür başlığı hizalıdır.
- Yan alan alta geçtiğinde içindeki kartlar da ana alanın tam genişliğine ulaşır.
- Sıralama ikona bağlı kompakt pencere; blur ve modal arka plan yok. Filtre/sıralama kısa açılış/kapanış geçişi, azaltılmış hareket desteği.
- Cari detayına girince işlem formu otomatik açık, klavye odağı zorlanmaz. Başlık + kaldırıldı. Aynı 44 px düğme aynı koordinatta ×/+ olur; gizleme taslağı korur. Vazgeç/başka kayda geçiş/düzenlemeye geçiş/yenileme koruması sürer. Başarılı kayıt formu temizler, yeni istek anahtarı üretir; aynı hareket tekrarlanmaz.
- Menü görünümü düğmesi tam → dar → gizli → tam döner, seçenek penceresi açmaz. Mobilde aç/kapat. Kaydedilmiş tercih boyut değişiminde korunur.
- Kısa, sakin hareketler; yüklemede iskelet, geciken aramada gösterge, kayıt sırasında mevcut meşgul kilidi. Hareket azaltma tercihi animasyonları kapatır. Rakam saydırma yok.

Aday dal: `codex/1.19.0`. Candidate QA akışı otomatik test/paket üretir; GitHub Release veya hosting yayını yapmaz. Çalışan Chromium/WebKit testleri fiziksel iOS/Firefox testi olarak sunulamaz.
