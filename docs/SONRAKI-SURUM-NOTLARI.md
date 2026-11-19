# 1.9.0 / 1.9.1 — uygulanan onaylı tasarım notları

1.9.1 bakım eki: detay ekranındaki liste kapsamlı arama eşleşen kaydı seçer; boş sonuçta geri dönüş ve tüm hesap uyarıları korunur. Şema 10 değişmez.

## 26 Ekim 2026 — Kredi kartları: grid liste ve ayrı detay sayfası

Durum: Kullanıcının 26 Ekim 2026 toplu kodlama/yayın onayıyla 1.9.0 kapsamında uygulandı. Bu karar kredi kartları için önceki carousel kararının yerini alır. Sonraki kullanıcı talebiyle Hesaplar bölümü de aşağıdaki kapsamla aynı gezinme yaklaşımına dahil edildi.

### Gezinme ve liste

- Kredi kartları menüsü, yalnız kredi kartlarının mevcut kart görsellerini temel alan bir grid liste açar. Carousel, sürükleme, önceki/sonraki okları ve konum sayacı kredi kartlarından kaldırılır.
- Kartın üzerine tıklayınca o karta ait ayrı detay sayfası açılır. Ekstre / Dönem içi işlemler / Gelecek dönem sekmeleri bu sayfadadır. Listeye dönüş bulunur; dönüşte arama/filtre ve kaydırma konumunun korunması hedeflenir.
- Liste kartlarında mevcut banka/program kimliği, tutarlar ve limit kullanımının görsel dili korunur. Kartın bilgi/ayar/düzenleme ikonları kendi üzerinde kalır; bu ikonlara basmak kartın detayına gitme eylemini ayrıca tetiklemez. Kart açma klavyeyle de erişilebilir olmalıdır.
- Grid sütun sayısı içerik alanının genişliğine göre uyarlanır; dar ekranda tek sütun kullanılır. Kart ve tutarlar okunamayacak kadar küçültülmez. Ortak üst arama ve sayfaya özgü filtreler korunur.

### Detay başlığı: yatay kart özeti

- Detay sayfasının üstünde mevcut kartın görsel dilini taşıyan, sayfanın içerik genişliğine uyarlanan yatay bir özet bandı bulunur. Bu bantta 1,618 en/boy oranı zorlanmaz; yükseklik içerikle belirlenir.
- Mevcut bilgiler: banka/program, kart adı, maskeli numara, kart sahibi, toplam limit, kullanılabilir limit, ekstre borcu, dönem içi/gelecek taksit limit kullanımı ve mevcut kesim/son ödeme bilgileri. Finansal anlamları birbirine karıştırılmaz.
- Eklenecek bilgiler: bir sonraki hesap kesim tarihi, bir sonraki son ödeme tarihi, önceki ekstre borcu ve açıkça atanmışsa kartın bağlı olduğu banka/kasa hesabı. Atanmamış hesap banka adından tahmin edilmez; "Bağlı hesap seçilmedi" olarak belirtilir.
- Mevcut ekstre ile bir sonraki dönemin tarihleri ayrı etiketlenir. Önceki ekstre toplamı ile o ekstreden kalan borç ayrı kavramlardır; birlikte gösterilirse açıkça adlandırılır ve borç toplamına ikinci kez eklenmez. Gelecek tarihler geçerli dönem/ayar bilgisine dayanır; bilgi yoksa uydurma tarih gösterilmez.

### Sade Netlik ile uyumlu yerleşim önerisi

- Masaüstünde üç görsel bölge: yaklaşık %25 kart kimliği, %45 limit/tutar özeti, %30 dönem tarihleri ve bağlı hesap. Bunlar sabit piksel veya kesin oran şartı değildir; uzun adlar ve tutarlara göre esner.
- Limit toplamı ve kullanım barı orta bölgede; ekstre borcu, dönem kullanımı ve kullanılabilir tutar aynı hizadaki alt metriklerde yer alır. Önceki ekstre bilgisi ilgili borç grubunda, mevcut/sonraki tarihler tarih grubunda gösterilir.
- Karta ait bilgi/ayar/düzenleme ikonları özet bandının kendi sağ üst bölümünde toplu bulunur. Finansal verilerle çakışmaz. Sekmeler bandın altında, hareket araçları ilgili tablonun kapsamında kalır.
- Tablet düzeninde bilgiler iki gruba, telefonda kimlik → limit/borç → tarihler/bağlı hesap sırasıyla alt alta yerleşir. Yatay bant biçimi uğruna yatay sayfa taşması veya küçük yazı kullanılmaz.
- Yerel Inter, Lucide, tabular para rakamları, mevcut renk paleti, başlık rolleri ve 4–32 px boşluk ölçeği korunur. Ana tutarlar öncelikli, tarih/hesap etiketleri ikincil olur; gereksiz yeni çerçeveler eklenmez. Mobil eylem alanları en az 44 × 44 px kalır.

## 26 Ekim 2026 — Hesaplar: aynı grid ve detay yaklaşımı

Durum: 1.9.0 kapsamında mevcut banka/kasa/KMH alanları korunarak uygulandı. İleri hesap özeti özelleştirmeleri ayrıca değerlendirilebilir.

- Hesaplar bölümündeki carousel de kaldırılacak; banka/kasa/KMH ve diğer hesaplar mevcut kart görünümünü temel alan, ekran genişliğine uyarlanan bir grid listede gösterilecek. Sürükleme, önceki/sonraki okları ve carousel sayacı kaldırılacak.
- Kredi kartlarıyla aynı liste → seçili hesabın ayrı detay sayfası yaklaşımı izlenecek. Detayda sayfa genişliğinde yatay hesap özeti ve hesaba ait hareket alanı bulunacak; başlıkta altın oran zorlanmayacak. Alanların kesin dağılımı daha sonra konuşulacak.
- Hesap hareketleri ve gelecek dönem hareketleri ayrımı; banka/kasa bakiyesi, KMH limiti/kullanılan/kullanılabilir tutar ve tahmini faiz gibi hesap türüne özgü anlamlar korunacak. Vadesiz hesaplarda vade sonu gösterilmeyecek. Kredi kartına özgü ekstre/kesim alanları banka veya kasa hesabına taşınmayacak.
- Tüm aktif hesap ve kasaları kapsayan kalıcı uyarı alanı kararı korunacak; seçili hesap veya arama diğer hesapların uyarılarını gizlemeyecek. Uyarıya tıklanınca ilgili hesap, hareket sekmesi ve varsa ilgili satır açılacak. Grid ve detayda masaüstü sağ sütun, dar ekranda ayrı yer ayıran Uyarılar düğmesi kullanılır.
- Bilgi/ayar/düzenleme ikonları kendi hesap kartı veya özet bandı üzerinde birlikte bulunacak. Ortak arama, sayfaya uygun filtreler, hareket araçlarının kendi kapsamı ve mobil okunabilirlik kuralları korunacak.

## 26 Ekim 2026 — Alt menüler başlangıçta kapalı

Durum: Kullanıcı tarafından onaylandı; tasarım ilkelerine eklendi. 1.9.0 kapsamında uygulandı.

- Genel kural: Bir ana menünün altında alt menüler varsa başlangıçta görünmezler. İlgili ana menüye tıklandığında alt menüler açılır ve görünür olur. Bu kural mevcut ve gelecekteki tüm alt menüler için geçerlidir.
- Kredi kartları altındaki Kampanyalar sürekli görünür olmayacak; yalnız Kredi kartları ana menüsüne tıklanıp alt menüsü açıldığında gösterilecek. Buradaki tetikleyici, grid içindeki tekil kredi kartına değil ana menü öğesine tıklamaktır.
- Açık/kapalı durum anlaşılır bir yön ikonu ve erişilebilir durum bilgisiyle belirtilir; klavye ve mobil gezinmede de aynı açılma kuralı uygulanır.

## 26 Ekim 2026 — Finansal görünüm referansıyla ortak sayfa düzeni

Durum: Kullanıcı tarafından onaylanan global tasarım yönü; 1.9.0 kapsamında ortak bileşen ve stillerle uygulandı. Referans, kullanıcının paylaştığı Finansal görünüm ekranındaki başlık, Güncel durum kutusu ve ana/sağ sütun düzenidir.

- **Sayfa başlığı:** Her sayfa hangi bölümde olduğumuzu net gösteren sade bir başlık satırı kullanır. Başlık, kısa açıklama ve varsa sağdaki ana eylem aynı hiyerarşi/hizalama/boşluk sistemini izler. Sayfaya göre farklı başlık düzenleri veya gereksiz tekrar başlıkları oluşturulmaz.
- **Tek özet kutusu:** İlişkili özet metrikleri, Güncel durum örneğindeki gibi tek dış çerçeve ve tek yüzey içinde, ince iç ayırıcılarla bölümlenir. Etiket → ana değer/birim → kısa açıklama hiyerarşisi korunur. Her metriği bağımsız kenarlıklı karta ayıran farklı bir görsel dil kullanılmaz.
- **Raporlar:** Mevcut ayrı özet kartları, hesapları ve anlamları korunarak bu tek, kendi içinde bölümlenmiş özet kutusuna dönüştürülecek. Diğer menülerde de özet gereksinimi varsa aynı bileşen/düzen kullanılacak; ihtiyaç olmayan sayfaya zorunlu özet eklenmeyecek.
- **Özetin anlamı:** Görsel dil ortak olsa da metrikler ve bölüm adı bağlama uygun olacak; örneğin raporda seçili dönem/filtre özeti açıkça belirtilecek. Güncel bakiye ile filtrelenmiş dönem toplamı birbirine karıştırılmayacak. Mobilde metrikler aynı dış kutu içinde alt satırlara geçecek; ayrı kartlara dönüşmeyecek.
- **Ana içerik / sağ sütun:** Sağ sütun kullanılmasına karar verilen sayfalarda Finansal görünümün geniş ekran oranı ortak referans olacak. Mevcut kaynakta bu oran 1,9:1; sütun aralığı hariç yaklaşık %65,5 ana içerik / %34,5 sağ sütundur. Geniş ekranda mevcut 20 px ara boşluk referans alınacak. Her sayfaya farklı oran veya bağımsız sabit sağ sütun genişliği verilmeyecek.
- **Duyarlı yerleşim:** Aynı genişlikteki sayfalar aynı sütun davranışını izleyecek. Daralırken okunabilirliği koruyan ortak kırılımlar kullanılacak; gerekince tek sütuna geçilecek. Tutarlar sıkıştırılmayacak, yatay sayfa taşması oluşturulmayacak. Sağ sütunun mobil erişimi, özellikle hesap uyarılarının her zaman erişilebilir olması kararıyla birlikte korunacak.
- **Ortak görünüm:** Başlık/özet/ana içerik sırası, içerik kenarları, bölüm aralıkları, panel iç boşlukları, çizgi ve köşe biçimleri, tipografi, ikon ve eylem ölçüleri tüm sayfalarda aynı tasarım sisteminden beslenecek. Ortak düzen tek bir yeniden kullanılabilir uygulama üzerinden kurulacak; sayfa başına kopyalanıp zamanla farklılaşan stiller üretilmeyecek.
- Bu karar, önceki kredi kartı ve hesap grid/detail notlarıyla birlikte uygulanacak: yatay detay özetleri de aynı görsel dili taşıyacak. Her sayfaya sağ sütun ekleme zorunluluğu yoktur; sağ sütun gereken yerlerde oran ortak olacaktır. Hesaplar bölümünde mevcut hesap türlerine özgü alanlar korunmuştur.

## 26 Ekim 2026 — Tasarım incelemesindeki önerilerin toplu onayı

Durum: Kullanıcı, `TASARIM-INCELEMESI-2026-10-26.md` içindeki A1–A4 ve B1–B10 önerilerinin tamamını onayladı. 1.9.0 kapsamında uygulandı; doğrulama sonuçları TEST-RAPORU-1.9.0.md içindedir.

- Mobil Ödeme Planı tarih/gezinme kontrollerinin örtüşmesi ve Hesaplar uyarı düğmesinin hareket tutarını kapatması giderilecek. Uyarılara sürekli erişim korunacak.
- Raporlar ve Ödeme Planı başta olmak üzere ortak başlık → tek bölümlü özet → içerik sırası uygulanacak. Sağ sütun kullanılan yerlerde ortak 1,9:1 oran izlenecek.
- Onaylı hesap/kredi kartı grid ve ayrı detay sayfası geçişleri ile kapalı başlayan alt menü kuralı aynı düzen içinde ele alınacak. Hesap alanlarının daha ayrıntılı görüşülmesi kararı korunuyor.
- Cari/araç detay başlıkları, geri dönüşler, panel dolguları, sekmeler ve ilgili liste araçları ortaklaştırılacak. Araç hatırlatmaları masaüstünde ortak orandaki sağ sütuna alınacak; mobilde uzun liste kartları aşağı itmeyecek.
- İkonların bağlama uygun adları, menü hiyerarşisi ve mobilde en az 44 px etkileşim alanları düzeltilecek. Mevcut Lucide ailesi ve marka çizimleri korunacak.
- Başlık rolleri, grafik ekseni/tarih/birim biçimleri ve aynı finansal metriğin renk rolü tutarlı olacak. Bu onay hesap modelini, para işaretlerini veya tablo sütunlarının sırasını değiştirme yetkisi değildir.
- Kullanıcılar gibi finans dışı ekranlarda bağlamsız TL/banka dipnotları temizlenecek; az kayıt bulunan sayfalara gereksiz özet veya sütun eklenmeyecek.

## 26 Ekim 2026 — Bütün takvim seçimleri bulanıklıksız açılacak

- Kullanıcının hatırlatmasıyla kural bütün tarih seçimlerine genişletildi: hem tarih aralığı hem tek gün seçen takvimler, tetikleyen tarih alanına/düğmesine bağlı açılacak; takvim açılması arka plana blur, karartma veya sayfayı iten yeni bir katman eklemeyecek.
- Kapsam: Ödeme Planı dönem/takvim tarihi, işlem tarihleri, ekstre kesim/son ödeme tarihleri, hesap vade tarihleri, araç/poliçe/bakım ve kampanya tarihleri dahil ortak tarih seçicinin bütün kullanımları.
- Kaynakta kalan ayrım doğrulandı: `src/DatePicker.jsx` tarih aralıklarında `FloatingPanel`, tek gün seçimlerinde `Sheet` kullanıyor. Tek günün `Sheet` üzerinden açılması mevcut bulanıklığın kaynağı; ortak bağlı takvim davranışına geçirilecek.
- Takvim ekran sınırlarına uyarlanacak, içeriği kaydırmayacak. Dışarı tıklama/Esc yalnız ilgili takvimi kapatacak; tarih aralığında uygulanmamış seçim iptal edilecek. İç içe açılan takvimde üst form yanlışlıkla kapanmayacak; odak tetikleyiciye dönecek.
- Bir işlem formu zaten kendi penceresinde açıksa takvim ikinci bir modal/blur oluşturmayacak. Bu karar genel ekle/düzenle pencerelerinin mevcut arka plan stilini topluca kaldırmaz.
- Kabul kontrolü: tek gün ve tarih aralığı seçimlerinin tamamı masaüstü/mobilde; form içinde ve sayfa üzerinde; blur/ek karartma/sayfa kayması olmadan açılmalı. Zorunlu tarih doğrulaması, seçme/uygulama, Esc, dışarı tıklama ve odak dönüşü korunmalı.

## 26 Ekim 2026 — Cari, hesap ve kredi kartı detaylarında ortak başlık / bilgi bandı

- Kullanıcının netleştirdiği ortak kural: sayfa başlığı, geri dönüş ve yeni işlem ekleme eylemi üst başlık alanında kalır. Başlığın hemen altında, içerik genişliğinde ayrı ve tek bir bilgi/özet kutusu bulunur. Cari detayındaki mevcut ad/bakiye/geri/ekle bileşimi de bu kurala uyarlanacak; cari sayfası istisna olmayacak.
- Alt bilgi kutusu sayfanın yeni işlem ekleme veya listeye geri dönme eylemlerini içine almaz. Kayıt bilgisi/ayar/düzenleme ikonları ise ilgili kaydın bu bilgi bandının üzerinde toplu kalır. Böylece önceki "karta ait ikonlar kendi üzerinde" kuralıyla başlıkta yeni işlem kuralı birlikte sağlanır.
- Aynı dış yüzey, bölüm ayırıcıları, başlık/değer/açıklama rolleri, boşluklar ve duyarlı davranış cari, banka/kasa/KMH ve kredi kartında paylaşılır. Alanlar menünün anlamına göre değişir; cari için ekstre/kesim, vadesiz hesap için vade gibi ilgisiz bilgiler eklenmez.
- Görsel değerlendirme için cari detay örneği üretildi. Yerel görsel: `.qa/design-ideation-20261026/cari-detail-summary.png`; kullanıcı ilk değerlendirmede olumlu buldu, kredi kartı örneğiyle karşılaştırmak istedi. Önerilen örnek alanlar: cari bakiye ve Alacak/Borç durumu, cari türü, ticari unvan ve son hareket. Bilgi kutusunun ayrıntılı alan sırası ve oranları görsel taslak değerlendirmesine tabidir; yeni veri veya finansal hesaplama ekleme kararı değildir.
- Başlıktaki seçili cari adı kutunun dışında olacak; içte ticari unvan ancak farklı anlam taşıyan kayıt alanı olarak gösterilir. Hareket tablosunun sütun sırası, para işaretleri ve bakiye hesabı korunur.
- Durum: ortak başlık/bilgi bandı kuralı kullanıcı talebidir. Cari taslağı ilk değerlendirmede olumlu bulundu; kredi kartı taslağı karşılaştırma için üretildi, kullanıcı tarafından “harika görünüyor” yanıtıyla onaylandı. İki görsel ve karşılaştırma `docs/tasarimlar/cari-ve-kredi-karti-karsilastirma-2026-10-26.md` içindedir. Onaylı taslaklar 1.9.0 uygulamasının ortak görsel referansıdır.

---

# Tamamlanan onaylı değişiklikler — 1.8.0

23 Ekim 2026. Kullanıcının toplu uygulama ve GitHub yayını onayıyla bu maddeler 1.8.0 kapsamında kodlandı. Yayın sonucu GitHub Release ve CI kaydından doğrulanır; canlı hosting kurulumu bu çalışmanın kapsamında değildir.

1. **Bildirimler:** Zile bağlı kompakt pencere; sayfa kayması/blur yok. Gecikmiş, Bugün, Yaklaşan, Diğer grupları; aynı carinin açık tutarları özetlenir. Hedef hesaba/cariye/takibe geçiş; Esc ve dışarı tıklama. Hesaplar sağ uyarı sütunu korunur.
2. **Filtreler:** Arama alanından içeriğin üzerine açılır. Taslak Uygula/Enter ile uygulanır; Vazgeç/Esc/dışarı tıklama iptal eder. Temizle önce taslağı temizler. Hareket/rapor ekranlarında cari/etiket/tutar, hesap hareketlerinde etiket/tutar ve mevcut hesap/tarih/ekleyen seçenekleri. AJAX/fetch ve 3 karakter/300 ms arama korunur. Filtreler gerçek bakiyeyi değiştirmez.
3. **Tarih aralıkları:** Paylaşılan tüm aralık takvimleri bağlı pencere; ekran sınırına uyar, arka plan bulanmaz, içerik kaymaz. Tek gün alanlarının mevcut penceresi korunur.
4. **Cari hareketi:** Açılmış bilgi ve eylem alanı tek yüzey, iç çizgi yok; dış ayırıcı ve sol vurgu korunur.
5. **Genel kart kuralı:** Karta ait bilgi/ayar/düzenleme ikonları kendi kartı üzerinde birlikte bulunur. Liste sıralama/CSV/ekle kontrolleri kendi listesinin kapsamındadır. Yeni araç kartları da bu kurala uyar.
6. **Cari gerekçesi:** Temel cari bilgileri için opsiyonel; kim/zaman/önceki/sonraki değerler denetim geçmişinde. Finansal hareket gerekçeleri değişmedi.
7. **Tedarikçi POS:** Opsiyonel özellikler → POS Cihazı; Garanti Bonus, Akbank Axess, Yapı Kredi World çoklu seçim. Sabit kodlar garanti:bonus, akbank:axess, yapikredi:world. Tür değişiminde temizlenir; eski istemcinin göndermediği alan korunur. Otomatik ödeme/komisyon/taksit işlemi üretmez.
8. **Kampanyalar:** Kredi kartları alt menüsü. Elle tanımlanan koşullar, kaynak bağlantısı, tarih/katılım hatırlatmaları; kart/POS/tedarikçi/etiket/tutar/işlem sayısı kısıtları ve kazanç sınırları. Taksitli alışveriş tek sayılır. Beklenen ve banka tarafından verilen ödül ayrıdır. Puan TL'ye çevrilmez; finansal bakiye otomatik değiştirilmez. Tedarikçi, tutar ve etikete göre olası uygun kart karşılaştırılır; bankadan veri çekilmez.
9. **Araçlarım:** Ana menü; araç kartı, km güncellemesi, sigorta/kasko poliçe geçmişi, MTV, muayene, bakımda tarih veya km hatırlatması. Tahmini ve kesin tutar ayrımı, prim taksitleri; mevcut gerçek ödemeye bağlantı ve ödeme takvimi. Finansal hareket çoğaltılmaz; aynı ödeme başka araç kaydına yeniden bağlanamaz.

## Teknik geçiş

1.7.2 şema 7 → POS alanı şema 8 → kampanya/araç tabloları şema 9. Güncelleme yöneticiyi ve mevcut finansal kayıtları korur, yedekleme akışını kullanır. Demo yenilemesi yalnız yöneticinin açık seçimiyle kayıtları siler; yeni örnek araç/kampanyalar paketteki üretici kodundadır. Şifreler, canlı veritabanı ve config Git'e/pakete alınmaz.

Önceki sürümlerde tamamlanan Embla, ortak arama, sağ üst tarih, hesap uyarı sütunu, takvim görünümü ve kapsamlı finans demosu korunur. Kanban iptal kararı sürer.

# 1.10.0 — son toplu onay uygulandı

26 Ekim 2026. Kullanıcı araçlarda 2 numaralı Poliçeler özeti ve 3 numaralı İşlemler görünümünü onayladı; bütün onaylı notları kodlama, demoyu yenileme, paketleme ve GitHub yayını talimatı verdi. Aşağıdaki geçmiş not alma ifadeleri kararların alındığı aşamayı gösterir; artık bekleme şartı değildir. İçerik ikonlarını başlığa taşıma kararı iptal edilmiştir ve uygulanmamıştır.

Uygulananlar: hesap/kart paralel yatay listeler, listeden bilgi/düzenleme ikonlarının kaldırılması ve detayda korunması; 5 uyarı ve son 5 işlem önizlemeleri; merkezi filtrelenebilir Bildirimler; cari bakiyeyi artıran/azaltan son 5 net hareket; araçlarda ortak poliçe bölmesi ile MTV/bakım/muayene özeti ve açılır satırlı birleşik İşlemler. Şema 10 korunur. Demo 4 araç, 44 araç kaydı ve 623 başlangıç finansal hareketi içerir. Yönetici bilgileri korunur; demo yenileme isteğe bağlıdır.

## Karar geçmişi

# 1.9.1 sonrası — not ve görsel değerlendirme aşaması

## Hesaplar: başlık araçları ve ana içerik kutusu

26 Ekim 2026. Kullanıcı not aşamasında 3 numaralı yatay kart tasarımını onayladı; kodlama ve yayın aşamasına henüz geçilmedi.

- “Hesap listesi” ikinci başlığı kaldırılacak.
- İçerik ikonlarını yeni işlem düğmesinin yanına taşıma kararı kullanıcı tarafından geri alındı. Sıralama/indirme ve benzer araçlar ilgili içerik alanında kalacak.
- Hesap kartlarının bulunduğu alan tek bir ana içerik kutusu olacak; kartlar bu kutu içinde yeniden bölümlenecek. Kart stili değişebilir.
- Üç görsel alternatif `tasarimlar/hesaplar-stil-denemeleri-2026-10-26.md` içinde. Kullanıcı **3 — Yatay kartlar** seçeneğini onayladı. Seçilen referans `tasarimlar/hesaplar-stil-3-yatay-kartlar-2026-10-26.png` dosyasıdır.
- Bu aşamada yalnız tasarım görselleri/notlar GitHub'a yüklenir; uygulama kodu, sürüm ve hosting paketi değiştirilmez.

- Seçilen yerleşim: tek ana içerik kutusu içinde tam genişlikte yatay hesap kartları; kimlik, bakiye/KMH özeti, tür/vade ve kayda ait bilgi/düzenleme eylemleri hizalı bölümlerde gösterilir.
- Taslak yerleşim referansıdır. Nihai uygulama mevcut yerel Inter, 27/24 px sayfa başlığı, 16 px bölüm, 14 px ana metin, 12 px yardımcı metin, mevcut para değeri rolleri, 4–32 px boşluk ölçeği, 24/16 px panel dolgusu, 44 px ana eylemler ve 1,9:1 ana/sağ sütun kurallarını koruyacaktır. Görseldeki farklı font, oran, logo veya temsili veriler yeni kural sayılmaz.
- Üçüncü taslaktaki üst araç grubu artık yerleşim şartı değildir; içerik araçları içerik kapsamında kalır. Mobilde yatay kart alanları mevcut duyarlı kurallarla alt alta geçer; içerik kesilmez.
- Kullanıcı diğer eksikleri aktarmaya devam ediyor; bu seçim tek başına kodlama, paketleme veya yayın talimatı değildir.

## Hesap kartları ve okunaklı uyarılar — sekiz önerinin tamamı onaylandı

26 Ekim 2026. Kullanıcı sekiz inceleme önerisini de onayladı; özellikle uyarıların önem düzeyine göre farklı renklerle ve daha okunaklı sunulmasını istedi. Bu maddeler sonraki tasarımın kapsamıdır; not aşaması devam ediyor.

1. **Ortak kart ölçüsü:** Onaylı yatay kart düzeninde aynı düzeydeki hesap kartları tutarlı yükseklik ve hizalar kullanır. Uzun içerik kesilmez; dar ekran için duyarlı düzen korunur.
2. **Ortak bilgi hizası:** Banka/hesap kimliği, hesap sahibi, IBAN, bakiye veya KMH verileri, tür/vade ve bilgi/düzenleme eylemleri ortak bölümlere oturur. IBAN bulunmaması diğer alanların hizasını bozmaz.
3. **Dengeli iç boşluklar:** Kimlik ve bakiye arasındaki gereksiz büyük boşluklar kaldırılır; hesap türüne göre rastgele yoğunluk farkı oluşmaz. Mevcut boşluk ve tipografi tokenları kullanılır.
4. **Okunabilir içerik genişliği:** Eski dar üç sütun yerine seçilmiş 3 numaralı tam genişlikli yatay hesap kartları uygulanır. Kartın iç bölümleri okunabilirliğe göre esner; sağ uyarı alanı nedeniyle tutarlar/adlar sıkıştırılmaz.
5. **Kompakt ve gruplu uyarılar:** Uyarılar hesapların önüne geçmeyen sakin bir sağ sütunda sunulur. Öncelik grupları kullanılır; aynı hesap/tarih tekrarları gerektiğinde ortak özet altında toplanır. Kayıt sayısı, detaylara erişim ve her uyarının doğru hesap/hareket hedefi korunur. Seçili hesap veya arama diğer hesapların uyarılarını gizlemez.
6. **Önem düzeyine göre renk:** Kritik/acil durum, dikkat gerektiren durum ve bilgilendirme ayrı semantik roller kullanır. Tüm uyarılar aynı sarı görünümde sunulmaz. Ayrıntılı renk kuralı tasarım ilkelerine eklendi.
7. **Tutarlı tarih/tutar düzeni:** Kullanıcıya görünen uyarı tarihleri kartlarla aynı Türkçe biçimde yazılır (ör. 15 Eki 2026). Hesap adı, açıklama, tarih ve tutar ortak hizalara yerleşir; tutar ile TL birimi ayrılmaz.
8. **Tek başlık ve bağlamsal araçlar:** İkinci “Hesap listesi” başlığının kaldırılması korunur. İçerik ikonlarını başlığa toplama kısmı sonraki kullanıcı kararıyla iptal edildi; araçlar ilgili içerik alanında kalır.

### Uyarı renklerinin anlamı

- **Kritik / acil:** Mevcut kırmızı rolü `#B54343`; örneğin vadesi geçmiş ve hâlâ açık ödeme veya gerçekleşmiş limit aşımı. Daha belirgin ikon/başlık, hafif kırmızı zemin/kenarlık kullanılır.
- **Dikkat gerektiren:** Mevcut amber rolü `#955F12`; örneğin yaklaşan ödeme veya vade sonu. Hafif amber zemin/kenarlık kullanılır.
- **Bilgilendirme:** Mevcut teal rolü `#087F8C` ve nötr yüzey; örneğin günlük tahmini faiz bilgisi. Tek başına faiz tahmini kritik alarm gibi gösterilmez.
- Önem düzeyi renk yanında ikon ve açık durum metniyle anlaşılır. Açık zeminler üzerinde okunabilir metin kontrastı korunur. Uyarı şiddeti ile işlem tutarının mevcut yeşil/kırmızı finansal yönü farklı anlamlardır; renk düzenlemesi hesap işaretlerini değiştirmez.
- Öncelik, ilgili kaydın gerçek durumuna dayanır; aynı türdeki her kayıt otomatik olarak kritik sayılmaz. Yeni bildirim veya finansal eşik/hesaplama kuralı uydurulmaz.

## Merkezi bildirim sayfası ve bağlama göre sağ sütunlar

26 Ekim 2026. Kullanıcının yeni tasarım talepleri kaydedildi; not aşaması sürüyor. Bu karar, önceki “hesaplarda tümünü göster ile baloncuk açılması” fikrinin yerini alır: tümüne erişim merkezi sayfaya yönlendirir.

### Kullanıcının istediği kapsam

- Hesaplar sağ sütunundaki uyarı modülü en fazla **5 bildirim** gösterir. “Tümünü göster” merkezi bildirim sayfasını **Hesaplar kapsamı uygulanmış** olarak açar; ek baloncuk açmaz.
- Uyarı modülünün altında **Son işlemler** modülü bulunur; hesaplarla ilişkili son **5 işlem** gösterilir.
- Kredi kartları bölümündeki ilgili önizlemeler kredi kartı kapsamını kullanır; son işlemler modülü kartlarla ilişkili son **5 işlem** gösterir.
- Cari hesaplar bölümüne de ortak **1,9:1** düzenle sağ sütun eklenir. Burada **Bakiyeyi artıran son 5 hareket** ve **Bakiyeyi azaltan son 5 hareket** ayrı iki blokta gösterilir. Kullanıcı giriş/çıkış ile cari bakiyeyi artıran/azaltan hareketleri kastettiğini netleştirdi; nakit tahsilat/ödeme sınıflaması kullanılmaz.
- Üstteki bildirim zili kompakt pencerede **5–6 bildirim** gösterir; kalanları “Tümünü göster” bağlantısıyla aynı global sayfaya taşır.
- **Global bildirim sayfası** bütün bildirimleri sıralı gösterir; önem düzeyine göre filtrelenebilir. Menüden gelen bölüm filtresi görünür ve temizlenebilir olur. Hesap filtresi temizlendiğinde kredi kartı/cari ve diğer mevcut modüllerin bildirimleri de görünür.
- Her menü merkezi mekanizmanın kendisiyle ilgili kayıtlarını filtreleyerek gösterir; ayrı ve çelişen bildirim üretme kuralları oluşmaz. Bir bildirim farklı bağlamlarda gösterilebilir; aynı olay global listede yinelenmez.
- Bildirim hedefleri ilgili hesap/kart/cari ve varsa hareketin detayına gider. Hesap uyarılarının aktif hesap seçimi ve liste aramasından bağımsız olarak bütün hesapları kapsaması korunur.
- Kırmızı kritik, amber dikkat, teal/nötr bilgilendirme kuralları bütün yüzeylerde aynıdır; ikon ve açık durum etiketi renk anlamını destekler. Mevcut araç/kampanya gibi bildirim kaynakları merkezi yapıdan dışlanmaz.

### Asistanın görüş ve önerileri — ayrıca değerlendirilmek üzere

- Zil dahil bütün küçük önizlemelerde **5 kayıt** kullanmak daha tutarlı olur; kullanıcı zilde 5–6 aralığını belirtmiştir, kesin sayı ayrıca değerlendirilebilir.
- Global listede önem yanında bölüm (Hesaplar/Kredi kartları/Cariler/diğer mevcut kaynaklar), ilgili kayıt ve tarih aralığı filtreleri yararlı olur. Aktif kapsam çip olarak görünür; tek kapsamı kaldırma ve tüm filtreleri temizleme ayrı anlaşılır eylemler olur.
- Varsayılan sıralama kritik → dikkat → bilgi; aynı önem grubunda vade/aciliyet ve güncellik anlamlı şekilde kullanılır. “En yeni” alternatif sıralaması düşünülebilir.
- Son işlem blokları gerçekleşmiş finansal hareket kayıtlarından beslenmeli; tarih/saat ve kayıt kimliğiyle tutarlı sıralanmalı. Planlanmış veya iptal edilmiş işlemler son gerçekleşen işlem gibi sunulmamalı. Kart iadesi/ödemesi gibi mevcut işlem türleri kapsamına uygun yer almalı; yeni finansal kayıt oluşturulmamalı.
- İşlem geçmişi ile uyarı önizlemesi aynı veri anlamı değildir: mevcut işlem kayıtları son işlemler modülünü, dikkat gerektiren koşullar bildirim listesini besler. Her işlemin otomatik olarak ayrı bir uyarı üretmesi gerekmiyor; kullanıcı tüm işlemleri bildirim geçmişine de almak isterse bu ayrıca netleştirilmeli.
- Çözülmüş/ödenmiş koşullar aktif uyarı gibi gösterilmemeli. Beş kayıt sınırı gerçek toplamı gizlememeli; modül başlığında toplam sayı ve “Tümünü göster” erişimi korunmalı.

Kod, sürüm, veritabanı veya yayın değişikliği yapılmadı. Cari blokları mevcut doğrulanmış net cari bakiye etkisine dayanır; yeni finansal hesaplama veya yön kuralı kurulmaz.

### Cari hareket bloklarının netleşen anlamı

Kullanıcı, “giriş/çıkış” ile **cari bakiyeyi artıran ve azaltan hareketleri** kastettiğini belirtti.

- Blok başlıkları: **Bakiyeyi artıran son 5 hareket** / **Bakiyeyi azaltan son 5 hareket**.
- Sınıflandırma mevcut net cari bakiye etkisini (`party_effect`) kullanır: pozitif etki artıran, negatif etki azaltan bloktadır. Etkisi sıfır olan kayıt iki bloktan birine zorla atanmaz.
- Nakit etkisi, brüt işlem tutarı, işlem adı veya yalnız görsel etiket rengiyle yön tahmin edilmez. Kısmi ödeme gibi durumlarda mevcut cari hesap modeli korunur; işlem tutarı ile net bakiye etkisi karıştırılmaz.
- Her blok kendi kapsamındaki en son 5 hareketi gösterir. Kullanıcı not aşamasındadır; kodlama/yayın başlatılmaz.

## İçerik ikonlarını yeni işlem düğmesinin yanına taşıma kararı geri alındı

26 Ekim 2026. Kullanıcı önceki site geneli araç satırı kararını iptal etti; içerik kısmındaki ikonların daha anlamlı olduğunu belirtti.

- Sıralama/indirme ve benzer içerik ikonları ilgili içerik/listenin alanında kalır. Bunları başlıktaki yeni işlem düğmesinin yanına ayraçla toplama veya içerik araç satırlarını kaldırma zorunluluğu yoktur.
- Hesaplar ekranındaki rahatsızlık mevcut kart tasarımıyla ilgilidir; onaylı 3 numaralı yatay liste/kart düzenine geçişle giderilmesi hedeflenir. Bu stilin onayı devam eder.
- Tek ana içerik kutusu, ortak kart hizaları/ölçüleri ve gereksiz ikinci liste başlığının kaldırılması dahil diğer kararlar korunur. Yeni işlem düğmesi başlıkta, kayda ait bilgi/düzenleme ikonları kendi kartı/özetinde kalır.
- Üç görseldeki üst araç yerleşimi bu iptal kararını geçersiz kılamaz; görseller yalnız kart yerleşiminin referansıdır.
- Önceki taşıma kararı yalnız belgelerdeydi; uygulama kodu değiştirilmediğinden kod geri alımı yapılmaz. Not aşaması sürüyor, kodlama veya yayın yoktur.

## Hesaplar ve kredi kartları paralel tasarlanacak; liste ikonları kaldırılacak

26 Ekim 2026. Kullanıcı, Hesaplar için konuşulan sonraki tasarım kararlarının Kredi kartları bölümüne de paralel uygulanmasını istedi. Not alma aşaması devam ediyor.

- İki menü ortak liste → detay akışını, tek ana içerik kutusunu ve onaylı **3 numaralı tam genişlikte yatay kart/liste stilini** kullanacak. Hesaplar'a yapılan düzenleme kredi kartında da karşılığıyla ele alınacak; iki farklı görsel dil oluşmayacak.
- Gereksiz “Hesap listesi” ve “Kart listesi” ikinci başlıkları kaldırılacak. Ortak tipografi, boşluk, hizalar, içerik araçlarının içerikte kalması, 1,9:1 ana/sağ sütun ve duyarlı kırılımlar birlikte uygulanacak.
- Hesaplarda kararlaştırılan kısa uyarı/son işlem düzeni kredi kartlarında da kart kapsamıyla bulunacak: en fazla 5 uyarı, son 5 kart işlemi, merkezi bildirim sayfasına kart filtresiyle “Tümünü göster” erişimi ve ortak önem renkleri. Finansal etkiler ve ilgili işlem hedefleri korunacak.
- **Her iki menünün liste kartlarından bilgi (info) ve düzenleme ikonları kaldırılacak.** Liste satırı/kartı daha kompakt ve sade olacak; kayda tıklanarak detay içeriği açılacak. Bilgi/ayar/düzenleme işlevleri detay açıldıktan sonra erişilebilir olacak; özellikler silinmeyecek ve yetkiler korunacak.
- Bu karar, hesap/kart liste özetlerinde ikonları kendi kartında gösterme kuralının yerini alır. Detay sayfasındaki ilgili özet/ayar alanı düzenleme işlevlerini taşır; diğer varlık kartlarının kuralları ayrıca değiştirilmez.
- Kompaktlık bilgi kaybettirmeyecek. Listeye ait mevcut özet bilgiler yatay yerleşimde okunabilir şekilde korunacak; ayrıntılar detay ekranından erişilebilir kalacak. Kartın/hesabın tamamı klavyeyle de açılabilecek; ayrıca ikon arama gerekmeyecek.
- Kredi kartı kimliği (banka/program, kart adı, maskeli numara, kart sahibi), toplam/kullanılabilir limit, ekstre kalanı, dönem içi ve gelecek taksit kullanımı, limit barı ve mevcut kesim/son ödeme bilgileri kendi anlamlarıyla gösterilecek. Detayda mevcut/sonraki tahmini tarihler, son ekstre toplamı/ödenen/kalan, bağlı hesap ve Ekstre / Dönem içi / Gelecek dönem ayrımları erişilebilir kalacak. Bu alanlar birbirine eklenerek borç çoğaltılmayacak.
- Banka/kasa/KMH tarafında bakiye, KMH limiti/kullanımı/kullanılabilir tutarı ve türe uygun vade/faiz bilgileri korunacak. Banka/kasaya kredi kartı ekstre alanları, kredi kartına banka bakiyesi anlamı taşınmayacak.
- Ortak iskelet içinde kart türüne göre ek bilgi satırları kullanılabilir; bütün alanları zorla aynı yüksekliğe sığdırmak için metin küçültülmez veya kesilmez. Aynı menüde hizalar ve tutarlı boşluklar korunur.

Uygulama kodu, sürüm veya paket değiştirilmedi. Bu kararlar sonraki toplu uygulama kapsamına eklendi.

## Araçlarım: Özet ve İşlemler sekmeleri

26 Ekim 2026. Kullanıcı araç kartından açılan sayfanın iki sekmeli olmasını istedi; önceki asistanın yalnız birleşik liste önerisi yerine bu akış esas alınır.

- Araç kartına tıklanınca varsayılan **Özet** sekmesi açılacak. Poliçe/MTV/bakım ve mevcut diğer türler grid bölmelerde kendi özet bilgileriyle gösterilecek.
- İkinci sekme **İşlemler** olacak. Farklı türde bütün girilen kayıtlar tek tarih sıralı listede yer alacak; trafik sigortası ve bakım satırları alt alta bulunabilecek.
- Satıra tıklanınca kaydın türüne uygun detay alanları satır içinde açılacak. Geçerlilik, kilometre, dönem/vade, tutar/ödeme ve ilgili eylemler bağlamına göre gösterilecek. Kategori başına ek navigasyon sekmeleri kaldırılacak.
- Mevcut Inter/ölçü/boşluk/tek özet yüzeyi/1,9:1 sütun dili korunacak. Araç kaydı, tahmini bedel ve gerçek finansal ödeme ayrı anlamlarını koruyacak; mevcut ödeme bağlantıları ikinci finansal hareket üretmeyecek.
- Kullanıcı otomobil toplulukları ve Product Design yaklaşımıyla alternatifleri değerlendirmek istedi. Üç görsel (iki Özet düzeni ve bir İşlemler açılır-satır görünümü), kaynaklar ve asistan önerileri `tasarimlar/araclar-ozet-islemler-onerileri-2026-10-26.md` içinde. Henüz görsel seçim yapılmadı.
- Asistanın önerisi: tek çerçeveli ilk Özet + üçüncü görseldeki işlem günlüğü. Poliçelerin birlikte özetlenmesi ve özet bağlantısının İşlemler'e tür filtresiyle geçmesi ayrıca değerlendirilecek; kullanıcı onayı sayılmaz.
- Kamuya açık PistonHeads/Drivvo/Fuelly kaynakları okundu; sosyal forum, yakıt veya otomatik bakım/arıza tahmini özellikleri kapsamımıza kendiliğinden eklenmedi.

Not aşaması devam ediyor. Uygulama kodu, sürüm, veritabanı veya paket değiştirilmedi.

# 1.11.0 — 27 Ekim onayları uygulandı

Kullanıcının son toplu uygulama/yayın talimatıyla [1.11.0 kapsamındaki](SURUM-1.11.0.md) bütün maddeler uygulandı. Bu kararlar önceki çift cari hareket modülü, detayda Son 5 işlem tekrarı ve iki sütun araç özeti kararlarının yerini alır. Mobil görsel onayının son düzeltmesi: etiket/ekleyen/bakiye satırı yalnız seçili işlemde açılır. Uygulama şeması 11; yeni hosting ZIP’i doğrudan web köküne açılır.

# 1.11.0 sonrası — yeni inceleme notları

## Genel bakış: kaldırılamayan tarih filtresi görünümü

27 Ekim 2026. Kullanıcının ekran görüntüsü üzerine kod incelendi; uygulama kodu değiştirilmedi.

- Bulgu: `App.jsx` başlangıçta `overviewRange` değerini Bu Ay olarak atıyor. Aynı aralık hem nakit akışı grafiği/son hareketler dönemini hem üst arama filtre alanını besliyor. `ListTools.jsx` boş olmayan her tarih aralığını etkin filtre sayıyor; başlangıç dönemini kullanıcı filtresinden ayırmıyor.
- Çipin X düğmesi boş aralık gönderiyor, ana sayfa bunu tekrar Bu Ay'a çeviriyor. Üstteki Temizle arama/hesap/işlemi sıfırlayıp aralığı yine Bu Ay'a döndürüyor. Bu yüzden zaten varsayılan aydayken çip ve 1 sayacı kaybolmuyor; temizleme çalışmıyor izlenimi oluşuyor.
- Öneri: Bu Ay varsayılan görüntüleme dönemi kabul edilsin, etkin filtre sayacı/çipi oluşturmasın. Dönem nakit akışı başlığındaki tarih seçicide görünmeye devam etsin. Varsayılandan farklı aralık seçildiğinde kaldırılabilir tarih çipi/sayacı gösterilsin.
- X veya genel Temizle varsayılan döneme dönsün ve tarih çipi/sayacı kalksın. Grafik ile son hareketler aynı dönemden beslenmeye devam etsin. Temizle arama, hesap ve işlem türü filtrelerini de sıfırlasın. Bu yalnız CSS ile çip gizleme şeklinde çözülmesin; filtre durumunun varsayılan değer algısı düzeltilsin.
- Kabul kontrolü: ilk açılışta tarih filtresi sayacı yok; özel aralık çip oluşturur; X/Temizle ile Bu Ay'a dönüş ve çipin kalkması; grafik/son hareket tutarlılığı; diğer sayfaların isteğe bağlı tarih filtrelerinin bozulmaması.

Bu bir bulgu ve düzeltme önerisidir; yeni toplu kodlama/yayın aşaması henüz başlatılmadı.

## Genel bakış: nakit akışı panelindeki alt boşluk

27 Ekim 2026. Kod incelemesinde `.dashboard-grid` eş satırdaki panelleri uzatırken `.chart` masaüstünde 177 px sabit yükseklikte kalıyor (mobilde 200 px). `ResponsiveContainer` bu sabit alanı dolduruyor; panelin artan yüksekliğini kullanmıyor. Grafik altındaki panel-foot da grafikle birlikte yukarıda kalıyor.

- Öneri: nakit akışı panelinde grafik, başlık/toplamlar ile en altta duran panel alt bilgisi arasındaki kullanılabilir alana esnesin. Görsel/SVG'yi ölçekleyerek yazıları büyütmek yerine Recharts yeniden ölçülerek çizsin. Yazı boyutu, bar genişliği ve renkler sabit tasarım rollerini korusun.
- Masaüstünde okunabilir alt/üst grafik yüksekliği sınırları olsun (uygulamada içerikle değerlendirilecek yaklaşık 240–360 px). Yan uyarı alanı çok uzarsa grafik sınırsız uzamasın; panel yüksekliği/hizalama ayrıca kontrollü ele alınsın. Mobilde yan sütun yüksekliğinden bağımsız kompakt grafik kullanılsın.
- Veri, tarih kapsamı, sıfır tabanı ve tutarlı Y ekseni korunur; yüksekliğin değişmesi değerleri değiştirmez. Boş veri, tek yüksek işlem, farklı tarih aralıkları, tooltip ve mobil etiketler kontrol edilir.

Bu bulgu/öneri kaydedildi; uygulama kodu değiştirilmedi.

## Cari hesaplar ana listesi: bakiye özeti tam genişlikte

27 Ekim 2026. Kullanıcı, mevcut ortak sayfa tasarım kuralına uyulmasını istedi: Toplam alacak / Toplam borç / Net cari bakiye özeti yalnız sol ana sütunda kalmayacak; ana içerik ve sağ sütunun toplam genişliğini kapsayacak.

- Sayfa sırası: başlık ve ekle → tam genişlikte tek bölümlenmiş bakiye özeti → iki sütunlu içerik.
- Cari listesi solda, Son 5 işlem sağda, özetin altında aynı üst hizadan başlayacak. Ortak 1,9:1 sütun oranı ve boşluk/çizgi/tipografi kuralları korunacak.
- Uygulamada özet `party-main` içinde kalmamalı; iki sütunlu `party-workspace` önüne taşınmalı veya iki sütunu kapsayan ortak satıra alınmalı. Mobilde mevcut kompakt özet ve içerik sırası korunacak.
- Kullanıcı tarafından istenen/onaylı yerleşim düzeltmesidir. Şimdilik yalnız notlara eklendi; uygulama kodu ve yayın değiştirilmedi.

### Toplu onay — inceleme geri dönüşleri

27 Ekim 2026. Kullanıcı, yukarıdaki üç incelemede verilen geri dönüş ve düzeltme önerilerinin tamamını onayladığını açıkça belirtti. Bu nedenle varsayılan Bu Ay döneminin etkin filtre sayılmaması ve X/Temizle davranışının düzeltilmesi; nakit akışı grafiğinin paneldeki boşluğa sınırlandırılmış ve duyarlı biçimde yayılması, alt bilginin panelin altında kalması; cari bakiye özetinin iki sütunu kapsaması birlikte **onaylı sonraki sürüm kapsamıdır**. Önceki maddelerdeki bulgu/öneri ifadeleri artık onay beklediği anlamına gelmez. Not alma aşaması devam eder; bu onay tek başına toplu kodlama/paketleme/yayın talimatı değildir.

## Ana sayfa: kategorili genel arama ve sonuçlara gezinme

27 Ekim 2026. Kullanıcı ana sayfa arama çubuğunun yalnız gösterilen veriyi daraltmasını değil, uygulama genelindeki kayıtlara ulaşan bir arama olmasını istedi. Örnek sorgu: emre.

### Kullanıcının istediği kapsam

- Arama alanına bağlı, filtre penceresine benzer bir öneri penceresi açılacak; kategorilere ayrılmış eşleşmeler gösterilecek. Arka plan bulanmayacak, sayfa aşağı itilmemeli; mevcut ortak açılır pencere dili korunmalı.
- Cari Hesaplar: kısa ad ve ticari unvanda sorguyu içeren cari kayıtları.
- İşlemler: açıklamasında sorguyu içeren hareketler; tarih, tür ve ayırt edici bağlam gösterilir.
- Hesaplar / Kredi kartları: hesap/kart sahibinde sorguyu içeren kayıtlar. Kayıt adıyla arama da mevcut kabiliyet kaybolmadan korunmalı.
- Araçlarım: ruhsat sahibinde sorguyu içeren araçlar; plaka/ad ile mevcut arama kabiliyeti korunmalı.
- Bir öneriye tıklamak ilgili menüde ilgili kaydın detayını açacak; işlem önerisi ilgili kaydı görünür/seçili hale getirecek. Daha fazla sonuç için arama sayfasında detaylı inceleme desteklenecek.
- Bu genel arama ana sayfadaki grafiğin tarih/hesap filtresiyle sınırlanmamalı. Kişi sahibinin eşleşmesi ile işlemi ekleyen kullanıcının eşleşmesi aynı anlam sayılmamalı. Diğer sayfalardaki bağlamsal arama korunmalı.

### Önerilen davranış ayrıntıları

- Önceki 3 karakter kuralı korunarak kısa bir beklemeden sonra sayfa yenilenmeden öneriler gelsin. Türkçe büyük/küçük harf eşleştirmesi kullanılsın; eski sorgunun geç gelen cevabı yeni sonucu değiştirmesin.
- Her kategoride en fazla 3–5 önizleme, toplam sonuç sayısı ve kategoriye ait tümünü gör; ortak Tüm sonuçları gör erişimi bulunsun. Enter/büyüteç seçili öneri yoksa arama sonuçları sayfasını açsın; ok tuşlarıyla öneri seçilince Enter ilgili kaydı açsın. Esc/dışarı tıklama pencereyi kapatsın.
- Filtre ve öneri pencereleri aynı anda üst üste açılmasın. Arama temizlenince öneriler kapansın; sıfır eşleşme, yüklenme ve hata durumları açık olsun.
- Sonuç sayfasında sorgu, kategori ve uygun detay filtreleri korunur; ana sayfanın dönem filtresi kendiliğinden taşınmaz. Arşiv/iptal edilmiş kayıtların kapsamı görünür olmalı, aktif kayıtlarla karıştırılmamalı. Yetki sınırları korunmalı.
- Kayıt açılınca eşleşmeyi gizleyecek eski menü filtreleri temizlenmeli/uyarlanmalı; geri dönüş sonuç sorgusu ve konumunu korumalı. Mobilde pencere ekrana sığmalı ve klavyeyle erişilebilir olmalı.

Kullanıcının genel arama talebi kaydedildi. Davranış ayrıntıları öneridir; şimdilik uygulama kodu, sürüm ve yayın değiştirilmedi.

### Genel arama — kullanıcı onayı

27 Ekim 2026. Kullanıcı genel arama önerisini ve son yanıttaki davranışları onayladı: 3 karakter sonrası sayfa yenilenmeden kategorili öneriler; alana bağlı, blur ve sayfa kayması olmayan pencere; kategori başına kısa sonuç listesi ve Tümünü gör; öneriden kayıt/hareket detayına geçiş; seçili öneri yokken Enter/büyüteç ile filtrelenebilir Arama sonuçları sayfası. Ana sayfa tarih/hesap kapsamından bağımsız arama ve diğer menülerde bağlamsal aramanın korunması onaylıdır. Yer tutucu: Cari, işlem, hesap, kart veya araç ara. Sahip bilgisi ile ekleyen kullanıcı ayrı anlamlarda ele alınır. Bu bölüm artık öneri/onay bekleme durumunda değildir; not alma aşamasındaki onaylı sonraki sürüm kapsamıdır. Toplu kodlama/paketleme/yayın talimatı henüz verilmedi.

## Aktif satır: cari/hesap hareketlerinde kesilen sol vurgu çizgisi

27 Ekim 2026. Kullanıcının üç ekranı karşılaştırıldı: Araçlarım'da sol teal çizgi açık kaydın ana bilgi, ayrıntı ve eylem alanını kesintisiz kapsıyor. Cari ve hesap hareketlerinde ana bilgi satırında çizgi yok, yalnız alt eylem satırında kısa çizgi var. Bu, mevcut kesintisiz tek aktif yüzey kuralına aykırı bir regresyondur.

- Koddan doğrulanan neden: Ledger ana satırının ilk hücresi mobil görünüm için eklenmiş `.mobile-ledger-cell`; masaüstünde `display:none`. Eski `.expanded td:first-child` seçicisi görünmeyen bu hücreyi işaretliyor. Alt eylem satırının kendi çizgisi görünür kaldığından vurgu yalnız orada çıkıyor. Araç listesi farklı bir kapsayıcıyı vurguladığı için aynı hatayı taşımıyor.
- Düzeltme: görsel seçili alanın en üstünden en altına uzanan aynı hizada tek sol çizgi; ana satır/ayrıntı/eylemler aynı arka plan; aralarında ayraç yok. DOM'daki ilk hücre sırasına bağımlı olmayan görünür satır/hücre yaklaşımı kullanılmalı.
- Ortak Ledger kullanan cari, banka/kasa, kredi kartı ve diğer hareket listeleri birlikte kontrol edilmeli. Masaüstünde ana satır çizgisinin ve alt eylem çizgisinin birleşimi, mobilde bilgi/eylem alanının kesintisizliği gerçek görünür hücre geometrisiyle doğrulanmalı; yalnız gizli hücrenin CSS değerini kontrol etmek yeterli değil.
- Önceden onaylı tasarım ilkesinin uygulanma hatası olarak düzeltme kapsamına eklendi. Şimdilik uygulama kodu/yayın değiştirilmedi.

## Menü gezinmesi, seçili kayıt belleği ve yenileme davranışı

27 Ekim 2026. Kullanıcı, cari/araç detayına girip başka menüye geçtikten sonra sol menüden geri dönünce ana liste yerine eski detayın açıldığını; kredi kartı Kampanyalar alt menüsünün başka ana menüye geçince açık kaldığını; F5 ile Genel bakış'a dönüldüğünü bildirdi.

### Koddan doğrulanan nedenler

- Bu bulgular HTTP/tarayıcı cache'i değildir. `SearchStateProvider` içindeki oturumluk Map ile `useScopedState` cari/araç selected kimliklerini sayfa bileşeni yeniden açılsa da saklıyor; gezinme hedefi ile liste tercihleri aynı belleğe karışıyor. Hesap/kart akışı da aynı ilkeye göre taranmalı.
- `navigateMenu` cardsMenu değerini yalnız Kredi kartları tıklamasında değiştiriyor; başka ana menüye geçişte kapatmıyor.
- `page` başlangıcı sabit Genel bakış. Mevcut rotayı URL'den okuma ve geçmiş yönetimi bulunmadığı için tam yenilemede ana sayfa açılıyor. Finansal API zaten Cache-Control: no-store, private kullanıyor; cache temizleme sorunu çözmez.

### Önerilen ortak davranış

- Sol menüde ana bölüm tıklaması her zaman o bölümün ana listesine gider; önceki detay/seçili satır/sekme kendiliğinden açılmaz. Ana menüden taze girişte varsayılan liste kapsamı; kayıt içinden Listeye dön veya tarayıcı Geri kullanıldığında önceki liste araması/sıralaması/konumu geri gelebilir. Bu iki giriş niyeti ayrı ele alınmalı.
- Detay seçimi rota parçası olmalı. Ana bölüm, kayıt kimliği ve gereken sekme URL ile temsil edilmeli; yenileme mevcut sayfada kalmalı, Geri/İleri gezinmesi anlamlı çalışmalı. Paylaşılan PHP hosting için rewrite gerektirmeyen hash rota uygun seçenek. Açılışta kayıt erişimi kontrol edilmeli; artık bulunmayan/izin verilmeyen kayıt anlaşılır durum ve listeye dönüş sunmalı.
- Alt menüler yalnız ilgili ana bölüm ailesi aktifken açık kalır: Kredi kartları/Kampanyalar içinde görünür; Hesaplar, Cariler veya Araçlarım'a geçince kapanır. Bildirim/genel arama ile alt menüye doğrudan gidildiğinde doğru üst grup açılır. Masaüstü/mobil aynı davranışı paylaşmalı.
- Rota/gezinme durumu, geçici arayüz tercihleri ve sunucu verisi ayrı sorumluluklardır. Bakiye/işlem verisi localStorage ile dondurulmaz; giriş/yenileme ve başarılı kayıt sonrası API'den doğrulanır. Oturum belleği çıkış/kullanıcı değişiminde temizlenir; kaydedilmemiş form kendiliğinden yeniden açılmaz.
- Kabul senaryoları: cari detay → araç detay → sol menü Cari hesaplar ile ana liste; araçlar/kartlar/hesaplar için aynı; farklı ana menüde alt menünün kapanması; F5 ile mevcut detayın korunması; Geri/İleri ve doğrudan arama/bildirim hedefleri; yetkisiz/kaldırılmış kayıt; masaüstü/mobil.

Bulgu ve yaklaşım notlara eklendi. Kullanıcı henüz bu yeni öneri için ayrı uygulama talimatı vermedi; kod/yayın değiştirilmedi.

### Gezinme yaklaşımı — kullanıcı onayı

27 Ekim 2026. Kullanıcı önerilen gezinme davranışlarını onayladı: ana menü her zaman bölüm ana listesine gider; detaydan Listeye dön önceki liste tercih/konumunu korur; başka ana bölüme geçince önceki alt menü kapanır; URL tabanlı sayfa/kayıt rotası sayesinde yenileme mevcut sayfayı korur ve Geri/İleri anlamlı çalışır. Rota, geçici arayüz belleği ve sunucudan doğrulanan finansal veriler ayrı tutulur; paylaşılan hosting için hash rota yaklaşımı uygundur. Önceki bölümdeki yaklaşım artık onay bekleyen öneri değildir. Not alma aşaması sürüyor; toplu uygulama/yayın henüz başlatılmadı.

## Mobil kredi kartı detayı: özetin yüksekliği ve bilgi önceliği

27 Ekim 2026. Kullanıcı banka uygulamasının mobil kart detayını ve mevcut Axess detayımızı yan yana referans olarak paylaştı. Henüz ayrı bir yeni tasarım onayı verilmedi; aşağıdakiler inceleme ve öneri notudur, uygulama kodu değiştirilmedi.

- Mevcut özet her metriği ayrı tam genişlikli bloğa yerleştiriyor; bilgi/düzenleme düğmeleri üstte ayrı yükseklik tüketiyor. İlk ekranda özet dahi bitmiyor, hareket sekmeleri ve işlemler aşağıda kalıyor.
- Öneri: mevcut yazı tipi/teal/boşluk sistemini koruyarak bir ana tutar ve açık etiketi; ardından etiketli limit göstergesi; ekstre kalan borcu ve dönem içi tutarını mobilde iki sütunda kompakt gösterme. Ana tutarın kullanılabilir limit mi dönem içi harcama mı olacağı kullanıcıyla netleştirilecek; referansa bakılarak finansal anlam değiştirilmeyecek.
- Son ödeme tarihi ve gecikme durumu açık ve öncelikli kalmalı; gecikme nötr alt metin yerine erişilebilir renk/ikon/metin ile belirtilmeli. Mevcut ekstre ödeme eylemine kısa erişim düşünülebilir; otomatik ödeme/ikinci finansal kayıt üretilmez.
- Bağlı hesap, kart sahibi, önceki/sonraki hesap kesim ve ödeme ayrıntıları aynı özet içinde Daha fazla ile açılabilir. Bilgiler silinmez; bilgi/düzenleme eylemleri detay özetinin içinde kompakt gruplanır.
- Hedef hareket sekmelerine ve ilk işleme daha erken ulaşmak; 320–390px genişlikte uzun ad/tutar ve yazı büyütme ile taşma olmaması. Sabit yükseklik veya okunamayacak küçük yazıyla sıkıştırma yapılmaz.
- Referanstaki kırmızı tema, internet limiti ve Chip-Para değerleri kendiliğinden aktarılmayacak. Uygulamada kaynağı bulunmayan puan/limit bilgisi varsayılmayacak; puanlar TL bakiyesi sayılmayacak.

### Mobil kredi kartı özeti — kullanıcı onayı

28 Ekim 2026. Kullanıcı son önerilen düzeni onayladı. Ana tutar **Kullanılabilir limit** olarak korunur; toplam limit ve kullanım göstergesi hemen altında yer alır. Ekstreden kalan ve dönem içi harcama mobilde iki sütunlu kompakt özette gösterilir; gelecek taksitler ilgili tutarın altında açıklama olarak kalır. Son ödeme tarihi, kalan ekstre borcu, gecikme uyarısı ve mevcut ödeme işlemine erişim belirgin bir ödeme satırında toplanır. Bağlı hesap, kart sahibi ve önceki/sonraki hesap kesim tarihleri aynı kutudaki Daha fazla alanında açılır. Bilgi/düzenleme ikonları kutunun içinde kalır fakat kendilerine ayrı boş satır ayrılmaz. Hareket sekmeleri ve işlem listesine daha erken erişim hedeflenir; mevcut renk, tipografi, oran ve finansal anlamlar korunur. Önceki bölümdeki ana tutar kararsızlığı ve onay bekleme durumu bu onayla kapanmıştır. Not alma aşaması devam eder; toplu kodlama/paketleme/yayın henüz başlatılmadı.

## Kredi kartı ekleme formu — sadeleştirme önerisi

28 Ekim 2026. Kullanıcı uzun Kredi kartı ekle penceresini karmaşık buldu ve alternatif istedi. Değerlendirme paylaşılan ekran görüntüsüne dayanır; görünmeyen alt alanlar ve form etkileşimleri bu incelemede test edilmedi. Aşağıdakiler öneridir, henüz onaylı uygulama kapsamı değildir.

- Sorun: temel kimlik, isteğe bağlı metadata ve başlangıç borcu alanları aynı ağırlıkta kesintisiz sıralanıyor; ilk kayıt için gerekli bilgi ile sonradan doldurulabilecek bilgi ayrışmıyor. Kaydet/Vazgeç sabit alt eylemlerinin korunması uygundur.
- Öneri: tek formda açık Temel bilgiler bölümü, kapalı Kart ayrıntıları ve Mevcut borçla başlat bölümleri. Çok adımlı sihirbaz yerine kısa ilk kayıt ve gerektiğinde genişletme tercih edilir.
- Temel bilgiler: banka, bankaya göre daraltılmış program, kart adı, toplam limit ve takibi çalıştıran hesap kesim/son ödeme bilgileri. Program kendiliğinden yanlış seçilmez; banka değişiminde uyumsuz seçim açıkça ele alınır. Banka/programdan düzenlenebilir kart adı önerilebilir, kullanıcının özel adı ezilmez.
- Kart ayrıntıları: ödeme ağı, kart sahibi, son dört hane, bağlı hesap. Bağlı hesap açıklaması ilgili alana yakın kısa bilgi olarak kalır; bağlantı otomatik ödeme değildir. Tam kart numarası/CVV istenmez.
- Mevcut borçla başlat isteğe bağlı açılır; yeni/borçsuz kart için başlangıç değerleri sıfırdır. Başlangıç toplam borcu ve başlangıç ekstre borcu mevcut finansal anlamlarıyla korunur; ekstre borcunun toplam borcun içindeki pay olduğu açıkça anlatılır, iki bağımsız toplanacak tutar izlenimi verilmez. Mevcut hesap modeli doğrulanmadan hesaplama değiştirilmez.
- Masaüstünde ilişkili kısa alanlar ikili, mobilde okunabilir tek sütun; büyük sayısal girişlerin ölçüsü ortak form diliyle tutarlı olur. Bölümler klavyeyle açılabilir, zorunlu etiketleri korunur; kapalı bölümde hata varsa bölüm açılıp ilgili alana odaklanılır. Eklemede sıfır varsayımı düzenlemede kayıtlı borcu sıfırlamaz.
- Uygulama kodu, sürüm ve yayın değiştirilmedi; kullanıcıya sadeleştirme önerisi sunulacak.

## Ortak veri giriş sistemi — detaylı inceleme talebi

28 Ekim 2026. Kullanıcı kart, cari ve işlem ekleme pencerelerinin birbirinden bağımsız görünmesini ele alıp önce vaka çalışması ve öneri istedi. İnceleme [Veri giriş sistemi vaka çalışması](VERI-GIRISI-VAKA-CALISMASI-2026-10-28.md) belgesinde: izole demo üzerinde 12 masaüstü/mobil ekran durumu ve Esc ile taslak kaybı gözlemi; kaynak kod karşılaştırması; ortak form sözleşmesi; cari/kart/işlem için bölüm sırası; kısmi ödeme ve etki özeti; hata/taslak/mobil kuralları; tek form-sihirbaz-tam sayfa alternatifleri ve kabul ölçütleri. Kanıtlar `.qa/forms-case-2026-10-28/` altında yereldir.

Önerilen yön bölümlü tek form ve gerektiğinde açılan ayrıntılardır. Yeni öneriler (değişmiş taslağı kapatmadan uyarı, ödeme etki özeti, tam/kısmi ödeme seçimi, ortak hata gösterimi vb.) henüz kullanıcı tarafından onaylanmadı. Önceden onaylı mobil kart özeti veya diğer sürüm kapsamları bu incelemeyle iptal edilmedi. Uygulama kodu/şema/sürüm değiştirilmedi, paket/yayın yapılmadı.

## 1.12.0 — toplu uygulama ve yayın onayı

28 Ekim 2026. Kullanıcı bölümlü tek form yaklaşımını ve bekleyen diğer onaylı değişiklikleri tasarım ilkeleriyle birlikte uygulayıp yeni sürümü GitHub'da yayımlamamızı istedi. 1.11.0 sonrası dönem/filtre temizleme, nakit akışı grafik yüksekliği, tam genişlik cari özeti, kategorili genel arama, aktif satır çizgisi, URL tabanlı gezinme/yenileme ve alt menü davranışları, kompakt mobil kart özeti ile ortak veri giriş formu sözleşmesi birlikte 1.12.0 kapsamındadır. Önceki bölümlerdeki not alma/onay bekleme ifadeleri bu kapsam için tarihsel kayıttır.

Ortak formda bölümler, Türkçe hata gösterimi, değişmiş taslağı kapatmadan uyarı, tam/kısmi ödeme ve kısa etki açıklaması uygulanır. Yeni kartta henüz ekstre oluşmadı desteği ayrı veri modeli kararıdır; mevcut zorunlu tarih kuralları korunur. Sürekli taslak saklama, Kaydet ve yeni ekle veya banka bağlantısı bu sürüme eklenmez. Şema 11 ve mevcut finansal hesaplama modeli korunur; üretim verisi/demosu sıfırlanmaz.

# 1.13.0 — Ayarlar, yedekleme ve gerçek veriye geçiş

30 Ekim 2026. Kullanıcı demo verilerini silip sıfır iş kaydıyla gerçek veri işlemeye geçmek ve Görünüm ve bilgiler üstünde Ayarlar menüsünde yedek al/geri yükle/otomatik yedek özelliklerini eklemek istedi. Bu istek uygulama kapsamıdır; yalnız not alma değildir.

Ayarlar yalnız yöneticilerde görünür. Yedekler özel sunucu dizininde, yüklenen dosyalar bütünlük/şema kontrolüyle alınır. Geri yükleme ve temizleme güvenlik yedeğinden sonra yapılır, güncel yönetici parolası korunur; diğer oturumlar geçersiz kılınır. Gerçek veri modunda demo temizleme engellenir. Günlük/haftalık ve 14 otomatik yedek; yönetici uygulamasında kontrol ve yalnız CLI cron desteği. Mevcut hosting bağlantısı olmadığından canlı veri bu çalışma ortamından silinmez; kullanıcı güncelleme sonrası Ayarlar'dan temizler. Şema 11 kalır, yedekleme kılavuzu docs/YEDEKLEME.md.

## 30 Ekim 2026 — Ortak banka seçimi ve tam sayfa kayıt oluşturma (onaylı sonraki kapsam)

Kullanıcı gerçek saha denemelerinde kart eklerken banka listesinin eksik kaldığını bildirdi ve geniş hazır liste + seçim içinden hızlı banka ekleme önerisini onayladı. Banka seçimi aranabilir olacak; listede bulunmayan banka, formdan ayrılmadan adıyla eklenebilecek. Bankalar hesap ve kredi kartı oluşturma akışlarının ortak kaynağı olacak. Aynı banka adının büyük/küçük harf farkıyla yinelenmesi önlenecek. Banka ile kart programı ayrı kavramlardır; bankaya uygun programlar önerilir, program isteğe bağlı kalır. Logosu olmayan bankada standart banka ikonu kullanılır. Ayarlar'da banka/program yönetimi ileride ayrıca ele alınabilir; bu yönetim sayfası için bu aşamada uygulama kararı alınmadı.

Kullanıcı tam sayfa **Kredi kartı ekle** görsel denemesini beğendi; aynı yaklaşımı **kredi kartı ekleme, hesap ekleme, cari ekleme ve araç ekleme** akışlarının tümü için onayladı. Görsel referans bu konuşmada 30 Ekim'de gösterilen tek tam sayfa kart ekleme tasarımıdır. Sonraki ayrıntılar geliştirilebilir; genel yön onaylıdır.

- Oluşturma akışı modal yerine ayrı sayfa olur; mevcut sidebar, üst bar ve sayfa çerçevesi korunur. Başlık hangi kaydın eklendiğini açıkça belirtir.
- Geri gezinme başlıkta; Vazgeç ve kaydetme eylemleri aynı başlık satırında gruplanır. Form bağımsız kaydedilen iki forma bölünmez, tek kayıt/tek kaydetme davranışı korunur.
- Ana sütunda gerekli temel bilgiler ve kayıt türüne göre ilgili bölümler yer alır. Sağ sütunda isteğe bağlı ayrıntılar, uygun olduğunda kompakt önizleme ve kısa açıklamalar bulunur. Alanların yeri kayıt türüne göre anlamlı biçimde belirlenir; kart alanları diğer türlere aynen kopyalanmaz.
- Kaynak görsel bir taslak yönüdür; nihai uygulamada mevcut Sade Netlik tipografi, renk, kontrol ölçüleri ve **1,9:1** ana/sağ sütun oranı esas alınır. Yeni kayıt sayfasına gereksiz metrikler, uyarı listeleri veya tekrarlanan marka bilgisi eklenmez.
- Dar ekranlarda ana ve isteğe bağlı alanlar okunabilir tek akışta toplanır; kaydetme ve hata alanlarına erişim korunur, yatay taşma oluşmaz. Mevcut bilgi alanları, finansal anlamlar, zorunlu doğrulamalar ve değişmiş taslağı terk etme uyarısı korunur.
- Kartta banka/ad/limit ve ekstre takvimi ana alandadır; program, kart sahibi, son dört hane, bağlı hesap, ödeme ağı ve mevcut borçla başlatma sağ alanda düzenlenebilir. Program önerilir ama zorunlu değildir; bağlı hesap otomatik ödeme değildir. Ekstre borcu başlangıç toplam borcunun içindedir, üzerine eklenmez.
- Bu karar yeni kayıt oluşturma akışlarını kapsar; mevcut kayıt düzenleme ve finansal işlem ekleme pencerelerinin dönüşümü ayrıca kararlaştırılacaktır.

Not ve görsel onay aşamasıdır. Bu kayıtta uygulama kodu, veritabanı, sürüm veya yayın değiştirilmedi; dört akışın kodlanması henüz başlatılmadı.

## 30 Ekim 2026 — Düzenleme ve işlem ekleme için alttan açılan kompakt alan (onaylı)

Kullanıcı, referans olarak alt kenarında yatay işlem giriş alanı bulunan bir hesap hareketleri ekranını paylaştı. Düzenleme ve finansal işlem ekleme akışlarının da merkez modal yerine sayfanın altından açılan kompakt bir alan kullanmasını istedi. Önceki bölümde bu akışların ayrıca kararlaştırılacağı notu bu kararla tamamlanmıştır.

- İşlem ekle veya ilgili düzenleme eylemine basılınca alt kenardan giriş/düzenleme alanı açılır; kullanıcı bulunduğu kaydın ve hareket listesinin bağlamını korur. Referans başka bir ürünün renklerini, tipografisini veya kalabalık liste düzenini aktarmak için kullanılmaz.
- Masaüstünde yatay alan değerlendirilir: işlem türüne göre tutar, açıklama ve gerekli cari/hesap/kart seçimi gibi temel bilgiler ilk görünümde olur. Seçili kayıt bağlamı mümkün olduğunda önceden doldurulur; kullanıcıdan gereksiz yeniden seçim istenmez.
- Tarih, vade, etiket, belge ve diğer alanların hangilerinin temel veya isteğe bağlı olduğu işlem türüne göre belirlenir. Zorunlu bir alan seçenekler içinde gizlenmez. Genişleyen **Diğer seçenekler** alanı ikincil bilgileri sunar; mevcut veri alanları kaldırılmaz veya mali anlamları değiştirilmez.
- Düzenleme aynı yüzeyde mevcut değerleri gösterir. İlgili zorunlu gerekçe, yetki, doğrulama ve değişmiş taslağı terk etme kuralları korunur. Kaydetme ve iptal/kapatma eylemleri kolay erişilir; işlem sürerken çift gönderim engellenir.
- Bu yaklaşım yeni kayıt oluşturma sayfalarının yerine geçmez: kredi kartı/hesap/cari/araç **oluşturma** ayrı tam sayfa; mevcut kayıt **düzenleme** ve finansal **işlem ekleme** alt kenardan açılan alandır. Önceki merkez modal kuralı bu kapsam için değişmiştir.
- Mobilde alanlar yatay sıkıştırılmaz; okunabilir biçimde yeniden akar. Alt gezinme çubuğu, ekran klavyesi ve güvenli ekran alanıyla çakışmamalı; hareket listesinin son satırları erişilebilir kalmalıdır. Açılma, içerik için yer ayırma ve mobil yükseklik davranışı nihai tasarımda birlikte doğrulanacaktır. Kullanıcı bu mesajda arka plan örtüsü/blur, sürükleme veya sürekli açık durma davranışı belirtmedi; bunlar ayrıca tasarlanmalıdır.

Not alma aşaması sürüyor. Bu kayıtta uygulama kodu, veritabanı ve sürüm değiştirilmedi; paketleme/yayın yapılmadı.

### Kompakt alt giriş alanı — son görsel onayı

30 Ekim 2026. Kullanıcı son gösterilen kompakt tasarımı onayladı ve **düzenleme alanının da aynı görünümde olmasını** açıkça istedi. Referans, konuşmada gösterilen son görseldir; yerel görsel `/workspace/generated_images/exec-84adf05e-3da6-4468-be85-e961c3431f3f.png`. Önceki geniş/tam kenara yayılan alt alan taslağının yerine bu sürüm geçerlidir.

- Alt alanın sol ve sağ kenarları ana içerik + yardımcı sütunun birleşik içerik sınırlarıyla hizalanır; aradaki sütun boşluğunu kapsar. Sidebar'a veya sayfanın dış kenar boşluklarına uzanmaz.
- Ayrı büyük başlık/alt eylem satırları yerine küçük bağlam başlığı, tek yatay temel alan sırası, kompakt seçenek düğmesi ve Kaydet bulunur. Ek alanlar **Diğer** düğmesiyle açılır; sağ üstte kapatma vardır. Sıkıştırma için mevcut yazı ve 44px kontrol/dokunma ölçüleri küçültülmez.
- Görselde işlem türü, açıklama, tutar ve tarih temel sıradadır; gerçek işlem türünün gerekli diğer alanları bu düzene uyarlanır. Kaydın bağlamı korunur, zorunlu alanlar gizlenmez. Uygun finansal etki açıklaması küçük ve ikincil kalır.
- Düzenleme aynı panel yerleşimini kullanır; seçili kaydın mevcut değerleri doldurulur, ilgili bağlam ve düzenleme durumu küçük başlıkta açıkça belirtilir. Kapalı ek alanların kayıtlı değerleri kaybolmaz; gerekçe/izin/doğrulama kuralları korunur.
- Arka plandaki sayfa görünür kalır. Alt alana yer ayrılarak hareketlere erişim korunur; dar ekran ve klavye davranışı mevcut mobil tasarım ölçüleriyle ayrıca doğrulanır.

Bu onay tasarım kapsamını kesinleştirir. Kullanıcı bu mesajda kodlama/paketleme/yayın istemedi; yalnız notlar güncellendi.

## 1.14.0 — Toplu uygulama ve gönderim onayı

Kullanıcı, yukarıdaki onaylı banka seçimi, dört tam sayfa oluşturma ve kompakt işlem/düzenleme alanını kodlayıp tasarım ilkeleri ve mobil/masaüstü taşmalar açısından kontrol ederek göndermemizi istedi. Önceki not alma / kodlamaya geçilmedi ifadeleri bu kapsam için tarihsel kayıttır. Mobil alt gezinme ve form eylemleri aynı kapsamda optimize edilir. Veri/kullanıcı temizliği istenmedi; sadece izole test verileri kullanılır. Kart banka adı metadatası için şema 12'ye güvenli geçiş ve şema 11 yedek uyumluluğu sağlanır. Özel banka adı kayıtla birlikte kaydedilir; bağımsız banka yönetim ekranı bu sürüme eklenmez.

## 31 Ekim 2026 — Yeni sürüm notları: ortak cari ekleme/düzenleme sayfası

Durum: kullanıcı tarafından onaylı karar; not alma aşaması. Bu talep kodlama, paketleme veya yayın başlatmaz.

- Cari oluşturma ve cari düzenleme aynı tam sayfa formunu kullanacak. Sayfa başlığı her iki durumda da **Cari Ekle / Değiştir** olacak.
- Yeni cari eklerken form yeni kayıt için açılacak; mevcut cariyi düzenlerken önceki bilgiler alanlara dolu gelecek, kullanıcı yalnız değiştirmek istediği verileri değiştirecek. Girilmeyen/değiştirilmeyen mevcut bilgiler korunacak.
- Düzenlemeye ilişkin açıklama / değişiklik gerekçesi isteğe bağlı kalacak; açıklama boşken de kaydedilebilecek.
- Düzenleme gerçekleştiğinde değişiklik logu tutulacak; log kaydı açıklama yazılmasına bağlı olmayacak.
- Paylaşılan görseldeki mevcut tam sayfa temel bilgiler ve yardımcı ayrıntılar düzeni, projenin tipografi/boşluk/1,9:1 oran ve mobil kurallarıyla korunacak.
- Bu karar, 1.14.0'daki “düzenleme kompakt alt alanda” kuralını **cari kartı düzenleme için** değiştirir. Cari işlem hareketi ekleme/düzenleme ve diğer kayıt türleri için bu notla yeni bir kapsam kararı alınmadı.

## 2 Kasım 2026 — İşlem alt alanını tek satıra indirme ve takvim düzeltmesi

Durum: onaylı yeni sürüm notu; not alma aşaması sürüyor, uygulama/yayın başlatılmadı.

- Alt işlem alanında ayrı bir satır oluşturan “İşlem ekle · Ada Tasarım” bağlam başlığı kaldırılacak. Kapatma (X) düğmesi Kaydet düğmesinin yanına taşınacak; taslak koruması devam edecek.
- Masaüstünde temel işlem alanları, takvim, Diğer, Kaydet ve kapatma aynı yatay satırda olacak. İçerik ana/yardımcı sütunların ortak sınırlarında kalacak; dış sayfa boşluklarına uzamayacak. İsteğe bağlı ayrıntılar ve gerekli doğrulama mesajları erişilebilir kalacak. Mobilde tek satıra zorlamak için kontroller küçültülmeyecek veya yatay taşma oluşturulmayacak.
- İşlem tarihi için form satırında yalnız takvim ikonu gösterilecek; gün/ay/yıl metni ve ayrı tarih etiketiyle yer tüketilmeyecek. Erişilebilir ad “İşlem tarihi” olacak; seçili tarih açılan takvimde okunabilir şekilde korunacak. Bu görsel sadeleştirme tarih değerini ya da kullanıcı seçimini değiştirmeyecek.
- Paylaşılan görselde takvim günleri pencerenin dar bir bölümüne sıkışıyor; takvim gövdesi ve yedi gün sütununun oranı düzeltilecek. Gün adları ve tarihler eşit, okunabilir sütunlarda, açılan pencerenin kullanılabilir genişliğini dolduracak.
- Takvim tıklanan ikona bağlı açılacak; arka planı bulanıklaştırmayacak, sayfayı itmeyecek. Ekran kenarlarına uyum, mobil genişlik ve alt işlem alanıyla çakışma uygulama aşamasında kontrol edilecek.

## 2 Kasım 2026 — Tüm işlem girişlerinde ortak tek satır ve kart ödeme kaynağı

Durum: onaylı yeni sürüm notu; uygulama/yayın başlatılmadı.

- Önceki tek satır kararı yalnız cariyle sınırlı olmayacak: kredi kartı ve diğer işlem ekleme alanları da aynı sade düzeni kullanacak. Ayrı başlık satırı kaldırılacak, X Kaydet yanında bulunacak, işlem tarihi yalnız takvim ikonuyla seçilecek. İçerik sınırları, Diğer seçenekler, doğrulama ve mobil taşmama kuralları ortak kalacak.
- Kredi kartı detayında **İşlem hesabı seçimi tamamen kaldırılacak**; bu alan kaynak hesap değildir ve başka bir karta işlem ekleme olanağı vermeyecek. İşlem doğrudan görüntülenen karta kaydedilecek. Başka karta işlem eklemek için o kartın detayına girilecek.
- **Ödeme eklerken ayrıca Kaynak hesap seçimi** gösterilecek; yalnız kasa/banka hesabı seçilebilecek. Hiçbir kredi kartı kaynak hesap olamayacak; karttan karta virman yeni işlem seçeneği olmayacak. Harcama eklerken bu ödeme kaynağı alanı gösterilmeyecek.
- Seçili kredi kartı işlemin bağlamı/hedefi olarak korunacak; kaynak seçimi seçili kartı yanlışlıkla başka bir karta dönüştürmeyecek. Kart harcamaları yine ilgili karta işlenecek; ödeme kaynağı kuralı harcamayı kasa/banka harcamasına çevirmeyecek.
- Bu finansal kısıt yalnız açılır listedeki görünür seçeneklerle bırakılmayacak; uygulama aşamasında API doğrulamasıyla karttan karta yeni aktarım da engellenecek. Mevcut eski hareketler bu not nedeniyle silinmeyecek veya yeniden hesaplanmayacak.

Kullanıcının aynı günkü netleştirmesi: Axess detayında World seçilerek World'e işlem yazılması hatalı bağlam davranışıdır. Hedef kart seçilemez; açık detaydan belirlenir. İşlem hesabı alanını yalnız filtrelemek yeterli değildir, kaldırılmalıdır. Ödeme kaynağı ayrı bir kavram ve ayrı alandır. Bu netleştirme önceki muğlak “işlem hesabı/kart ödeme kaynağı” ifadesinin yerini alır.

## 2 Kasım 2026 — Cron kurulum bilgisi ve tekrarlanan elle yedek onayı

Durum: onaylı yeni sürüm notu; uygulama/yayın başlatılmadı.

- Ayarlar'daki otomatik yedekleme bölümünde hosting panelinin Cron / Zamanlanmış görev alanına girilecek **kopyalanabilir komut** ve zamanlama bilgisi gösterilecek. Komut PHP CLI ile uygulamanın `api/backup-cron.php` dosyasını çalıştıracak; hosting PHP yolu ve uygulamanın kurulu olduğu tam dosya yolu açıkça ayrılacak. Örnek yollar gerçek sunucu yolu gibi sunulmayacak; veritabanı parolası veya anahtar komuta konmayacak.
- Mevcut günlük Türkiye saati 03.00 kuralı korunacak. Hosting zamanlaması Europe/Istanbul ise `0 3 * * *`, UTC ise `0 0 * * *` bilgisi verilecek. Uygulamadaki seçeneği açmak cron görevi kurulduğu anlamına gelmeyecek; hosting paneline otomatik kurulum bu notun kapsamında değil.
- Aynı gün (Europe/Istanbul takvim günü) daha önce başarılı yedek alınmışsa, kullanıcı yeniden **Yedek al** dediğinde yeni elle yedek oluşturmadan önce onay gösterilecek. Son yedeğin tarih/saati, yeni yedek oluşturulacağı ve saklama sınırının etkisi açıklanacak; Vazgeç / Yeniden yedek al eylemleri sunulacak.
- Toplam beş yedek sınırı korunacak. Uyarı genel olarak “eskisi silinecektir” demeyecek: yalnız rotasyon gerçekten bir kopyayı silecekse **silinecek en eski yedeğin tarih/saatini** belirtecek. Beşten az kopya varken silinme olmayacağı doğru aktarılacak. Aynı gün yeni elle yedek almak önceki aynı gün kopyasını koşulsuz değiştirmeyecek.
- Peş peşe çift tıklama/tekrarlanan istekler aynı işlem için birden fazla yedek üretmeyecek; işlem sürerken düğme kilitli kalacak ve sunucu tarafında tekrar/eşzamanlılık koruması doğrulanacak. Onay iptal edilince dosya oluşturulmayacak veya silinmeyecek.
- Yeni yedek başarıyla tamamlanmadan mevcut kopya silinmeyecek; başarısız yedekleme eski yedekleri kaybettirmeyecek. Geri yükleme/veri temizliği öncesindeki zorunlu güvenlik yedekleri bu elle yedek onayı nedeniyle atlanmayacak. Cron'un günde en fazla bir başarılı otomatik yedek üretmesi ve Ayarlar'a girişin yedek almaması korunacak.

## 2 Kasım 2026 — Fabrika ayarlarına sıfırlama

Durum: onaylı yeni sürüm notu; canlı sıfırlama veya kodlama/yayın talimatı değildir.

- Ayarlar sayfasındaki **Demo verilerini temizle** düğmesinin yanına **Fabrika ayarlarına sıfırla** eklenecek. Demo temizliğinden farklı, açıkça yıkıcı bir eylem olarak ayrışacak; mobilde düğmeler taşmadan yerleşecek.
- Uygulamanın veritabanındaki tüm kullanıcı verileri, finansal kayıtlar, cariler, hesaplar, kartlar, araçlar, kampanyalar ve diğer kullanıcı hesapları temizlenecek. Yalnız işlemi yapan yöneticinin kullanıcı hesabı ve mevcut parola özeti korunacak; yönetici uygulamaya aynı kullanıcı adı/parolayla girebilecek. Parola düz metne çevrilmeyecek veya yeni parola atanmayacak.
- Uygulama boş, gerçek veri girişine hazır durumda açılacak; demo verileri otomatik yüklenmeyecek. Geçerli şema/migrasyon yapısı korunacak; paylaşılan veritabanındaki uygulama dışı tablolar silinmeyecek.
- Yalnız yönetici kullanabilecek. İşlemden önce mevcut yönetici parolasıyla yeniden doğrulama ve açık yazılı sıfırlama onayı istenecek; gerçek verilerin de silineceği açıkça belirtilecek. Demo temizliğinin gerçek veri modundaki engeli bu ayrı sıfırlama eylemine uygulanmayacak.
- Sıfırlama öncesi geri yüklenebilir güvenlik yedeği zorunlu olacak; yedek başarısızsa sıfırlama başlamayacak. Özel yedek dosyaları ve hosting yapılandırması bu işlemle silinmeyecek. Veri temizliği yarım kalmayacak şekilde atomik yürütülecek, diğer oturumlar geçersiz kılınacak ve sıfırlama olayı denetim kaydına yazılacak.

## 2 Kasım 2026 — 1.15.0 toplu uygulama ve yayın onayı

Kullanıcı notları alınan değişikliklerin hazırlanıp GitHub'a yüklenmesini istedi. Yukarıdaki cari ortak sayfa, tek satır işlem alanları/takvim, sabit kart hedefi/ödeme kaynağı, cron kurulum bilgisi, tekrarlı yedek onayı ve yönetici koruyan fabrika sıfırlaması uygulama kapsamıdır. Önceki yalnız not alma ifadeleri bu onaya kadar olan durumu belirtir. Canlı veri sıfırlanmaz; yıkıcı işlevler yalnız izole test verisinde doğrulanır.

## 1.15.0 sonrası notlar — Taslaktan vazgeçme onayı alt alanda kesiliyor

Durum: kullanıcı hatayı bildirdi ve öneri istedi; çözüm önerisi henüz onaylanmadı. Kodlama/yayın başlatılmadı.

- Kullanıcının ekran görüntüsünde kaydedilmemiş değişiklikler onayı tek satır işlem alanının içine sıkışıyor; başlık/açıklama ve ikinci düğme tam görünmüyor. Mevcut EntrySurface onayı alt alanın içinde oluşturuyor; alt alanın yükseklik/kaydırma sınırları onayı etkiliyor.
- Öneri: onayı alt formdan bağımsız, ortak bir portal üzerinden viewport katmanında küçük bir onay penceresi olarak göstermek. Masaüstünde ortada yaklaşık 380–420 px; mobilde ekran kenarlarından boşluk bırakan, klavye açıkken de tamamen erişilebilir boyut. Alt işlem alanı büyütülmeyecek veya kaydırılmayacak.
- Metin: “Değişiklikler kaydedilmedi” / “Çıkarsanız girdiğiniz bilgiler kaybolacak.” Eylemler: birincil “Düzenlemeye dön”, ikincil yıkıcı “Değişikliklerden vazgeç”. Masaüstünde yan yana, dar ekranda gerekirse alt alta; düğmeler kesilmeyecek.
- Önerilen etkileşim: hafif karartma, arka planı bulanıklaştırmadan; ilk odak Düzenlemeye dön'de, Tab odağı onayda kalır. Esc veya dışarı tıklama taslağı silmez, düzenlemeye döner. Vazgeçme yalnız açık yıkıcı düğmeyle gerçekleşir; düzenlemeye dönünce değerler ve odak korunur.
- X, Escape ve menü/geri ile ayrılma aynı ortak onayı kullanmalı. Onay uygulandığında hem masaüstü/mobil hem de gerçek düğme konumu, görünürlük ve klavye kontrolleri yapılmalı; yalnız DOM'da bulunması yeterli sayılmamalı.

## 9 Kasım 2026 — Global uyarlanabilir yerleşim mimarisi incelemesi

Durum: kullanıcı bölünmüş masaüstü penceresinde okunabilirlik sorununu bildirdi; React/React DOM/Vue ve ortak header/sidebar/content yönetimi hakkında ayrıntılı yönlendirme istedi. Aşağıdakiler öneridir; uygulama/yayın onayı değildir. Önceki taslaktan vazgeçme onayı önerisi de bekleyen not olarak korunur.

Kanıt: kullanıcının bu mesajda gönderdiği Mavi Ofis ekranı ve mevcut kaynak kodu. Ekranda tam sol menü + altı sütunlu hareket tablosu + sağ bilgi sütunu birlikte korunuyor; açıklamalar bölünüyor ve işlem türleri kısalıyor. base.css normal sidebar 216 px; context.css sağ cari sütununu 1100 px altında alta geçiriyor; system.css 761 px üzerinde tablo minimumlarını, entry-surfaces.css 1101 px üzerinde bunları kaldıran ayrı kuralı içeriyor. Bu tespit canlı tüm sayfa/cihaz denetimi değil, gönderilen ekran ve kaynak incelemesidir.

Önerilen teknik yön:

- React + mevcut React DOM devam etsin; Vue'ye geçiş bu yerleşim sorununu kendiliğinden çözmez. React bileşen/state yönetir, React DOM tarayıcıya yerleştirir; görünüm uyarlaması esas olarak CSS Grid/Flexbox, media/container queries ve ortak ölçü sözleşmesiyle çözülür.
- Header / Sidebar / Content bir HTML tabloyla değil ortak AppShell içinde CSS Grid bölgeleriyle yönetilsin. PageLayout; PageHeader, SummaryBar, MainContent/ContextAside ve EntryComposer/OverlayHost sözleşmelerini paylaşsın. Sayfalar kendi shell ölçülerini tekrar tanımlamasın.
- Sol gezinmenin tam, ikon şeridi ve açılır panel durumları olsun. Otomatik daralma ile kullanıcının tercihi ayrı yönetilsin; yeterli alan geldiğinde tercih geri gelebilsin. Ana içerik okunabilirliği önce gelsin.
- 1,9:1 ana/yardımcı oran yalnız iki sütun da okunabilir minimumları sağlıyorsa kullanılsın. Alan azaldığında sağ modüller alta taşınsın veya görünür etiketli açılır bilgi alanına dönüşsün; veri kaybolmasın. Başlangıç çalışma eşiği içerik alanında yaklaşık 1200 CSS px; kesin değer gerçek içerik minimumlarıyla ölçülerek belirlensin.
- İçerik/bileşen genişliği container queries ile izlensin; yalnız pencere genişliği veya cihaz türüne güvenilmesin. Aynı pencere genişliği, açık/kapalı sidebar ve yardımcı sütun nedeniyle farklı kullanılabilir alan verebilir.
- Ledger/tablo için geniş, orta, dar sunumları: orta alanda etiket/ekleyen gibi ikincil metadata açıklama altında veya genişleyen satırda birleşsin; tarih/açıklama/tutar ve gerekiyorsa bakiye okunur kalsın. Daha dar alanda kompakt hareket listesine geçilsin. Bu sütun birleştirmeleri öneridir, onaysız sıra/anlam değişikliği yapılmasın. Tutar/yön/işlem anlamı ellipsis ile kaybolmasın; yazı küçülterek çözülmesin. Yoğun rapor tablosunda gerekirse yalnız yerel tablo kaydırması kullanılsın.
- Tek satır işlem alanı yalnız gerekli kontroller okunur sığıyorsa tek satır olsun; orta/dar genişlikte kontrollü iki satıra aksın. Sabit form, alt nav ve sanal klavye ölçüleri ortak tokenlarla uyumlansın.
- Global OverlayHost/portal ile takvim/popover/onaylar formun overflow/yükseklik sınırından bağımsız açılsın. Özellikle bekleyen vazgeçme onayı sıkışması aynı katman mimarisi kapsamında ele alınsın.
- Header'da arama öncelikli; tarih/kısayol gibi ikincil öğeler alan azaldığında sadeleşsin. Erişilebilir etiketler ve en az 44 px hedefler korunsun. Layout ölçüsü CSS'te, menü/odak/taslak etkileşim durumu React'te tutulsun; her resize olayında JS piksel hesabı temel çözüm olmasın.

Önerilen uygulama sırası: mevcut breakpoint/min-width/overflow/!important envanteri ve tek merkezde sadeleştirme → ortak shell/overlay altyapısı → zor örnek cari detayda doğrulama → hesap/kart/araç/rapor/ayarlar ve formlara yayma → görsel regresyon. Önce masaüstü yarım pencere ve orta genişlikler kabul kriterleriyle netleştirilsin.

Kabul kapsamı önerisi: 320/390/768/960/1024/1180/1268/1280/1366/1440/1536/1920 CSS px, kırılma eşiğinin hemen altı/üstü, açık/kapalı sidebar, tarayıcı zoom %125/%150/%200, uzun adlar ve büyük tutarlar, yatay mobil ve klavye. Sadece scrollWidth kontrolü yetmez; anlamlı sütun genişliği, kritik metinlerin tam görünmesi, düğmelerin çakışmaması, odak ve onay görünürlüğü görüntülerle denetlensin. Kritik akışlar fiziksel telefonda da doğrulansın; yapılmadan fiziksel test iddiası olmasın. Mutlak “hiç sorun çıkmaz” garantisi yerine ortak kurallar ve tekrarlanabilir regresyon kontrolleri kurulsun.

## 9 Kasım 2026 — Uyarlanabilir yerleşim taslakları

Kullanıcı mimari yaklaşımı uygun bulup taslak istedi. Kod/yayın değiştirilmeden üç bağımsız görsel taslak hazırlandı; her biri aynı cari detayının geniş, bölünmüş pencere ve mobil durumlarını karşılaştırır. Görseller sentetik konsepttir, çalışan arayüz testi değildir. Tipografi/ölçek ve finansal örnekler uygulama sırasında gerçek bileşenlerle doğrulanmalıdır.

Kullanıcıya göründükleri sırayla seçim eşlemesi:

1. Akışkan sütunlar — genişte mevcut ana/sağ oranı, dar pencerede bilgi alanı aşağı; `/workspace/generated_images/exec-cd6bd876-04d7-4e5b-8416-8f180d289e77.png`.
2. Odaklı çalışma alanı — tam geniş hareketler ve istek üzerine bağlam paneli; `/workspace/generated_images/exec-7327ef71-ba64-4ce0-a0ae-e186f7160a30.png`.
3. Sekmeli çalışma alanı — aynı sayfada Hareketler / Durum ve bilgiler görünümü; `/workspace/generated_images/exec-80ddd79e-45e0-47c0-afdc-8cb4867dddcd.png`.

Henüz görsel seçilmedi. Mimari yaklaşımın onayı bu üç alternatiften birini otomatik seçmez; uygulama başlamadı.

## 9 Kasım 2026 — Seçilen yön ve ana yerleşim kutuları eskizi

Kullanıcı üç taslaktan **1 / Akışkan sütunlar** yönünü beğendi. Düzeltme: bölünmüş pencerede hızlı işlem alanı yardımcı bilgilerden önce gelmemeli; kendi alt bölgesinde durmalı, bilgi alanının üstüne binmemeli. Kullanıcı henüz uygulama istemedi; önce ana kutuların üzerinden konuşup sonrasında içeriklerini belirlemek istiyor.

Bu nedenle tek yapısal eskiz üretildi: `/workspace/generated_images/exec-a1e64e49-6c7c-48df-afc6-1dcb3b0c7d50.png`. Aynı mimarinin geniş ve dar/bölünmüş pencere hâlleri; ürün içeriği/işlem satırları olmadan numaralı bölgeler:
1 sidebar; 2 header; 3 content dış çerçevesi; onun içinde 4 sayfa başlığı, 5 ortak özet, 6 ana içerik, 7 yardımcı içerik, 8 sayfa footer'ı. 9 hızlı işlem alanı ayrı alt bölge olarak kendi yüksekliğine yer ayrılarak hizalanır. Dar durumda 7, 6'nın altına; 8 ikisinin altına gelir. 9, yardımcı içerikle ana içerik arasına girmez ve içerik üstüne binmez.

Eskiz konuşma aracıdır; ölçüler/kaydırma davranışı, hangi kutuların sabitleneceği ve kutu içerikleri henüz kesinleşmedi. Global mimari seçimi tek başına kodlama/yayın onayı sayılmaz.

## 9 Kasım 2026 — Kutu şeması ve görünüm/yerleşim ayrımı onaylandı

Kullanıcı dokuz kutulu şemayı site geneli için onayladı ve tasarım kriterlerine alınmasını istedi. Kriterler `docs/GLOBAL-YERLESIM-SOZLESMESI.md` ve tasarım ilkeleri belgesine işlendi. Tüm sayfalar aynı bölge sözleşmesini paylaşacak; her kutunun davranışı ve içeriği sırayla konuşulacak. Yerleşim, görsel tema, bileşen stilleri ve etkileşim/veri ayrı tutulacak. İleride renk şeması/tema değiştirme ihtimali için anlamsal token sınırları hazırlanacak; bugün yeni tema, seçici veya uygulama/yayın talimatı verilmedi.

Sonraki görüşme başlangıcı olarak Sidebar önerileri (henüz ayrıca onaylanmadı): genişte yazılı menü; orta genişlikte ikon şeridi; dar/mobilde kullanıcı açtığında görünen gezinme paneli; yeterli yer yokken tam menü tercihi ana içeriği ezmesin; genişlik geri geldiğinde kullanıcı tercihi geri uygulanabilsin. Uzun menüde gezinme kaydırılabilsin, alt ayarlara erişim korunabilsin. Kesin eşikler, genişlikler ve sabitlik bir sonraki karardır.

## Sidebar önerileri onaylandı — her genişlikte küçültme ve gizleme

Kullanıcı Sidebar başlangıç önerilerini uygun buldu ve geniş ekranda bile küçültme ile tamamen gizleme seçeneklerinin her zaman bulunmasını istedi. Tam menü / ikon şeridi / gizli durumları ayrı ele alınacak; gizliyken yeniden açma kontrolü erişilebilir kalacak, kullanıcının tercihi otomatik genişlemeyle kaybolmayacak. Menüden boşalan alan ortak içerik düzenine katılacak. Global yerleşim sözleşmesi ve tasarım kriterlerine işlendi. Kesin ölçüler, kontrol konumu ve saklama kapsamı henüz görüşülecek; kodlama/yayın başlatılmadı.

## Header onayı ve Content görüşmesine geçiş

Kullanıcı Header görev dağılımını uygun bulup devam edilmesini istedi. Onay global yerleşim sözleşmesine ve tasarım kriterlerine işlendi. Önerilen yaklaşık yükseklikler henüz değişmez ölçü değildir. Sıradaki 3 Content çerçevesi için ortak kenarlar, kullanılabilir alan, ana/yardımcı kırılması ve kaydırma önerileri sunulacak; henüz ayrıca onaylı sayılmaz. Not/kriter aşaması sürüyor, uygulama veya yayın yapılmadı.

## Başlık/özet ayrımı onayı ve kalan bölümler için son öneri

Kullanıcı 4 Sayfa başlığı / 5 Özet ayrımını mantıklı buldu ve diğer bölümler için görüş verilip mimari görüşmenin sonuçlandırılmasını istedi. Önceki Content yaklaşımı da uygun bulunmuştu; bu onaylar tasarım kriterlerine işlendi. 6 ana içerik, 7 yardımcı içerik, 8 footer, 9 hızlı işlem bölgesi ve bağımsız açılır katmanlar için son öneri paketi `docs/GLOBAL-YERLESIM-SOZLESMESI.md` içine eklendi. Öncelik okunabilir ana içerik, ortak kaydırma, gerektiğinde alta geçen yardımcı alan, akış sonunda footer ve kendi yüksekliği ayrılan hızlı formdur. Son öneri paketi ayrıca onay bekler; kodlama/paketleme/yayın başlatılmadı.

## Son yerleşim paketi onaylandı — tema/kodlama sırası sorusu

Kullanıcı kalan bölgeler ve katman davranışlarını “onaylıyorum” diyerek kabul etti; ardından kodlamaya şimdi mi geçileceği, tema değişikliklerinin de birlikte mi yapılacağı konusunda görüş istedi. Tasarım onayı kaydedildi; soru kodlama/yayın talimatı olarak yorumlanmadı. Öneri: mevcut tema korunarak global kabuk/responsive/katman ve token ayrımını önce doğrulamak, yeni tema tasarımlarını bundan sonra ayrı çalışmak. Tema seçicisi ve yeni paletler henüz onaylı kapsam değildir.

## 9 Kasım 2026 — 1.16.0 kodlama aşaması

Kullanıcı “evet, başla bakalım o zaman kodlamaya” dedi. Yukarıdaki global yerleşim kapsamı mevcut Sade Netlik görünümüyle uygulamaya alındı. Yeni tema/tema seçici ayrı çalışma olarak kaldı. Dokuz bölge, içerik genişliğine bağlı uyarlama, kalıcı menü tercihi, bağımsız onay ve tema/yerleşim ayrımı kodlandı; uygulama eşikleri [global sözleşmede](GLOBAL-YERLESIM-SOZLESMESI.md), sürüm özeti [1.16.0 kapsamında](SURUM-1.16.0.md). Bu talimat GitHub veya canlıya yayın talimatı değildir.

1.16.0 ek yayın onayı: Kullanıcı kodlama tamamlandıktan sonra “git huba yükle” talimatını verdi. Hazır kaynak, sürüm etiketi ve doğrulanmış hosting paketleri GitHub’a yayımlanır. Önceki yayın yapılmayacağına dair kapsam cümleleri önceki aşamanın tarihçesidir; canlı hosting kurulumu bu talimata dahil değildir.

## 9 Kasım 2026 — 1.17.0 mobil düzeltme ve yayın onayı

Kullanıcı mobil ekran görüntülerindeki incelemeye katıldı ve “Sana katılıyorum, değişiklikleri hazırla ve githuba yükle” dedi. Açılan cari satırının dar şeride sıkışması, mobil menüde adların kaybolması, özet ayraç/girintileri, hesap listesi boşlukları, uzun filtre paneli, header arama alanı, ödeme planı yoğunluğu ve bildirim zeminleri kapsam içindedir. Yeni tema veya finansal anlam değişikliği istenmedi. Kaynaklar, testler ve hosting paketleri 1.17.0 etiketiyle GitHub'a yayımlanır; canlı hosting kurulumu yapılmaz. Ayrıntılar SURUM-1.17.0.md ve TEST-RAPORU-1.17.0.md içindedir.

## 17 Kasım 2026 — 1.22.0 bağımlılık analizi (uygulama onayı yok)

- Kullanıcı son yayımlanmış sürümde kullanılan kütüphane, paket ve çalışma ortamlarının listesini ve güncellik analizini istedi. Bu talep paket yükseltme, kodlama veya yayın talimatı değildir.
- İnceleme yerel 1.17.0 yerine GitHub `v1.22.0` etiketi ve onun `package-lock.json` dosyasında yapıldı. 14 doğrudan npm bağımlılığının 8'i npm latest sürümüyle aynı; React/React DOM 19.2.9 → 19.3.1, lucide-react 1.57.0 → 1.74.0, Vite 6.4.6 → 8.3.8, @vitejs/plugin-react 5.0.4 → 6.3.0 ve Playwright 1.64.1 → 1.65.1 geride. Bunlar 17 Kasım 2026 anlık karşılaştırmasıdır, onaylanmış yükseltme hedefi değildir.
- Kilit dosyasında 263 bağımlılık kaydı var; `npm audit --package-lock-only --json` bilinen açık bildirmedi. Dolaylı paketlerin tamamı için ayrı güncellik karşılaştırması yapılmadı.
- Node gereksinimi >=24 <25; CI Node 24 kullanıyor. Güncel 24 dalı 24.22.3, en yeni kararlı/LTS 26.13.1. Stylelint 18'in Node 24 dalında en az 24.15.0 istemesi nedeniyle projenin genel alt sınırı ayrıca değerlendirilmelidir.
- GitHub Actions checkout v5 / setup-node v5 / upload-artifact v6 kullanıyor; son yayımlanan sürümleri sırasıyla v7.0.1 / v7.1.0 / v7.0.2. Test ortamı PHP 8.3 ve MariaDB 11.4 imajlarını digest ile sabitliyor; canlı hosting sürümleri bu analizde doğrulanmadı.
- Karar bekleniyor: kullanıcı açık uygulama talimatı vermeden hiçbir bağımlılık veya çalışma ortamı yükseltilmeyecek.

1.9.1 bakım eki: detay ekranındaki liste kapsamlı arama eşleşen kaydı seçer; boş sonuçta geri dönüş ve tüm hesap uyarıları korunur. Şema 10 değişmez.

## 17 Kasım 2026 — Bağımlılık güncellemeleri uygulama onayı

Kullanıcı “güncellemelerin tamamını gerçekleştir” talimatıyla bağımlılık ve araç güncellemelerini uygulamayı onayladı. Kapsam: son 1.22.0 kaynakları üzerinde güncel kararlı npm paketleri, Node.js LTS, test ortamı imajları ve GitHub Actions güncellemeleri; gerekli uyumluluk düzenlemeleri ve doğrulamalar. Finansal model ve şema 12 korunur. Bu talimat GitHub Release yayımlama veya canlı hosting kurulumu içermez.

### Uygulanan bağımlılık kapsamı

- Güncel kararlı 14 doğrudan npm paketi kesin sürümlerle sabitlendi; uyumlu dolaylı bağımlılıklar yenilendi ve kilit dosyası yeniden doğrulandı.
- Node 26.13.1 LTS / npm 12.2.2, Python 3.15.2 ve güncel GitHub Actions sürümleri iş akışlarına işlendi.
- Test imajları PHP 8.5.12 ve MariaDB 12.3.3 LTS; Inter fontları 4.1. Eski PHP imajı önbelleğinin güncellemeyi atlaması engellendi.
- Finansal model, şema 12 ve canlı veri korunur. Doğrulama ayrıntıları `BAGIMLILIK-GUNCELLEME-2026-11-17.md` içindedir. Yeni uygulama sürüm numarası ve GitHub Release yayın talimatında hazırlanacak; bu çalışma mevcut 1.22.0 tabanı üzerindeki yayımlanmamış değişikliklerdir.

## 17 Kasım 2026 — 1.23.0 GitHub yayını ve canlı hosting talimatı

Kullanıcı “githubta yayınla ve canlı hosting güncellemesini yap” diyerek bağımlılık güncellemelerinin yeni GitHub sürümü olarak yayımlanmasını ve mevcut canlı kurulumun güncellenmesini açıkça yetkilendirdi. Hedef sürüm 1.23.0, şema 12. Önceki yalnız yerel uygulama/yayın bekleniyor ifadeleri önceki aşamaya aittir. Canlı uygulama güncellemesi dosya/veritabanı yedeği ve mevcut api/config.php korunarak yapılır; veri sıfırlama veya demo yükleme kapsamında değildir. Hosting hedefi ve erişim bilgisi bu ortamda henüz tanımlı değildir; kullanıcıdan bağlantı yöntemi istenmiştir.

## 17 Kasım 2026 — Geçerli yayın akışı: kodlama onayı GitHub yayınını kapsar

Kullanıcı hosting bağlantısı/dağıtımı işini kapsamdan çıkardı; hosting yükleme ve canlı incelemeyi kendisi devraldı. Bundan sonra açık kodlama/uygulama onayı aynı kapsamın GitHub deposuna gönderilmesini ve yeni GitHub Release yayımlanmasını da yetkilendirir; ayrıca yayın onayı istenmez. Hostinge doğrudan yüklenmeye hazır ZIP ve SHA-256 dosyası hem depo içine hem GitHub Release varlıklarına eklenir. Önceki ayrı GitHub yayın onayı ve bu oturumdaki canlı hosting bağlantısı talebi bu son talimatla değiştirilmiştir.

### 1.23.0 yayın tamamlandı

GitHub Release ve dört varlık (tam ZIP, hosting ZIP, iki SHA-256) yayımlandı. Windows/Linux yayın koşusu 44066468482 başarılı. Repo içindeki hosting ZIP yayın varlığıyla birebir eşleşiyor. Kodlama onayıyla birlikte GitHub yayın akışı kalıcı olarak AGENTS.md'ye işlendi. Hosting bağlantısı/yükleme/inceleme yapılmadı; kullanıcı üstleniyor. Nihai rapor `TEST-RAPORU-1.23.0.md`.

## 17 Kasım 2026 — 1.24.0 proje genelinde biçim kontrolü onayı

Kullanıcı Prettier kapsamının genişletilmesini ve sonraki sürümlerde projenin tamamının denetlenmesini istedi. Sabit 14 dosyalık liste kaldırılacak; desteklenen kaynak/belge/yapılandırma türleri otomatik keşifle kontrol edilecek. PHP için resmi Prettier eklentisi kullanılacak. Python/SQL gibi desteklenmeyen türler Prettier kontrolü yapılıyor gibi gösterilmeyecek. Üretilmiş çıktılar, bağımlılıklar, geçmiş test kanıtları, paket arşivleri, gerçek config ve özel çalışma verileri hariç tutulacak. İlk biçim düzenlemesi ayrı bakım kapsamıdır; uygulama davranışı, finansal model ve şema 12 korunacak. Kodlama onayı GitHub yayınını kapsar; 1.24.0 hosting ZIP + SHA-256 depoya ve Release'e eklenecek, hosting yükleme/inceleme kullanıcıda kalacak.

### 1.24.0 uygulama ve yerel kabul

232 desteklenen dosya otomatik keşifle denetleniyor; 14 dosyalık liste kaldırıldı. Yeni JS/PHP dosyalarıyla kapsam ve hata/düzeltme akışı doğrulandı. Genel format/derleme/birim/worker, API/migrasyon/yedekleme ve paket kurulumu başarılı; altı masaüstü/mobil piksel karşılaştırması aynı. Geçmiş test kanıtları değiştirilmedi. Hosting ZIP + SHA-256 repo için hazırlandı; GitHub tam kabul ve yayın aşamasına geçiliyor.

### 1.24.0 yayın tamamlandı

Windows/Linux tam kabulü ve GitHub Release yayını başarılı (44070786379). Yeni desteklenen dosyalar otomatik keşfediliyor; PHP dahil proje genelindeki biçim kontrolü artık kalıcı yayın koşulu. Hostinge hazır ZIP + SHA-256 repo içine ve Release varlıklarına eklendi, indirilip birebir eşliği doğrulandı. Hosting yükleme/inceleme kullanıcıya ait.

## 17 Kasım 2026 — Yeni sürüm tasarım notları: tedarikçi bilgi alanı ve aylık çalışma hacmi

**Durum: Tasarım/kapsam onayı; not toplama aşaması sürüyor. Kodlama, paketleme, commit/push veya yayın başlatılmayacak.** Kullanıcı önce yeni fikirlerini tamamlayacak; yalnız açık ve kesin “kodlamaya başla” veya eşdeğer başlangıç talimatıyla uygulamaya geçilecek. Bir fikrin uygun bulunması, kapsam genişletme veya görseldeki yaklaşımı uygulama yönünün onaylanması başlangıç talimatı sayılmaz. Başlangıç talimatı verildiğinde mevcut GitHub yayın/hosting ZIP akışı geçerlidir; hosting yükleme ve incelemeyi kullanıcı yapar.

Görsel referans: [Tedarikçi bilgi alanı, masaüstü ve mobil aylık özet](tasarimlar/tedarikci-hafta-pos-aylik-ozet-2026-11-17.png). Aşağıdaki son kullanıcı düzeltmesi, referans görseldeki geçmiş gün zemininden önceliklidir. Görseldeki banka logoları, sayısal değerler ve hareket satırları sunum örneğidir; mevcut finansal veriler veya işlem tablosu değişikliği talimatı değildir.

### Son düzeltme — Geçmiş ziyaret gününün arka planı

- **Geçmiş planlı ziyaret gününün pasif gri arka planı yalnız tarih rakamını değil, gün kısaltmasını, tarih rakamını ve ziyaret işaretini birlikte kapsayacak.** Aktif/gelecek planlı ziyaret günündeki dikey yüzeyle aynı sınır, yükseklik, köşe ve hizalama kullanılacak; yalnız renk pasif nötr gri/bej rolünde olacak.
- Referans görselde örneğin “Pzt” dışarıda, “16” gri zemin içinde kalıyor; bu ayrım düzeltilmeli. Kullanıcı diğer görsel kararlarını uygun buldu. Bu onay kodlamaya başlama talimatı değildir.

### Ziyaret günleri

- “Ziyaret günleri” başlığı korunur. Metin listesi yerine içinde bulunulan hafta, pazartesi–pazar sırasıyla yedi eşit sütunda ve kompakt gösterilir; gün kısaltması ve tarih rakamı aynı sütundadır.
- Planlı ziyaretler işaretlenir. Geçmiş planlı ziyaret nötr pasif gri, bugün/gelecek planlı ziyaret açık turkuazdır. Bugün ince turkuaz çerçeveyle ayrıca ayrılır.
- Planlı ziyaret bilgisi gerçekleşmiş ziyaret/katılım takibi değildir; tamamlandı işareti veya yeni ziyaret gerçekleşme kaydı üretilmez.
- Referans tarihi 17 Kasım 2026, örnek hafta 16–22 Kasım'dır; uygulama gerçek içinde bulunulan haftaya göre ilerler. Örnek ziyaret günleri gerçek tedarikçi kaydına yazılmayacak.

### POS Cihazları

- “POS programları” başlığı **“POS Cihazları”** olur; bilgi “i” ikonu yerine uygun mevcut POS cihazı ikonu, yoksa kasa ikonu kullanılır.
- İlişkili banka/POS kimlikleri logolarla gösterilir. **Logo altında ayrı banka/program etiketi olmayacak.** Son görseldeki gibi yalnız banka logosu/wordmark kalır; Bonus, World veya Axess için altta ek açıklama satırı eklenmez.
- Logo boyutları önceki büyük taslağın yaklaşık %80'ine indirilir; grup yatay alanı sıkışık doldurmaz, dengeli boşluk bırakır. Genişliğe göre satırda 3–4 logo hedeflenir; örnek referansta üç logo vardır.
- Yeni bir banka/POS finansal bağlantısı üretilmez; mevcut ilişkilendirme bilgileri kullanılır.

### Kampanyalar

- Başlık **“Kampanyalar”** olur. İlişkilendirilmiş kampanyalar her biri tek satırlık ad olarak alt alta listelenir.
- Katılım durumu, kayıt/puan/iade tutarı ve uzun açıklama alt satırları bu kompakt bilgi alanında gösterilmez. Kampanya verisi veya ayrıntı işlevi kaldırılmaz.
- Örnek adlar: “Bonus market kampanyası”, “World Otomotiv Sektöründe 2 taksit kampanyası”. Örnek kampanyalar gerçek kayda otomatik eklenmez.

### Aylık Özet — Yerleşim

- Masaüstü iki sütunlu görünümde **yardımcı sağ sütunda, Durum ve bilgiler panelinin altına** aynı genişlikte ayrı Aylık Özet paneli gelir. Masaüstünde bu iki panel ayrı sekmelere dönüştürülmez.
- Mobil görünümde aynı alan “Durum ve bilgiler” / “Aylık Özet” sekmeleriyle kullanılabilir.
- Ay seçimiyle rapor değişir. Mevcut Recharts ile dinamik grafik hazırlanabilir; sırf grafik için Chart.js gibi ikinci bir kütüphane eklemek onaylı kapsam değildir.

### Aylık Özet — Anlam ve oranlar

- Amaç finansal kasa/banka akışı değil, **seçili ayda tedarikçiyle çalışma hacmi ve bu hacmin dağılımıdır**.
- Yalnız ilgili ayın alışları ve bunlara bağlı ödeme/iade işlemleri kapsanır. Önceki aylara ait borç ödemesi seçili ayın dağılımına katılmaz; toplam cari bakiye bu ayın açık borcu yerine kullanılmaz.
- Faturalı/faturasız brüt alış ve iade tutarı kısa özet olarak gösterilir; net alış hacmi iadeler düşüldükten sonraki tutardır.
- İade bağımsız gelir dilimi değildir. İlgili alış hacminden düşer; nakit/banka veya karta geri alındıysa ilgili ödeme grubunun net tutarını, açık borçtan düşüldüyse açık borç grubunu azaltır. Bankaya olan kredi kartı borcu, kasa/banka bakiye etkisi bu raporun konusu değildir.
- **İki eş merkezli halka aynı net alış toplamını bağımsız iki şekilde sınıflandırır:** dış halka faturalı/faturasız alış; iç halka nakit/banka, kredi kartı, açık borç. Her halka kendi içinde %100'dür; beş kategori tek halkada toplanmaz.
- Dıştaki alış halkasının kalınlığı içteki ödeme/borç halkasının **yarısıdır (%50 daha ince)**. Bu yalnız görsel kalınlık kararıdır, veri oranlarını değiştirmez. Ortada net alış toplamı; açıklamalarda tutar ve yüzde görünür.
- Onaylı örnek: brüt faturalı 6.000 TL + faturasız 4.000 TL − iade 2.000 TL = net 8.000 TL. Örnekte her alış türünden 1.000 TL iade varsayılır: dış halka faturalı 5.000 TL/%62,5, faturasız 3.000 TL/%37,5. İç halka nakit/banka 3.000 TL/%37,5, kart 2.000 TL/%25, açık borç 3.000 TL/%37,5. Örnek tutarlar gerçek veri değildir.
- Uygulama aşamasında ödeme/iadenin ilgili ayın alışına bağlantısı mevcut veri modeliyle doğrulanmalıdır. Bağlantı bilinmiyorsa önceki borç ödemelerini tahminen aya dağıtmak veya mevcut finansal modeli bu görselden çıkarımla değiştirmek yetkisi yoktur; eksik ilişki netleştirilir.

### Önceki arama önerileri sorunu — Çözüm taslağı

Kullanıcı öneriler penceresinin çarpıyla kapandıktan sonra arama odağı nedeniyle yeniden açılmasını bildirdi ve çözüm düşünülmesini istedi. Önerilen davranış: çarpı/Esc açık önerileri kapatır; metin/filtre ve imleç korunur; odağın geri gelmesi tek başına pencereyi açmaz. Yeni yazma, açıkça yeniden tıklama veya Aşağı Ok ile yeniden açılır. Bu çözüm önerisi henüz ayrıca uygulama başlangıç talimatı almadı; not aşamasındadır.

## 17 Kasım 2026 — Müşteri ve personel bilgi alanı: yeni tasarım çalışması

**Durum: Kullanıcının talepleri ve görüş bekleyen tasarım önerileri. Kodlama/yayın başlangıç talimatı yoktur.** Kullanıcı müşteri görünümünün tedarikçi tasarımıyla sürekliliğini ve personel için öneriler hazırlanmasını istedi; önce görselleri yorumlayacak. Önceki tedarikçi tasarım onayı bu yeni önerilerin kendiliğinden onaylandığı anlamına gelmez.

### Müşteri — Kullanıcının istediği kapsam

- Tedarikçideki “Ziyaret günleri” yerine müşteride **“Alışveriş günleri”** başlığı kullanılır. İçinde bulunulan haftada ilgili cariye ait gerçek işlem olan günler aktif işaretlenir.
- Bu, tedarikçinin planlı ziyaret takvimi değildir: işlem gerçekleşmiş geçmiş günler de aktif görünür; tedarikçinin geçmiş planlı ziyaretine ait pasif gri kuralı müşterinin gerçekleşmiş işlem günlerine otomatik taşınmaz. Gün kısaltması/tarih/işaret aynı yüzeyde kalır; bugün ince çerçeveyle ayrıca ayrılır.
- Altında kompakt “Müşteri bilgileri”: **Ünvan, TCKN/VKN, Adres, Telefon**, her biri kısa ayrı satır. Uzun adres dar ekranda taşmadan gerektiği kadar sarılır.
- Altında aynı görsel dilde aylık halka grafik: müşterinin ay içindeki borçlanmasını ve borç ödeme/tahsilat durumunu anlamayı amaçlar.
- Masaüstünde bilgi alanı ve Aylık Özet aynı yardımcı sütunda alt alta; mobilde bilgi/aylık özet sekmeleri önerilir.

### Müşteri — Görüş bekleyen grafik önerisi

- Tek halka: **seçili ayın net satışına ait tahsil edilmiş ve açık kalan tutar**. İade satıştan düşer; iade, tahsil edilmiş para diye gösterilmez. Sıfır toplamda anlamsız yüzde üretilmez.
- Ay içinde önceki aylara ait borç da tahsil edilebilir; bu tutarı mevcut ayın satış halkasına eklemek %100'ü aşan veya yanıltıcı oran doğurabilir. Öneri: bu tahsilatı halkanın dışında ayrı bir satırda göstermek. Kullanıcının istediği “aynı ay ne kadar girdi/çıktı” için ay içindeki toplam tahsilat ayrıca görünür olur; bunun aynı aya ait satış tahsilatından farklı olduğu açıkça adlandırılır. Bu ayrım henüz kullanıcı tarafından ayrıca onaylanmadı.
- Örnek: brüt satış 22.000 TL − iade 2.000 TL = net satış 20.000 TL. Bu satışlara ait tahsilat 14.000 TL/%70, açık kalan 6.000 TL/%30. Ay içi toplam tahsilat 16.000 TL ise bunun 2.000 TL'si önceki ay alacağına aittir; halkaya dahil edilmez.
- Grafiğin adı gerçekleşmiş “Tahsilat dağılımı” veya “Aylık satış ve tahsilat” olabilir. Tek ayın gerçekleşmiş oranı, geleceğe dönük ödeme potansiyeli/risk puanı diye sunulmaz. Mevcut altı aylık satış ve vadeye göre zamanında tahsilat metriklerini kaldırma kararı henüz verilmedi.
- İptal/plan kayıtları gerçek işlem günlerini doldurmaz; işlem tarihi esas alınır. Ödeme/iadenin hangi satışa bağlı olduğu uygulama aşamasında doğrulanır; bağlantı eksikse ilişki uydurulmaz.

### Personel — Yorum bekleyen öneri

- Aynı ortak bilgi/aylık özet düzeni; haftalık başlık **“İşlem günleri”**. Yalnız gerçekleşmiş cari hareketlerin günleri işaretlenir; devam/puantaj veya işe gelme takibi gibi gösterilmez.
- Kompakt “Personel bilgileri”: Ad soyad, TCKN, Telefon; gerekirse mevcut adres alanı. Yeni görev/departman/işe giriş verisi varsayılmaz.
- Mevcut kayıtların desteklediği kısa haftalık izin özeti: kullanılan/toplam gün. Yalnız haftalık sayı biliniyorsa belirli bir gün izinliymiş gibi takvime işaret konmaz.
- Aylık hakediş ve ödeme özeti: maaş + tanımlı yemek hakkı; ödenen/kalan. Örnek maaş 30.000 TL + yemek 3.000 TL = toplam 33.000 TL, buna bağlı ödenen 24.000 TL/%72,7 ve kalan 9.000 TL/%27,3.
- Tedarikçideki görsel devamlılık için ince dış halkada maaş/yemek payı (%90,9/%9,1), iç halkada ödenen/kalan (%72,7/%27,3) önerilir; her halka ayrı %100'dür.
- Maaş/yemek ödemesi mevcut açık kalem/ay bağlantısıyla hesaplanır; aynı ödeme iki kalemde sayılmaz. Avans kendiliğinden yeniden borç veya otomatik mahsup üretmez. Personelin şirkete olan ayrı borcu maaş alacağından otomatik düşülmez; gerekirse ayrı satırda gösterilir.
- Öneriler yeni bordro, puantaj, performans/risk puanı veya finansal hesaplama değişikliği yetkisi değildir. Görsellerdeki tüm tutar, ad ve iletişim bilgileri örnektir.

### Müşteri ve personel — Görsel taslaklar hazır, kullanıcı yorumu bekleniyor

- [Müşteri taslağı](tasarimlar/musteri-hafta-bilgi-aylik-ozet-2026-11-17.png): gerçek cari işlem günleri, gün kısaltmasını/tarihi/işareti birlikte kapsayan aktif yüzeyler; kompakt müşteri bilgileri; net satışa ait tahsil edilen/açık kalan halka. Ay içi toplam tahsilat ve önceki aydan gelen tahsilat ayrı satır önerisidir.
- [Personel taslağı](tasarimlar/personel-hafta-bilgi-aylik-ozet-2026-11-17.png): gerçek işlem günleri, kompakt personel bilgileri, haftalık izin sayısı ve iki halkalı hakediş/ödeme özeti. Takvim devam/puantaj takibi değildir.
- Müşteri taslağındaki geçmiş gerçekleşmiş işlem günü aktif turkuazdır; tedarikçinin geçmiş planlı ziyaretindeki pasif griden bilinçli olarak farklıdır. Her aktif günün zemin/çerçevesi gün kısaltması dahil tüm hücreyi kapsar.
- Bu görsellerdeki sayılar ve maskeli kimlik/telefonlar örnektir. Taslaktaki maskeleme gerçek alanların görünürlüğünü değiştirme kararı değildir. Personel taslağı asistan önerisidir; müşteri grafiği için eski ay tahsilatının ayrı satır önerisi de dahil kullanıcı yorumu beklenir.
- Yalnız belge ve görsel referansları kaydedildi. Uygulama kodu değiştirilmedi; commit/push, paketleme veya yayın yapılmadı.

### Personel — Kullanıcının çalışma takvimi ve vardiya düzeltmesi

**Not ve görsel aşaması sürüyor; kodlama/yayın başlatılmayacak.** Bu talep yalnız personel taslağındaki önceki “İşlem günleri” önerisini değiştirir; müşteri ve tedarikçinin takvim anlamları korunur.

- Personel haftalık alanının başlığı **“Çalışma takvimi”** olur. Gerçek cari işlem günleri yerine planlanan çalışma vardiyası ve haftalık izin günü gösterilir.
- İki vardiya vardır: sabah ve akşam. Taslaktaki önerilen yön: gün hücresinin **üst yarısı sabah**, **alt yarısı akşam**; planlanan vardiya yarısı uygun tonla vurgulanır, diğer yarı nötr kalır. Sabah için açık turkuaz, akşam için hafif nötr arduvaz tonu önerildi.
- Haftalık izin günü mevcut uyarı paletindeki **sarı-turuncu açık zeminle tüm hücre boyunca** işaretlenir. Gün kısaltması, tarih ve izin etiketi bu zemin içinde kalır. Bugün tüm hücreyi kapsayan ince çerçeveyle ayrıca ayrılır. Küçük açıklama üst/alt yarının anlamını belirtir.
- Görseldeki pazartesi/çarşamba/cuma sabah, salı/perşembe/cumartesi akşam, pazar izin planı **yalnız örnektir**; gerçek personele otomatik atanmaz. Vardiya başlangıç/bitiş saatleri verilmedi, uydurulmaz.
- Haftalık izin satırında örnek planlanan gün gösterilir; “kullanıldı” veya gerçekleşmiş devam bilgisi varsayılmaz. Bu, puantaj/gerçekleşmiş katılım takibi değildir.
- Mevcut modelde yalnız haftalık kullanılan/toplam izin sayısı olması, belirli bir izin günü veya günlük vardiya bilindiği anlamına gelmez. Uygulama öncesinde gün bazlı vardiya ve izin planının girileceği yer, tekrar/haftalık değişiklik davranışı ve kayıt modeli netleştirilmelidir. Maaş/izin kesintisi, devamsızlık veya otomatik finansal etki bu talepten türetilmez.
- Personel bilgileri ve aylık hakediş/ödeme grafiği bu görsel revizyonda korunur.

Görsel referans: [Personel çalışma takvimi ve vardiya taslağı](tasarimlar/personel-calisma-takvimi-vardiya-2026-11-17.png). Kullanıcı görseli henüz ayrıca onaylamadı; örnek tonlar ve üst/alt gösterim öneri olarak sunuldu.

### Personel — Tek vardiya vurgu rengi ve izinlerin yalnız takvimde gösterimi

**Kullanıcının son tasarım düzeltmesi; not/görsel aşaması sürer, kodlama ve yayın başlamaz.** Aşağıdaki kararlar önceki farklı sabah/akşam renk önerisini ve personel bilgileri altındaki ayrı haftalık izin satırını değiştirir.

- Sabah ve akşam vardiyası **aynı aktif vurgu rengini** kullanır; ayrı renk anlamı yoktur. Aktif yarı açık turkuaz, pasif yarı nötrdür. Aktif vurgu **üst yarıdaysa sabah**, **alt yarıdaysa akşam** anlaşılır. Küçük açıklamalar bu konumsal anlamı gösterir.
- Haftalık izin gününün tamamı sarı-turuncu uyarı zeminiyle işaretlenir.
- Yıllık izin ve hastalık izni mevcut **kırmızı vurgu** ve hafif kırmızı zeminle tüm gün hücresinde gösterilir. Aynı rengi kullanan bu iki izin türü kısa “Yıllık” / “Hastalık” etiketiyle ayrılır; devamsızlık veya hata olarak yorumlanmaz.
- İzin hücrelerinde aktif vardiya yarısı gösterilmez; gün kısaltması, tarih ve izin etiketi tek tam yüzeyde kalır. Bugün çerçevesi tüm hücreyi kapsar.
- **Personel bilgileri altındaki haftalık izin satırı kaldırılır.** İzinler takvimde gösterilir; aynı bilgi altta tekrarlanmaz.
- Bu tek renk kararı çalışma takviminin vardiya tonlarına aittir; aylık hakediş/ödeme grafiğindeki veri kategorilerinin renklerini değiştirmez.
- Örnek görselde cuma yıllık izin, cumartesi hastalık izni, pazar haftalık izin yalnız gösterim örneğidir; gerçek personele plan atanmaz. İzin saatleri, ücret kesintisi, hakediş etkisi, yıllık izin kotası veya puantaj davranışı bu görsel talebinden türetilmez. Gün bazlı vardiya/izin planının giriş ve kayıt modeli uygulama öncesi netleştirilmeyi bekler.

Yeni referans: [Personel tek vurgu renkli vardiya ve izin takvimi](tasarimlar/personel-calisma-takvimi-tek-vurgu-2026-11-17.png). Önceki vardiya görseli karar geçmişidir.

### Personel — Tasarım onayı ve tek satırlık lejant düzeltmesi

**Kullanıcı personelin son tasarımını, aşağıdaki lejant düzeltmesiyle onaylı değişiklik olarak kaydetmemizi istedi. Bu, yalnız tasarım/kapsam onayıdır; kodlamaya başlama veya yayın talimatı değildir. Yeni fikirler için not toplama aşaması sürer.**

- **Çalışma takvimi altındaki lejant tek satıra sığacak; iki satıra bölünmeyecek.** Sabah/akşam, haftalık izin, yıllık/hastalık ve bugün anlamları kısa etiketler ve küçük ortak sembollerle korunur. Örnek kısa etiketler: “Sabah”, “Akşam”, “Haftalık izin”, “Yıllık/Hastalık”, “Bugün”. Okunabilirlik ve üst/alt yarının anlamı korunur; anlamsız renk farkı veya metin taşması eklenmez. Görsel referanstaki iki satırlı lejantın yerine bu son karar geçerlidir.
- Tek aktif turkuaz / nötr pasif yarı; üst=sabah, alt=akşam; sarı-turuncu haftalık izin; kırmızı yıllık/hastalık; tüm hücreyi kapsayan bugün çerçevesi ve personel bilgileri altındaki izin tekrarının kaldırılması onaylı tasarım kapsamıdır.
- Son personel görselindeki diğer düzen, kompakt personel bilgileri ve aylık hakediş/ödeme görünümü tasarım olarak uygun bulundu. Önceki farklı vardiya renkleri ve ayrı haftalık izin satırı tarihsel önerilerdir, geri eklenmez.
- Bu onay müşterinin grafik ayrıntılarına veya henüz kararlaştırılmamış vardiya/izin giriş ve kayıt modeline otomatik olarak taşınmaz. Örnek günler/tutarlar gerçek veri değildir.
- Kod, paket, sürüm numarası ve yayın değiştirilmedi. Açık kodlamaya başlama talimatı beklenir.

## 17 Kasım 2026 — Takvim aç/kapat ve işlem ekleme ekranı için görsel alternatifler

**Not ve görsel keşif aşaması. Kullanıcı kodlamaya başlama talimatı vermedi.** Paylaşılan ekran/eskiz kesin tasarım kararı değildir; alternatifler hazırlanıp yorumlanacaktır. Görsel seçimi de tek başına kodlama/yayın talimatı sayılmaz.

### Takvim ikonu

- Takvimi açan aynı ikona tekrar basıldığında açık takvim kapanır; tetikleyici aç/kapat davranışı gösterir. Kapanışta odağın geri dönmesi takvimi yeniden açmaz.
- İşlem tarihi/vade için ilgili takvim kendi alanına bağlı kalır; ikinci tıklama formu kapatmaz ve kaydedilmiş tarihi temizlemez. Aralık/taslak iptal anlamı mevcut ilgili takvim kuralıyla korunur. Kullanıcı bu davranışı istedi; uygulama aşaması açık başlangıç talimatını bekler.

### İşlem ekleme — Kullanıcının tasarım kriterleri

- Opsiyonel özellikler açıldığında mevcut ana alanlar yerini ve boyutunu korur; ek alanlar için ayrı yer açılır. Alanlar birbirini yatay sıkıştırmaz, mevcut girişlerin konumu/ölçüsü yeniden dağıtılmaz.
- Tutarlı grid ve hizalar sürer. Tarih/saat gibi kompakt olabilen alanlar gereksiz yere genişlemez; metin ve açıklama gerçek ihtiyaca göre alan kullanır.
- Sade Netlik, Türkçe etiketler, mevcut finansal anlamlar ve kolay takip edilen giriş akışı korunur. Yeni bir işlem/hukuki alan veya muhasebe davranışı görselden türetilmez.
- Kullanıcı yenilikçi bir veri girişi yaklaşımına da açık; üç bağımsız görsel yön araştırılacak. İlk yön sabit ana şerit ve altta genişleyen grid; ikinci yön değişmeyen temel form ve ayrı iç ayrıntı sütunu; üçüncü yön işlem cümlesi/fişi ve isteğe göre eklenen alan grupları. Bunlar adaydır, henüz seçilmedi.
- Bu statik görseller etkileşim veya ekran kayması testinin yapılmış sayılması değildir; seçilen tasarım kodlama talimatından sonra ayrıca doğrulanır. Örnek tutar/tarih/hesaplar gerçek kayıt oluşturmaz.

### İşlem ekleme — Üç görsel aday, henüz seçim yok

Sohbette görüntülenen gerçek sıraya göre referanslar:

1. [Sabit ana şerit](tasarimlar/islem-ekleme-sabit-serit-2026-11-17.png): işlem/açıklama/tutar/kompakt tarih ve kaydet aynı şeritte; ayrıntılar aşağıda hizalı yeni satırda.
2. [Temel form ve ayrıntı sütunu](tasarimlar/islem-ekleme-ayrinti-sutunu-2026-11-17.png): ana alanlar solda sabit, isteğe bağlı alanlar formun kendi içindeki ayrılmış sağ bölgeye açılır; global sağ drawer değildir.
3. [İşlem cümlesi ve fiş](tasarimlar/islem-ekleme-islem-fisi-2026-11-17.png): sabit işlem/tutar/tarih çekirdeği, istenen ödeme/vade/belge/etiket gruplarıyla aşağı genişleyen yapı.

Bu üçü bağımsız tasarım adaylarıdır, aynı anda uygulanacak özellikler değildir. Kullanıcı tercih/düzeltme bildirecek. Seçim yalnız tasarım yönünü belirler; açık kodlamaya başlama talimatı olmadan kod, paket veya yayın işlemi yapılmaz. Görsellerdeki işlem tablosu örneklerinin sıralama/tarih/tutar detayları gerçek tablo davranışını değiştirme talimatı değildir. Statik görsel, alanların konumunun etkileşimde gerçekten sabit kaldığını kanıtlamaz; uygulama aşamasında ölçülmesi gerekir.

### İşlem ekleme — Önceki üç aday reddedildi; listenin sonunda yeni satır yönü

**Kullanıcı önceki üç işlem ekleme görselini seçmedi.** Sabit şerit, ayrıntı sütunu ve işlem fişi adayları uygulama referansı değildir; karar geçmişi olarak kalır. Yeni talep tek bir satır içi işlem ekleme alternatifinin görsel çalışmasıdır. Kodlama veya yayın başlangıç talimatı yoktur.

- Yeni işlem, listenin sonunda yeni bir satır açar; mevcut bir kayıt düzenleniyormuş gibi aynı tablo hücrelerinde sıfırdan doldurulur. Eski bir kaydın değerleri kopyalanmaz; görseldeki girilmiş örnekler taslak örneğidir.
- Ana alanlar mevcut **Tarih / Açıklama / Etiket / İşlem / Ekleyen / Tutar / Bakiye** sütun sırasıyla hizalanır. Ekleyen mevcut kullanıcı bilgisidir; kaydetmeden gerçekleşmiş bakiye değişikliği gösterilmez. Taslak ile kayıtlı hareket görsel olarak açık ayrılır.
- Seçilen opsiyonlara göre ek bilgi alanları yeni satırın alt satırlarında, aynı genişleyen yüzeyde ve tutarlı grid içinde açılır. Ayrı alt giriş paneli, modal veya işlem fişi bu yönün yerine kullanılmaz. Ana satırın alanları yer/boyut değiştirmez.
- Mevcut düzenleme alanındaki zorunlu değişiklik gerekçesi, **yeni kayıt oluşturma** alanına taşınmaz. İsteğe bağlı açıklama ve işleme bağlı zorunlu alanlar kendi anlamlarını korur.
- Tarih/saat kompakt; işlem türü ve etiket seçeneklerinin adları kesilmeden okunur. Tutarlar sağa hizalı ve Türkçe para biçimindedir; uzun açıklama için makul alan ayrılır.
- Kullanıcı görselin oran/orantı ve finansal okunaklılık açısından önce değerlendirilmesini istedi. Görselde ana tutar, şimdi ödenen, alıştan açık kalan borç ve varsa tahmini kayıt sonrası cari bakiye birbirine karıştırılmayacak. Taslak hesapları kesinleşmiş hareket gibi sunulmayacak.
- Kontrol örneği: mevcut tedarikçi cari bakiyesi −39.963,00 TL; yeni alış 12.500,00 TL; kısmi ödeme 2.500,00 TL; bu alıştan açık borç 10.000,00 TL; kayıt sonrası cari bakiye önizlemesi −49.963,00 TL. Kasa çıkışı 2.500,00 TL'dir; ikinci alış kaydı üretilmez. Örnek değerler gerçek finansal kayıt oluşturmaz.
- Statik görsel yalnız tasarım değerlendirmesidir; veri bağlama, kaydırma, yeni satırın görünür olması, sıralama/filtreyle etkileşimi uygulama aşamasında ayrıca netleştirilip test edilir.

### Satır içi yeni işlem — Görsel ve okunaklılık değerlendirmesi

Yeni aday: [Listenin sonunda yeni işlem satırı](tasarimlar/islem-ekleme-liste-sonu-yeni-satir-2026-11-17.png). Bu son görsel, aynı turdaki ara taslakların yerini alır; henüz kullanıcı tarafından onaylanmadı. Önceki üç alternatif reddedilmiş olarak kalır.

- İki kayıtlı hareketten sonra en sonda yeni taslak satır, tüm alt alanları kapsayan tek hafif turkuaz yüzey ve sol işaretle gösterildi. Kaydedilmemiş Bakiye hücresinde sayısal gerçekleşmiş bakiye yerine tire ve “Kaydedilmedi” var.
- İlk görsel kendi içinde incelendi: alış/ödeme/kalan borç hesabı tutarlıydı; ancak vade alanı fazla geniş, ek ödeme tutarı sola hizalı ve belge/saat satırı üst gridle uyumsuzdu. Son revizyonda para girişi sağa hizalandı, belge ve saat üst alanların hizalarına alındı, belge/tarih/saat kontrolleri daha sınırlı boyutla gösterildi.
- Görselde işlem türü ve etiket metinleri kesilmeden, tutarlar tam ve sağa hizalı gösterilir; açıklamaya ayrı alan ayrılır. Ana kalemler mevcut tablo sütunları sırasındadır. Tarih/saat kompakt tutulması ve sütun hizalarının gerçek ekran genişliğinde ölçülmesi uygulama kabul koşuludur.
- Finansal kontrol: 12.500,00 TL alış − 2.500,00 TL şimdi ödeme = 10.000,00 TL açık borç; −39.963,00 TL mevcut cari bakiye − 10.000,00 TL yeni net borç = −49.963,00 TL yalnız **önizleme**. Kaydetmeden gerçek hareket/bakiye güncellenmez. Yeni işlem olduğu için değişiklik gerekçesi alanı yoktur.
- Görsel örnek değerlerle doldurulmuş bir yeni taslağı gösterir; “yeni satır açınca eski kayıt değerleri kopyalansın” anlamına gelmez.
- Bu değerlendirme statik görsel okumasıdır; ekran boyutu, etkileşimde sabit alan ölçüleri, klavye/odak ve mobil davranış test edilmiş sayılmaz. Yalnız not ve görsel kaydı yapıldı; kodlama/commit/push/paketleme/yayın yapılmadı.

### Satır içi yeni işlem — Varsayılan kapalı ek bilgiler ve alanların görsel yenilenmesi

**Not/görsel revizyon aşaması; kodlama veya yayın talimatı yoktur.** Kullanıcı mevcut satır içi taslağı henüz tam uygun bulmadığını söyledi; yeni düzeltmelerle geliştirme istiyor.

- **Ek bilgiler yeni işlemde varsayılan olarak kapalı gelir.** Ödeme/vade/belge/saat gibi ek alanlar ilk açılışta sergilenmez. Açılıp kapanması ana satırdaki alanları yeniden dağıtmaz; kapanış girilmiş değerleri kendiliğinden temizleme anlamına gelmez.
- Kullanıcı giriş alanları ve dropdown menülerini eski görünümlü buldu. Sade Netlik korunarak daha hafif, modern, anlaşılır düzenlenebilir hücreler ve okunaklı seçim listeleri için görsel revizyon yapılır. Görsel yenileme tarih/tutar/işlem anlamlarını değiştirmez.
- Kullanıcının çizdiği sınır, **giriş alanlarının Tutar sütunu sınırında bitmesi; sağdaki bakiye/eylem bölgesine taşmaması** olarak yorumlandı. İptal/kaydet, çizimdeki X ve onay ikonlarıyla sağda ayrı bir alanda önerilir. Bu yorum görsel üzerinden değerlendirilecek; bağımsız yeni bir muhasebe sütunu ekleme kararı değildir.
- Tarih/etiket/işlem tetikleyicileri kompakt; açıklama için yeterli alan ve para girişi için sağ hizalı net tipografi. Odak görünür, eylemler anlaşılır; yalnız modern görünmek için gereksiz animasyon/gölge veya okunaksız kutusuz alan eklenmez.
- Yeni işlem görüntüsü boş başlangıç durumuyla hazırlanabilir: tarih/ekleyen gibi mevcut varsayılanlar dışında eski kayıt değerleri taşınmaz, tutar henüz girilmemişken sayısal bakiye önizlemesi uydurulmaz. Bu revizyon için eski örnekteki kısmi ödeme varsayılan kabul edilmez.
- Açık bir dropdown örneği, ek bilgilerin açık olduğu anlamına gelmez. Önerilen özel seçim görünümü şimdilik yalnız taslaktır; gerçek klavye/odak/erişilebilirlik davranışı uygulanmış veya test edilmiş sayılmaz.

### Satır içi yeni işlem — Hafif hücreler, kapalı ek bilgiler ve ayrı ikon alanı görseli

Yeni aday: [Modern satır içi giriş, ek bilgiler kapalı](tasarimlar/islem-ekleme-satir-ici-modern-kapali-2026-11-17.png). Henüz onaylı nihai tasarım değildir. Aynı turdaki ara görüntü yerine son revizyon referans alınır.

- Boş başlangıç durumunda açıklama/tutar girilmemiş, işlem seçilmemiş örnek gösterildi; kaydet ikonu gerekli alanlar tamamlanana kadar pasif görünümdedir. Bakiye hücresinde taslak işareti vardır, sayısal bakiye önizlemesi uydurulmaz.
- Geleneksel kalın kutular hafif düzenlenebilir hücrelerle, kompakt tarih ve seçim tetikleyicileriyle yenilendi. Tutar odağı ince turkuaz çerçeveyle görünür; metin/para okunaklılığı korunur. İşlem menüsü ayrı hizalı seçenek listesi örneğidir; açık menü, varsayılan kapalı Ek bilgiler durumunu değiştirmez.
- Sağda, tutar alanının sınırını aşmayan iptal X ve kaydet onay ikonu bölgesi önerildi; büyük metin düğmeleri bu görsel adayda yoktur. İkonların gerçek uygulamada erişilebilir adları, odak ve klavye davranışı gerekecektir. Bunların çalıştığı iddia edilmez.
- Görsel kontrolde menü için oluşan gereksiz beyaz ara alan fark edildi; revizyonda menü, önceki kayıtların üzerine açılan katman olarak ele alındı. Gerçekte satırların/panelin kaymaması ve kayıtlar arasına boşluk eklenmemesi, uygulama aşamasında ayrıca ölçülmesi gereken koşuldur; statik görsel etkileşim testi değildir.
- Kullanıcının ek bilgiler kapalı gelsin talebi kaydedildi; giriş/dropdown stili ve sağdaki ikon düzeni yorum bekleyen görsel öneridir. Kodlama, commit/push, paketleme ve yayın yapılmadı.

## 17 Kasım 2026 — Açık uygulama ve GitHub yayın talimatı

Kullanıcı son satır içi tasarımı onayladı ve “düzenleme ekranını da buna göre tasarlıyorsun ve aldığımız son notlarla birlikte yeni sürümü kodlayıp githuba yüklüyorsun” talimatını verdi. Biriken son kararlar 1.25.0 kapsamında uygulanır. Önceki not/görsel aşaması ifadeleri karar geçmişidir.

- Yeni işlem ve düzenleme aynı modern satır içi dili kullanır; ek bilgiler başlangıçta kapalıdır. Ana sütunlar sabit kalır; bakiye sütunu kaydet/iptal eylemlerine ayrılır. Yeni işlem gerekçe istemez, düzenleme gerekçesi korunur.
- Tedarikçi, müşteri ve personel için son takvim/bilgi/aylık özet kararları, arama kapanışı ve takvim tetikleyicisinin aç/kapat davranışı uygulanır.
- Personel planı cari düzenlemede tarih bazında girilir; başka haftaya otomatik tekrar etmez. Girilmeyen günlere vardiya atanmaz. Planın ücret/puantaj etkisi yoktur. Mevcut haftalık izin sayıları korunur, gün planı diye yorumlanmaz.
- Aylık oranlar yalnız seçilen ayın gerçekleşmiş kayıtlarına ve mevcut açık kalem eşleştirme kuralına dayanır. Ay dışında oluşmuş borç tahsilatı/ödemesi ayrıca gösterilir; halka toplamına zorla eklenmez. Orana sığmayan iade/mahsup açıkça ayrı gösterilir.
- Şema 12 korunur; profil JSON alanı doğrulanarak genişletilir. Gerçek veriler ve yapılandırma değiştirilmez.
- Kaynak ve yeni GitHub Release yayımlanır; hostinge hazır ZIP + SHA-256 depoya eklenir. Hosting yüklemesi/incelemesi kullanıcıya aittir.

### 1.25.0 son etiket menüsü kontrolü

Varsayılan Genel etiketi diğer seçenekleri gizlememelidir. Okla açıldığında tüm etiketler, yazarken eşleşenler gösterilir; aynı oka ikinci tıklama kapatır. Etiket ve işlem türü menüleri klavyeyle de seçilir. Bu, yetkilendirilen modern satır içi formun doğrulama düzeltmesidir.

### 1.25.1 son aylık özet doğrulaması

Seçili ayda açılış bakiyesine karşı yapılan ödeme/tahsilat, devreden / önceki dönem borcuna ait satıra dahil edilir. Bu, mevcut yetkilendirilmiş aylık rapor kapsamının doğruluk düzeltmesidir. Yeni hareket veya bakiye değişikliği oluşturmaz.

### Yayın tamamlandı — 1.25.1

Son onaylı tasarım/not kapsamı 1.25.0 ve doğruluk düzeltmesi 1.25.1 olarak GitHub'da yayımlandı. Son sürüm 1.25.1'dir. Windows/Linux yayın kabulü ve indirilen ZIP/checksum eşliği doğrulandı; hosting paketi `releases/1.25.1/` içindedir. Hosting yüklemesini kullanıcı yapar. Bundan sonraki talepler yeni not olarak toplanır; açık uygulama talimatı olmadan kodlama/yayın başlatılmaz.

## 18 Kasım 2026 — 1.25.1 boş sayfa bildirimi

**Yeni hata kaydı ve analiz aşaması; açık kodlama/yayın talimatı verilmedi.**

- Kullanıcı 1.25.1 yüklemesinde boş sayfa geldiğini, 1.25.0'a dönünce düzeldiğini bildirdi. Kullanıcının çalışan kurulumu şu anda kendi beyanına göre 1.25.0'dır. Önceki test/yayın kabulü bu gerçek kurulum bildirimini geçersiz kılmaz.
- Yerel repo hosting ZIP'lerinin SHA-256 değerleri kendi checksum dosyalarıyla eşleşiyor. Her iki ZIP'in index.html dosyasındaki JavaScript/CSS referansları ilgili arşivde mevcut. İki sürümün paketlenmiş PHP dosyaları birebir aynı.
- 1.25.0 JavaScript dosyası `assets/index-CAYi46j4.js`, 1.25.1 dosyası `assets/index-Ej-lEohi.js`; CSS dosyası iki sürümde de `assets/index-DXkARMTf.css`. Kaynak farkı devreden borç sınıflandırması, açıklama metni ve sürüm bilgisidir. Bunlar tek başına boş sayfanın kesin nedenini kanıtlamaz.
- Kesin teşhis için boş sayfanın giriş ekranından önce mi, girişten sonra mı oluştuğu ve tarayıcı konsolundaki ilk hata metni gerekir. Eksik/engellenen JS yüklemesi, önbellek veya çalışma zamanı hatası henüz ayırt edilmedi; neden kesinmiş gibi sunulmaz.
- Uygulama kodu, paket ve GitHub yayını değiştirilmez; hosting bağlantısı/yükleme/incelemesi kullanıcıya aittir. Yeni uygulama için açık talimat beklenir.

## 18 Kasım 2026 — Personel ekranı için tasarım değerlendirmesi

**Kullanıcı paylaştığı ekranın görünümü hakkında görüş istedi. Bu bölüm öneridir; tasarım seçimi, kodlama veya yayın onayı değildir. Önceki 1.25.1 boş sayfa bildirimi ayrı ve henüz çözümlenmemiş olarak korunur.**

Kanıt yalnız bu mesajda paylaşılan personel ekranı görüntüsüdür. Canlı hosting'e bağlanılmadı; klavye, odak, menü etkileşimi veya mobil davranış bu görüntüden doğrulanmış sayılmaz. Ekrandaki kişisel bilgiler ve işlem tutarları bu belgeye aktarılmaz.

### Görüntüde görülen sorunlar

- Satır içi girişte ana alanlar ve sağdaki taslak/kaydet/iptal grubu ortak bir görsel çizgi kurmuyor. Ek bilgiler açıldığında büyük boşluklar ve ayrı bloklar ortaya çıkıyor.
- Maaş işleminin açıklama metni ek alan gridinde bir alan yerini işgal ediyor; vade/saat/belge alanları düzensiz görünüyor. Tarih ve saat gereğinden geniş, belge alanı tek başına alt satırda kalıyor.
- Takvimde plan gösterilmediği halde çok küçük ve yoğun bir lejant yer kaplıyor; personel bilgileri, plan ve aylık özetin görsel öncelikleri zayıf.
- Tek hakediş kategorisi ve sıfır değerli ikinci kategoriyle iki halka tekrar yaratıyor; grafik kart içinde baskın görünüyor.
- Listede ödeme/avans görünmesi ile grafikte ödenen tutarın sıfır görünmesi arasında kullanıcıya açıklanması gereken bir ilişki olabilir. Ekran görüntüsü ödeme bağlantılarını göstermediğinden hesap hatası kesinleştirilemez; otomatik mahsup ya da tahmin önerilmez.

### Henüz onaylanmamış tasarım önerisi

- Satır içi ekleme/düzenleme yapısı ve kayıt sütunları korunur. Ana alanlar aynı yükseklik ve çizgide, tutar ile sağ eylemler dengeli yerleşir. Açıklama alanı esnek; tarih, etiket ve işlem türü ihtiyacına uygun ölçüdedir.
- Ek bilgiler, ana alanların yerini/ölçüsünü değiştirmeden altta düzenli bir satır açar. Vade ve saat kompakt; belge alanı gerçek metin ihtiyacı kadar geniştir. Maaşla ilgili açıklama tam satırlık kısa yardımcı not olur, gridde bir giriş alanının yerini almaz.
- Ek bilgiler kapalı başlar; aynı ölçü/kenarlık/yazı dili bütün girişlerde paylaşılır. Okunabilirlik korunarak gereksiz yükseklik ve boşluk azaltılır.
- Plan olmayan takvimde açık bir boş durum açıklaması önerilir; lejant yalnız anlam taşıdığı durumda gösterilir. Gün bazlı plan ve izinlerin mevcut anlamı korunur.
- Aylık özette grafik küçültülüp tutar/ödeme bilgileriyle dengelenir. Tek hakediş türünde tek halka, birden fazla türde ince dış halka kullanımı ve sıfır değerli kategori satırlarını gizleme değerlendirilir; önceki iki halka kararı kullanıcı onayı olmadan değiştirilmez.
- Ödeme bağlantısı eksikse “Ödeme bağlantısı tanımlanmamış” gibi açık bir durum gösterilir; belirsizlik kesin ödenmemiş borç gibi sunulmaz. Mevcut ay/kalem bağlantıları incelenmeden hesaplama kararı alınmaz.

Yalnız not düzenlendi. Uygulama kodu, paket, sürüm ve GitHub yayını değiştirilmedi.

## 18 Kasım 2026 — Satır çizgisi, metin hizası, etiket ve tarih davranışı

**Kullanıcının son tasarım gereksinimleri kaydedildi; kodlamaya başlama/yayın talimatı verilmedi.** Bu mesaj önceki genel tasarım önerilerinin tamamına onay sayılmaz. 1.25.1 boş sayfa kaydı ayrıca açık kalır.

### Aktif satır çizgisi ve yazı hizaları

- Aktif satırın sol vurgu çizgisi, ek bilgiler hizasında kaymadan, kalınlık/konum değiştirmeden kesintisiz devam eder. Ek bilgiler açılıp kapandığında çizgi yer değiştirmez.
- Veri giriş metinleri, aynı sütundaki kayıtlı metinlerin başlangıç çizgisi ve dikey hizasına oturur. Referans kutunun dış kenarı değil, içindeki metindir. Tutarın sağ hizası ve TL biriminin yerleşimi de birlikte değerlendirilir.
- Kaynak incelemesinde normal hücrelerin ortak yatay boşluğuna ek olarak girişlerin kendi 8 px iç boşluğu ve 1 px kenarlığı olduğu görüldü. Bu, metinlerin sağa kaymış görünmesi için somut bir etkendir; canlı tarayıcıda ölçülmüş kesin piksel farkı olarak sunulmaz.
- Sol vurgu şu anda ana satırın ilk hücresine ve ayrı ek bilgi satırının birleşik hücresine ayrı ayrı çiziliyor. Çizgi birleşimi ortak bir referansla düzenlenir; kesin kayma nedeni ve koordinatlar uygulama aşamasında gerçek tarayıcı ölçümüyle doğrulanır.
- Hizalama düzeltmesi ek bilgiler açılınca ana sütunların yerini/boyutunu değiştirmez. Yeni işlem ve satır içi düzenleme aynı metin hizalarını paylaşır.

### Etiket yazma ve seçim

- Kullanıcı oka basarak seçimde sorun olmadığını; yazmak için tıklayınca hazır Genel metnini önce silmek zorunda kaldığını bildirdi.
- Yeni işlemde Genel gerçek, silinmesi gereken giriş metni yerine boş alandaki yer tutucu olarak gösterilir. Kullanıcı doğrudan yeni etiketini yazar; girilen metin Genel sözcüğüne eklenmez.
- Hiç etiket girilmezse mevcut Genel varsayılanı korunur. Açılır listeden seçim çalışmayı sürdürür. Genel açıkça seçilmişse bir seçim olarak korunur.
- Mevcut bir işlem düzenlenirken kayıtlı etiket odağa girildi diye silinmez. Üzerine yazmayı kolaylaştırmak için ilk odakta metnin tamamını seçme davranışı önerilir; yazmadan çıkılırsa mevcut değer korunur.
- Yazma, liste seçimi, klavye seçimi ve taslak koruması aynı etiketi yönetir; ek bir silme adımı gerekmez.

### İşlem tarihi — ikonla başla, seçilince metne dönüş

- Yeni işlemde başlangıçta yalnız takvim ikonu görünür; yanında bugünün tarih metni bulunmaz.
- Kullanıcı takvimden tarihi seçince ikon kaldırılır, tarih üstteki kayıtlı hücreler gibi sade metin görünümünde gösterilir. Tarih bir giriş kutusu/rozet görünümü almaz.
- Tarih metninin kendisi tıklanabilir ve yeniden takvimi açar. Yeni bir tarih seçilince metin güncellenir. İkon ve tarih aynı anda gösterilmez.
- Bugün tarihi takvimden açıkça seçilirse de metin görünümüne geçilir. Yalnız takvimi açıp kapatmak veya Escape ile çıkmak seçim yapılmış sayılmaz.
- Yeni işlemde henüz takvim kullanılmadıysa mevcut uygulama bugünü varsayılan işlem tarihi olarak koruma önerisi geçerlidir; görsel sadeleştirme kendiliğinden işlem tarihini değiştirmez veya alanı zorunlu boş hale getirmez. Bu varsayım kullanıcı başka bir tarih kuralı belirtirse yeniden değerlendirilir.
- Mevcut işlem düzenlenirken kaydın tarihi zaten seçili olduğundan baştan sade, tıklanabilir tarih metni gösterilir. Tarih biçimi listeyle tutarlı ve okunaklıdır; saat bu alana ayrıca eklenmez.
- Sade metin görünümü etkileşimi kaldırmaz: klavyeyle erişim, görünür odak, erişilebilir ad ve yeterli tıklama alanı korunur. Takvim alana bağlı açılır; tekrar tıklama kapanışı sürer.
- Bu karar cari satır içi işlem tarihi alanına aittir; vade ve diğer takvim alanlarına otomatik kapsam genişletme yapılmaz.

Yalnız belge güncellendi. Uygulama kodu, sürüm, paket ve GitHub yayını değiştirilmedi.

## 18 Kasım 2026 — Koşullu ek bilgiler, birleşik tarih/saat ve maaşla ödeme

**Kullanıcının yeni gereksinimleri notlara alındı. Bu, kodlamaya başlama veya GitHub yayın talimatı değildir.** Önceki hizalama/etiket/tarih kararları korunur. 1.25.1 boş sayfa bildirimi ayrıca açık kalır. Paylaşılan ekrandaki kişisel bilgiler ve işlem tutarları belgeye kopyalanmaz.

### İşlem seçilmeden ek bilgiler görünmez

- Yeni işlemde bir işlem türü seçilene kadar Ek bilgiler başlığı, açma/kapatma kontrolü ve içeriği tamamen görünmez. Yalnız pasifleştirilmiş bir bölüm olarak ekranda bırakılmaz; boş alan da ayırmaz.
- İşlem seçildikten sonra yalnız o işlem türüne ait alanlar kullanılabilir hale gelir. Ek bilgiler önceki karara uygun biçimde kapalı başlar. Türün ek alanı yoksa boş başlık gösterilmez.
- İşlem seçimi kaldırılırsa ek bilgiler yeniden gizlenir. Tür değiştirilirken artık geçerli olmayan alanların finansal kayda sızması önlenir; ortak geçerli alanlar sebepsiz sıfırlanmaz.
- İşlem seçilmeden kaydetme etkinleşmez; açıklama/tutar gibi önceden girilmiş ana alanlar sırf bölümün gizlenmesiyle silinmez. Ek bilgiler açılınca ana satırın konumu ve ölçüleri korunur.

### Tarih ve saat aynı takvim penceresinde

- İşlem saati alanı ek bilgilerden kaldırılır; işlem tarihinin açtığı takvim penceresine taşınır. Tarih ve saat aynı yerde düzenlenebilir.
- Tarih seçiminin pencereyi saat düzenlemeye fırsat vermeden kapatması engellenir; birleşik tarih/saat akışında kullanıcı iki değeri de tamamlayabilir. Kesin onay/kapanış sunumu tasarımda değerlendirilir.
- Önceki ana satır görünümü korunur: yeni işlemde yalnız takvim ikonu; açık tarih seçiminden sonra yalnız sade, tıklanabilir tarih metni. Saat ana satırda yeni bir metin/kutu olarak eklenmez.
- Yeni işlemde saat kullanıcı tarafından değiştirilmediyse kayıt anındaki güncel uygulama/sistem saati kullanılır; formun ilk açıldığı saatte donup kalmaz. Uygulamanın mevcut saat dilimi ve zaman hassasiyeti korunur. Seçilen işlem tarihi kendiliğinden değiştirilmez.
- Kullanıcının açıkça girdiği saat korunur. Mevcut kayıt düzenlenirken saate dokunulmadıysa geçmiş kayıt saati güncel saatle üzerine yazılmaz.
- Tarih/saat taslağı, odak, klavye, tekrar tıklamayla kapatma ve kaydedilmemiş değişiklik koruması birlikte değerlendirilir.

### Personelde belge / fatura no alanı kaldırılır

- Personel carisinin bütün işlem türlerinde ekleme/düzenleme formundan Belge / fatura no alanı kaldırılır; yalnız Maaş Ekle ile sınırlı değildir.
- Daha önce kaydedilmiş belge bilgileri bu arayüz değişikliği nedeniyle silinmez. Diğer cari türlerinin belge alanları bu kararla kaldırılmaz.

### Maaş Ekle — ödeme kaynağı ve tutarı

- Maaş Ekle seçildiğinde ek bilgilerde yan yana iki ödeme alanı bulunur: ödeme kaynağı seçimi ve ödenen tutar.
- Birinci alanın başlangıç seçeneği tam olarak **Ödeme yapılmadı** olur. İkinci alan bu durumda pasiftir; maaş hakedişi kaydedilir, hesaptan para çıkışı ve sıfır tutarlı ödeme kaydı oluşmaz.
- Birinci alandan uygun ödeme hesabı (kasa/banka) seçilince ikinci alan etkinleşir ve maaş tutarının tamamıyla otomatik dolar. Ödeme yapılmadı tekrar seçilirse ödeme alanı pasife döner; görünmeyen eski tutar kayda gönderilip ödeme oluşturmaz.
- Ödenen tutar maaşa eşitse tam ödeme; sıfırdan büyük ve maaştan küçükse kısmi ödeme kabul edilir. Sıfır için gerçek ödeme oluşturulmaz; negatif veya maaşı aşan ödeme bu akışta kabul edilmez.
- Tam ödeme tutarı kullanıcı tarafından ayrıca değiştirilmemişken maaş tutarı değişirse tam ödeme alanı yeni tutarı izler. Kullanıcı kısmi tutarı elle girdiyse maaş alanı değişince bu seçim sessizce ezilmez; sınır doğrulaması yapılır.
- Maaş hakedişi brüt tutarıyla korunur; seçilen hesaptan yalnız fiilen ödenen tutar çıkar. Bu maaştan kalan borç = hakediş − ödeme. Önceki personel borcu/avansı kendiliğinden bu kayıtla mahsup edilmez.
- Ödeme bu maaşa ve ilgili hakediş dönemine açıkça bağlanır; aylık özette bir kez sayılır. Yeni maaş içinden girilen ödeme için kullanıcıdan ikinci bir ödeme kaydı veya ayrıca elle bağlantı seçmesi beklenmez. Açıklama metninden maaş ayı tahmin edilmez.
- Hakediş ve ödeme tek kaydetme eyleminde birlikte tamamlanır; hata halinde yarım kayıt bırakılmaz. Yinelenen gönderim aynı ödeme/hakedişi çoğaltmaz. Kaynak incelemesinde mevcut maaş yolunun peşin ödeme tutarını sıfırladığı görüldü; bu yüzden yalnız iki arayüz alanı eklemek yeterli değildir. Kayıt, hesap etkisi, dönem bağlantısı, aylık özet ve düzenleme/iptal tutarlılığı uygulama sırasında birlikte ele alınmalıdır.
- Teknik kayıt biçimi bu notta seçilmedi: mevcut modele uygun bağlı ödeme ya da tek işlem içindeki ödeme bilgisi değerlendirilir. Kullanıcıya görünen sonuç bir hakediş ve yalnız bir gerçek ödeme etkisidir. Düzenlemede mevcut ödeme ilişkileri varsayılan alan değerleri yüzünden silinmez veya yeniden oluşturulmaz; finansal değişiklik gerekçesi korunur.
- Örnek (temsili): 30.000 TL maaş, seçili hesaptan 10.000 TL ödeme → bu maaştan 20.000 TL borç; hesaptan 10.000 TL çıkış; ilgili aylık özette 10.000 TL ödenen. Bu örnek gerçek kayıt verisi değildir.

Yalnız notlar güncellendi. Uygulama kodu, sürüm, ZIP ve GitHub yayını değiştirilmedi.

## 18 Kasım 2026 — Cari dizini sütun başlığının geçişlerde kararsız görünmesi

**Yeni hata/düzeltme gereksinimi kaydedildi; açık kodlamaya başlama ve yayın talimatı verilmedi.**

- Kullanıcı sayfa yenilenirken ve Cari hesaplar bölümüne girip çıkarken Cari / Tür / Net bakiye başlık satırının kaybolup geri göründüğünü bildirdi. Hedef ana sayfa başlığı veya üst bakiye özet kutusu değil, cari listesinin sütun başlıklarıdır.
- Uygulama/listenin görünür yükleme sürecinde sütun başlığı aynı konum, yükseklik ve genişlikte kalmalı; veri beklenirken ayrıca gizlenip geri gelmemeli. Başlığın kaybolmasıyla alt satırlar ve panel yüksekliği sıçramamalı.
- Başlık, veri satırlarının yükleme/boş sonuç durumundan ayrılır. Liste yüklenirken, arama yapılırken ve sonuç boşken başlık/sıralama kontrol alanı korunur. Gerçek tarayıcı yenilemesinin belgeyi yeniden yüklemesi ile uygulama içindeki gereksiz görünürlük/yerleşim değişimi ayrıştırılır.
- Yükleme göstergesi başlığın üstüne sonradan satır ekleyip çıkarmamalı; mevcut arama/araç alanında aynı ölçüler içinde veya baştan ayrılmış bir alanda sunulmalı.
- Kaynak incelemesinde `.party-column-head` dizin içinde koşulsuz oluşturuluyor. Bunun üzerinde `searching` durumunda ayrı bir Aranıyor satırı eklenip kaldırılıyor; ayrıca başlık için birden fazla responsive görünürlük kuralı var. Bunlar incelenecek somut noktalar; bildirilen kaybolmanın kesin nedeni henüz tarayıcıda yeniden üretilmedi.
- Bu talep kaydırmada yapışkan başlık ekleme talimatı değildir. Mevcut Cari / Tür / Net bakiye sırası, hizalar, sıralama işlevi ve etkin yön oku korunur.
- Uygulama aşamasında ilk yükleme, yenileme, liste/detay arasında gidip gelme, geri/ileri gezinme, yavaş ağ, boş sonuç ve mevcut dar ekran/menü durumları izlenerek başlığın görünürlük ve koordinat kararlılığı doğrulanır. Yeni animasyonla sorun örtülmez.
- Önceki 1.25.1 boş sayfa bildirimiyle aynı nedene dayandığı varsayılmaz; o kayıt ayrıca açık kalır. Paylaşılan görseldeki kişisel bilgiler ve işlem tutarları belgeye aktarılmaz.

Yalnız not belgesi güncellendi. Uygulama kodu, sürüm, ZIP ve GitHub yayını değiştirilmedi.

## 18 Kasım 2026 — iOS hissine yakın yumuşak sayfa geçişleri

**Kullanıcı geçişlerin bir anda değişmek yerine gözle takip edilebilmesini istedi; özellikle cari liste → cari detay geçişini belirtti. iOS yaklaşımının/sürelerinin incelenmesi istendi. Bu, kodlamaya başlama veya yeni yayın talimatı değildir.** Süre ve hareket önerileri aşağıda ayrı belirtilmiştir; kullanıcı tarafından henüz seçilmiş sayılmaz.

### Kaynak kontrolü

18 Kasım 2026 tarihinde Apple'ın resmî dokümantasyonu incelendi:

- [Human Interface Guidelines — Motion](https://developer.apple.com/design/human-interface-guidelines/motion): anlamlı, kısa ve yönü tutarlı hareket; gereksiz tekrar/bekleme eklememe; erişilebilirlik tercihlerini gözetme ve hareketin kullanıcıyı engellememesi öneriliyor. Bu sayfada bütün iOS sayfa geçişlerine uygulanacak tek bir sabit milisaniye değeri verilmiyor.
- [SwiftUI — Animation.default](https://developer.apple.com/documentation/swiftui/animation/default): güncel varsayılan `spring(response: 0.55, dampingFraction: 1.0, blendDuration: 0.0)` olarak açıklanıyor; iOS 17 öncesinde `easeInOut` olduğu belirtiliyor. Bu genel SwiftUI animasyon tanımıdır; bütün yerel gezinme geçişlerinin süresinin 550 ms olduğu anlamına gelmez.
- [UIKit — transitionDuration](https://developer.apple.com/documentation/uikit/uiviewcontrollertransitioncoordinatorcontext/transitionduration): ilgili geçişin etkileşimsiz beklenen süresini o geçiş bağlamından veren özelliktir. Web uygulamasında iOS'un gerçek gezinme motoru doğrudan kullanılmış/ölçülmüş sayılmaz.
- Gerçek iPhone üzerinde süre veya hareket eğrisi ölçülmedi. Aşağıdaki 350 ms değeri Apple'ın zorunlu standardı ya da cihazda ölçülmüş sayı olarak sunulmaz.

### Mevcut kaynak gözlemi

- `src/styles/motion.css` içinde sayfa yüzeyleri için 160 ms `quiet-enter` solması tanımlı. Bu gözlem, her liste/detay değişiminde animasyonun gerçekten yeniden çalıştığını kanıtlamaz; geçişin doğru gezinme olayıyla tetiklenmesi ayrıca değerlendirilmelidir.
- Menü/panel ve sayfa geçişleri aynı kapsam değildir. Bu talep bütün etkileşim sürelerini topluca artırma talimatı değildir.

### Henüz onaylanmamış başlangıç önerisi

- Cari liste → detay için yaklaşık **350 ms**; küçük yatay hareket (örneğin 16–24 CSS px) ve yumuşak solma. Hızlı başlayan, duruşta yavaşlayan, gözle takip edilebilir bir hareket önerilir. Sallanma/zıplama etkisi eklenmez.
- Detay → liste dönüşü aynı yaklaşık süre ve ters yönle ilişkiyi anlatır. İleri/geri tarayıcı gezinmesinin yönü de korunur.
- Sol menü ve üst gezinme çubuğu yerinde kalır; hareket ilgili içerik bölgesinde olur. Satırlar ve kartlar ayrı ayrı geciktirilerek sırayla gelmez.
- Veri isteği animasyonla birlikte başlayabilir; yalnız süreyi doldurmak için yapay bekleme, boş beyaz kare veya yükleme perdesi eklenmez. Yavaş veri durumunda önceki içerik ya da yerleşimi korunmuş yükleme görünümü kullanımı değerlendirilir.
- Hızlı tekrar tıklamada animasyonlar kuyruk oluşturmaz; kullanıcı hareket bitene kadar gereksiz kilitlenmez. Çıkmakta olan ekran ikinci bir kayıt işlemi başlatamaz. Taslak terk etme onayı varsa gezinme/geçiş bu onaydan sonra başlar.
- Kaydırma konumu ve klavye odağı korunur/uygun hedefe aktarılır; geçiş sırasında ekran genişliği ve başlık yükseklikleri sıçramaz.
- Hareketi azaltma sistem tercihi (`prefers-reduced-motion`) korunur; bu tercihte kaydırma kaldırılır ve mevcut erişilebilir hareketsiz davranış sürer.
- Arama sonucu, bakiye güncellemesi veya aynı sayfadaki her veri yenilemesi yeniden sayfa geçişi oynatmaz. Sayfa yenilenirken gereksiz ilk açılış animasyonu ayrıca değerlendirilir.
- Önceki Cari / Tür / Net bakiye başlığı kararsızlığı ayrı düzeltilmelidir. Animasyon bu kaybolmayı/yerleşim sıçramasını örten bir yöntem olarak kullanılmaz.
- 350 ms ve hareket mesafesi, kodlama yetkisi geldikten sonra çalışan masaüstü/dar ekran akışında değerlendirilip gerekirse ayarlanacak başlangıç önerileridir.

Yalnız araştırma ve not düzenlemesi yapıldı. Uygulama kodu, sürüm, paket ve GitHub yayını değiştirilmedi. Önceki hata ve gereksinim kayıtları korunur.

## 18 Kasım 2026 — Zorunlu alanlara göre ek bilgilerin açılışı ve dikkat vurgusu

**Yeni tasarım gereksinimi kaydedildi; kodlama/yayın talimatı verilmedi. Açık/kapalı davranışındaki terim belirsizliği için kullanıcıdan netlik bekleniyor.**

### Açık kullanıcı talepleri

- Ek bilgilerin başlangıçta açık/kapalı olması seçili işlem türüne bağlı olmalı; bütün işlemlere tek bir başlangıç durumu uygulanmamalı.
- Seçili işlemin ek bilgilerinde doldurulması gereken zorunlu alan yoksa bölüm kapalı başlamalı.
- Kullanıcı zorunlu alanların çerçevelerinde kısa süreli bir parlama/vurgu ile hangi alanların doldurulacağını fark etmek istiyor.
- Önceki karar korunur: işlem türü seçilmeden Ek bilgiler başlığı ve içeriği görünmez.

### Netleştirilecek ifade

Kullanıcı, zorunlu alan varsa “collapse edilmiş olarak gelsin” dedi. Collapse terimi kapalı/daraltılmış anlamına gelir; ancak açıklamanın bütünü zorunlu alanların görünmesi ve dikkat çekmesi yönündedir. Bu nedenle zorunlu alan varken otomatik **açık/genişletilmiş** başlama yorumu henüz kesin onay olarak kaydedilmez. Kullanıcıya bu anlam sorulur. Önceki bütün işlemlerde kapalı başlatma kararı, bu son talebin netleşen kapsamına göre güncellenecektir.

### Netlik sonrasında değerlendirilecek öneri

- İşlem yok → bölüm tamamen gizli.
- İşlem var, ek alanda doldurulmayı bekleyen zorunlu alan yok → kapalı.
- İşlem var, ek alanda boş/geçersiz zorunlu alan var → otomatik açık olma önerisi; kullanıcı teyidi beklenir. Örneğin bir ödeme işleminde kaynak hesabı seçilmemişse ilgili alan görünür olmalı.
- Vurgu, ilgili zorunlu girişlerin kenarına uygulanır; hangi alan olduğu anlaşılmadan yalnız bütün panelin parlamasıyla yetinilmez. Öneri: mevcut turkuaz paletle tek seferlik yaklaşık 600–800 ms yumuşak çerçeve vurgusu, ardından normal görünüm. Süre henüz kullanıcı tarafından seçilmedi.
- Yıldız/alan adı ve erişilebilir zorunluluk bilgisi kalıcıdır; kısa efekt zorunluluğu anlatan tek araç olmaz. Kırmızı hata görünümü kullanıcı henüz hata yapmadan sırf yönlendirme için kullanılmaz.
- Sürekli yanıp sönme, ses, titreşim veya her tuşta tekrar vurgu eklenmez. Hareketi azaltma tercihinde parlamanın yerine hareketsiz, okunaklı bir sınır/işaret kullanılır.
- Başlangıç davranışı işlem seçimiyle değerlendirilir; kullanıcı alanları doldururken bölüm kendiliğinden kapanıp açılmaz. Tamamlanmış alanlar sebepsiz yeniden parlatılmaz.
- Ana satırın ölçü/hizası ve kullanıcının odağı korunur; zorunlu alana dikkat çekmek otomatik kaydırma/odak çalma anlamına gelmez. Kullanıcının açma/kapatma kontrolü ve mevcut doğrulama mesajları korunur.

Yalnız notlar güncellendi. Uygulama kodu, sürüm, ZIP ve GitHub yayını değiştirilmedi.

## 18 Kasım 2026 — Açık uygulama ve yayın onayı (1.26.0)

Kullanıcı “evet collapse derken bunu kastettim. notlardaki değişiklikleri onaylıyorum, değişikleri kodla ve yayınla” talimatını verdi. 18 Kasım'da biriken notlar 1.26.0 kapsamına alınır. Önceki “öneri/onay bekleniyor/kodlama başlamadı” ifadeleri bu onaydan önceki aşamayı anlatır.

- Netleşen karar: doldurulmayı bekleyen zorunlu ek alan varsa bölüm **açık/genişletilmiş**, yoksa kapalı; işlem seçilmediyse başlık dahil gizli. Zorunlu alanlar tek seferlik yumuşak çerçeve vurgusu alır.
- Hizalama/tek aktif çizgi, Genel yer tutucusu, tarih ikonundan metne dönüşüm, aynı pencerede saat, personel belge alanının kaldırılması, maaşla tam/kısmi ödeme ve aylık bağlantı birlikte uygulanır.
- Personel boş plan durumu, küçük/adaptif halka ve belirsiz ödeme bağlantısının açık anlatımı; cari dizini başlık kararlılığı ve yaklaşık 350 ms yönlü sayfa geçişi uygulanır.
- 1.25.1 boş sayfa bildirimi araştırılır; yeniden üretilemeyen canlı neden kesin çözülmüş gibi raporlanmaz. Paket yükleme/kayıp JS ve beklenmedik çalışma zamanı hatalarına karşı görülebilir hata kurtarma ekranı ve paket yükseltme doğrulaması değerlendirilir.
- Kullanıcının gerçek verilerine/config'ine dokunulmaz. GitHub kaynak/Release ve repo içindeki hosting ZIP + SHA-256 tamamlanır. Canlı hosting'e yükleme/inceleme kullanıcıya aittir.

### 1.26.0 uygulama karşılığı

18 Kasım kapsamı uygulandı; ayrıntılar [1.26.0 kapsamı](SURUM-1.26.0.md) içinde. Geçmiş paragraflardaki kodlama başlamadı/onay bekleniyor durumları tarihsel görüşme aşamasıdır; yukarıdaki son açık talimat bunları bu sürüm kapsamında yürürlüğe aldı. Yeni fikirler tekrar not ve açık uygulama talimatı akışına tabidir.

Yayın kontrolü bulgusu: picomatch 4.0.7 için yamasız GHSA-fc5q-39xc-vjpf bildirimi bulundu. Yalnız güvenilen derleme globlarına ait dar istisna 18 Aralık 2026 sonuna kadar açıkça belgelenir; diğer bulgular denetimi durdurur. Hostingde Node çalışmaz. Ayrıntı: [güvenlik kaydı](GUVENLIK-ISTISNASI-1.26.0.md).

1.26.0 GitHub yayını tamamlandı. Kaynak, hosting ZIP ve checksum repoya eklendi; indirilen Release dosyaları doğrulandı. [Test/yayın sonucu](TEST-RAPORU-1.26.0.md). Yeni fikirler bu sürümün onayına otomatik dahil değildir; önce not ve ardından açık uygulama talimatı gerekir.

## 18 Kasım 2026 — Kompakt taslak satırı ve sütunlara bağlı ek bilgiler

**Yeni talep notlara alındı; bu kapsam için henüz açık kodlama/yayın talimatı verilmedi. 1.26.0'ın önceki uygulama onayı bu yeni talebe taşınmaz.** Kullanıcının paylaştığı iki ekran görüntüsü mevcut düzensizliğin referansıdır.

### Taslak ve eylem alanı

- Bakiye hücresindeki tire kaldırılacak; Taslak bilgisi doğrudan tirenin bulunduğu konumda gösterilecek. Bakiye için ayrılan yer korunacak; Taslak için ayrıca ikinci bir satır açılmayacak.
- Vazgeç ve Kaydet ikonları, ana bilgi girişi satırındaki kutularla aynı yatay hizada olacak. Durum yazısı ikonları aşağı itmeyecek.
- Taslak satırının altındaki gereksiz boşluk azaltılacak; satır daha kompakt olacak. İkonların kullanılabilir tıklama alanı korunacak.

### Ek bilgilerde ortak sütun hizası

- Ek bilgiler, üstteki tablodan bağımsız eşit genişlikli kutulara bölünmeyecek. Ana tablonun mevcut sütun başlangıç/bitiş çizgileri ek alanların da hizalama çizgileri olacak.
- Her kutu, içeriğinin okunaklı biçimde sığacağı bir sütunu veya bitişik sütunların birleşimini kaplayacak. Örneğin İşlem sütununun genişliği yeterliyse tek sütun; yetersizse yeni sütun sırasına göre bitişiğindeki Açıklama sütunuyla birlikte kullanılabilecek. (Önceki İşlem + Ekleyen örneği, aşağıdaki yeni sıralama talebiyle güncellendi.)
- Kutuların sol ve sağ kenarları bu ortak çizgilere oturacak; aradaki boşluklar tutarlı olacak. Alan başlıkları da ilgili kutuyla hizalanacak.
- Sütunlar ekran/içerik genişliğiyle esnedikçe ek bilgi kutuları da aynı ölçülerle esneyecek. Sabit piksel genişlikleriyle yalnız belirli bir çözünürlükte hizalı görünen bir düzen oluşturulmayacak.
- Ekran çözünürlüğü veya kullanılabilir içerik genişliği değiştiğinde kutuların kapladığı sütun sayısı da yeniden değerlendirilecek; ilk yerleşimdeki sütun sayısı sabit kalmayacak. Bilgi girişini kısıtlayacak kadar daralan kutu daha fazla bitişik sütuna yayılabilecek; gereksiz genişleyen kutu daha az sütuna çekilebilecek. Her iki durumda da kutunun kenarları mevcut sütun çizgilerine hizalı kalacak.
- Alanın sığmadığı durumda metni sıkıştırmak veya kesmek yerine uygun bitişik sütunlar birlikte kullanılacak. Dar görünümde de o görünümün sütun düzeni esas alınacak; okunabilirlik ve taşmama korunacak.
- İşleme göre değişen ek alanların tamamı aynı hizalama kuralını kullanacak. Ek bilgiler açıldığında ana satırın sütun ölçüleri ve eylem hizası değişmeyecek; eylemler için ayrılan alan korunacak.
- Önceki zorunlu alanlara göre açılma, tek seferlik dikkat vurgusu ve kullanıcı açma/kapatma kontrolü geçerli kalacak. Finansal hesaplama ve kayıt davranışı bu görsel düzenleme talebinin kapsamı değildir.

Yalnız sürüm notları güncellendi. Uygulama kodu, sürüm numarası, ZIP ve GitHub yayını değiştirilmedi.

## 18 Kasım 2026 — Personel IBAN bilgisi ve hızlı kopyalama

**Yeni talep notlara alındı; henüz açık kodlama/yayın talimatı verilmedi.**

- Personel bilgilerine IBAN alanı eklenecek. Personel bilgilerini ekleme/düzenleme sırasında girilebilecek ve personel detayındaki kompakt bilgiler içinde gösterilecek; para gönderirken bilgiyi kolayca kullanmak amaçlanıyor.
- Personelin IBAN ve T.C. kimlik numarası değerlerinin yanında ayrı birer kopyalama ikonu olacak. Kullanıcı ilgili ikona bastığında yalnız o değer panoya kopyalanacak.
- Şimdilik yalnız bu iki alan kopyalama kapsamındadır. Diğer personel alanları veya başka cari türlerine yayılım ileride ayrıca değerlendirilecek.
- Boş/tanımlanmamış değer için kopyalama eylemi sunulmayacak; Tanımlanmadı gibi yer tutucu metinler panoya kopyalanmayacak.
- Uygulama ayrıntısı önerisi: IBAN okunaklı biçimde aralıklı gösterilebilir; panoya aktarılırken başka platformlara yapıştırmaya uygun, boşluksuz değer kullanılabilir. T.C. kimlik numarası metin olarak korunmalı. Kopyalama sonucu kısa ve anlaşılır bir geri bildirimle belirtilmeli; başarısız işlem başarılı gösterilmemeli. Bu öneriler henüz kodlanmadı.

Yalnız sürüm notları güncellendi. Uygulama kodu, sürüm numarası, ZIP ve GitHub yayını değiştirilmedi.

## 18 Kasım 2026 — Cari hareketlerinde sütun sırası ve otomatik maaş açıklaması

**Yeni talepler notlara alındı; henüz açık kodlama/yayın talimatı verilmedi.**

### Yeni sütun sırası

- Cari hareketleri sütunları **Tarih → İşlem → Açıklama → Etiket → Ekleyen → Tutar → Bakiye** sırasına alınacak. İşlem sütunu Tarih sütununun hemen yanında olacak.
- Liste satırları, satır içi yeni işlem ve düzenleme alanları aynı sırayı kullanacak. Mevcut sıralama işlevleri ilgili sütunla birlikte korunacak.
- Ek bilgi kutularının sütun çizgilerine hizalanması ve ekran genişliğine göre kapladığı bitişik sütun sayısını değiştirmesi kuralı bu yeni sıra üzerinden uygulanacak. Önceki sütun sırasına ait örnekler yeni sıraya göre değerlendirilecek.

### Personelde otomatik maaş açıklaması

**Sonraki talep bu akışı değiştirdi:** Maaş Ekle manuel cari işlem seçeneklerinden çıkarılacak. Aşağıdaki açıklama fikri otomatik aylık hakediş kayıtlarında kullanılacak; manuel seçim akışı uygulanmayacak. Güncel karar aşağıdaki personel tahakkuku bölümündedir.

- Personel carisinde yeni işlem için **Maaş Ekle** seçildiğinde açıklama alanına bulunduğumuz ay ve yıl kullanılarak otomatik metin gelecek.
- Biçim: **kasım 2026 maaşı**. Ay adı Türkçe ve küçük harfli olacak; başka aylarda ilgili ay/yıl kullanılacak.
- Kullanıcının “hangi ayda isek” talebi gereği ay/yıl uygulamanın Türkiye saatine göre güncel tarihinden alınacak; işlem tarihini geçmişe çekmek kendiliğinden başka bir maaş ayı seçildiği anlamına gelmeyecek.
- Uygulama önerisi: Otomatik açıklama kullanıcı tarafından düzenlenebilir olmalı; önceden yazılmış özel açıklama veya mevcut bir kaydın açıklaması işlem seçimi nedeniyle sessizce ezilmemeli. Bu ayrıntı öneri olarak kaydedildi; henüz kodlanmadı.
- Otomatik metin açıklama kolaylığıdır; maaş tutarı, ödeme, hakediş ayı bağlantısı veya başka finansal veri açıklama metninden türetilmeyecek.

Yalnız sürüm notları güncellendi. Uygulama kodu, sürüm numarası, ZIP ve GitHub yayını değiştirilmedi.

## 18 Kasım 2026 — Personelde otomatik aylık maaş/yemek tahakkuku ve tekrarlayan işlemler

**Yeni talep ve değerlendirme kaydedildi; açık kodlama/yayın talimatı verilmedi.** Bu karar önceki manuel Maaş Ekle ve seçimde otomatik açıklama akışını değiştirir. 1.26.0'daki maaşla birlikte peşin ödeme yaklaşımı yeni otomatik akışa kendiliğinden taşınmaz.

### Kullanıcının istediği davranış

- Maaş Ekle, personel carisinin manuel işlem seçeneklerinden çıkarılacak. Önceden kaydedilmiş maaş işlemleri silinmeyecek; geçmiş kayıtlar korunacak.
- Personel bilgilerinde maaş ve yemek ücreti alanları bulunacak.
- Tanımlı tutarlar her ayın **1. günü saat 12.00'de**, Türkiye saatiyle (**Europe/Istanbul**), ilgili personelin cari hesabına otomatik hakediş olarak eklenecek.
- Maaş/yemek bilgisi girilmemiş personelde ilgili otomatik işlem oluşturulmayacak. Her iki alan boşsa hiçbir hakediş oluşturulmayacak.
- Kaydedilen açıklama ilgili dönemi belirtecek: örneğin **kasım 2026 maaşı** ve **kasım 2026 yemek ücreti**. Geçmiş bir dönem sonradan işlenirse açıklama çalıştırıldığı ayı değil kaydın ait olduğu dönemi gösterecek; önceki güncel ay açıklaması notunun bu istisnası yeni otomatik modelden kaynaklanır.

### Uygulama için önerilen yorum ve korumalar

- Maaş ve yemek tutarları **aylık TL tutarı** olarak ayrı değerlendirilsin. Yalnız maaş girilmişse maaş, yalnız yemek girilmişse yemek işlensin; boş veya sıfır kalem atlanabilsin. Tek alanın boş olmasının diğer tanımlı kalemi de durdurması isteniyorsa bu yorum ayrıca değiştirilebilir. Günlük yemek bedeli/çalışılan gün çarpımı henüz talep edilmedi.
- Maaş ve yemek iki ayrı, açıkça sınıflandırılmış cari hakediş kaydı olsun. Bu kayıtlar personele olan borcu artırır; otomatik banka/kasa ödemesi veya IBAN'a para transferi oluşturmaz. Gerçek ödeme ayrıca kaydedilir.
- Mevcut aylık yemek bilgisi yalnız profil/özet metadatasıdır. Yemek gerçek bir finansal hakediş kaydına dönüşürken aylık özetin hem profil tutarını hem yeni kaydı toplaması engellenmeli; mevcut veriler otomatik olarak geçmiş hakedişlere çevrilmemeli.
- Her personel + dönem + hakediş kalemi için tek üretim kimliği saklansın. Eşzamanlı çalıştırma veya tekrar denemede aynı maaş/yemek ikinci kez eklenmesin. Kimlik tekilliği ve finansal kayıt veritabanında birlikte güvenceye alınsın; sadece açıklama metnine bakarak mükerrerlik aranmasın.
- Oluşan kayıtta o dönemde kullanılan tutar ve kaynak tanımı saklansın. Personel ücretini sonradan değiştirmek geçmiş kaydı yeniden hesaplamasın. Otomatik kaydın düzenleme/iptal geçmişi korunsun; iptal edilmiş kayıt sıradaki kontrolde sessizce yeniden üretilmesin.
- Arşivlenmiş/pasif personel için yeni hakediş üretmeme, işe giriş/çıkış tarihleri ve ücret değişikliğinin hangi aydan geçerli olacağı uygulanmadan önce kararlaştırılmalı.

### Zamanında çalıştırma

- Tarayıcı kapalıyken de saat 12.00'de çalışabilmek için sunucu tarafında zamanlanmış görev gerekir. Mevcut projede CLI cron yaklaşımı yedekleme için vardır; bu, maaş görevinin zaten kurulu olduğu anlamına gelmez. Yedekleme görevinin 03.00 kuralı değiştirilmemeli.
- Öneri: Tekrarlayan işlemler için ayrı bir PHP CLI görev yürütücüsü hazırlansın; hostingde görevi kullanıcı kursun. Hosting bağlantısı, uzaktan cron kurma veya canlı inceleme yapılmayacak.
- Sunucu görevi kurulmadan tam saatinde çalışacağı vaat edilmesin. Sayfanın açılmasını bekleyen bir kontrol, gerçek zamanlanmış görev yerine sunulmasın.
- Kesinti/başarısızlık için aynı dönemin ayın 2. ve 3. günü yeniden denenmesi aşağıdaki son taleple netleşti. İlk etkinleştirmenin ayın 1–3 aralığı dışında olması ve daha eski ayların ele alınması henüz kararlaştırılmadı; geçmiş aylar otomatik borçlandırılmamalı.

### Genel tekrarlayan işlemler için taslak öneri

- Personel hakedişi ortak bir tekrarlama altyapısının ilk kullanımı olabilir; kira, abonelik ve benzeri kalemler daha sonra aynı altyapıyı kullanabilir. Bu genişleme henüz uygulama onayı değildir.
- Tekrarlama tanımı: işlem türü, ilgili cari/hesap, tutar, sıklık, gün/saat, başlangıç/bitiş, aktif/duraklatılmış durumu. Tanım ile üretilen her dönem kaydı ayrı tutulmalı; son/sonraki çalışma ve hata durumu izlenebilmeli.
- Plan/hatırlatma ile gerçekleşmiş finansal kayıt açıkça ayrılmalı. Personel maaş/yemek tahakkuku belirlenen zamanda hakediş üretir; başka işlemlerde otomatik gerçek kayıt mı, hatırlatma/plan mı üretileceği işlem türüne göre ayrıca seçilmeli. Tekrarlama tanımı eklemek kendiliğinden para çıkışı olmamalı.
- İlk sürüm için sabit tutarlı aylık tekrar yeterli bir başlangıç önerisidir. Günlük/haftalık tekrar, ayın 29–31'i, iş günü/tatil kaydırması ve değişken tutar daha sonra ayrıca kararlaştırılabilir.
- Önerilen yönetim görünümü: tutar, sıklık, sonraki tarih ve durumun görüldüğü kompakt liste; düzenle/duraklat ve oluşan kayıtlara git eylemleri. Ayrı bir sayfa mı mevcut Ödeme Planı içinde mi olacağı henüz seçilmedi.

### Netleştirilecek kararlar

- Son yanıttaki “evet”, önceki soruya karşılık yemek tutarının aylık toplam olması olarak kaydedildi. Dolu kalemlerin birbirinden bağımsız işlenmesi önerisi korunur.
- Otomasyon ayın 1–3 aralığı dışında etkinleştirilirse ilk kaydın ne zaman üretileceği ve daha eski dönemlerin ele alınması; aynı dönem için ilk üç günün yeniden denemesi aşağıda netleşti.
- Yeni başlayan/ayrılan ve pasif personel için kapsam; ücret değişikliğinin geçerli olacağı dönem ve varsa kıst hesap ihtiyacı.

Yalnız notlar ve taslak öneri hazırlandı. Uygulama kodu, veri modeli, finansal kayıtlar, zamanlanmış görev, sürüm numarası, ZIP ve GitHub yayını değiştirilmedi.

## 18 Kasım 2026 — Üç günlük tahakkuk denemesi, kritik bildirim ve cron kurulum rehberliği

**Yeni gereksinimler notlara alındı. Kullanıcı cron ayarlarını kendisinin yapması için yönlendirme istedi; uygulama kodlama/yayın talimatı verilmedi.** Hosting erişimi veya uzaktan kurulum yapılmayacak. Mevcut yedekleme cron'u kurulabilir; personel tahakkuk cron'u henüz kodlanmış/yayımlanmış değildir.

### Netleşen aylık deneme kuralı

- Yemek ücreti aylık toplam tutar olarak ele alınacak.
- Aynı ayın maaş/yemek hakedişi için ilk deneme **ayın 1'i saat 12.00**, başarısızsa ikinci deneme **ayın 2'si saat 12.00**, yine başarısızsa son deneme **ayın 3'ü saat 12.00** olacak. Saat dilimi Europe/Istanbul.
- Başarıyla tamamlanmış dönem sonraki günlerde yeniden üretilmeyecek. Üçüncü günün denemesinden sonra hâlâ tamamlanamayan işlem için sitede **kritik bildirim** gösterilecek.
- Önerilen cron takvimi İstanbul saat diliminde `0 12 1-3 * *`, UTC saat diliminde `0 9 1-3 * *`. Ayın yalnız 1'inde çalışan bir cron, ertesi gün tekrar denemelerini başlatmaya yetmez. Bunlar henüz oluşturulmamış görevin planıdır; çalışır bir tahakkuk komutu olarak sunulmayacak.

### Mükerrerlik ve kısmi başarının korunması

- Her personel + yıl/ay + maaş/yemek kalemi için veritabanında kalıcı tekillik sağlanacak. Yeniden deneme ve eşzamanlı görevler aynı hakedişi çoğaltmayacak.
- Kısmen başarılı bir toplu çalışmada yalnız eksik/başarısız kalemler yeniden denenecek; daha önce tamamlanan personel kayıtları geri alınıp tekrar oluşturulmayacak. Kayıt ve tamamlanma işareti atomik saklanacak.
- Her denemenin zamanı, sonucu ve başarısız kalemleri izlenebilecek. İptal edilmiş otomatik hakediş, cron tekrarlandı diye yeniden yaratılmayacak.

### Kritik site bildirimi

- Üçüncü günün başarısızlığı sonrasında ilgili dönemi ve tamamlanamayan hakedişleri belirten kalıcı bir kritik bildirim oluşturulacak. Başarısız tahakkuk tamamlanmış gibi gösterilmeyecek.
- Aynı sorun her kontrolde yeni bildirim üretmeyecek; dönem bazında aynı bildirim güncellenecek. Sorun giderilince durum çözüldü olarak izlenebilecek. Üç günden sonraki kurtarma/elle yeniden deneme akışı ayrıca tasarlanacak; sessiz sınırsız otomatik deneme varsayılmayacak.
- Cron hiç tetiklenmezse de eksik çalışma son başarı/plan kayıtlarından anlaşılmalı. Site ayın 3'ü saat 12.00 sonrasında açıldığında veya sunucu kontrolünde, tamamlanmamış dönem için kritik durum tespit edilebilmeli. Bu kontrol hakedişi tarayıcıdan üretmeyecek. Site/veritabanı tamamen erişilemiyorsa bildirim ancak hizmet yeniden erişilebilir olduğunda gösterilebilir.

### Mevcut yedekleme cron kurulumu

- 1.26.0'da hazır dosya: `api/backup-cron.php`. PHP CLI ile çalışır; HTTP üzerinden çağrılmaz.
- Uygulamada **Ayarlar → Otomatik yedek al** açık olmalı. **Hosting cron kurulumu** bölümü sunucudaki uygulamaya göre gerçek betik yolunu içeren kopyalanabilir komutu verir; PHP CLI yolu hosting sağlayıcısının PHP 8.3+ yolu olmalı.
- Her gün Türkiye saatiyle **03.00**: İstanbul saat diliminde `0 3 * * *`, UTC'de `0 0 * * *`.
- Mevcut bir yedek cron girdisi varsa ikinci bir aynı görev eklemek yerine mevcut giriş kontrol edilecek. İlk doğrulamada görev çıktısı saklanacak; başarılı çalışmadan sonra uygulamanın yedek listesinde otomatik kayıt/zamanı kontrol edilecek.
- Betik yalnız İstanbul saatiyle 03.00–03.59 aralığında otomatik yedek üretir. Panelden başka saatte Çalıştır demek yeni otomatik yedek üretmeyebilir; bu tek başına kurulumun bozuk olduğu anlamına gelmez. Yedekleme takvimi ve beş kopya saklama kuralı değiştirilmedi.
- Kesin panel adımları ve komut için kullanıcıdan panel adı, Ayarlar'daki cron komutu ve hosting cron saat dilimi istendi. Hosting parolası veya uzaktan bağlantı gerekmiyor.

Yalnız notlar ve kurulum rehberliği hazırlandı. Uygulama kodu, finansal kayıtlar, sunucudaki cron görevleri, sürüm numarası, ZIP ve GitHub yayını değiştirilmedi.

### 18 Kasım 2026 — cPanel ekranlarıyla kurulum durumu

- Kullanıcı hosting panelinin cPanel olduğunu bildirdi. Görselde `0 3 * * *` zamanlamalı mevcut bir cron girdisi var; komut `/usr/local/bin/php` üzerinden uygulamanın `cron/yedek.php` yolunu çağırıyor.
- 1.26.0 kaynak/paketindeki resmi yedekleme betiği `api/backup-cron.php`. Görseldeki eski yolun geçerli bir özel sarmalayıcı olup olmadığı veya dosyanın sunucuda bulunup bulunmadığı uzaktan incelenmedi; mevcut girdinin bu uygulamaya ait olduğu ve güncel betik yolu Dosya Yöneticisi / uygulamadaki Hosting cron kurulumu üzerinden doğrulanmalı.
- PHP Selector görselinde web hesabı sürümü 8.3. Cron'un kullandığı `/usr/local/bin/php` CLI sürümü bununla kesinleşmez; cPanel Terminal varsa `/usr/local/bin/php -v` ile, yoksa hosting sağlayıcısından doğrulanmalı. PHP 8.3+ CLI ve uygulamanın kullandığı pdo_mysql desteği gerekir.
- Sunucunun cron saat dilimi görsellerde belirtilmiyor. Mevcut saat 3 değerinin Türkiye 03.00'e denk geldiği henüz doğrulanmadı; İstanbul ise saat 3, UTC ise saat 0 kullanılacak. Betik içindeki Europe/Istanbul ayarı, cPanel'in görevi tetiklediği saati kendiliğinden değiştirmez.
- Yedekleme için yeni bir aynı görev açmak yerine mevcut girdinin Düzenle eylemi kullanılacak; gerçek betik yolu ve PHP CLI doğrulandıktan sonra kaydedilecek. Maaş/yemek görevi henüz hazır olmadığından eklenmeyecek.

Yalnız notlar ve cPanel için manuel yönlendirme hazırlandı; sunucuya bağlanılmadı, cron veya uygulama kodu değiştirilmedi.

### 18 Kasım 2026 — Cron kurulumunun ertelenmesi

- Kullanıcı hosting desteğine şu anda ulaşamadığını ve mevcut bilgiler yeterli değilse cron konusunu sonraya bırakmak istediğini belirtti. Cron kurulum rehberliği bu aşamada ertelendi; yeni bilgi veya doğrulama için kullanıcıya ek işlem yaptırılmayacak.
- Paylaşılan cPanel ekranları web PHP sürümünü ve mevcut cron girdisini gösteriyor; CLI PHP sürümü, görev saat dilimi ve sunucudaki betik yolu henüz doğrulanmadı. phpMyAdmin'in veritabanı/PHP bilgileri tek başına cron'un çalıştırdığı PHP sürümünü veya cron saat dilimini kesinleştirmez.
- Önceki komut ve saat önerileri doğrulama bekleyen rehber olarak kalır; tamamlanmış kurulum sayılmaz. Bu aşamada mevcut cron girdisini değiştirme veya yeni görev ekleme yönlendirmesi uygulanmayacak.
- Yedek cron'unun çalıştığı doğrulanmış değildir. Maaş/yemek otomasyonunun üç günlük deneme, mükerrer kayıt önleme ve kritik bildirim gereksinimleri notlarda korunur; hostingde görevin kurulması daha sonra ele alınacak. Erteleme bu özellikleri uygulamak için kodlama/yayın onayı değildir.

Yalnız notlar güncellendi; uygulama kodu, hosting ayarları ve GitHub yayını değiştirilmedi.

### 18 Kasım 2026 — phpMyAdmin çalışma ortamı bilgisi

- Kullanıcının paylaştığı Web sunucusu ekranı: `cpsrvd 11.138.0.24`, PHP `8.4.27`, veritabanı istemcisi `libmysql - mysqlnd 8.4.27`; listelenen PHP uzantıları mysqli, curl ve mbstring.
- Bunlar phpMyAdmin'in çalıştığı ortamı gösterir; uygulamanın PHP Selector'daki 8.3 sürümüyle farklı olması tek başına bir çelişki veya hata değildir. Cron'un CLI PHP sürümü ve pdo_mysql desteği bu ekranla doğrulanmaz.
- mysqlnd 8.4.27 istemci sürümüdür; MySQL/MariaDB sunucu sürümü olarak kaydedilmez. Cron saat dilimi de bu ekranda yoktur.
- Cron kurulumunun ertelenmesi kararı korunur. Yalnız ortam bilgisi notlara eklendi; uygulama veya hosting yapılandırması değiştirilmedi.

## 18 Kasım 2026 — Satır içi giriş modelini diğer bölümlere yayma önerisi

**Kullanıcı bölüm bazında düşünülmüş notlar ve onayına sunulacak tasarım önerisi istedi; kodlama/yayın talimatı vermedi.** Kaynak üzerinden inceleme yapıldı; yeni çalışan arayüz/hosting testi yapılmış gibi değerlendirilmez.

Ayrıntılı öneri: [Cari tasarımının diğer bölümlere yayılması](SATIR-ICI-YAYILIM-TASLAGI.md).

- Cari hesapların son kararları ortak hedef olacak: yeni satır, Tarih/İşlem komşuluğu, kompakt Taslak ve aynı hizadaki Kaydet/Vazgeç, sütuna bağlı ve genişliğe göre yeniden biçimlenen ek alanlar, zorunluluğa göre açılma, modern alanlar, ortak tarih/saat ve kolay etiket girişi.
- Tahsilat & Ödeme, banka/kasa/KMH ve kredi kartı hareketlerindeki ayrı sayfa altı ekleme alanları kaldırılıp ilgili listenin sonunda satır içi girişe geçilmesi önerildi. Eski otomatik alt form tetikleyicileri ve boş yer payları da kaldırılmalı; aynı kayıt için iki giriş yolu birlikte açık kalmamalı.
- Ödeme Planı takvimi korunarak seçili günün listesi; araç ve kampanyalarda kendi liste satırı/kartı referans alınacak. Ortak etkileşim dili paylaşılacak, farklı finansal anlamlara aynı tablo zorlanmayacak.
- Yeni cari/hesap/kart/araç tanımlama ve kullanıcı yönetimi de kendi listesinde taslak satır/kart olarak öneriye dahil edildi. Bu, eski tam sayfa varlık ekleme kararını da değiştireceğinden tasarım onayına açıkça sunulur.
- Raporlar ve Genel bakışta her yere yeni finansal kayıt düğmesi eklemek yerine doğru kaynak liste/satırına erişim; normal ayar ve yedekleme ekranlarında kendi işlevine uygun formları koruma önerildi.
- Taslak toplam/bakiye/CSV'ye katılmayacak; kayıt sonrası filtreler sessizce temizlenmeyecek. Mükerrer kaydetme, taslak kaybı ve kaynak/hedef karışıklığı önlenecek. Plan/gerçekleşen, kart/banka ve araç/kampanya bağlantıları aynı finansal davranışı koruyacak.
- Bu çalışma geçmiş sürüm onaylarını genişletmez. Tasarım onayından sonra da ayrıca açık uygulama talimatı gelmeden kodlama/yayın başlamayacak. Cron kurulumu ertelenmiş durumda kalır.

Yalnız analiz ve öneri belgeleri hazırlandı; uygulama kodu, sürüm numarası, ZIP ve GitHub yayını değiştirilmedi.

## 18 Kasım 2026 — Yayılım tasarım onayı ve işlem bağlantılarından kaynak satıra yönlendirme

**Kullanıcı önceki satır içi yayılım tasarımını onayladı ve aşağıdaki yeni özelliği kapsama ekledi. Bu tasarım onayıdır; henüz açık kodlama/yayın talimatı verilmedi.** Önceki “onaya sunulan” ifadesi bu onaydan önceki durumu anlatır. Ayrıntılar [onaylı tasarım belgesinde](SATIR-ICI-YAYILIM-TASLAGI.md).

- Genel bakıştaki Dikkat isteyenler ve Son hareketler, cari listesindeki Son 5 işlem ve benzer işlem özetlerine tıklandığında açılan kayıt penceresi kaldırılacak.
- Kayıt kendi kaynak cari/hesap/kart sayfasında, doğru sekme/ekstre/dönemde açılacak; ilgili satır görünür ve aktif/genişletilmiş gelecek. Başka bölümdeki kayıt araç/kampanya gibi kendi bölümüne gidecek.
- Aynı kural hesap/kart uyarıları, bildirimler/zil, Ödeme Planı kayıt görüntüleme bağlantıları, rapor/arama sonuçları ve bağlı hareket kısayolları için taranıp uygulanacak. Özetin belli bir hesap/kart/cari bağlamı varsa o bağlam korunacak.
- Yalnız gezinme yapılacak: otomatik düzenleme, yeni işlem, ödeme veya plan gerçekleştirme tetiklenmeyecek. Ayrı Düzenle/Öde eylemleri kaynak satırda kalacak.
- Eski/ilk 30 kayıtta olmayan hareket yüklenip seçilecek. Filtre hedefi gizliyorsa kayıt görünür yapılacak ve kapsam değişikliği açık olacak; geri dönüşte eski liste tercihleri ve konum korunacak. Taslak koruması ve yetki denetimi sürecek.
- Takvim/menü/taslak onayı gibi farklı işlevli pencereler bu taleple kaldırılmayacak; hedef kayıt görüntüleme pencereleridir.
- Kaynak incelemesinde App içindeki Son hareketler tablosu ve bazı bildirim/Ödeme Planı yollarında kayıt penceresi çağrıları, Ledger içinde ise hedef hareketi yükleyip genişletme altyapısı görüldü. Bu altyapı değerlendirilerek tüm giriş noktalarında tutarlı kaynak yönlendirmesi sağlanacak; kod henüz değiştirilmedi.

Yalnız tasarım ve sürüm notları güncellendi. Uygulama kodu, sürüm numarası, ZIP, hosting ayarları ve GitHub yayını değiştirilmedi.

## 18 Kasım 2026 — Açık kodlama ve GitHub Release talimatı (1.27.0)

Kullanıcı “kodlamaya başla ve yeni sürümü github release olarak yayınla” dedi. Yukarıdaki birikmiş gereksinimler ve onaylı yayılım/yönlendirme tasarımı 1.27.0 için uygulanır. Önceki kodlama başlamadı/onay bekleniyor ifadeleri tarihsel aşamalardır. Personel IBAN/kopyalama, aylık hakediş ve üç günlük deneme/uyarı kuralları da kapsamdadır; hostingde cron kurma ve canlı yükleme ertelenmiş kalır. Genel kira/abonelik tekrarlama ekranı henüz seçilmiş bir tasarım değildir; bu sürümde ortak zamanlama yaklaşımının personel maaş/yemek kullanımı uygulanır.

İlk etkinleştirmede geçmiş aylar üretilmez; ilk uygun başlangıç ayı arayüzde açıkça belirlenir (varsayılan sonraki ay). Pasif personel atlanır; aylık tutarlar bağımsız işlenir. Dönem içi ücret değişikliği daha önce oluşmuş kaydı değiştirmez. İşe giriş/çıkış için kendiliğinden kıst hesap veya günlük yemek hesabı üretilmez. Bunlar uygulama sırasında kullanılan açık başlangıç kararlarıdır; yeni mali varsayım sessizce eklenmez.

### 1.27.0 uygulama sonucu

Yetkilendirilen satır içi yayılım, kaynak satıra yönlendirme, personel IBAN/kopyalama ve dönem planına bağlı maaş/yemek otomasyonu uygulandı. Yerel kabul ve hosting paket kurulumu doğrulandı; yayın sonucu sürüm raporunda tutulur. Hosting yükleme/inceleme ve cron kurulumu kullanıcıya aittir. Bu sürümün onayı, daha sonra eklenecek yeni fikirler için uygulama/yayın yetkisi vermez.

1.27.0 GitHub Release yayımlandı; Windows/Linux kabulü ve indirilen paketlerin checksum/kaynak eşliği doğrulandı. Ayrıntı docs/TEST-RAPORU-1.27.0.md. Hosting yükleme/inceleme ve cron kurulumu yapılmadı; kullanıcıya aittir. Yeni talepler yine önce notlara alınacak, açık kodlama talimatı beklenecek.
