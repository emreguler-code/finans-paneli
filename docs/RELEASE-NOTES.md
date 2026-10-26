# Finans Paneli 1.9.1

1.9.0 tasarım güncellemesinin bakım sürümüdür. Hesap/kart detayında arama kapsamı listeye alındığında eşleşen kayıt artık özeti ve hareketleriyle seçilir. Eşleşme yoksa açık boş durum ve listeye dönüş korunur. Hareket araması gerçek bakiyeyi değiştirmez; tüm hesapların uyarıları görünür kalır.

Kurulum: ZIP içindeki `hosting/` dosyalarını yükleyin; mevcut `api/config.php` dosyanızı koruyun. Şema 10 kullanılır; 1.9.0'dan ek migrasyon yoktur. 1.8.0 ve öncesinden geçiyorsanız yöneticiyle `update.php` üzerinden güncelleyin. Demo yenilemesi isteğe bağlıdır.

Aşağıdaki 1.9.0 tasarım kapsamının tamamı bu pakete dahildir.

---

# Finans Paneli 1.9.0

- Hesaplar ve kredi kartlarında carousel kaldırıldı. Duyarlı grid kart listesi ve karttan açılan ayrı hareket detayları; klavyeyle seçim, listeye dönüş, liste aramasının korunması.
- Cari, hesap ve kart detaylarında ortak başlık: geri ve yeni işlem düğmeleri üstte; bilgi/düzenleme ikonları altındaki tek özet bandında. Kredi kartında kullanılabilir limit, ekstre kalanı, dönem içi/gelecek taksitler, son ekstre toplamı/ödenen ve mevcut/sonraki dönem tarihleri ayrı gösterilir.
- Kart ayarlarında isteğe bağlı bağlı hesap seçimi. Bu yalnız bilgi bağlantısıdır; otomatik ödeme oluşturmaz. Sonraki tarihler ayarlara dayalı tahmindir, bankanın kesin ekstresi değildir.
- Raporlar ve Ödeme Planı tek bölümlenmiş özet yüzeyini kullanır. Ana/sağ sütun oranı 1,9:1; hesap uyarıları ve araç işleri aynı yerleşim dilini izler. Hesap uyarıları seçim/aramadan bağımsız kalır, ilgili hesabı ve hareketi açar.
- Kampanyalar alt menüsü başlangıçta gizlidir; Kredi kartları açıldığında görünür. Masaüstü ve mobil gezinme aynı kuralı izler.
- Tek gün dahil tüm takvimler tıklanan alanın yanında açılır. Ek bulanıklık, karartma ve sayfa kayması yoktur; Esc yalnız takvimi kapatır, üst form açık kalır.
- Ortak panel boşlukları, kaydırılabilir tek satır sekmeler, ikon adları, mobil dokunma alanları ve takvim gezinme kontrolleri düzeltildi. Kullanıcılar sayfasındaki ilgisiz finans dipnotu kaldırıldı. Embla ve kullanılmayan carousel stilleri çıkarıldı.
- Kapsamlı, isteğe bağlı demo verileri pakette korunur; örnek kartın bağlı hesabı açıkça atanır. Finansal model, tablo sütun sırası ve mevcut bakiye hesapları korunur.

**Güncelleme:** ZIP içindeki `hosting/` içeriğini yükleyin ve mevcut `api/config.php` dosyanızı koruyun. Yöneticiyle `update.php` üzerinden şema **10** güncellemesini çalıştırın. Yönetici ve mevcut kayıtlar korunur. Önce dosya/veritabanı yedeği alın. Demo yenilemesi mevcut kayıtları silen, ayrı ve isteğe bağlı bir işlemdir.

---

# Finans Paneli 1.8.0

- Bildirim ziline bağlı kompakt pencere; gecikmiş/bugün/yaklaşan grupları, aynı cari için kalan tutarların özeti ve hedefe geçiş.
- Ortak filtreler ve tüm tarih aralığı takvimleri tıklanan alana bağlı açılır; arka plan bulanmaz, sayfa aşağı itilmez. Filtreler Uygula/Enter ile uygulanır; Esc/dışarı tıklama taslağı iptal eder. Sayfaya uygun etiket, cari ve tutar filtreleri eklendi; 3 karakter/300 ms arama korunur.
- Aktif cari hareketi ve işlem ikonları tek yüzeydir. Hesap/kart düzenleme ikonları kendi kartındadır. Cari kartı düzenleme gerekçesi isteğe bağlıdır; finansal hareket gerekçesi zorunlu kalır.
- Tedarikçilerde isteğe bağlı çoklu POS banka/programı: Garanti Bonus, Akbank Axess, Yapı Kredi World.
- Kredi kartları altında Kampanyalar: tarih, katılım, kart/POS/tedarikçi/etiket koşulları, asgari tutar, işlem sayısı, kazanç sınırları, puan/nakit iade/ek taksit/erteleme. Alışveriş ilişkilendirme, taksitleri tek alışveriş sayma, beklenen/alınan kazanç ayrımı ve tedarikçiye göre uygun kart karşılaştırması. Puanlar nakit bakiyesine eklenmez; banka kampanyalarının koşulları elle kaydedilir.
- Araçlarım: plaka/model/km, sigorta/kasko geçmişi, MTV, muayene, tarih veya kilometreye bağlı bakım; hatırlatmalar, tahmini/kesin tutar ve prim taksitleri. Mevcut gerçek ödemeler bağlanır; aynı ödeme iki araç kaydına sayılamaz. Kesin ve ödenmemiş tutarlar ödeme takvimine girer.
- İsteğe bağlı kapsamlı demo artık araç ve kampanya örneklerini de içerir. Yönetici/config korunur. Normal güncelleme verileri sıfırlamaz.

Güncelleme: hosting dosyalarını yükleyip mevcut api/config.php dosyanızı koruyun; yöneticiyle update.php üzerinden şema 9'a geçin. Önce dosya/veritabanı yedeği alın. Demo yenilemesi ayrı, silici ve isteğe bağlı bir işlemdir.

---

# Finans Paneli 1.7.2

Sayfa geçişinde ortak aramanın kısa süreliğine içerikte belirmesi engellendi. Ortak aramada 3 karakter / 300 ms otomatik arama, büyüteç düğmesi ve hareket paneliyle aynı kenarlık rengi. Fat. Alış / Fatsız. Alış etiketleri ve daha dar işlem alanı.

Hesap uyarıları ayrılmış sağ sütunda tüm aktif banka/kasa/KMH hesapları için görünür. Uyarı ilgili hesabı, sekmeyi ve hareket satırını açar; hareketsiz uyarılar hesap bilgisini gösterir. Dar ekranda sabit Uyarılar düğmesi vardır. Tablet hareket açıklamalarının harf harf bölünmesi giderildi.

Kesim sonrası kartlar arası borç aktarımının kaynak kartta eski ekstreye girmesi düzeltildi; hedef karttaki ödeme görünümü korunur. Ekstre listesine önceki dönem borcunu görünür kılan devir satırı eklendi; mevcut borç hesabı değişmedi.

Paket içindeki update.php → Demo verilerini yenile seçeneği eski kayıtları silip 588 kayıtlı yeni demoyu oluşturur; yönetici şifresi korunur. İsteğe bağlı yönetici demo yenilemesi yedi aylık kapsamlı sentetik veri oluşturur; finans uzlaştırması, ay/hafta raporları ve yoğun veri tarayıcı kontrolleri eklendi. Şema 7, yönetici ve config korunur. Demo yenilemesi işlem verilerini siler; yalnız bu açık seçenek seçilince çalışır.

---

# Finans Paneli 1.7.1

16 Ekim 2026. 1.7.0 arayüz gerilemelerini ve güncelleme ekranının açıklamasını düzelten bakım sürümü.

- Sağ üst tarih/gün bilgisi ve masaüstü Ctrl K ipucu geri getirildi. Tek ortak arama ve onaylı filtre davranışı korundu.
- Arama, filtre ve Ara düğmeleri tüm sayfalarda aynı 44 px satıra hizalandı; arama ve içerik aynı esnek çerçeveyi kullanır. Mobil ekle düğmeleri başlıkla aynı satırdadır.
- Genel bakıştaki gereksiz sıfırlama satırı kaldırıldı. Hesap/kart listesi ile hareket tablosunun sıralama ve CSV araçları yeniden bağımsızdır; tablo araçları sağa hizalanır.
- Ekran yüksekliği hızla küçüldüğünde işlem penceresinin eski ekran yüksekliğine göre taşması engellendi.
- Carousel kenar maskesi/silikliği, ok yerleşimi ve bölüm boşlukları düzeltildi. Embla korunur.
- Grafik sütunu ve gösterge rengi eşitlendi. Son hareketler planlanan ve ileri tarihli kayıtları göstermez; planlar ödeme takviminde ve gelecek dönem sekmelerinde kalır.
- Hatırlanan filtreler açık gezinme hedeflerini geçersiz kılmaz; hesap/bildirim/ödeme türü geçişleri düzeltildi.
- Güncelleme ekranı, dosya yüklemesi ile veritabanı migrasyonunu açıkça ayırır. Şema güncelse gereksiz güncelleme düğmesi gösterilmez; eski şemada etkinleşir.

Veritabanı şeması 7 olarak kalır. Mevcut yönetici, işlem verileri ve api/config.php korunur. ZIP içindeki hosting/ içeriğini yükleyin; şema zaten 7 ise ek veritabanı işlemi gerekmez. Önce dosya/veritabanı yedeği alın; demo yenileme seçeneğini kapalı bırakın.

---

# Finans Paneli 1.7.0

15 Ekim 2026. Arama, kart gezinmesi ve ödeme takvimini birleştiren arayüz ve bakım sürümü.

- Her sayfada tek üst arama alanı; sayfaya özgü filtre paneli aramanın altında açılır. Metin ve filtreler Enter/Ara ile birlikte uygulanır, Esc taslağı iptal eder. Aktif filtreler kaldırılabilir etiketlerle görünür; son aramalar sayfa bazında oturum boyunca korunur.
- Hesap/kart araması ile seçili hesabın hareket araması ayrı kapsamlardır. Kullanıcılarda ad, rol ve aktiflik araması eklendi. Liste sıralama, CSV ve yeni kayıt araçları korunur.
- Banka ve kredi kartları ortak Embla carousel kullanır. Dokunma/fare sürüklemesi, karta hizalanma, döngü, klavye ve azaltılmış hareket tercihi desteklenir. Hareket listesi geçiş tamamlandığında seçilen hesaba güncellenir.
- Ödeme Planı takvim olarak kalır. Gün hücreleri ödeme/tahsilat özeti gösterir; seçilen gün masaüstünde sağ panelde, mobilde takvimin altında açılır. Gecikmiş/vadesiz kayıtlar, dönem dışındaki arama sonuçlarına geçiş ve okunabilir altı haftalık aylar desteklenir. Kanban eklenmedi.
- Ortak Inter yazı ölçeği, boşluklar, ikonlar, kontrast ve mobil dokunma alanları düzenlendi. Genel bakış işlem ekle düğmesi diğer sayfalarla aynı 44 × 44 px ölçüdedir.
- Vite 6.4.4, React/React DOM 19.2.9, Lucide 1.57.0 ve güvenlik yamaları; Node.js 24 LTS geliştirme/derleme ortamı; haftalık npm ve Actions Dependabot takibi.
- Actions Node.js 20 uyarısı giderildi. Hostingde Node.js gerekmez. Yeni kurulumlar için PHP 8.3+ ile MySQL 8.4 LTS veya MariaDB 11.4 LTS önerilir.

Veritabanı şeması 7 olarak kalır; mevcut yönetici ve işlem verileri korunur. Güncellemeden önce dosya/veritabanı yedeği alın, mevcut api/config.php dosyasını koruyun ve ZIP içindeki GUNCELLEME.md belgesini izleyin. Demo yenileme seçeneğini kapalı bırakın.

---

## Önceki sürüm

Finans Paneli 1.6.1 bakım sürümü. PHP 8.3+ ve MySQL/MariaDB gerektirir; hostingde Node.js gerekmez.

- Statik derlemeler PHP ve gerçek config dosyalarını içermez; PHP hosting paketi ayrı oluşturulur.
- Eski ve ulaşılamayan ekran/API kodları temizlendi. Cari, form, geçmiş ve kullanıcı bileşenleri ayrıldı.
- CSV ve para girişi ortaklaştırıldı; vadesiz hesaplar ödeme planında vade hatırlatması üretmez.
- Cari araması ve kapama hesaplamalarında tekrar taramalar azaltıldı. CSS tek girişte toplandı; mevcut tasarım korunur.
- İzole finans API, migrasyon/kurtarma ve masaüstü/mobil tarayıcı testleri Release iş akışına eklendi.

Şema 7 ve mevcut yönetici/işlem verileri korunur. Güncellemeden önce yedek alın, mevcut api/config.php dosyanızı koruyun ve ZIP içindeki GUNCELLEME.md belgesini izleyin. Demo yenileme seçeneğini kapalı bırakın.
