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
- Hesap kartları tek bir ana içerik kutusunun içinde bölümlenir. Kayda ait bilgi/düzenleme ikonları yine kendi kartındadır. İç kartların görsel stili üç alternatif üzerinden değerlendirilmektedir; seçim henüz yapılmadı.
- Not ve görsel aşamasıdır; kodlama/yayın onayı değildir. Ayrıntılar sonraki sürüm notlarındadır.
