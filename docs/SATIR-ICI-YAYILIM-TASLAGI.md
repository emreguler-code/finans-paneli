# Cari tasarımının diğer bölümlere yayılması — onaylı tasarım

18 Kasım 2026 tasarım aşaması kaydı. **Sonraki açık kodlama ve GitHub Release talimatıyla 1.27.0 kapsamında uygulandı; güncel kapsam [SURUM-1.27.0.md](SURUM-1.27.0.md) içindedir.** Aşağıdaki henüz uygulanmadı/onay bekliyor ifadeleri önerinin yazıldığı aşamayı anlatır. Kullanıcının istediği çalışma: cari hesaplarda alınan kararları diğer bölümlere uyarlamak, sayfa altındaki ayrı işlem ekleme alanlarını kaldırıp kayıtları ilgili listenin içinde eklemek. Bu belge analiz ve tasarım önerisidir; kodlama veya GitHub yayını başlatılmaz. Tasarım onayı ile uygulama talimatı ayrı tutulur.

## İnceleme kapsamı ve başlangıç durumu

Kaynak incelemesi 1.26.0 ve sonrasında henüz kodlanmamış kullanıcı notlarına dayanır. Bu çalışma için yeni bir çalışan arayüz testi veya canlı hosting incelemesi yapılmadı.

- Cari satır içi ekleme/düzenleme `Ledger.jsx` ve `PartyEntryForm.jsx` üzerinden çalışıyor.
- Hesap ve kredi kartı hareketleri aynı Ledger bileşenini kullanıyor; yeni işlem girişleri App içindeki kalıcı alt form akışına bağlı. Tahsilat & Ödeme de ayrı alt giriş oluşturuyor. Bu bölümlerde yalnız görünümü değiştirmek yeterli olmaz; eski alt form tetikleyicisi de kaldırılmalı.
- Ödeme Planı takvim ve seçili gün/kalem akışı; araçlar ile kampanyalar ise kendilerine ait liste/kart satırları kullanıyor. Cari tablosunu olduğu gibi kopyalamak bu bağlamları karşılamıyor.
- Cari/hesap/kart/araç tanımlama ile bunlara finansal hareket ekleme farklı işlemler. Her iki ekleme türü de aşağıda kendi listesi içinde ele alınıyor.
- Cari sütun sırası değişikliği, tire yerine Taslak, kompakt eylem hizası ve ek alanların esnek sütun kaplaması henüz uygulanmış özellikler değildir; bu taslağın ortak hedefleridir.

## Ortak yeni kayıt modeli

1. Yeni kayıt eylemi ilgili listenin sonunda, düzenleme durumundaki bir satır gibi bir taslak açar. Liste boşsa aynı alan ilk satır olur. Sayfa altındaki bağımsız ekleme paneli ve bu panel için ayrılan boş alan kaldırılır. Aynı işlem için iki ayrı giriş yüzeyi kalmaz.
2. Ana alanlar, üstteki kayıtların gerçek sütunlarıyla hizalanır. Yeni işlem ve mevcut işlem düzenleme aynı alanları, açılır menüleri ve ölçüleri paylaşır. Liste başka bir sıralamada olsa da taslak giriş alanı liste sonunda kalır; kayıt tamamlanınca gerçek sıralamasındaki yerine yerleşir.
3. Cari hareketlerinde hedef sıra **Tarih → İşlem → Açıklama → Etiket → Ekleyen → Tutar → Bakiye**. Diğer bölümlerde ilgili mevcut sütunların anlamı korunur; aynı alanlar varsa Tarih ve İşlem komşu tutulur. Cari, hesap, kart, hedef hesap veya kayıt türü gibi gerekli alanlar kendi bağlamında gösterilir. Her listeye zorla yedi sütun veya Bakiye eklenmez.
4. Bakiye/durum alanında tire yerine **Taslak** yer alır. Kaydet ve Vazgeç ikonları ana giriş kutularıyla aynı hizada kalır. Bilgi yazısı ikonları aşağı itmez; gereksiz alt boşluk kaldırılır. Bakiye sütunu olmayan listelerde eylemler için sağda ayrılmış hücre veya satır bölgesi kullanılır; durum ile sayısal değer karıştırılmaz.
5. İşlem türü seçilmeden türün ek alanları ve Ek bilgiler başlığı görünmez. Genel yeni işlemde kullanıcı türü seçer. Öde/Tahsil et gibi belirli bir eylemden gelindiyse ilgili tür ve hedef önceden belirlenebilir; bu durumda zorunluluklar doğrudan değerlendirilir.
6. Boş zorunlu ek alan varsa Ek bilgiler otomatik açılır; ilgili alanlar bir kez kısa turkuaz çerçeve vurgusu alır. Zorunlu eksik yoksa kapalı başlar. Doldururken kendiliğinden kapanmaz, odak çalınmaz; kullanıcı açıp kapatabilir. Yıldız ve erişilebilir zorunluluk bilgisi kalıcı, hareket azaltma tercihi geçerlidir.
7. Ek bilgi kutularının iki kenarı ana listenin sütun çizgilerine oturur. Tek sütun dar kalırsa bitişik sütunlar birleştirilir; genişlik değiştiğinde kaplanan sütun sayısı yeniden hesaplanır. Gereksiz genişleyen alan daha az sütuna çekilir. Etiketler/kutu içeriği sıkıştırılmaz veya kesilmez. Liste satırının kendi sütun düzeni, tablosuz bölümlerde de bu hizalamanın referansıdır.
8. Ana sütun geometrisi ek alan açıldığı için değişmez. Açıklayıcı metin ve işlem etkisi kutu gibi bir grid hücresi tüketmez; alt satırda okunaklı bir bilgi olarak görünür. Hedef ve kaynak hesap arasındaki ilişki açık belirtilir.
9. Finansal yeni kayıtta tarih başlangıçta kompakt takvim ikonu, açık seçimden sonra düz ve yeniden tıklanabilir tarih olur. İşlem saati aynı takvim penceresindedir; değiştirilmediyse kayıt anındaki uygulama saati kullanılır. Düzenlemede mevcut saat korunur. Vade/geçerlilik/takip tarihi farklı anlam taşır; bunlara gereksiz işlem saati eklenmez ve gelecekteki tarih seçimi yanlışlıkla engellenmez.
10. Etiket varsa yeni kayıtta Genel yer tutucu olur; kullanıcı önce silmek zorunda kalmaz. Düzenlemede mevcut değer kolay değiştirilir. Açılır menüler ortak modern görünümü ve klavye kullanımını paylaşır. Kullanıcının yazdığı açıklama tür değişiminde sessizce ezilmez.
11. Kaydedilmemiş taslak toplam, bakiye, rapor, takvim borcu veya CSV'ye katılmaz. Finansal etki gösterilecekse açıkça önizleme olarak belirtilir. Sadece gerçek başarılı kayıttan sonra veriler yenilenir. Çift tıklama/tekrar istek aynı kaydı çoğaltmaz; düzenleme mevcut kimlik ve sürüm üzerinden yapılır.
12. Değişmiş taslakla başka kayıt/sayfa/sekme açma, kapatma, geri veya yenileme koruması sürer. Aynı anda çakışan iki işlem formu açılmaz. Hata durumunda girilen veri korunur; kaydetme başarılıymış gibi kapanmaz. Yeni bir taslak önceki kaydın tutarını, tarih seçimini veya ödeme seçimlerini yanlışlıkla devralmaz.
13. Kaydetme sonrasında aktif filtre/sıralama korunur. Yeni kayıt filtre dışında kalırsa kaydın başarıyla oluştuğu ve ilgili kayda erişim açıkça gösterilir; kaydı görünür yapmak için filtreler sessizce temizlenmez.

## Bölüm bazında uyarlama

| Bölüm / kayıt türü                            | Satır içi girişin yeri ve temel uyarlama                                                                                                                         | Finansal veya işlevsel sınır                                                                                                                                |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cari hareketleri                              | Referans model; yeni sütun sırası, kompakt Taslak/eylemler ve sütuna oturan ek alanlar                                                                           | Son personel kararı geçerli: manuel Maaş Ekle kaldırılacak; maaş/yemek otomasyon notları bu yayılımın ayrı kapsamıdır.                                      |
| Tahsilat & Ödeme                              | Hareket listesinin sonunda yeni işlem satırı; cari, kaynak/hedef hesap ve türüne göre gerekli alanlar kendi satırında/altında                                    | Farklı hesapları birleştiren listede tek bir hesap bakiyesi uydurulmaz. Ödeme/tahsilat yönü ve gerçek nakit etkisi açık kalır.                              |
| Banka / kasa / KMH hareketleri                | Seçili hesabın hareketleri içinde yeni satır; hesap bağlamı önceden belirli, tekrar seçtirilmez                                                                  | Para girişi/çıkışı ve aktarım farklı türlerdir. Aktarım kaynak/hedef ilişkisi alt alanlarda görünür; mevcut tek işlem modeli korunur.                       |
| Hesapların gelecek dönem hareketleri          | İlgili plan listesi içinde yeni satır; plan tarihi ve gerekli hesap alanları                                                                                     | Plan henüz gerçekleşmiş para hareketi gibi bakiyeye işlenmez. Gerçekleştirme aynı kayda bağlı yapılır.                                                      |
| Kredi kartı harcaması / iadesi                | Seçili kartın ilgili hareket listesinde taslak; kart bağlamı sabit, dönem/taksit gibi alanlar gerektiğinde altta                                                 | Harcama kart borcudur; banka ödemesiyle karıştırılmaz. Taksit toplamı ve kart dönemi korunur.                                                               |
| Kart borcu ödemesi / nakit avans              | İlgili kart hareket listesi içinde, tıklanan eyleme uygun türle açılan satır; kaynak banka/kasa veya para hedefi zorunluluğu görünür                             | Kart borcunu ödemek ikinci bir alış/gider oluşturmaz. Karttan karta ödeme sınırları gevşetilmez.                                                            |
| Ekstre ekleme / düzeltme                      | Ekstre bölümünde tanımlı ekstre satırı içinde genişleyen giriş; tarih, toplam ve son ödeme bilgisi aynı bağlamda                                                 | Ekstre tanımlamak yeni harcama üretmez. Harcama taslağının sütunları ekstreye zorla uygulanmaz.                                                             |
| Ödeme Planı                                   | Takvim korunur; seçili günün detay listesinde yeni plan satırı. Öde/Tahsil et/Gerçekleştir de ilgili günün mevcut satırında açılır                               | Hatırlatma, plan ve gerçekleşmiş işlem ayrılır. Takvimde görünmesi ikinci bir finansal olay üretmez.                                                        |
| Araç bakım / poliçe / diğer takip             | Seçili aracın ilgili listesinin sonunda taslak kayıt satırı; tarih, tür, açıklama, tutar/ödeme durumu bağlama göre hizalanır; km, poliçe ve dönem altta          | Takip kaydı ile ödeme bağlantısı ayrıdır. Mevcut gideri bağlamak ikinci bir ödeme yaratmaz; ödenmemiş takip kaydı ödenmiş sayılmaz.                         |
| Kampanya tanımı / katılım / kazanım           | Kampanya listesinde yeni taslak satırı; koşullar alt alana açılır. Var olan kampanyaya ait katılım/kazanım girişi o kampanyanın genişleyen satırında kalır       | Puan, TL, taksit ve erteleme ayrı birimlerdir. Kazanım metadatası kendiliğinden kasa hareketine dönüşmez.                                                   |
| Yeni cari / hesap / kredi kartı / araç tanımı | İlgili ana listede yeni taslak satır/kart; kimlik alanları üstte, diğer bilgiler aynı satırın altında. Tablosuz listede mevcut kart/satır hizası referans alınır | Varlık tanımlama, hareket eklemeyle tek formda birleştirilmez. Açılış bakiyesi varsa gerçek etkisi açık gösterilir; boş alanlara varsayımsal borç eklenmez. |
| Kullanıcı yönetimi                            | Mevcut kullanıcı listesinde ekleme/düzenleme satırı; rol, ad ve giriş bilgileri aynı kaydın altında                                                              | Yönetici yetkileri ve mevcut kullanıcı/parola değiştirme kuralları korunur; finansal işlem alanları eklenmez.                                               |
| Genel bakış / bildirim kısayolları            | Kısayol, doğru kaynak listesini açıp ilgili yeni/mevcut satırı etkinleştirir; bağımsız sayfa altı form açmaz                                                     | Hedef cari/hesap/kart/tarih bağlamı taşınır; aynı kayıt iki farklı yerden yeniden oluşturulmaz.                                                             |
| Raporlar                                      | Mevcut hareketin izin verilen düzenlemesi kendi satırında; yeni işlem gerekiyorsa doğru kaynak listeye yönlendirme                                               | Rapor salt görüntüden yeni bir finansal kaynak haline getirilmez. Karma rapora sahte Bakiye veya gereksiz yeni kayıt düğmesi eklenmez.                      |
| Ayarlar / Görünüm ve bilgiler                 | Liste halinde eklenen bir kayıt varsa o listenin kendi satırında; normal ayarlar kendi alanlarında kalır                                                         | Ayar, yedek alma/geri yükleme ve sistem güncellemesi işlemleri kayıt tablosuna zorlanmaz. Yeni ayar veya işlev icat edilmez.                                |

## Mobil ve dar ekran

- Yeni kayıt ilgili listenin akışında kalır. Masaüstü yedi sütunu küçük ekrana sıkıştırmak yerine listenin mevcut mobil satır/kart düzeni kullanılır; ana alanlar ve alt bilgiler aynı kayıt yüzeyindedir.
- Mevcut görünümde hangi sütun/alan çizgileri kullanılıyorsa giriş alanları da onları paylaşır. Ekran değiştiğinde alanlar uygun bitişik sütunları yeniden kaplar. Tarih gibi kompakt alanlar gereksiz büyütülmez.
- Ekrana sabitlenen eski ekleme dock'u geri gelmez. Mobil klavye açıkken aktif alan ve Kaydet/Vazgeç erişilebilir kalır; kaydırma ilgili satıra yapılır, içerik veya alt gezinme üzerine ikinci bir panel binmez.
- Kaydet/Vazgeç en az 44 px dokunma hedefini korur. Açıklama ve para tutarları kesilmez, yatay sayfa taşması oluşmaz. Alan etiketleri dar görünümde görünür ve anlaşılır kalır.

## Mevcut kararlarla ilişki

- Onay verilirse bu tasarım, ilgili bölümlerdeki eski ayrı alt ekleme paneli kuralının yerini alacak. Yeni cari/hesap/kart/araç için mevcut tam sayfa ekleme akışını kendi listesinde satır/kart girişine taşıma da bu taslakta açıkça öneriliyor; yalnız işlem eklemeyle sınırlı tutulmuyor.
- Sade Netlik paleti, tipografi, ikonlar, ortak arama/filtre/sıralama, veri/izin kuralları ve sayfa kabuğu korunur. Cari bilgileri, tedarikçi POS/kampanyaları veya personel takvimi ilgisiz modüllere kopyalanmaz.
- Global yerleşim sözleşmesindeki ayrı Hızlı işlem alanının bu kapsamdaki kullanımı sonlandırılır; form ilgili ana içerik listesinin parçası olur. Bu değişiklik sidebar/header veya tek kaydırma sahibi kuralını değiştirmez. Boş alt bölge/pay bırakılmaz.
- Cron kurulumunun ertelenmesi korunur. Bu analiz otomatik tahakkuku etkinleştirme, canlı veri üretme veya sunucuya bağlantı izni değildir.

## Uygulama onayı sonrası kabul ölçütleri

- Etkilenen her bölümde yeni kayıt ve düzenleme doğru kaynak satırında açılır; eski sayfa altı formu DOM'da veya boşluk olarak kalmaz.
- Ana alanların metin başlangıçları, kutu kenarları ve ek alanların sütun birleşimleri doğrulanır; zorunlu alanlar açılırken ana satırın ölçüleri ve ikon hizası değişmez.
- Çoklu çözünürlük, geniş/dar sidebar, mobil klavye ve kısa pencere senaryoları incelenir. Aynı veri alanı dar/geniş ekranda gerektiği kadar sütun kaplar.
- Filtre/sıralama, boş liste, kaydın filtre dışında kalması, değişmiş taslaktan ayrılma, sunucu hatası ve hızlı çift kaydetme sınanır. Gerçekleşmiş/planlı ayrımı ve kaynak/hedef bağlamı korunur.
- Finansal tutarlar, bakiyeler, kart borcu, ödeme bağlantıları ve toplamların önceki davranışı uygun entegrasyon testleriyle karşılaştırılır. Yalnızca arayüzün benzemesi yeterli kabul edilmez.

Bu kapsamın tasarım onayı 18 Kasım 2026'da alındı. Yeni işlem bağlantılarının kaynak sayfaya gitmesi kuralı aşağıda kapsama eklendi. Henüz uygulama kodu, sürüm numarası, ZIP, cron görevi veya GitHub yayını değiştirilmedi.

## Onay sonrasında eklenen karar: işlem özetinden kaynak satıra gitme

Kullanıcı, Genel bakıştaki Dikkat isteyenler ve Son hareketler, cari listesindeki Son 5 işlem ve benzer alanlardaki kayıt bağlantılarının pencere açmasını kaldırmak istedi. Kayıt, bulunduğu asıl sayfada ve ilgili sekmede aktif satır olarak açılacak. Bu yeni istek tasarım kapsamına eklendi; kodlanmadı.

### Ortak davranış

- Bir işlem özetine tıklamak kayıt görüntüleme/düzenleme penceresi açmayacak. Doğru cari/hesap/kart/araç/kampanya sayfasına, gerekiyorsa doğru dönem/sekme seçilerek gidilecek.
- Hedef kayıt kimliğiyle bulunacak; ilgili satır görünür alana kaydırılacak ve mevcut aktif/genişletilmiş satır durumuyla seçilecek. Yalnız sayfanın başına gitmek veya cari kartını seçmek yeterli sayılmayacak.
- Tıklama yalnız gezinme ve satır seçimi yapacak. Düzenleme modu açılmayacak, plan gerçekleşmiş sayılmayacak, ödeme yapılmayacak veya yeni kayıt oluşturulmayacak. Gerçek düzenle/öde/iptal eylemleri kaynak satırda açıkça seçilecek.
- Özet belli bir cari/hesap/kart bağlamını gösteriyorsa o bağlam korunacak. Bağlamı olmayan genel işlem listesinde cari bağlantılı kayıt cariye; carisiz kart hareketi karta; carisiz banka/kasa hareketi hesaba yönlendirme için başlangıç kuralı olacak. Kaynak/hedef içeren işlemde tıklanan özetin temsil ettiği taraf esas alınacak; bir işlem için rastgele ekran seçilmeyecek.
- Satırı ilk 30 kayıt dışında kalan hareketlerde gereken kayıtlar yüklenip hedef görünür yapılacak. Kayıt dönem filtresi veya arama yüzünden gizliyse yalnız sayfayı açıp görünmez bırakılmayacak; hedefi gösterecek görünüm seçilecek ve geçici kapsam değişikliği kullanıcıya açık olacak. Mevcut liste tercihleri/geri dönüş konumu korunacak; filtreler sessizce silinmeyecek.
- Geri düğmesi kullanıcıyı geldiği özet/listenin filtre ve kaydırma konumuna döndürecek. Mevcut taslak varsa gezinme başlamadan taslak koruması çalışacak; yumuşak geçiş ve hareket azaltma kuralları korunacak.
- Erişilemeyen/silinmiş kayıt için açık bir bilgi gösterilecek; başka kayıt seçilmeyecek veya eski pencere akışına dönülmeyecek. Görüntüleme yetkisi olmayan kayda erişim verilmeyecek.

### Taranacak giriş noktaları ve hedefler

| Giriş noktası                                                                                                   | Hedef davranış                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Genel bakış → Dikkat isteyenler / Son hareketler                                                                | İşlemin kaynak cari/hesap/kart sayfası; ilgili satır aktif.                                                                                                         |
| Cari listesi → Son 5 işlem ve benzer son hareket alanları                                                       | İlgili cari detayı ve işlem satırı; cari bağlantısı olmayan kayıtta doğru kaynak hesap/kart.                                                                        |
| Hesap özeti, yaklaşan/gecikmiş hesap uyarıları                                                                  | İlgili hesap, gerçekleşmiş veya gelecek dönem sekmesi ve hedef satır.                                                                                               |
| Kart özeti, ekstre ve dönem içi işlem bağlantıları                                                              | Doğru kart ve doğru ekstre/dönem; işlem veya ekstre satırı aktif. Kart ödemesi başka bir harcama gibi açılmaz.                                                      |
| Bildirim merkezi / zil önizlemesi / kritik veya vade bildirimleri                                               | Bildirimin hedef kaydı kendi bölümünde aktif; araç/kampanya uyarısı cari sayfasına zorlanmaz.                                                                       |
| Ödeme Planı → kayıt görüntüleme bağlantısı                                                                      | İlgili kaynağa gider ve satırı seçer. Öde/Gerçekleştir gibi ayrı eylemler onaylı satır içi modelini kullanır; sadece görüntüleme tıklaması bu eylemleri tetiklemez. |
| Rapor satırları, genel arama sonuçları, araç/kampanya içindeki bağlı işlem bağlantıları ve diğer benzer özetler | Aynı kaynak kaydı bulma ve satırı aktif gösterme kuralı; artık ayrı kayıt penceresi yok.                                                                            |

Bu istek kayıt bağlantılarının davranışını değiştirir. Takvim, seçenek listesi, taslak terk etme onayı veya kaydın kendi denetim geçmişi gibi farklı amaçlı küçük pencerelerin tamamını kaldırma talebi olarak yorumlanmaz.

### Uygulama kabulüne eklenecek kontroller

- Belirtilen tüm özetler ve kaynak taramasında bulunan benzer bağlantılar envantere alınır; aynı kayıt bağlantısının bir yerde pencere, başka yerde yönlendirme yapması bırakılmaz.
- Cari, banka, kartın geçmiş ekstresi/dönem içi/gelecek dönemi, eski hareket, aktif filtre, arşivli/iptal kayıt ve görüntüleyici yetkisi senaryolarında doğru hedef doğrulanır.
- İlk sayfada olmayan kayıt görünür/aktif gelir; geri dönüş ve değişmiş taslak koruması çalışır. Ekranın değişmesi finansal yan etki üretmez.
