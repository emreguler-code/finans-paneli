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


# 1.9.1 sonrası — not ve görsel değerlendirme aşaması

## Hesaplar: başlık araçları ve ana içerik kutusu

26 Ekim 2026. Kullanıcı not aşamasında 3 numaralı yatay kart tasarımını onayladı; kodlama ve yayın aşamasına henüz geçilmedi.

- “Hesap listesi” ikinci başlığı kaldırılacak.
- Sıralama ve indirme ikonları, yeni kayıt/işlem ekleme düğmesinin bulunduğu sayfa başlığı satırına alınacak. Diğer gerekli sayfa araçları aynı grupta yer alacak; ince ayraçtan sonra ekle düğmesi en sağda kalacak. Bu düzen site geneline ortak kural olarak uyarlanacak.
- Hesap kartlarının bulunduğu alan tek bir ana içerik kutusu olacak; kartlar bu kutu içinde yeniden bölümlenecek. Kart stili değişebilir.
- Üç görsel alternatif `tasarimlar/hesaplar-stil-denemeleri-2026-10-26.md` içinde. Kullanıcı **3 — Yatay kartlar** seçeneğini onayladı. Seçilen referans `tasarimlar/hesaplar-stil-3-yatay-kartlar-2026-10-26.png` dosyasıdır.
- Bu aşamada yalnız tasarım görselleri/notlar GitHub'a yüklenir; uygulama kodu, sürüm ve hosting paketi değiştirilmez.

- Seçilen yerleşim: tek ana içerik kutusu içinde tam genişlikte yatay hesap kartları; kimlik, bakiye/KMH özeti, tür/vade ve kayda ait bilgi/düzenleme eylemleri hizalı bölümlerde gösterilir.
- Taslak yerleşim referansıdır. Nihai uygulama mevcut yerel Inter, 27/24 px sayfa başlığı, 16 px bölüm, 14 px ana metin, 12 px yardımcı metin, mevcut para değeri rolleri, 4–32 px boşluk ölçeği, 24/16 px panel dolgusu, 44 px ana eylemler ve 1,9:1 ana/sağ sütun kurallarını koruyacaktır. Görseldeki farklı font, oran, logo veya temsili veriler yeni kural sayılmaz.
- Üst sıralama/indirme grubu ve ayraçtan sonraki ekle düğmesi, üçüncü taslaktaki ana sütun sınırına değil tam sayfa başlığının en sağına hizalanacaktır. Mobilde yatay kart alanları mevcut duyarlı kurallarla alt alta geçer; içerik kesilmez.
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
8. **Tek başlık ve ortak araç satırı:** İkinci “Hesap listesi” başlığı kaldırılır; sıralama/indirme ve gerekli sayfa araçları başlık satırında, ayraçtan sonraki ekle düğmesi en sağda kalır. Site genelindeki ortak karar korunur.

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
