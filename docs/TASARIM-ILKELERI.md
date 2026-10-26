# Sade Netlik — geçerli tasarım kararları

Finans Paneli'nin kendi tasarım dili korunur; başka projelerin görsel tercihleri aktarılmaz.

- Yerel Inter, Lucide ikonları, tabular rakamlar. Sayfa başlığı masaüstünde 27 px, mobilde 24 px; bölüm başlığı 16 px/600, alt başlık 14 px/500, ana metin 14 px, yardımcı metin 12 px. Yardımcı metin satır yüksekliği 1,5; mobil form alanı 16 px. Ölçüler `src/styles/tokens.css` üzerinden paylaşılır.
- Porselen #F5F7F8, beyaz, metin #202C39, ikincil #596879, vurgu #087F8C, yeşil #147D59, kırmızı #B54343, uyarı #955F12, çizgi #DDE3E8.
- İşlem pencereleri merkezde, arka plan bulanık. Sağdan açılan işlem paneli yok. Satır içi detaylar ve log baloncukları bu kurala özel istisnadır. Bildirimler, ortak filtreler ve tek gün dahil tüm tarih seçimleri tıklanan alana bağlı kompakt pencere olarak açılır; arka plan bulanmaz ve içerik aşağı itilmez. Esc/dışarı tıklama taslağı iptal eder.
- Benzer listelerde arama, filtre, sıfırla, sırala ve CSV ikonları ortak düzendedir; altlarında yazı yoktur, erişilebilir adları bulunur.
- Cari sütunları: Tarih / Açıklama / Etiket / İşlem–Oluşturan / Tutar / Bakiye. Onaysız yer değişikliği yapılmaz. Açıklamada yalnızca kullanıcının metni görünür; cari adı otomatik eklenmez.
- Cari başlığındaki aşağı ok mevcut beyaz kutuyu genişletir. Bilgiler yeni pencerede açılmaz.
- Aktif hareket ve alt eylemler tek satır yüzeyi gibi görünür: arada çizgi yok, sol koyu işaret genişleyen alanın tamamını kaplar. Kompakt düzenle/log/sil ikonları; tutar sağa hizalı.
- İşlem etiketinin yeşil/kırmızı yönü ilgili hesabın işaretine uyar; rakamların mevcut renk davranışı ayrıca değiştirilmez. Tutar ile net etki/bakiye birbirine karıştırılmaz.
- Hesap/kredi kartları duyarlı grid listede gösterilir; seçilen kartın ayrı detayında yatay özet ve hareketler bulunur. Carousel kullanılmaz. Kart içeriği kesilmez, detayda sabit en/boy oranı zorlanmaz.
- Banka sayfasında arama üstte ekle ikonunun solundadır; arşiv seçeneği yanındaki filtreyle aşağı açılır. Bilgi/düzenle ikonları kart üzerindedir.
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

- Kart benzeri her alanda kendi bilgi, ayar ve düzenleme ikonları kendi kartının üzerinde toplu bulunur. Bu kural hesaplar, kredi kartları ve araç kartları için ortaktır.
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

- Kullanıcının yeni kararı: gereksiz ikinci liste başlığı kaldırılır. Sayfaya ait sıralama/indirme ve gerekli araçlar ana başlık satırında gruplanır; ince ayraçtan sonra yeni kayıt/işlem ekleme düğmesi en sağda kalır. Site genelinde aynı yerleşim kullanılacaktır.
- Hesap kartları tek bir ana içerik kutusunun içinde bölümlenir. Kayda ait bilgi/düzenleme ikonları yine kendi kartındadır. Kullanıcı 3 numaralı yatay kart düzenini onayladı: tek ana kutu içinde tam genişlikli hesap kartları ve hizalı kimlik/tutar/tür/eylem bölümleri kullanılacaktır.
- Not ve görsel aşamasıdır; kodlama/yayın onayı değildir. Ayrıntılar sonraki sürüm notlarındadır.

- Onaylı 3 numaralı görsel yalnız yerleşim referansıdır; nihai fontlar, tipografi/değer rolleri, boşluklar, kontrol ölçüleri, renkler ve ana/sağ sütun oranı bu belgedeki ortak kurallara uyar. Üst araçlar tam sayfa başlığının en sağındadır; ekle düğmesi ayraçtan sonra en sağda kalır. Mobilde kart içeriği okunabilir biçimde alt alta düzenlenir.


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


## 26 Ekim 2026 — Site genelinde ortak içerik araçları satırı (onaylı, uygulama bekliyor)

- Yeni kayıt/işlem ekleme düğmesinin bulunduğu başlık satırı, içerikle ilgili araç ikonlarının da ortak yeridir. Sıralama, indirme/dışa aktarma ve benzer içerik eylemleri için ayrı araç satırı oluşturulmaz; mevcut ayrı satırlar bu kurala uyarlanır. Bu karar yalnız Hesaplar için değil site genelinde geçerlidir ve önceki ayrı içerik araç satırı yerleşimlerinin yerini alır.
- İçerik araçları ekle düğmesinin yanında yer alır; araya ince dikey ayraç konur. Önceden onaylanan sıra korunur: içerik araçları → ayraç → en sağda yeni kayıt/işlem ekle.
- Gerekli alt ikon grupları ilgili ekran ele alınırken belirlenecektir; şimdi sabit bir alt gruplama veya yeni ikon listesi dayatılmaz.
- Ortak ikon/düğme ölçüleri ve erişilebilir adlar korunur. Bu kural, kayda özgü bilgi/düzenleme ikonlarının kendi kartı/özetinde bulunması kararını kaldırmaz.
- Kullanıcı not aşamasındadır; yalnız tasarım belgeleri güncellenir, kodlama ve yayın başlatılmaz.
