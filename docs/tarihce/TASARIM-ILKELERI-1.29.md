# Tarihsel kayıt — geçerli tasarım talimatı değildir

Güncel kaynak: [Tasarım sözleşmesi](../TASARIM-SOZLESMESI.md).

# Sade Netlik — geçerli tasarım kararları

Finans Paneli'nin kendi tasarım dili korunur; başka projelerin görsel tercihleri aktarılmaz.

- Yerel Inter, Lucide ikonları, tabular rakamlar. Sayfa başlığı masaüstünde 27 px, mobilde 24 px; bölüm başlığı 16 px/600, alt başlık 14 px/500, ana metin 14 px, yardımcı metin 12 px. Yardımcı metin satır yüksekliği 1,5; mobil form alanı 16 px. Ölçüler `src/styles/tokens.css` üzerinden paylaşılır.
- Porselen #F5F7F8, beyaz, metin #202C39, ikincil #596879, vurgu #087F8C, yeşil #147D59, kırmızı #B54343, uyarı #955F12, çizgi #DDE3E8.
- İşlem pencereleri merkezde, arka plan bulanık. Sağdan açılan işlem paneli yok. Satır içi detaylar ve log baloncukları bu kurala özel istisnadır. Bildirimler, ortak filtreler ve tek gün dahil tüm tarih seçimleri tıklanan alana bağlı kompakt pencere olarak açılır; arka plan bulanmaz ve içerik aşağı itilmez. Esc/dışarı tıklama taslağı iptal eder.
- Benzer listelerde arama, filtre, sıfırla, sırala ve CSV ikonları ortak düzendedir; altlarında yazı yoktur, erişilebilir adları bulunur.
- Cari sütunları: Tarih / Açıklama / Etiket / İşlem / Ekleyen / Tutar / Bakiye. Onaysız yer değişikliği yapılmaz. Açıklamada yalnızca kullanıcının metni görünür; cari adı otomatik eklenmez.
- Cari başlığındaki aşağı ok mevcut beyaz kutuyu genişletir. Bilgiler yeni pencerede açılmaz.
- Aktif hareket ve alt eylemler tek satır yüzeyi gibi görünür: arada çizgi yok, sol koyu işaret genişleyen alanın tamamını kaplar. Kompakt düzenle/log/sil ikonları; tutar sağa hizalı.
- İşlem etiketinin yeşil/kırmızı yönü ilgili hesabın işaretine uyar; rakamların mevcut renk davranışı ayrıca değiştirilmez. Tutar ile net etki/bakiye birbirine karıştırılmaz.
- Hesap/kredi kartları duyarlı grid listede gösterilir; seçilen kartın ayrı detayında yatay özet ve hareketler bulunur. Carousel kullanılmaz. Kart içeriği kesilmez, detayda sabit en/boy oranı zorlanmaz.
- Banka sayfasında arama üstte ekle ikonunun solundadır; arşiv seçeneği yanındaki filtreyle aşağı açılır. Hesap/kart liste özetlerinde bilgi/düzenle ikonları bulunmaz; bu işlevler detay açıldıktan sonra ilgili özet/ayar alanındadır (sonraki sürüm kararı).
- Vadesiz hesapta vade sonu gösterilmez. KMH limit barı kredi kartıyla aynı görsel sisteme uyar. Hesap uyarıları masaüstünde ayrılmış sağ sütunda, 1100 px ve altında sabit Uyarılar düğmesinin açtığı merkez pencerede gösterilir. Hesap seçimi ve arama bu uyarıları gizlemez.
- Ödeme planı: aylık görünümde nokta ve tıklayınca detay baloncuğu; haftalıkta günlük ödeme/tahsilat özeti; günlükte tüm satırlar. Takvimde gün hücreleri okunabilir minimum yükseklikte kalır; gerektiğinde sayfa kaydırılır.
- Tek etiket, girilmezse Genel. Formlarda ortak tarih seçici, Türkçe binlik ayırıcı nokta, ondalık virgül kullanılır. İşlem açıklaması eklerken opsiyonel, işlem düzenlerken zorunludur; hesap/kart ayar düzenlemesi için gerekmez.

## Ortak ölçüler

- Boşluk ölçeği: 4, 8, 12, 16, 20, 24 ve 32 px. Finans tablosunun 18 px yatay hücre boşluğu korunur.
- Formlar ve ana eylemler en az 44 px yüksekliğindedir. Masaüstü satır eylemleri 32 px olabilir; mobil dokunma alanları en az 44 × 44 px olur.
- Eylem ikonları 18 px, yön ikonları 16 px, gezinme ikonları 20 px. Banka/program marka çizimleri kendi oranlarını korur.
- Köşe yarıçapı: alan/düğme 8 px, panel 12 px, işlem penceresi 14 px. Dairesel ikonlar dairesel kalır.
- Mobil sınır 760 px, tablet sınır 1100 px. Rapor özetleri masaüstü/tablet/mobilde 4/2/1 sütun olur; para rakamları satır ortasında bölünmez. 360 px ve altındaki cari başlıkta bakiye ve eylemler ayrı satırlara alınır.
- İptal edilen kayıtların metni opaklığını kaybetmez; durumu etiketle belirtilir. Gri grafik serisi ikincil metin rengini kullanır; form kenarı #83929C olur. Ana palet korunur.
- Paylaşılan kurallar `src/styles/system.css` içinde, bileşene özgü düzenler kendi stil dosyalarında tutulur. Yeni bir ölçü eklemeden önce mevcut rol kullanılır.

## 1.7.0 etkileşim kararları

- Tek üst arama, sayfaya özgü filtreler ve taslak/uygulanmış seçim ayrımı kullanılır. Filtre paneli içeriğin üzerinde açılır; aktif seçimler görünür kalır.
- Önceki carousel/Embla kararı 1.9.0 grid/detay kararıyla kaldırıldı; bağımlılık silindi.
- Ödeme Planı takvim olarak kalır. Masaüstünde gün hücreleri tutar ve kayıt özeti, mobilde kayıt sayısı ile Ö/T/V göstergeleri içerir. Seçilen günün ayrıntıları sağda veya dar ekranda altta gösterilir. Renk tek başına anlam taşımaz.

## 1.7.2 etkileşim kararları

- Ortak arama kenarlığı hareket panelinin çizgi rengini kullanır. Ara düğmesi erişilebilir adlı büyüteç ikonudur.
- Üç karakter ve üzerinde 300 ms yazma arasıyla arama uygulanır; Enter/ikon hemen uygular. Boş arama temizler. Filtre panelindeki taslaklar yalnız uygula ile yürürlüğe girer.
- İşlem etiketlerinde Fat. Alış / Fatsız. Alış kullanılır, tam ad title içinde korunur. Etiket alanı 100 px, ekleyen hizası ortaktır.
- Hesap uyarı sütunu kalıcı yer ayırır ve kendi içinde kayar. Uyarı hedefi hesabı ve varsa ilgili hareketin sekmesini/sayfasını seçer. Faiz/vade uyarısı salt okunur hesap bilgisini açar.
- Masaüstü/tablet tablosu açıklamayı daraltmak yerine panel içinde yatay kayar; telefonda mevcut kart satırı düzeni korunur.

- Kayda ait bilgi/ayar/düzenleme eylemleri ilgili kayıt kapsamında tutulur. Yeni kararla hesap ve kredi kartı liste özetlerinde bu ikonlar kaldırılacak; detay açıldıktan sonra ilgili özet/ayar alanında erişilecek. Araç ve diğer varlık kartlarının mevcut kendi-kartında eylem kuralı ayrıca değiştirilmez.
- Cari kartının temel bilgileri düzenlenirken gerekçe isteğe bağlıdır; finansal hareket düzenleme gerekçesi zorunludur.

## 26 Ekim 2026 — Onaylı alt menü kuralı (1.9.0 kapsamında uygulandı)

- Alt menüler başlangıçta kapalı ve görünmezdir. İlgili ana menüye tıklandığında açılır ve görünür olurlar. Bu kural mevcut ve gelecekteki tüm alt menülerde, masaüstü ve mobil gezinmede geçerlidir.
- Kampanyalar, yalnız Kredi kartları ana menüsünün alt menüsü açıldığında gösterilir; sürekli görünür bir menü öğesi olarak yer almaz. Tekil kredi kartı seçimiyle karıştırılmaz.
- Alt menüsü olan öğede açılma yönü ve açık/kapalı durum anlaşılır olmalı; klavyeyle erişim ve erişilebilir durum bilgisi sağlanmalıdır.

## 26 Ekim 2026 — Onaylı ortak sayfa düzeni (1.9.0 kapsamında uygulandı)

- Finansal görünüm ekranı genel yerleşim referansıdır: sade sayfa başlığı ve kısa açıklama, ihtiyaç varsa tek özet kutusu, ardından ana içerik ve gerekiyorsa sağ sütun. Ana eylem başlık satırında aynı hizalama ve ölçü sistemini izler.
- İlişkili özet metrikleri, Güncel durum barındaki gibi tek dış çerçeveli beyaz yüzey içinde ince ayırıcılarla bölümlenir. Etiket, değer/birim ve yardımcı açıklama hiyerarşisi ortaktır. Raporlardaki ayrı özet kartları bu düzene geçirildi; diğer menülerde ihtiyaç olduğunda aynı özet dili kullanılır.
- Raporların 4/2/1 gibi duyarlı metrik yerleşimleri, bu karar uygulandığında tek dış kutunun iç bölümleri olarak ele alınır; ekran daralınca bağımsız dış kartlara dönüşmez. Özet başlığı, dönem ve filtre kapsamı sayfanın anlamına uygun belirtilir; görünüm ortaklığı finansal anlamları değiştirmez.
- Sağ sütun gereken sayfalarda geniş ekran ana/sağ sütun oranı Finansal görünümle aynı 1,9:1 olur: ara boşluk hariç yaklaşık %65,5 / %34,5. Mevcut masaüstü 20 px ara boşluk referanstır. Sayfaya özgü farklı oranlar veya bağımsız sabit sağ sütun genişlikleri oluşturulmaz.
- Dar ekranlarda ortak kırılımlarla okunabilirlik korunur ve gerektiğinde tek sütuna geçilir; aynı genişlikte sayfalar tutarlı davranır. Tutarlar bölünmez, içerik yatay taşmaz. Sağ sütun yalnız ihtiyaç olan sayfalarda bulunur; hesap uyarılarının mobil erişimi korunur.
- Sayfalar aynı başlık/özet/içerik hizalarını, tipografi rollerini, boşluk ölçeğini, panel/ayırıcı/köşe biçimlerini ve ikon/düğme ölçülerini kullanır. Bu ortak düzen ve özet bileşeni yeniden kullanılır; sayfa başına farklılaşan kopyalar oluşturulmaz. Kredi kartı ve hesap detaylarındaki yatay özetler de bu dili izler.

## 26 Ekim 2026 — İnceleme önerileri ve bütün takvimler (onaylı, 1.9.0 kapsamında uygulandı)

- Tasarım incelemesindeki A1–A4 ve B1–B10 önerilerinin tamamı kullanıcı tarafından onaylandı. Ortak panel, özet, sekme, ikon/eylem ve mobil erişim kuralları bütün menülerde uygulandı; hesaplama modeli ve tablo sütun sırası korunacak.
- Araç hatırlatmaları masaüstünde ortak 1,9:1 düzende sağda yer alacak. Mobilde uyarı erişimi korunurken içerik/tutarlar eylemlerle örtülmeyecek. Takvim gezinmesinde komşu kontrollerin örtüşmesi giderilecek.
- **Takvim kuralı tek gün ve tarih aralığı seçimlerinin tamamını kapsar.** Tetiklenen alana bağlı pencere kullanılır; takvimin açılması ek bulanıklık, karartma veya sayfa kayması oluşturmaz. Önceki "tek gün seçimleri merkez pencerede kalır" istisnası bu kararla kaldırılmıştır.
- Ödeme Planı, işlem/ekstre/vade, araç/poliçe/bakım ve kampanya takvimleri aynı davranışı izler. Açık bir form içindeki takvim ikinci modal/blur katmanı oluşturmaz; genel işlem pencerelerinin kendi stili bu karardan ayrı kalır.
- Esc ve dışarı tıklama yalnız ilgili takvimi kapatır; aralık taslağı uygulanmadıysa atılır. Üst form açık kalır, odak tetikleyiciye döner. Ekran sınırları, zorunlu tarih doğrulaması ve klavye/mobil erişimi korunur.

## 26 Ekim 2026 — Ortak kayıt detay başlığı ve bilgi bandı (1.9.0 kapsamında uygulandı)

- Cari, banka/kasa/KMH ve kredi kartı detaylarında sayfa başlığı, geri dönüş ve yeni işlem ekleme eylemi üst başlık alanında yer alır. Başlığın altında tek ve ayrı bir bilgi/özet kutusu bulunur. Cari detayının mevcut birleşik başlık kutusu da bu kurala geçirilir.
- Yeni işlem ve geri dönüş bilgi kutusunun dışında; kayda ait bilgi/ayar/düzenleme ikonları ilgili bilgi bandının kendi üzerinde kalır.
- Bilgi bandının dış yüzeyi, ayırıcıları, tipografi ve boşluk sistemi ortaktır; alanlar kaydın türüne göre yerleştirilir. Aynı görünüm uğruna finansal anlamlar, hesap modeli veya tablo sütun sırası değiştirilmez. Cari ve kredi kartı taslakları kullanıcı tarafından onaylanan referanstır.

## 26 Ekim 2026 — 1.9.1 sonrası başlık araçları ve kart alanı (uygulama bekliyor)

- Gereksiz ikinci liste başlığı kaldırılır. Kullanıcı, içerik araçlarını ana başlığa taşıma kararından vazgeçti: sıralama/indirme ve benzer ikonlar ilgili içerik/listenin kapsamında kalır; yeni işlem düğmesinin yanına taşınmaz.
- Hesap/kredi kartı listeleri tek bir ana içerik kutusunun içinde bölümlenir. Son kararla liste kartlarında bilgi/düzenleme ikonları bulunmaz; işlevler detay ekranındadır. Kullanıcı 3 numaralı yatay kart düzenini onayladı: tek ana kutu içinde tam genişlikli hesap kartları ve hizalı kimlik/tutar/tür/eylem bölümleri kullanılacaktır.
- Not ve görsel aşamasıdır; kodlama/yayın onayı değildir. Ayrıntılar sonraki sürüm notlarındadır.

- Onaylı 3 numaralı görsel yalnız yerleşim referansıdır; nihai fontlar, tipografi/değer rolleri, boşluklar, kontrol ölçüleri, renkler ve ana/sağ sütun oranı bu belgedeki ortak kurallara uyar. Görseldeki üst araç yerleşimi artık geçerli değildir; içerik araçları ilgili içerik alanında, yeni işlem düğmesi başlıkta kalır. Mobilde kart içeriği okunabilir biçimde alt alta düzenlenir.

## 26 Ekim 2026 — Onaylı kart hizaları ve uyarı hiyerarşisi (uygulama bekliyor)

- Kullanıcı hesap ekranına ilişkin sekiz önerinin tamamını onayladı. Yatay hesap kartlarında ortak ölçü/hiza, dengeli boşluk, okunabilir iç bölümler ve kayda ait ikonların tutarlı konumu korunur. IBAN gibi isteğe bağlı alanlar diğer bilgilerin hizasını bozmaz.
- Uyarı sütunu kompakt ve grupludur; hesapların görsel önceliğini bastırmaz. Öncelik grupları, gerektiğinde aynı hesap/tarih altında tekrarların özeti, kayıt sayısı ve hedefe ulaşma işlevi birlikte korunur. Hesap seçimi ve arama diğer hesapların uyarılarını gizlemez.
- **Kritik/acil:** kırmızı `#B54343`; **dikkat gerektiren:** amber `#955F12`; **bilgilendirme:** teal `#087F8C` ve nötr yüzey. Mevcut palet üzerinden açık zemin/kenarlık ve okunabilir ikon/metin kullanılır; tüm kayıtlar tek sarı stile sokulmaz. Kritik durumlar daha belirgin olur.
- Şiddet renk dışında ikon ve açık durum etiketiyle de anlaşılır. Renk, gerçek durumun anlamına göre atanır; günlük faiz tahmini tek başına kritik alarm değildir. Uyarı önceliği para yönünden ayrıdır; işlem işaretleri/bakiye hesabı değiştirilmez.
- Uyarılarda tarih kartlarla aynı Türkçe biçimde gösterilir; hesap/açıklama/tarih/tutar hizası ortaktır. Para değeri ve TL birimi birlikte kalır.
- Bu kararlar sonraki tasarıma aittir; kullanıcı notlarına devam ediyor. Kodlama ve yayın henüz başlatılmaz.

## 26 Ekim 2026 — Merkezi bildirim ve bağlamsal önizleme (uygulama bekliyor)

- Bildirimler ortak mekanizmaya ve tek global sayfaya dayanır; modüller aynı kayıtları kendi bölüm kapsamıyla önizler. Kaynak, önem rengi, durum metni ve hedef davranışı ortaktır.
- Hesap uyarıları en fazla 5 kayıt gösterir; altına hesaplarla ilişkili son 5 işlem modülü eklenir. Kart bölümündeki son 5 işlem kartlarla ilişkilidir. Cari bölümüne sağ sütun eklenir; bakiyeyi artıran son 5 hareket ve bakiyeyi azaltan son 5 hareket ayrı bloklarda sunulur. Ana/sağ sütun oranı ve duyarlı kırılımlar ortak kalır.
- Zil kompakt 5–6 bildirim gösterir. “Tümünü göster” bütün yüzeylerden aynı global bildirim sayfasına gider; hesap ekranından giderken Hesaplar filtresi uygulanır. Sayfa filtresi görünür ve kaldırılabilir; kaldırıldığında diğer bölümlerin bildirimleri de görünür. Bu amaçla yeni baloncuk açılmaz.
- Global bildirim sayfasında önem filtresi bulunur. Kritik/dikkat/bilgi renkleri aynı anlamı korur; yalnız renk kullanılmaz. Toplam sayı ve tam listeye ulaşma görünür kalır. Sağ sütun önizlemesi uzun bir tam listeye dönüştürülmez.
- Kullanıcı cari giriş/çıkışını net cari bakiyeyi artıran/azaltan hareketler olarak netleştirdi. Bloklar mevcut `party_effect` yönünü kullanır; nakit etkisi veya brüt tutardan sınıflandırma yapılmaz. Sıfır etki iki bloktan birine zorla atanmaz. Ek filtre/sıralama önerileri ve son işlemler kapsamı sonraki sürüm notlarında ayrı değerlendirme olarak kayıtlıdır.
- Kullanıcı notlarına devam ediyor; kodlama, paketleme ve yayın başlatılmaz.

## 26 Ekim 2026 — İçerik araçlarını başlığa taşıma kararı iptal edildi

- Kullanıcı, sıralama/indirme ve benzer içerik ikonlarını yeni işlem düğmesinin yanına ayraçla toplama kararından vazgeçti. Ayrı içerik araç satırlarını kaldırma zorunluluğu da iptal edildi.
- İçerikle ilgili ikonlar ilgili içerik/listenin kapsamında kalır. Yeni kayıt/işlem ekleme düğmesi mevcut başlık yerleşimini korur. Kayda ait bilgi/düzenleme ikonları kendi kartı/özetindedir.
- Hesaplar ekranındaki rahatsızlık mevcut kart düzeniyle ilişkilidir; onaylı 3 numaralı yatay liste/kart düzenine geçilerek giderilecektir. Tek ana içerik kutusu, kart hizaları, gereksiz ikinci başlığın kaldırılması ve diğer onaylı kararlar korunur.
- Taslak görsellerdeki üst araç grubu uygulanacak kural değildir; görseller yatay kart yerleşimi için referans olmaya devam eder.
- Bu karar henüz uygulama koduna taşınmadığından kod geri alımı gerekmiyor; yalnız belgeler düzeltildi. Not aşaması sürüyor, kodlama/yayın başlatılmaz.

## 26 Ekim 2026 — Paralel hesap/kredi kartı tasarımı ve kompakt listeler (uygulama bekliyor)

- Hesaplar ve Kredi kartları sonraki düzenlemelerde paralel ilerler: tek ana içerik kutusu, onaylı 3 numaralı yatay kart/liste stili, ortak başlık ve araç kapsamı, okunabilir hizalar, 1,9:1 sağ sütun, kısa uyarılar ve bağlama göre son işlemler iki menüde de uygulanır.
- Liste kartlarındaki bilgi ve düzenleme ikonları iki menüden de kaldırılır. Tıklama/klavye ile detay açılır; bilgi/ayar/düzenleme işlevleri ilgili detay özetinde/ayar alanında kalır. Listeyi sadeleştirmek işlev veya bilgi silmek anlamına gelmez.
- Kredi kartının banka/program/numara/sahip kimliği, limit ve kullanım bölümleri, ekstre/dönem/taksit tutarları ve kesim/son ödeme bilgileri korunur. Hesap/KMH alanları kendi finansal anlamlarını taşır. Ortak stil, türün gerektirdiği verileri birbirine dönüştürmez veya borcu çoğaltmaz.
- Gerektiğinde ek bilgi satırlarıyla okunabilirlik korunur; kompaktlık için küçük yazı, kesilmiş tutar veya kayıp bilgi kullanılmaz. Gereksiz ikinci liste başlıkları iki menüden de kaldırılır.
- Bu son karar, görsellerde veya önceki notlarda hesap/kart liste ikonlarının bulunmasını isteyen kısımların yerini alır. Kullanıcı not aşamasındadır; henüz kodlama/yayın yapılmaz.

## 26 Ekim 2026 — Araç detayında iki sekme (uygulama bekliyor)

- Araç kartından varsayılan Özet açılır; kategori bazlı grid bölmeler güncel poliçe/MTV/bakım ve diğer mevcut araç bilgilerini gösterir. İşlemler ikinci sekmedir; tüm kayıt türleri tek tarih sıralı listede karışık yer alır. Trafik sigortası/kasko/MTV/bakım/muayene ayrı navigasyon sekmeleri olarak kullanılmaz.
- Seçili işlem, kendi türüne uygun ayrıntıları satır içinde açar. Mevcut ortak genişleyen satır, ikon, boşluk ve içerik araçları yerleşimi kullanılır. Genel başlıkta ekle; sıralama/indirme ilgili içerikte kalır.
- Geçerlilik durumu ile ödeme durumu, tahmini tutar ile gerçek ödeme ve kayıt tarihi ile yaklaşan tarih/km ayrı anlamlardır. Özet veya liste ikinci finansal hareket üretmez.
- Görsel yerleşim alternatifleri kullanıcı değerlendirmesindedir; ilk Özet ile birleşik işlem günlüğü asistan önerisidir. Not aşaması sürer, kodlama/yayın başlatılmaz.

## 1.10.0 uygulama durumu

26 Ekim 2026 toplu kodlama/yayın onayıyla yukarıdaki bekleyen hesap/kart yatay liste, merkezi bildirim ve cari sağ sütun kuralları uygulanmıştır. Araçlarda kullanıcı 2 numaralı Poliçeler özeti ile 3 numaralı birleşik İşlemler görünümünü seçmiştir. Önceki not aşaması/uygulama bekliyor ifadeleri tarihsel durumdur; bekleme şartı değildir. Zil dahil küçük önizlemeler 5 kayıtla sınırlıdır. İçerik ikonlarını başlığa taşıma kararı iptal edilmiş olarak kalır.

## 1.11.0 — kompakt mobil ve yatay araçlar

Mobil hareketlerde tür/tarih/tutar/açıklama görünür; etiket/ekleyen/işlem sonrası bakiye ile eylemler yalnız seçili satırda açılır, kesintisiz aynı yüzeydir. Masaüstü sütun sırası değişmez. Cari özetinde alacak/borç/net tek yüzey; liste sağında tek Son 5 işlem, detay sağında türüne bağlı Durum ve bilgiler bulunur. Ziyaret günleri plan bilgisidir. Mobil detay özeti kompakt bakiye gösterir; ek bilgiler kendi bilgi düğmesinden açılır.

Araç ana listesi ve detay kategorileri tek sütun yatay satırlardır; Özet/İşlemler korunur. Bilgi/düzenleme detayda kalır. Bakım göstergesi yalnız tanımlı zaman/km aralığını, poliçe göstergesi süreyi anlatır; ödeme ayrı alandır. Eksik veriye oran atanmaz. Kayıt adlarının saklanan değeri değiştirilmeden tekrar eden standart banka/program adları gösterimde sadeleştirilir. Son işlem önizlemesi aynı taksitli alışverişi bir kez gösterir; özgün dönemler ayrıntıda erişilebilir kalır.

## 28 Ekim 2026 — 1.12.0 ortak veri girişi ve gezinme

- Veri girişi tek formda bölümlenir: başlık/bağlam → temel bilgiler → işleme bağlı bilgiler → isteğe bağlı ayrıntılar → gerektiğinde finansal etki açıklaması → sabit Vazgeç/kaydet eylemleri. Gerçek zorunlu alanlar sırf kısalık için gizlenmez; banka/kart metadata bağlantıları finansal işlem yaratmaz.
- Cari iletişim/adres tek bölüm, başlangıç bakiyesi ve türe özel bilgiler gerektiğinde açılır. Kartta kimlik/limit ve ekstre takvimi açık; başlangıç borcu ve kart ayrıntıları isteğe bağlı bölümdedir. Ekstre borcu toplam borcun içindedir.
- Yeni işlemde tutar/tarih önceliklidir; açık hesap/tam/kısmi ödeme mevcut hesap modeliyle işlenir. İşlem etkisi metinle açıklanır; renk tek anlam taşıyıcısı olmaz.
- Türkçe alan hatası + bağlantılı kısa hata özeti, kapalı hatalı bölümün açılması ve ilk hatalı alana odak uygulanır. Kaydet yalnız kayıt sürerken kilitlenir; hata durumunda girdiler korunur.
- Önceki Esc/dışarı tıklama taslağı koşulsuz iptal eder kuralı, değiştirilmiş veri giriş formlarında kaldırılmıştır: boş form kapanır; değişmiş formda Düzenlemeye dön / Değişikliklerden vazgeç seçimi sunulur. Takvim Esc önce yalnız takvimi kapatır. Taslaklar kalıcı localStorage'a yazılmaz.
- Ana menü temiz ana listeye gider; detaydan Listeye dön ve tarayıcı Geri/İleri önceki liste tercih/konumunu korur. Hash rota yenilemede sayfa/kaydı korur. Alt menü yalnız kendi bölüm ailesinde görünür. Çıkışta oturum belleği ve rota temizlenir.
- Genel bakış araması 3 karakter/300 ms sonrası cari/işlem/hesap/kart/araç önerilerini alana bağlı pencerede gösterir; sonuçlar dönem filtresinden bağımsızdır. Diğer menüler bağlamsal aramayı korur.
- Varsayılan Bu Ay görüntüleme dönemi etkin filtre sayılmaz; özel dönem temizlenince Bu Ay'a dönülür ve rozet/çip kalkar. Cari liste özeti ana/sağ sütunun tamamını kapsar.
- Mobil kart özeti ana kullanılabilir limit + limit göstergesi, iki metrik, belirgin son ödeme satırı ve kapalı Daha fazla alanını kullanır. Bilgi/düzenleme aynı özet içinde ayrı boş satır açmadan durur; masaüstü ayrıntıları korunur.

## 1.14.0 — Onaylı kayıt giriş yüzeyleri

Kart, hesap, cari ve araç oluşturma modal yerine tam sayfadır. Başlık/geri/eylemler ortak dilde, ana/yardımcı alanlar masaüstünde 1,9:1 oranındadır. Düzenleme ve finansal işlem ekleme alt kenarda, dış sayfa boşluklarına uzanmadan aynı içerik sınırlarına hizalı kompakt alandır. Arka plan bulanmaz; liste kaydırılabilir ve son satırlar için alan ayrılır. Gerekli alanlar açık, diğerleri Diğer üzerinden erişilirdir. Metin ve 44px alanlar sıkıştırmak için küçültülmez.

Mobilde oluşturma sayfasının Kaydet/Vazgeç çubuğu alt gezinmenin yerini alır; işlem/düzenleme alanı normal gezinmenin üstünde durur, klavye açıkken gezinme gizlenir. Alanlar okunabilir iki/tek sütuna akar, kaydetme erişilir kalır. Dört ana gezinme hedefi aynı kısa etiketlerle korunur. Değişmiş taslak ayrılmadan önce korunur; kapalı ayrıntılardaki değerler kaybolmaz.

## 1.15.0 — Cari düzenleme ve tek satır işlem alanı

Cari ekleme/düzenleme ortak tam sayfadır; diğer düzenleme yüzeyleri önceki kurallarını korur. Alt işlem alanında bağımsız başlık satırı yoktur; X Kaydet yanında, tarih yalnız erişilebilir etiketli takvim ikonu olarak görünür. Temel kontroller masaüstünde tek satır; ayrıntılar ve finansal etki Diğer içinde, hatalar gerektiğinde görünürdür. Mobilde tek satıra zorlama veya 44 px altı hedef yoktur. Tek aylık takvim gövdesi yedi eşit sütunla kullanılabilir genişliği doldurur; ikonuna bağlı açılır, blur veya sayfa kayması yoktur.

## 9 Kasım 2026 — Onaylı global kutu sistemi ve tema ayrımı

Tüm sayfalarda ortak dokuz bölge sözleşmesi kullanılacak: 1 Sidebar, 2 Header, 3 Content çerçevesi, içinde 4 Sayfa başlığı / 5 Özet / 6 Ana içerik / 7 Yardımcı içerik / 8 Footer ve çerçeveyle hizalı ayrı 9 Hızlı işlem alanı. Dar genişlikte yardımcı alan ana içeriğin altına taşınır; hızlı işlem bölgesinin kendi yüksekliğine yer ayrılır, diğer bölgeleri örtmez. Bölgeler ortak kabuğun slotlarıdır; gereksiz boş kutular oluşturulmaz. Kesin ölçüler ve sabit/kaydırma davranışları sırayla görüşülecektir.

Yerleşim, görsel tema, ortak bileşen stilleri ve etkileşim/veri davranışı ayrı sorumluluklardır. Renk veya düğme görünümü değiştirmek kabuk ölçülerini ve diğer sayfaların düzenini değiştirmemelidir. Anlamsal renkler tema tokenlarıyla; bölge ölçüleri yerleşim tokenlarıyla; düğme gibi öğeler kapsamı belli varyantlarla yönetilir. Tipografi/boyut değişikliklerinin ölçü etkisi esnek akış ve responsive testlerle ele alınır. Çoklu tema gelecekteki olasılık olarak desteklenecek mimari karardır; yeni tema veya seçici henüz istenmedi.

Ayrıntılı geçerli sözleşme: [Global yerleşim sözleşmesi](GLOBAL-YERLESIM-SOZLESMESI.md). Bu onay gelecek düzenin kriteridir; kodlama/yayın başlatmaz. Önceki sabit breakpoint ve koşulsuz iki sütun kuralları yeni mimariye taşınırken bu sözleşmeye göre gözden geçirilecektir; henüz değiştirilmiş sayılmaz.

Sidebar manuel kontrolü: Geniş ekran dahil her genişlikte kullanıcıya küçültme ve tamamen gizleme olanağı sunulur. Tam / ikon şeridi / gizli durumları ayrıdır; otomatik responsive uyarlama kullanıcının tercihini silmez. Gizliyken yeniden açma kontrolü erişilebilir kalır. Menü alanı boş bırakılmadan ortak yerleşim kalan genişliği kullanır. Ayrıntılar global yerleşim sözleşmesindeki Sidebar bölümündedir.

Header görev dağılımı onaylandı: menü kontrolü, esnek ve kapsamı anlaşılır arama, uygulanabilir filtre, bildirim ve yer uygunsa ikincil kontroller tek ortak satırdadır. Gizli sidebar'ın açma kontrolü Header'da erişilebilir kalır. Header kaydırırken üstte erişilir kalır; açılır öğeler sayfayı itmez. Kesin ölçüler ve dar genişlik geçişleri global yerleşim sözleşmesi üzerinden doğrulanacaktır.

Content ve başlık/özet ayrımı kullanıcı tarafından uygun bulundu: 3 ortak dış çerçevedir; 4 sayfa kimliği ve ana eylemleri, 5 güncel metrikleri taşır. 4 sade başlık satırı, 5 gerektiğinde tek bölümlenmiş özet yüzeyidir; her ikisine ayrı panel zorunlu değildir. 6–9 ve açılır katmanların detayları global yerleşim sözleşmesinde son öneri paketi olarak kaydedildi; bu son öneriler henüz ayrıca onaylı uygulama sayılmaz.

Kullanıcı son 6–9 bölge davranışlarını ve bağımsız açılır katman önerisini onayladı. Önceki “son öneri henüz onaylı değil” ifadelerinin yerini bu onay alır. Tek içerik akışı, alta taşınan yardımcı alan, akış sonundaki footer, yüksekliğine yer ayrılan hızlı işlem bölgesi ve küçük merkezi taslak onayı geçerli kapsamdır. Kesin ölçüler testle doğrulanacak; tema/kodlama çalışma sırası görüşülüyor, henüz yeni uygulama/yayın talimatı verilmedi.

1.16.0 uygulama kaydı: Son kodlama talimatı önceki not aşamasını yürürlüğe aldı. Dokuz bölgeli ortak kabuk, içerik container'ına bağlı sütunlar, kalıcı sidebar tercihi, tek ana kaydırma, kendi yüksekliğine yer ayrılan işlem bölgesi ve bağımsız merkezi taslak onayı uygulandı. Tema renkleri `theme.css`, kabuk ölçüleri `layout-tokens.css/app-shell.css` içinde ayrıldı. Kesin başlangıç ölçüleri ve davranışlar global sözleşmenin 1.16.0 bölümünde; yeni tema ve canlı/GitHub yayını bu aşamanın kapsamı değildir.

## 1.17.0 — mobil durumların kabulü

Yalnız kapalı liste ve body taşması kontrolü yeterli değildir. Seçili/açık satır, meta bilgiler, bakiye ve eylemler aynı tam genişliği paylaşmalıdır. Mobil tablo yapısında blok satır ile native tablo hücresini karıştırmayın. Mobil drawer metinli gezinmedir; masaüstü kompakt ikon modu değildir. Özetlerde mobil ayraçlar ortak kenarda yataydır; eski masaüstü dikey çizgileri/girintileri taşınmaz. Cari kapalı özeti kompakt kalır.

Mobil filtre başlık/alanlar/eylemler olarak bölünür; yalnız alan gövdesi kaydırılır, eylemler alt gezinme üstünde erişilebilir kalır. Mobil header ayrı Ara düğmesi yerine klavyenin Ara/Enter eylemini kullanır; erişilebilir tam arama etiketi korunur, kısa placeholder kullanılır. Odak menüyü ve zili gizlemez. Hesap listesinde banka/ad/bakiye önceliklidir; sahip/IBAN/tür bilgisi detaydan erişilebilir kalır. Çok dar kart listesinde finansal metrikler para birimiyle tam görünür. Bildirim önemi metin ve ikonla sürer; bütün satırı boyamak zorunlu değildir. 44 px temel eylem hedefleri korunur. Chromium ve WebKit'te gerçek satır/hücre geometrisi, filtre footer'ı ve kritik tutarlar kontrol edilir; viewport emülasyonu gerçek cihaz testi olarak sunulmaz.

## 16 Kasım 2026 — 1.18.0 onaylı cari detay istisnası

Cari detayında ad/tür/güncel bakiye kompakt tek yüzeydedir; önceki ayrı başlık ve dört metrikli özet yerine kullanılır. Aşağı ok bilgileri kendi yüzeyinde genişletir; rol izinli geri/düzenle/yeni işlem korunur. Cari hareket araması, filtre, sıfırla, sırala ve CSV bu listede birliktedir; header araması açıkça genel arama kapsamındadır. Ortak kabuk ve diğer modüllerin arama yerleşimi korunur. Cari hareket rakamları nötr, yön etiketleri işarete göre renkli; üst net bakiye renkli kalır. Brüt tutar/peşin ödeme/net etki/tarihsel bakiye açılan satırda ayrı anlam taşır. Filtre toplamı güncel bakiye yerine geçmez. Masaüstü sütun sırası ve mobil blok sunumu korunur. Bu değişiklik için kullanıcı uygulama ve yeni sürüm yayını onayı verdi.

## 1.19.0 ile güncellenen kararlar

Önceki nötr cari rakam kuralı tutarın rakamları için sürer; işaret yön renginde, satır bakiyesinin tamamı kendi işaretine göre renklidir. Cari bakiyesinde alacak/borç metni yerine çapraz ok, sıfırda nokta vardır; anlam erişilebilir adlarda korunur. Sıralama da ikona bağlı, blur olmayan bir penceredir. Cari işlem formu varsayılan açıktır; X taslağı gizler ve aynı noktada + olur. Formdan gerçekten ayrılma koruması sürer. Menü görünümü her tıklamada tam/dar/gizli/tam döner. Animasyonlar kısa, rakamlar sabittir; prefers-reduced-motion ile kapanır. Ayrıntılı kapsam: SURUM-1.19.0.md.

## 1.20.0 — Son notların yürürlüğü

Ayrıntılı bölüm bazlı analiz SURUM-1.20.0.md içindedir. Arama/filtre aynı çubukta kaldırılabilir çiplerdir; eski harici ara/filtre/sıfırla düğmeleri kalkar. Aktif tarih aynı sütunda iki satır (12 px/500 tarih, 12 px/400 gün-saat-saniye), tekrarsızdır. Finansal düzenleme işlem türü dahil kendi satırında; ilgili alanlar aynı satırda genişler. Görünüm son 30 hareketten başlar, önceki kayıtlar konumu bozmadan eklenir. Gerçek ay sonu bakiyesi filtrelenen toplamla karıştırılmaz. Gizli giriş formu grid'de yer bırakmaz, + aynı konumda yüzer. Ortak davranışlar cari/banka/kart/ödeme/rapor hareketlerinde paylaşılır; araç, takvim, ekstre ve ayarların farklı veri anlamları korunur.

## 1.21.0 — Yerleşim ve bileşen sahipliği

Ana/yardımcı sütun dönüşümü, ana tablonun okunabilir minimumunu birlikte karşılar. 1,9:1 masaüstü oranı korunur; yeterli alan yoksa yardımcı bölge tam genişlikte alta iner. Arama ikonları dikey merkezlidir; filtre metinleri kelime/harf bazında parçalanmaz, etiket kendi bütünlüğünde sarılır. Ek işlem alanları yatay alanı kullanır; gereksiz iç içe açılır bölümler kaldırılır. Form eylemleri içerik genişliğiyle büyümez; mobil dokunma hedefleri korunur. Yerleşim hataları viewport ve bileşen geometri testleriyle denetlenir. Tipografi/renk/ikon dili ve finansal anlamlar değişmez.

## 1.28.0 — Ortak kompakt formlar ve mobil gezinme

Finansal ekleme ve düzenleme, hareket tablosunun üstünde aynı formun iki modudur; tablo satırı salt okunur kalır. Alanlar sütun çizgilerine zorlanmaz, mali ilişkilerine göre gruplanır. Müşteri/tedarikçi/personel farklı işlem seçeneklerini korur. Zorunlu ödeme alanları doğrudan görünür; isteğe bağlı ayrıntılar kapalıdır. Düzenleme gerekçesi ve taslak koruması korunur. Bakiye önizlemesi eski etkiyi çıkarıp yenisini uygular.

Varsayılan hareket sırası işlem tarihi/saatine göre azalandır. Cari bilgileri kendi Durum ve bilgiler kartında düzenlenir. Personel takvimi gerçek İstanbul haftasına dayanır. Mobil alt gezinme kaldırılır; bölüm erişimi yalnız hamburger menüyle, form eylemleri kendi formunda sağlanır. Önceki satır içi finansal editör, liste sonu yeni işlem ve dört düğmeli alt gezinme kararları bu kapsamda geçersizdir.

## 1.29.0 — Ayrı form kartı ve kısa kayıt geçmişi

İşlem formu ve hareket listesi ortak çerçeveden ayrılır; ikisi de yuvarlatılmış karttır, ortak bölüm boşluğu korunur. Tutar üst işlem satırının sağındadır, eylemler İşlemin etkisi bölümündedir. Diğer uygun kayıt formları da listeyle aynı çerçevede sıkıştırılmaz. Geçmişte yalnız değişen alanların önce/sonra değerleri gösterilir. Silme yerinde kompakt gerekçe/eylem satırıdır; üstü çizili önizleme kaydetmeden mali etki doğurmaz. Kopyalama ikonlarının dokunma alanı bilgi satırının görünür yüksekliğini büyütmez.
