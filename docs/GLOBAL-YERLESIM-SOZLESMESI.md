# Global yerleşim sözleşmesi

9 Kasım 2026 — Kullanıcı tarafından onaylanan mimari/tasarım ilkeleri. Henüz uygulama koduna geçirilmedi; 1.15.0'ın davranışını değiştiren bir yayın değildir. Bölgelerin ayrıntılı ölçüleri, sabit/kaydırılabilir davranışları ve içerikleri sırayla kararlaştırılacak.

Görsel referans: `/workspace/generated_images/exec-a1e64e49-6c7c-48df-afc6-1dcb3b0c7d50.png`. Seçilen yön: Akışkan sütunlar.

## Ortak bölgeler

| No | Bölge | Sorumluluk |
| --- | --- | --- |
| 1 | Sidebar | Site genelindeki gezinme |
| 2 | Header | Ortak üst çubuk ve araçları |
| 3 | Content | Sayfa içeriğinin dış çerçevesi ve ortak kenarları |
| 4 | Sayfa başlığı | Sayfanın kimliği, bağlamı ve ilgili ana eylemleri |
| 5 | Özet alanı | İlişkili özet bilgilerin ortak yüzeyi |
| 6 | Ana içerik | Sayfanın temel çalışma alanı |
| 7 | Yardımcı içerik | Bağlamsal bilgi ve yardımcı modüller |
| 8 | Footer | Sayfa alt bilgisi; hızlı işlem formundan ayrı |
| 9 | Hızlı işlem alanı | Açıldığında kendi yüksekliğine yer ayrılan işlem giriş bölgesi |

Tüm sayfalar bu ortak bölge sözleşmesini kullanır; kendi bağımsız header/sidebar/kenar ölçülerini kurmaz. Bir sayfanın ihtiyaç duymadığı yardımcı/özet/işlem bölgesi sırf şemayı doldurmak için boş kutu olarak gösterilmez. Sayfalar içeriklerini ilgili bölgelere verir; ortak kabuk yerleşimi yönetir.

4–8, 3 numaralı çerçevenin içindedir. 6 ve 7 yeterli alan olduğunda yan yana 1,9:1 oranını kullanır; okunabilir minimumlar sağlanmadığında 7, 6'nın altına geçer. 8 ikisinin altındadır. 9 ayrı alt bölgedir, içerik kenarlarına hizalanır; 6/7 arasına girmez, içerik veya footer üzerine binmez. Kesin kırılma genişlikleri henüz kararlaştırılmadı. Bölge kimlikleri breakpoint/tema değişiminde aynı kalır.

## Birbirinden ayrılacak katmanlar

1. **Yerleşim:** Grid bölgeleri, sütun oranları, ortak kenarlar, boşluklar, minimum genişlikler, akış/kaydırma ve daralma kuralları. Bu ölçüler ortak yerleşim tokenlarıyla yönetilir.
2. **Görsel tema:** Anlamsal renk rolleri (sayfa/yüzey/metin/çizgi/vurgu/başarı/uyarı/hata), tipografi rolleri, köşe ve gölge tercihleri. İleride birden çok tema bu değerleri değiştirebilir; mevcut Sade Netlik başlangıç temasıdır. Tema seçici veya yeni tema bu onayla uygulanmaz.
3. **Bileşenler:** Button, IconButton, Input, SummaryBar, Ledger gibi ortak parçaların kendi iç düzeni, boyut ve görünüm varyantları. Bileşen stili dış kabuğun sütun/konum kurallarını değiştirmez.
4. **Etkileşim ve veri:** React içindeki menü açma, taslak, izin, form doğrulama, kayıt ve finansal anlamlar. Tema değişimi bu davranışları değiştirmez.

Yerleşim kodunda renk değeri yazılarak, tema kodunda sidebar genişliği/kolon oranı/konum belirtilerek bu sınırlar aşılmaz. Sayfaya özel CSS ile global `button` kurallarının ezilmesi yerine kapsamı belli bileşen varyantları kullanılır. Finansal pozitif/negatif ve uyarı rolleri temalar arasında anlamını korur; durum yalnız renkle anlatılmaz.

Düğmenin rengi, kenarı veya ikonu değişince AppShell düzeni değişmemeli. Metin, yazı tipi, iç boşluk veya boyut değişikliği gerçek ölçüyü etkileyebilir: ortak min/max, esnek akış ve taşma kuralları bunu karşılamalı; testlerle doğrulanmalı. Her tema/değişken metin için hiç yer değişmez garantisi verilmez. Erişilebilir dokunma/odak/kontrast kuralları temadan bağımsız korunur. Yoğunluk veya tipografi ölçü değişimi ayrı karar ve responsive kontrol gerektirir.

Takvim ve onay gibi açılır öğeler ortak, bu bölgelerin overflow/yükseklik sınırına sıkışmayan bağımsız katmanda yönetilir. Önceki taslaktan vazgeçme onayı hatasının ayrıntılı çözümü hâlâ görüşülecek; bu belge görünümünü kendiliğinden onaylamaz.

## İnceleme sırası ve açık kararlar

Sidebar → Header → Content çerçevesi → sayfa başlığı → özet → ana/yardımcı içerik → Footer → hızlı işlem bölgesi. Her bölgede geniş/dar pencere/mobil, minimum ölçü, kaydırma/sabitlik, diğer alanlara etkisi ve tema sınırı incelenecek.

Henüz belirlenmedi: kesin genişlik/yükseklikler, otomatik menü daralmasıyla kullanıcı tercihinin önceliği, hangi bölgelerin sabit/sticky olacağı, sayfa veya içerik kaydırmasının sahibi, yeni tema paletleri ve tema değiştirme arayüzü. Uygulama öncesi bu kararlar ayrı ayrı kaydedilecek.

## Sidebar — onaylanan davranışlar

Kullanıcı başlangıç önerilerini uygun buldu ve manuel kontrolü netleştirdi:

- Alan uygunsa ikon + yazılı tam menü; orta genişlikte ikon şeridi; dar/mobil görünümde kullanıcı açtığında görünen gezinme paneli kullanılabilir. Kesin ölçüler ve geçiş eşikleri henüz belirlenmedi.
- **Pencere genişliği ne olursa olsun kullanıcı sidebar'ı küçültebilmeli veya tamamen gizleyebilmelidir.** Geniş ekran tam menüyü zorunlu kılmaz. Tam menü / küçültülmüş ikon şeridi / gizli durumları birbirinden ayrıdır.
- Kullanıcının küçültme/gizleme tercihi geniş pencereye geçildiğinde otomatik olarak tam menüye çevrilmez; uygun genişliklerde korunur. Alanın daralması içerik okunabilirliğini koruyabilir; otomatik uyarlama kullanıcı tercihini silmez. Tercihin saklama yöntemi ve kapsamı henüz belirlenmedi.
- Gizli durumda menüyü yeniden açacak erişilebilir kontrol görünür kalmalıdır; sidebar içine gizlenerek erişilemez hâle gelmemelidir. Kontrolün kesin konumu Header görüşmesinde netleştirilecek.
- Menü küçüldüğünde veya gizlendiğinde Header, Content ve hızlı işlem bölgesinin ortak sınırları yeniden uyumlanır; boş bir sidebar sütunu bırakılmaz ve içerik üstüne binme oluşmaz.
- Uzun menüde gezinme kaydırılabilir, alt ayarlara erişim korunur. İkon modunda adlara erişim fareyle ve klavye odağıyla sağlanır. Sabitlik/kaydırma ayrıntıları ve tam kontrol tasarımı henüz belirlenmedi.

## Header — onaylanan görev dağılımı

Kullanıcı Header önerisine “ok, devam edelim” dedi. Tek satırlı ortak kontrol alanı: menü kontrolü → esnek arama → ilgili sayfada varsa filtre → bildirimler → ikincil kontroller. Menü gizliyken yeniden açma kontrolü Header'da erişilebilir kalır. Sayfa başlığı/özet/yeni işlem eylemleri kendi bölgelerindedir; Header'a taşınmaz.

- Arama kapsamı görünürdür: genel bakışta site genelinde, detaylarda ilgili hareketlerde. Arama genişliğe uyum sağlar; Enter ve arama simgesi kullanılabilir. Ayrı geniş Ara düğmesi zorunlu değildir.
- Filtre yalnız uygulanabilir sayfada vardır; etkin filtre sayısı anlaşılırdır. Bildirim düğmesinin konumu tutarlıdır; kompakt önizleme/tümüne geçiş korunur.
- Alan azaldığında önce tarih/kısayol gibi ikincil öğeler sadeleşir. Mobil arama odağında genişleyebilir. Kesin minimum genişlik ve dönüşüm tasarımı uygulama öncesi doğrulanır.
- Header kaydırma sırasında erişilebilir biçimde üstte kalır; açılır filtre/bildirim onu büyütüp içeriği aşağı itmez. Sidebar'dan boşalan alanı kullanır; iç hizaları ortak içerik kenarlarına uyar.
- Önerilen başlangıç yükseklikleri masaüstü yaklaşık 64 px, mobil 56 px; bunlar değişmez kesin ölçü olarak onaylanmış değildir. Renk/kenar/ikon görünümü tema, geometri yerleşim katmanındadır. İkincil oturum kontrollerinin ayrıntıları henüz belirlenmedi.

## Content çerçevesi — onaylanan yaklaşım

Kullanıcı Content önerilerini uygun buldu. 3 numaralı çerçeve 4–8'i tek ortak akışta taşır; sayfalar ayrı dış kenar hesapları üretmez. Kalan alanı kullanır, çok genişte okunabilir ortak üst sınır uygulanır; yoğun raporlar için varsa geniş varyant merkezi ve açıkça tanımlı olur. Başlangıç kenar boşluğu önerileri genişte 24–32 px, dar/mobilde 12–16 px olup ölçümle kesinleşir.

Ana/yardımcı alanın yan yana veya alt alta gelmesi cihaz adına değil gerçek kullanılabilir içerik genişliğine bağlıdır. Ana içerikte tek temel dikey kaydırma alanı önerilir; tablo ve yardımcı kutulara varsayılan ayrı dikey scrollbar eklenmez. Header erişilebilir kalır, uzun içerik footer'a kadar ulaşılabilir olmalıdır. 9 açıldığında gerçek yüksekliği için yer ayrılır; son satırlar ve footer örtülmez. Kaydırmanın teknik sahibinin body/main olması, mobil klavye davranışı ve istisnai büyük rapor tablosu kaydırması uygulama öncesi test edilerek kesinleşir. Pencere/menü genişliği değişiminde filtre, seçim ve taslak kaybolmamalıdır.


## Sayfa başlığı ve özet — onaylanan ayrım

Kullanıcı 4 ve 5'in ayrımını açıklamadan sonra uygun buldu. 4, “Neredeyim ve hangi ana eylemi yapabilirim?” sorusunu karşılar: sayfa/kayıt adı, gerekiyorsa geri ve kısa bağlam, yeni kayıt/işlem eylemi. 5, güncel durum/metrikleri karşılar: örneğin cari bakiye/tür/son hareket veya kart limit/ekstre/son ödeme. İkisi ayrı sorumluluklardır; iki ayrı beyaz panel olmak zorunda değildir. 4 sade zeminde başlık/eylemdir, 5 ilişkili bilgilerin tek bölümlenmiş yüzeyidir. Başlık her sayfada vardır; özet yalnız ihtiyaç varsa. Dar genişlikte bağımsız sadeleşebilirler; kritik metrik korunur ve ek bilgi erişilebilir kalır.

## Kalan bölgeler — onaylanan davranış paketi

Kullanıcı son öneri paketini onayladı. 6–9 bölgeleri, ortak kaydırma yaklaşımı ve bağımsız açılır katman/taslak onayı davranışları geçerli tasarım kriteridir. Ardından kodlamanın tema çalışmasından önce mi sonra mı yapılması gerektiğini sordu; bu soru tek başına uygulama/yayın talimatı sayılmaz. Kesin ölçüler uygulamada doğrulanacaktır.

### 6 — Ana içerik

- En yüksek alan önceliğine sahip çalışma bölgesi. Sayfa türüne göre tablo/liste, grafik, form gibi içerikleri alır; sayfa iş mantığı ortak kabuğu değiştirmez.
- Sıralama/indirme ve sekme gibi içerik araçları kendi içerik bölümünün üstünde kalır; sırf aynı düğme stilini kullanıyor diye sayfa başlığına taşınmaz. Mevcut onaylı sütun sırası/finansal anlamlar korunur; dar sunumda ikincil metadata kontrollü açılır, tutar ve işlem anlamı kırpılmaz.
- Normalde ayrı dikey scrollbar veya yapay sabit yükseklik yoktur; ortak içerik akışı kullanılır. Uzun listelerde mevcut sayfalama korunur. Gerekirse tablo başlıkları ortak header'ın altında sticky olabilir; üst üste binme ve kısa viewport durumları test edilir.
- Ana/yardımcı kutular zorla aynı yüksekliğe esnetilip gereksiz boşluk oluşturulmaz. Çok geniş veri tabloları için gerekli yerel yatay kaydırma belirgin istisnadır; tüm sayfa yatay kaymaz.

### 7 — Yardımcı içerik

- Yalnız ilgili bölüm/kayıt bağlamındaki bilgiler/uyarılar/modüller. Ana içerikteki bilgileri sebepsiz tekrar etmez, ihtiyaç yoksa boş alan bırakmaz.
- Yan yana yalnız iki bölgenin okunabilir minimumları sağlanınca; aksi durumda ana içerikten sonra tam genişlikte. Oran yeterli alanda 1,9:1. Sırf yer kazanmak için yazı/tutar küçültülmez.
- Varsayılan bağımsız dikey scrollbar veya sürekli sticky yüksek blok değil; ortak akışın parçası. Dar durumda kapatılabilir alt modüller gerekiyorsa açıkça etiketlenir; kritik uyarıya erişim yalnız uzun sayfanın dibine bağlanmaz. Kesin içerik önceliği sayfa bazında ayrıca belirlenir.

### 8 — Footer

- İçeriğin sonunda, 6 ve 7'nin altında kısa sayfa alt bilgisi. Sabit alt araç çubuğu veya yeni işlem butonu bölgesi değildir. Gereksiz iri panel/boş yükseklik yoktur; bilgi yoksa gösterilmez.
- Ana/yardımcı toplam içerik kenarlarına hizalıdır. Hızlı işlem alanı ve mobil gezinme tarafından örtülmez; gerekli son boşluklar ortak kabuk tarafından ayrılır.

### 9 — Hızlı işlem alanı

- Açıldığında içerik çerçevesine hizalı ayrı alt çalışma bölgesi; yüksekliği ortak yerleşimden ayrılır. 6/7 arasına girmez; son satırları, footer'ı veya mobil gezinmeyi örtmez.
- Gerekli kontroller önce, ek alanlar Diğer altında; genişte tek satır, sığmıyorsa kontrollü iki/çok satır. Kısa ekran veya açılmış ayrıntılarda formun kendisi görünür yüksekliğe göre kaydırılabilir; bunun istisnai bir form scroll'u olduğu açık tutulur. Kaydet/kapat erişilebilir kalır.
- Form açıkken içerik gezilebilir; kapanma/yeniden boyutlanma kullanıcı değerlerini silmez. İçerik kaydırması formu kendiliğinden kapatmaz. Yükseklik artışı, sanal klavye ve safe-area ortak ölçülür. Kayıt sürerken tekrar gönderme önlenir; izinler ve taslak terk etme koruması korunur.

### Açılır katmanlar — bölgelerden bağımsız altyapı

Takvim/filtre/bildirim kendi tetikleyicisine bağlı katmanda; taslak kaybı onayı küçük merkezi pencerede önerilir. Bölge 9'un overflow sınırına veya kısa yüksekliğine gömülmezler. Katman sırası tek yerden yönetilir. Taslak onayında hafif karartma, blur olmaması, Düzenlemeye dön'e ilk odak, Tab odağının pencerede tutulması ve Esc/dışarı tıklamanın taslağı koruyarak düzenlemeye dönmesi önerilir. Açık yıkıcı düğme dışında değer silinmez.

### Teknik kabul sınırı

Ortak React kabuğu ve bölge bileşenleri; yerleşimde CSS Grid/Flex ve gerçek içerik genişliğine bağlı container queries, sadece gerektiğinde JS ölçümü. Tema değerleri ve bileşen varyantları ayrı. Tam piksel eşikleri sabit varsayılmaz; yarım pencere/zoom/uzun veriyle ölçülür. Kabul yalnız yatay taşma olmaması değildir: metin/tutar okunabilirliği, kritik eylemlerin görünürlüğü, korunmuş odak/taslak ve kesilmeyen açılır katmanlar görüntü+etkileşimle doğrulanır. Bu aşamada yeni çoklu tema arayüzü veya yayın yapılmaz.

## Son onay ve çalışma sırası görüşü

Kullanıcı kalan davranış paketini onayladı. Önceki “taslak kaybı onayı hâlâ görüşülecek” / “son paket henüz onaylanmadı” ifadeleri bu onaya kadar olan tarihsel durumdur; merkezi bağımsız onay ve taslağı koruyan kapatma kuralları artık kapsam içindedir.

Asistanın çalışma sırası önerisi (henüz ayrıca uygulama talimatı değil): önce mevcut Sade Netlik görünümünü koruyarak ortak kabuk, responsive davranışlar, açılır katman ve tema token ayrımını kodlamak/test etmek; ardından yeni tema paletlerini ve gerekirse tema seçicisini ayrı görsel çalışma olarak tasarlamak. İlk aşamada tema altyapısı hazırlanır, yeni görünüm üretilmez. Yeni renk teması ile yeni font/yoğunluk ölçülerinin farklı riskleri vardır; ikinciler ayrıca yerleşim testi gerektirir.

## 1.16.0 — uygulama kararları

Kullanıcının son kodlama talimatıyla ilk aşama uygulandı. Önceki “henüz kodlama talimatı değil / karar verilmedi” ifadeleri görüşme tarihçesidir. Yeni tema ve yayın bu talimatın kapsamında değildir.

- Geometri: `src/AppShell.jsx`, `src/styles/layout-tokens.css`, `src/styles/app-shell.css`. Mevcut React/React DOM korunur; Vue'ya geçiş gerekmez.
- Menü 216 px tam / 72 px ikon şeridi / 0 px gizli. 1280 px ve altında otomatik ikon şeridi; 760 px ve altında açılır mobil panel. `finans.sidebar.preference` tarayıcı yerel depolamasında yalnız kullanıcının seçimini saklar; responsive geçiş bunu değiştirmez. Dar ekrandaki Tam menü tercihi, yeterli alana dönüldüğünde uygulanır. Gizli tercihi masaüstünün her genişliğinde korunur.
- Header 64 px, mobil 56 px asgari; mobil gezinme 56 px + güvenli alan. İkincil tarih/kısayol 1280 px ve altında gizlenir. Arama/menü/bildirim gerçek tıklama hedefleri korunur. Aktif filtreler içerik başlangıcındadır; header'ı büyütmez.
- Ortak çerçeve en fazla 1500 px; kenarlar geniş/orta/mobilde 32/24/12 px. Native içerik scrollbar payı header/işlem çubuğunda da ayrılır. Sütun arası 20 px.
- `workspace` container iç genişliği 1240 px altında ana ve yardımcı sütun tek akışa geçer; yeterli alanda 1,9:1. Bu, monitörün CSS genişliği değildir: sidebar ve kenarlar düşüldükten sonraki içeriktir. 800 px altında yardımcı bloklar/hesap yüzeyleri daha da sadeleşir. Rapor özetleri 600 px altında tek sütundur.
- Hareket tablosunun kendi `ledger` bölgesi 880 px altında kompakt sunuma geçer; kritik tutar/açıklama kalır, ikincil bilgiler seçilen satırda açılır. Masaüstü sütun sırası değişmez.
- MainShell grid satırları header / esnek içerik / hızlı işlem / mobil gezinmedir. `.main-content` ana dikey kaydırmadır. Footer, ana ve yardımcı içeriğin arkasındadır. Uzun listelerin sayfalaması korunur; kısa ekranlarda menü içi gezinme ve genişleyen işlem ayrıntıları gerektiğinde kendi alanında kaydırılabilir.
- İşlem bölgesi boşken satırı yoktur; açılınca gerçek yüksekliği kadar yer ayırır. 1050 px altındaki composer container'ında eylemler gerektiğinde ayrı satıra geçer. Mobil form iki esnek alan sütunu ve tam genişlik açıklama kullanır; Kaydet/X erişilebilir kalır. Görünür yükseklik ölçümü klavye sınırı içindir, piksel konumlandırma için değildir.
- Taslak onayı body portalında, en fazla 420 px, hafif karartma ve blur olmadan açılır. Odak iki eylemde kalır, arka plan inert olur; kapatma taslağı korur. İç içe katmanlar referans sayımıyla kilitlerini bırakır.
- Tema renk rolleri ve eski görünümü koruyan palet değerleri `theme.css` içindedir; tipografi/bileşen tokenları `tokens.css` içindedir. Tema dosyası sidebar/sütun konumu tanımlamaz. Bileşen iç düzenleri mevcut kapsamlarında kalır; yeni kabuk ölçüleri sayfalarda tekrar kurulmaz.

Kesin ölçüler bu sürümün test edilmiş başlangıç değerleridir; gelecekteki yoğunluk/font değişikliği responsive kabul testlerini tekrar gerektirir. Ekran adı veya yalnız yatay taşma olmaması tek başına kabul ölçütü değildir.
