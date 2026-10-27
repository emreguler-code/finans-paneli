# Finans Paneli 1.11.0

Mobil cari listesi ve hareketler onaylı kompakt tasarıma geçti. Kapalı işlemde tür/tarih/tutar/açıklama; seçildiğinde etiket, ekleyen, işlem sonrası bakiye ve eylemler görünür. Masaüstü sütun sırası ve finansal etkiler korunur.

- Cari listesinde toplam alacak/borç/net tek özet yüzeyinde, tekrarlanan unvanlar kaldırılmış; sağda tek Son 5 işlem. Cari detayında son işlemler yerine türe bağlı Durum ve bilgiler.
- Personel: aktif ayın maaş hak edişi, açıkça seçilen maaş/avans ve yemek ödemeleri, tanımlı yemek tutarı ve haftalık izin kullanımı/hakkı. Aylık ödemeler ve pazartesi başlayan izin haftası düzenleme formunda seçilir; avans kendiliğinden maaşa sayılmaz. Eski dönem ve iptal edilmiş ödemeler güncel özete katılmaz. Bilgi eksikse tanımlanmadı gösterilir; yıllık izin takibi değildir.
- Tedarikçi: opsiyonel çoklu ziyaret günleri ve sonraki planlı ziyaret (bugün dahil), POS programları, ilişkili aktif kampanyalar. Ziyaret gerçekleşme kaydı veya gelmedi uyarısı yoktur. Kampanya geneli beklenen kazanç ile bu tedarikçiye bağlı doğrulanmış kazanç ayrıdır; puan TL bakiyesi değildir.
- Müşteri: son 6 tamamlanmış ayın aylık brüt satış ortalaması (iadeler hariç), vadesi gelen satışlarda vadeye kadar tahsil edilmiş tutar oranı ve açık vadeli tahsilatlar. Eksik/vadesiz veri başarı yüzdesine zorlanmaz.
- Hesap/kart listeleri: tekrar eden banka/program metinleri sadeleştirildi; özel kayıt adları korunur. Taksitli alışveriş Son işlemler'de tek toplamla görünür; dokununca özgün taksitler/dönemleri açılır. Gelecek taksit ayrı yeni alışveriş gibi gösterilmez. Kart borcunu artıran harcama kırmızı, ödeme/iade yeşil. Limit bilgileri ve ekstre uyarıları daha açık; tüm bildirim sayısı görünür.
- Araç ana listesi ve Özet tek sütunda yatay satırlar. Otomobil/motosiklet/kamyonet ve otomobil gövde tipi kaydedilebilir. Yağ, yağ filtresi, hava filtresi, yazlık/kışlık lastik ayrı bakım kalemleridir. Tanımlı tarih/km aralıkları ve poliçe süresi göstergeleri; önce dolan bakım sınırı esas alınır. Bu göstergeler gerçek aşınma veya otomatik lastik tavsiyesi değildir; eksik aralıkta yüzde üretilmez. Geçerlilik ve ödeme ayrı kalır.

## Yükleme

`finans-paneli-1.11.0-hosting.zip` içeriğini doğrudan web dizinine yükleyin; mevcut `api/config.php` korunmalıdır. Ardından yöneticiyle `update.php` üzerinden **şema 11** güncellemesini uygulayın. Önce özel yedek alınır; mevcut yönetici ve finansal kayıtlar korunur. Bu sürümde yalnız cari isteğe bağlı bilgi alanı eklenir; araç ek alanları mevcut JSON kayıtlarında saklanır.

Tam paket ayrıca kurulum belgeleri ve başlangıç SQL dosyalarını içerir. Hosting ZIP'i bunları taşımaz; gerekli çalışma migrasyonları ve font lisansı dahildir. Hostingde Node.js gerekmez.

Demo yenileme isteğe bağlıdır: mevcut kayıtları sıfırlar, yönetici hesabını/parolasını korur. Geniş demo 4 araç, 48 araç kaydı, örnek ziyaret günleri ve personel dönem bilgileri içerir. Canlı veriler otomatik sıfırlanmaz.
