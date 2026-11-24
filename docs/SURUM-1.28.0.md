# 1.28.0 — Kompakt ortak formlar ve sade mobil gezinme

24 Kasım 2026 tarihli “kodla ve githuba yükle release yayınla” talimatının kapsamıdır. Hosting yükleme ve cron kurulumu kullanıcıya aittir.

## İşlem girişi ve düzenleme

Finansal işlemler tablo hücreleri yerine hareket listesinin üstündeki ortak formda eklenir ve düzenlenir. İşlem türü doğrudan düğmelerden seçilir. Tedarikçinin alış türü faturalı/faturasız olarak ayrıca belirtilir; müşteri satış/tahsilat/iade, personel ödeme/tahsilat/borçlandır akışlarını korur. Personelde manuel maaş ekleme geri getirilmez; eski hakediş düzenlemeleri ve otomasyon korunur.

Tutar/açıklama ana gruptur; ödeme kaynağı ve kısmi ödeme gibi zorunlu alanlar doğrudan görünür. Tarih-saat aynı seçicide, etiket ve isteğe bağlı ayrıntılar kompakt erişimlerdedir. Ek işlem seçilmeden Diğer bilgiler gösterilmez. Zorunlu boş alanın kısa vurgusu ve azaltılmış hareket tercihi korunur. Kayıt önizlemesi taslak olarak belirtilir; düzenlemede mevcut bakiyeye yalnız yeni etki ile eski etkinin farkı eklenir. Sayısal bakiye ile eylem düğmeleri aynı hücreyi paylaşmaz.

Form kapalı başlar, Yeni işlem ekle ile açılır ve başarılı kayıt sonrası kapanır. Hatalı kayıt taslağı kaybetmez. Aynı anda tek finansal taslak, terk etme koruması, düzenleme gerekçesi, id/version ve atomik API devam eder. Hareket satırları salt okunurdur; seçili satır ve kaynağa yönlendirme korunur.

Varsayılan sıralama işlem tarihi ve saatine göre yeniden eskiyedir. Sisteme giriş tarihi kullanılmaz. Son 30 hareket üsttedir; eski kayıtlar alta eklenir. İşlem sonrası tarihsel bakiye görüntüleme sırasına göre yeniden hesaplanmaz. Oturum içinde açıkça değiştirilen sıralama korunur; cari dizinin alfabetik sırası ayrıdır.

## Ortak kayıt sistemi

Cari/hesap/kart/araç/kullanıcı/kampanya kayıtları ortak bölüm başlıkları, modern seçimler, duyarlı alan grupları ve yazılı Kaydet/Vazgeç eylemlerini kullanır. Oluşturma formları ilgili listenin üstündedir. Araç takibi, ekstre ve kampanya ilişkilerinin kendi alanları korunur; finansal tutarlar, kart limiti ve kampanya puanları birbirine dönüştürülmez. Araç kaydı ikinci bir ödeme üretmez.

Cari profil düzenlemesi sağdaki Durum ve bilgiler kartının kendi içinde yapılır. Üst bakiye yanındaki gereksiz açılır ok ve düzenleme düğmeleri kaldırıldı. IBAN/TCKN kopyalama yalnız minimal ikondur; dokunma alanı ve erişilebilir ad korunur.

Personelin çalışma takvimi gerçek Europe/Istanbul gününün pazartesi-pazar haftasını gösterir. Demo işlem tarihi veya aylık özet seçimi takvimi geriye götürmez. Görünürlük/odak dönüşünde ve 30 saniyelik kontrolle hafta yenilenir. Önceki tarihlerin vardiyaları yeni haftaya kopyalanmaz.

Mobil alt bölüm gezinmesi ve Diğer penceresi tamamen kaldırıldı. Bölümler hamburger menüden açılır; eski alt gezinme satırı/boşluğu yoktur. Form eylemleri kendi formunda kalır. Sidebar kısa pencerede kaydırılabilir; kaydırma izi boşta saydam, hover/klavye odağında görünürdür. Menü öğeleri kesilmez.

Şema 12 ve API hesap modeli değişmedi. [Doğrulama](TEST-RAPORU-1.28.0.md).
