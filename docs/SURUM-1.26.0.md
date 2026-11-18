# Finans Paneli 1.26.0

18 Kasım 2026 tarihli açık kodlama ve yayın talimatıyla biriken notlar uygulanır. Şema 12; kullanıcıların gerçek yapılandırması, işlemleri ve yedekleri korunur. Hosting yükleme ve inceleme kullanıcıya aittir.

- Satır içi yeni işlem ve düzenleme aynı sütun hizasını paylaşır. Turkuaz aktif çizgi alt alanlarda kesilmez. Alan kenarı yerine metin başlangıçları hizalanır; tarih kompakt, sağ eylemler ikon olarak kalır.
- İşlem seçilmeden Ek bilgiler görünmez. İşlem seçildiğinde boş zorunlu ek alan varsa bölüm açılır ve ilgili alan bir defa 750 ms turkuaz çerçeve vurgusu alır. Diğer işlemlerde kapalı başlar; doldururken kendiliğinden kapanmaz. Hareket azaltma tercihi korunur.
- Yeni etikette Genel yer tutucudur; boş bırakılan etiket yine Genel olarak kaydedilir. Düzenlemede mevcut etiket ilk odakta seçilir.
- Yeni işlem tarihi başlangıçta yalnız takvim ikonudur. Tarih seçilip Uygula denildiğinde düz tarih metnine dönüşür; tekrar tıklanabilir. Saat aynı takvim penceresindedir. Yeni kayıtta saat değiştirilmezse kaydetme anındaki uygulama saati, düzenlemede mevcut saat korunur.
- Personel işlemlerinde belge/fatura no alanı gösterilmez; eski kayıt bilgisi silinmez. Maaş Ekle işleminde Ödeme yapılmadı varsayılandır; ödeme tutarı pasiftir. Hesap seçildiğinde tam maaş önerilir, azaltılırsa kısmi ödeme olur. Hakediş brüt kaydedilir, yalnız ödenen tutar kasa/bankadan çıkar. Tek olay içindeki ödeme yeniden ayrı kayıt olarak sayılmaz. Fazla/negatif ödeme ve kredi kartından maaş ödemesi reddedilir.
- Personel aylık özeti doğrudan maaşla kaydedilen ödemeyi ve açıkça aya bağlanan diğer ödemeleri kullanır. Bağlantısız ödeme varsa gerçeğe aykırı oran yerine açıklama gösterir. Tek hakediş türünde gereksiz ikinci halka yoktur; sıfır kalemler gizlidir. Grafik küçültülür. Boş haftalık plan açıkça belirtilir.
- Cari listesi başlık satırı yükleme sırasında yer değiştirmez; gösterge aramanın içindedir. Sayfa/kayıt değişimi 350 ms hafif yönlü geçiş kullanır; geri dönüş ters yöndedir. Arama ve aynı ekrandaki güncellemeler animasyonu tekrar başlatmaz. Hareket azaltmada geçiş yoktur. Apple belgelerinde tek evrensel iOS süresi olmadığı için bu süre ürünün başlangıç tercihidir.
- Başlangıç modülü eksik/yüklenemiyorsa boş sayfa yerine yenileme açıklaması vardır; beklenmedik React render hatası görünür kurtarma ekranına düşer. Kullanıcının 1.25.1 canlı boş sayfa nedenini gösteren konsol/hosting kanıtı bulunmadığından kök neden kesinleşmiş sayılmaz. Bu sürümde paket ve kayıp-modül senaryoları ayrıca doğrulanır.

Hostinge hazır ZIP ve SHA-256 `releases/1.26.0/` altında ve GitHub Release varlıklarında tutulur. Güncelleme sırasında mevcut `api/config.php` ve özel yedekler korunmalıdır. Dosyalar eksiksiz yüklenmeli; varlıklar yüklenmeden yeni index yayınlanmamalıdır. Bu sürüm canlı hosting erişimi veya otomasyonu içermez.

Derleme araçlarındaki henüz yaması bulunmayan picomatch danışması için dar ve süreli [güvenlik istisnası](GUVENLIK-ISTISNASI-1.26.0.md) yayın denetiminde açıkça raporlanır.
