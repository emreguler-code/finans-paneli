# Sade Netlik — geçerli tasarım kararları

Finans Paneli'nin kendi tasarım dili korunur; başka projelerin görsel tercihleri aktarılmaz.

- Yerel Inter, Lucide ikonları, tabular rakamlar. Sayfa başlığı masaüstünde 27 px, mobilde 24 px; bölüm başlığı 16 px/600, alt başlık 14 px/500, ana metin 14 px, yardımcı metin 12 px. Yardımcı metin satır yüksekliği 1,5; mobil form alanı 16 px. Ölçüler `src/styles/tokens.css` üzerinden paylaşılır.
- Porselen #F5F7F8, beyaz, metin #202C39, ikincil #596879, vurgu #087F8C, yeşil #147D59, kırmızı #B54343, uyarı #955F12, çizgi #DDE3E8.
- İşlem pencereleri merkezde, arka plan bulanık. Sağdan açılan işlem paneli yok. Satır içi detaylar/filtreler ve log baloncukları bu kurala özel istisnadır.
- Benzer listelerde arama, filtre, sıfırla, sırala ve CSV ikonları ortak düzendedir; altlarında yazı yoktur, erişilebilir adları bulunur.
- Cari sütunları: Tarih / Açıklama / Etiket / İşlem–Oluşturan / Tutar / Bakiye. Onaysız yer değişikliği yapılmaz. Açıklamada yalnızca kullanıcının metni görünür; cari adı otomatik eklenmez.
- Cari başlığındaki aşağı ok mevcut beyaz kutuyu genişletir. Bilgiler yeni pencerede açılmaz.
- Aktif hareket ve alt eylemler tek satır yüzeyi gibi görünür: arada çizgi yok, sol koyu işaret genişleyen alanın tamamını kaplar. Kompakt düzenle/log/sil ikonları; tutar sağa hizalı.
- İşlem etiketinin yeşil/kırmızı yönü ilgili hesabın işaretine uyar; rakamların mevcut renk davranışı ayrıca değiştirilmez. Tutar ile net etki/bakiye birbirine karıştırılmaz.
- Banka ve kredi kartı carousel'leri döngülü, kenarları silik, dokunma/fare sürükleme ve oklarla gezilir. Seçilen kartın hareketleri altta açılır. Kartlar masaüstünde yaklaşık 1,618 oranındadır; mobilde içerik yüksekliği önceliklidir. Kart içeriği kesilmez, geçiş okları metin ve tutarların üzerine gelmez.
- Banka sayfasında arama üstte ekle ikonunun solundadır; arşiv seçeneği yanındaki filtreyle aşağı açılır. Bilgi/düzenle ikonları kart üzerindedir.
- Vadesiz hesapta vade sonu gösterilmez. KMH limit barı kredi kartıyla aynı görsel sisteme uyar. Uyarılar başlık altında ve genel bildirim sisteminde tutarlı görünür.
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

- Tek üst arama, sayfaya özgü filtreler ve taslak/uygulanmış seçim ayrımı kullanılır. Filtre paneli içeriği aşağı iter; aktif seçimler görünür kalır.
- Hesap ve kredi kartı carousel ortak Embla mekanizmasıyla çalışır. Otomatik kaydırma yoktur; liste seçimi geçiş durduğunda güncellenir.
- Ödeme Planı takvim olarak kalır. Masaüstünde gün hücreleri tutar ve kayıt özeti, mobilde kayıt sayısı ile Ö/T/V göstergeleri içerir. Seçilen günün ayrıntıları sağda veya dar ekranda altta gösterilir. Renk tek başına anlam taşımaz.
