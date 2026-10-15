# 1.7.0 — onaylı değişiklikler ve uygulama kapsamı

15 Ekim 2026. Sürüm numarası 1.7.0 olarak belirlendi. Bu belge onaylı kapsamı kaydeder; yeni öneriler kullanıcı tarafından iletilmeye devam ediyor. Onaylı işler 1.7.0 sürümü için uygulandı; doğrulama ve yayın sonucu TEST-RAPORU-1.7.0.md dosyasında izlenir.

## Onaylı bakım işleri

- Önce güvenlik yamaları: Vite 6.4.2 → 6.4.4; PostCSS, nanoid, Browserslist, source-map-js ve baseline-browser-mapping bağımlılıklarını güvenlik bildirimlerini giderecek uyumlu sürümlere güncelle. Kilit dosyasını yenile, güvenlik taramasını ve ilgili testleri tekrar çalıştır.
- React ve React DOM'u birlikte 19.2.0 → 19.2.9 yama sürümüne güncelle.
- Yeni hosting kurulum önerilerini MySQL 8.4 LTS / MariaDB 11.4 LTS olarak güncelle. Bu belge değişikliği mevcut hosting veritabanını otomatik yükseltmez.
- Derleme ve geliştirme ortamını Node.js 24 LTS'ye taşı; iş akışı ve kurulum belgelerini uyumlu hale getir. Hostingde Node.js gerekmemesi korunur.
- npm ve GitHub Actions için haftalık Dependabot takibi ekle. Otomatik birleştirme veya yayınlama bu onayın kapsamında değildir.
- Lucide küçük sürüm güncellemesini uygula; ikonların görünümünü doğrula.

## Onaylı ortak arama ve filtre tasarımı

15 Ekim 2026'da onaylandı; 1.7.0 kapsamında uygulandı.

- Üst çubuktaki “Çalışma alanı > sayfa adı” yolu kaldırılır; içerikteki sayfa başlığı ve sol menü navigasyonu korunur. Bildirim kontrolü ayrı kalır.
- Üst alanda, sol menüden sonra kalan alanın ortasında, kenar boşlukları bulunan ve kullanılabilir içerik genişliğine sürekli uyum sağlayan tek bir ortak arama kutusu kullanılır. Yanında filtre ve Ara düğmeleri bulunur.
- Cari hesaplar, Tahsilat & Ödeme, Ödeme Planı, Hesaplar, Kredi kartları, Raporlar ve Kullanıcılar aynı arama bileşenini kullanır. Arama mevcut sayfanın bağlamında çalışır; açıklaması ve filtre seçenekleri sayfaya göre değişir. Sayfa içindeki tekrar eden arama/filtre alanları kaldırılır.
- Hesap/kart listesi ile seçili hesabın/kartın hareketlerini arama kapsamları açıkça ayrılır; filtre panelinde kapsam seçilebilir. Cari listesi ve seçili carinin hareketleri için de bağlam ayrımı korunur.
- Filtre düğmesi, arama satırı genişliğinde aşağı açılan ve içeriği aşağı iten bir panel açar; panel takvim veya sonuçların üzerine binmez. Mobilde alanlar tek sütuna geçer, uzun panelde Ara düğmesi erişilebilir kalır.
- Arama metni ve filtreler Enter veya Ara ile birlikte uygulanır; başarılı uygulamada panel kapanır. Seçimler onaylanmadan sonuçlar değişmez. Geçersiz tarih aralığı gibi hatalar paneli kapatmadan gösterilir. Açık tarih seçici veya seçenek listesinde Enter önce ilgili seçimi tamamlar; Esc uygulanmamış değişiklikleri iptal ederek paneli kapatır.
- Uygulanan filtreler panel kapalıyken ikon üzerindeki sayı ve kaldırılabilir etiketlerle görünür kalır. Temizle eylemi bulunur; sonuç yoksa bu durum açıkça belirtilir.
- Her sayfanın son uygulanmış arama ve filtreleri oturum boyunca ayrı saklanır; sayfalar birbirinin filtrelerini devralmaz. Geri dönüldüğünde ilgili sayfanın son durumu korunur.
- Filtrelenmiş rapor toplamları ile gerçek cari/hesap bakiyeleri ayrılır. Hareket araması gerçek bakiyeyi değiştirmez; “Filtrelenen hareket toplamı” ve “Güncel bakiye” açıkça adlandırılır.
- Sıralama, CSV indirme, yeni kayıt ve takvim dönemi değiştirme gibi içerik araçları korunur; ortak arama bu eylemleri kaldırmaz.
- Ctrl/Cmd+K ortak aramaya odaklanır. Panel kapanınca odak arama alanına döner; sonuç sayısı erişilebilir biçimde bildirilir. Mevcut rol ve veri erişim sınırları korunur.
- Uygulama sırasında sayfa kapsamları, taslak/uygulanmış filtre ayrımı, klavye davranışı, mobil panel yerleşimi ve finansal toplamların anlamı uygun testlerle doğrulanır.

## Onaylı Embla carousel geçişi

15 Ekim 2026'da onaylandı; 1.7.0 kapsamında uygulandı.

- Hesaplar ve Kredi kartları sayfaları aynı ortak Embla carousel bileşenini kullanır. Mevcut özel sürükleme mekanizması kaldırılır; kartların mevcut tasarımı korunur.
- Aktif kart ortalanır, komşu kartlar kenarlarda görünür. Dokunma ve fare sürüklemesinde kart hareketi doğrudan takip eder; bırakıldığında hız ve mesafeye uygun biçimde bir karta yumuşakça hizalanır.
- Döngülü gezinme korunur; kart sayısı veya kullanılabilir alan döngüye yetmediğinde normal gezinmeye dönülür. Tek kartta gereksiz geçiş kontrolleri devre dışı kalır.
- Alt hareket listesi kaydırma durulduğunda seçilen hesap/karta göre güncellenir; görsel seçim ile gösterilen hareketler tutarlı kalır.
- Dikey sayfa kaydırması korunur. Bilgi/düzenle düğmeleri sürükleme sırasında yanlışlıkla tetiklenmez. Yön okları, klavye desteği ve azaltılmış hareket tercihi desteklenir; otomatik kaydırma eklenmez.
- Embla'nın uyumlu sürümü sabitlenir ve bağımlılık güncelleme takibine alınır. Gereksiz eklentiler eklenmez.
- Hızlı ve art arda kaydırma, yön değiştirme, ilk/son kart geçişi, tek/az kart, arama ile daralan kart listesi ve pencere boyutu değişikliği doğrulanır. Fare, trackpad ve iOS/Android dokunmatik davranışı kontrol edilir; gerçek cihazda yapılamayan kontroller açıkça belirtilir.

## Ödeme Planı — takvim korunacak

15 Ekim 2026'da kullanıcı Kanban tasarımını şimdilik iptal etti. Ödeme Planı'nın mevcut takvim görünümü korunacak. Kanban uygulaması veya varsayılan Pano görünümüne geçiş onaylı kapsamda değildir. Ayrı taslak dalına yüklenen PNG yalnızca geçmiş tasarım denemesidir; uygulama kararı olarak kullanılmaz.

Kullanıcı aynı gün aşağıdaki takvim iyileştirmelerinin tamamını onaylayıp yeni sürümün hazırlanmasını ve yayımlanmasını istedi:

- Masaüstü gün hücrelerinde ödeme/tahsilat toplamları, en fazla iki kayıt adı ve kalan kayıt sayısı; mobilde kayıt sayısı ve ayrı ödeme/tahsilat göstergeleri.
- Gün seçilince masaüstünde sağda, mobilde altta sabit ayrıntı alanı; detaylar ve yetkiye uygun kayıt eylemleri.
- Hesaplarım yerine Bugün ve yaklaşan işler; seçilen günden yaklaşanlara dönüş.
- Dönem değişse de erişilebilen gecikmiş kayıt sayısı, ayrı ödeme/tahsilat tutarları ve vadesiz kayıtlar.
- Altı haftalı aylarda da okunabilir minimum hücre yüksekliği; gerekirse sayfa kaydırma.
- Ortak aramanın takvim/listeler/dönem toplamlarına aynı kapsamda uygulanması, dönem dışında sonuç varsa uygun tarihe geçiş ve görünüm değiştirirken seçili tarihin korunması.
- Genel bakıştaki işlem ekle düğmesinin diğer sayfalardaki 44 × 44 px ölçüye getirilmesi.

## Ayrı uyumluluk değerlendirmesi

- GitHub Actions checkout/setup-node/upload-artifact v7 geçişlerini değişiklik notları ve mevcut paketleme akışıyla değerlendir. Önceki Node.js 20 uyarısı için yerelde yapılan v5/v5/v6 düzeltmesi korunur.
- Vite 8 ve React eklentisi 6 büyük sürüm geçişlerini güvenlik yamalarından ayrı değerlendir; doğrudan yükseltme kararı henüz verilmedi.
- Playwright ve Recharts kontrolde günceldi. PHP 8.3 güvenlik desteği devam ediyor; bu aşamada ana sürüm değişikliği gerekmiyor.

## Mevcut durum

- Önceden onaylanan tasarım düzeltmeleri çalışma alanında uygulandı ve test edildi; 1.7.0 paketine dahil edildi.
- Bu bakım listesine alınmak, değişikliklerin uygulandığı veya yeni sürümün yayımlandığı anlamına gelmez. Yayın sonucu sürüm test raporunda belgelenir.
