# Finans 1.4 — Onaylanan tasarım kararları

Sade Netlik: mevcut Inter, özgün yazı ölçekleri, Lucide çizgi ikonları ve bağımsız finans. paleti korunur. Safir mavisi / Güler Market projesine ait kararlar kullanılmaz.

- Tarih seçilen tüm alanlarda ortak takvim: işlemler, açılış, cari vade, hesap vade sonu, ekstre ve son ödeme için tek gün; listeler, genel bakış ve raporlar için başlangıç/bitiş aralığı. Bugün, Bu Hafta, Bu Ay, Son 3 Ay, Son 1 Yıl. Türkçe, pazartesi başlangıcı; aralık iki yönde seçilebilir. İşlem tarihi için mevcut gelecekte kayıt yasağı korunur.
- Cari adı ve bakiye aynı başlık kutusunda; bilgi simgesi sağ panel açar. Ayrı hareket/bilgi/vade sekmeleri yok. Vade filtreleri: belirtilmiş, vadesiz, açık, kısmen kapanmış, kapanmış, yaklaşan 7 gün, bugün, gecikmiş. Gerçek tarihsel satır bakiyesi filtrelerle tekrar hesaplanmaz.
- Ödeme Planı: aylık varsayılan; takvim hücrelerinde yalnız nokta. Günlük/haftalık/aylık tüm görünümlerde tıklanınca gün ayrıntıları ve ödeme/tahsilat toplamları açılır. Aylık beş/altı hafta ekranın en ve boyuna sığar. Haftalık yedi sütun korunur. Gecikmiş ve vadesiz kayıtlar ayrı panellerden erişilir.
- Düzenle ve yeni kayıt kontrolleri yalnız kalem / artı ikonudur. Erişilebilir ad ve ipuçları vardır. Formun Kaydet/Vazgeç ve gerçek ödeme/tahsilat eylemleri yazılı kalır.
- Cari türleri: Müşteri #087F8C, Personel #596879, Tedarikçi #955F12, Diğer #202C39; yumuşak zeminler. Finansal pozitif/negatif renklerin anlamı korunur.
- Kompakt banka ve kart kayıtları: yatay 1.618 oran, banka kimliği üst solda, program üst sağda; seçilmiş ödeme ağı ayrıca gösterilir. İlk kayıt kataloğu Garanti BBVA/Bonus, Yapı Kredi/World, Akbank/Axess. Diğer banka için genel banka ikonu kullanılır. Logo yorumları sunumdaki çizgi diline uyarlanmış vektörlerdir; resmî logo dosyalarının birebir kopyası değildir. Eski hesapların banka/program/ağı isimlerinden tahmin edilmez.
- Finansal hareket düzenleme gerekçesi zorunlu; banka/kart ayarlarında gerekçe alanı yoktur. Aktör, saat ve önce/sonra değerleri her durumda denetim geçmişinde korunur. Cari/kullanıcı gerekçe kuralları değişmez.
- Hareketler ana menüsü kaldırıldı; genel bakış ve mobil bağlantılar Raporlar'a yönelir. Cari/hesap/kart içi hareket listeleri korunur.
- Raporlar: ortak tarih/hesap kapsamı, nakit giriş/çıkış/net ve kartla ödeme toplamı; günlük/haftalık grafik, grafikten liste filtresi; arama, filtre, sıfırlama, sıralama ve CSV; açılır hesap/kategori net nakit dağılımları, güncel cari bakiyeler/avanslar. Güncel bakiyeler dönem kapanışı diye gösterilmez. Virman nakit raporuna katılmaz, kart borcu ödemesi yalnız bir kez nakit çıkışı olur.
- Şema 5: hesaplara bank_code; kartlara bank_code/program_code/network_code. Yalnız isteğe bağlı kimlik alanları eklenir; eski finansal hareket, bakiye, vade ve config korunur. Güncelleme update.php üzerinden, manuel SQL yok.

Son hareketler ve genel rapor satırları aynı işlem yönü hesabını kullanır; kartla cari ödeme genel listede eksi, cari içinde borcu azaltan artı etki olarak görünür. Aynı kayıt farklı bağlamdaki gerçek hesap etkisini gösterir.
