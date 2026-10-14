# Sade Netlik — geçerli tasarım kararları

Finans Paneli'nin kendi tasarım dili korunur; başka projelerin görsel tercihleri aktarılmaz.

- Yerel Inter, Lucide ikonları, tabular rakamlar. Başlık yaklaşık 27 px, ana metin 14 px, yardımcı metin 12 px; mevcut ölçek ve boşluklar korunur.
- Porselen #F5F7F8, beyaz, metin #202C39, ikincil #596879, vurgu #087F8C, yeşil #147D59, kırmızı #B54343, uyarı #955F12, çizgi #DDE3E8.
- İşlem pencereleri merkezde, arka plan bulanık. Sağdan açılan işlem paneli yok. Satır içi detaylar/filtreler ve log baloncukları bu kurala özel istisnadır.
- Benzer listelerde arama, filtre, sıfırla, sırala ve CSV ikonları ortak düzendedir; altlarında yazı yoktur, erişilebilir adları bulunur.
- Cari sütunları: Tarih / Açıklama / Etiket / İşlem–Oluşturan / Tutar / Bakiye. Onaysız yer değişikliği yapılmaz. Açıklamada yalnızca kullanıcının metni görünür; cari adı otomatik eklenmez.
- Cari başlığındaki aşağı ok mevcut beyaz kutuyu genişletir. Bilgiler yeni pencerede açılmaz.
- Aktif hareket ve alt eylemler tek satır yüzeyi gibi görünür: arada çizgi yok, sol koyu işaret genişleyen alanın tamamını kaplar. Kompakt düzenle/log/sil ikonları; tutar sağa hizalı.
- İşlem etiketinin yeşil/kırmızı yönü ilgili hesabın işaretine uyar; rakamların mevcut renk davranışı ayrıca değiştirilmez. Tutar ile net etki/bakiye birbirine karıştırılmaz.
- Banka ve kredi kartı carousel'leri döngülü, kenarları silik, dokunma/fare sürükleme ve oklarla gezilir. Seçilen kartın hareketleri altta açılır. Kartlar kompakt ve yaklaşık altın oranındadır.
- Banka sayfasında arama üstte ekle ikonunun solundadır; arşiv seçeneği yanındaki filtreyle aşağı açılır. Bilgi/düzenle ikonları kart üzerindedir.
- Vadesiz hesapta vade sonu gösterilmez. KMH limit barı kredi kartıyla aynı görsel sisteme uyar. Uyarılar başlık altında ve genel bildirim sisteminde tutarlı görünür.
- Ödeme planı: aylık görünümde nokta ve tıklayınca detay baloncuğu; haftalıkta günlük ödeme/tahsilat özeti; günlükte tüm satırlar. Takvim pencereye sığar.
- Tek etiket, girilmezse Genel. Formlarda ortak tarih seçici, Türkçe binlik ayırıcı nokta, ondalık virgül kullanılır. İşlem açıklaması eklerken opsiyonel, işlem düzenlerken zorunludur; hesap/kart ayar düzenlemesi için gerekmez.
