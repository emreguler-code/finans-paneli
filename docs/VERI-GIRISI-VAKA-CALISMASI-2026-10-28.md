# Veri giriş sistemi — ürün içi vaka çalışması

28 Ekim 2026 · Finans Paneli 1.11.0 · Analiz ve öneri, uygulama onayı değildir.

## Kapsam ve yöntem

Amaç, yeni cari / kredi kartı / finansal işlem girişini aynı ürünün parçaları haline getirmek; bilgi kaybetmeden ilk kaydı kolaylaştırmak ve finansal etkiyi anlaşılır kılmak.

Mevcut sürüm izole sentetik demo üzerinde Chromium ile 1440×1000 ve 390×844 görünüm alanlarında açıldı. 12 ekran durumu kaydedilip incelendi; cari taslağını Esc ile kapatma ayrıca denendi. Form açma, tür değiştirme, ödeme seçeneği değiştirme ve boş kart formunda doğrulama incelendi. Hiçbir yeni finansal kayıt veya cari/kart kaydedilmedi. Demo başlatıcısının kendi izole kontrolleri bu UX çalışmasından ayrıdır.

Kanıtlar `.qa/forms-case-2026-10-28/` altında; ölçümler `evidence.json` dosyasında. Bunlar yerel QA materyalleridir, GitHub'a yayımlanmış görseller değildir. Bulgular uygulama ekranları ve kaynak kodla desteklenmiştir; dış ürün araştırması veya kullanıcılarla yapılmış kullanılabilirlik testi değildir. Fiziksel iPhone, gerçek sanal klavye, ekran okuyucu, sunucu hatası ve kayıt sonrası başarı akışı bu çalışmada test edilmedi. Tam erişilebilirlik uygunluğu iddiası yoktur.

İlgili kaynaklar: `src/EntityDialog.jsx`, `src/EventForm.jsx`, `src/PartyProfileFields.jsx`, `src/ui.jsx`, `src/styles/forms.css`, `docs/TASARIM-ILKELERI.md`.

## Bulgular

### Güçlü temel

- Ortak Sheet kabuğu zaten var: başlık, kapatma, kaydırılabilir içerik ve sabit Vazgeç/Kaydet satırı.
- Modal odağı, Tab döngüsü, arka alanın inert yapılması ve kapandıktan sonra önceki odağa dönüş için kod mevcut. Bu, tüm yardımcı teknoloji senaryolarının test edildiği anlamına gelmez.
- Ortak para ve tarih bileşenleri, işlem bağlamına göre değişen seçenekler, kayıt sürümü ve çoğu kayıt akışında tekrar isteği koruyan requestId kullanılıyor. Yeni tasarım bunları korumalı.
- Cari ayrıntılarını sonradan doldurma yaklaşımı ve yalnız ilgili işlemde görünen hesap alanları doğru başlangıçtır.

### A. Ortak kabuk var, ortak içerik mimarisi yok — yüksek öncelik

Cari formunda açılış ve iletişim bölümleri kapalı; kart formunda 13 alan tek sıra halinde açık. İşlem formunda operasyon, ödeme şekli ve finansal hesap değiştikçe yeni alanlar araya giriyor. Kullanıcı her formda bilgiyi nerede bulacağını yeniden öğreniyor.

Kartın masaüstü içerik yüksekliği 1411 px, kullanılabilir kaydırma alanı 776 px. Mobilde 1391/660 px. Bu ölçüm dolum süresi değildir; temel kart bilgileri için bile uzun tarama gerektiğini gösterir. Ödeme ağı/bağlı hesap gibi ayrıntılar, zorunlu ekstre tarihinden önce geliyor.

### B. Açılır bölüm sayısı tek başına çözüm değil — yüksek öncelik

Cari formunda telefon ve e-posta ayrı büyük bölümler. Bu, boş alanları saklasa da beş-altı menüyle uğraşmaya yol açıyor. Tedarikçi ziyaret günleri ise kapalı özellikler bölümünün dışında yedi onay kutusuyla doğrudan görünüyor. Türü tedarikçiye değiştirmek içerik yüksekliğini 710 px'den 1318 px'e çıkardı; farklı içerik nedeniyle pencere üst konumu da değişti.

Çözüm, her alanı ayrı akordeona koymak değil; kullanıcının işine göre anlamlı az sayıda grup kurmak.

### C. İşlem tarihi ve ödeme mantığı ikinci plana düşüyor — yüksek öncelik

Bağımsız işlemde tarih; açıklama, etiket ve planlama seçiminden sonra. Tedarikçi alışında Hemen öde seçilince hem Tutar hem Şimdi ödenen alanı açılıyor; tam/kısmi ödeme ayrımı görsel olarak açıklanmıyor. İşlem türü ve cari seçimi değiştiğinde finansal anlam değişmesine rağmen kaydetmeden önce tek bir etki özeti yok.

Seçili hesap aktif listedeki ilk hesap olarak gelebiliyor. Bu kolaylık sağlasa da kullanıcının kaynağı doğrulamadan yanlış hesapla kayıt oluşturması riskini artırıyor. Formun nereden açıldığı görünür bağlam olmalı.

### D. Veri kaybı ve hata kurtarma ortaklaştırılmalı — yüksek öncelik

Cari adını doldurup Esc'e basınca form onaysız kapandı. Bu mevcut tasarım belgesindeki Esc/dışarı iptal davranışıyla uyumludur; hata olarak gizlice değiştirilecek bir ayrıntı değil, değiştirilmesi önerilen ürün kararıdır.

Boş kart formu kaydedilmedi ve kart adı odağa geldi. Yerel tarayıcı doğrulamasında İngilizce mesaj görüldü. Sunucu hatası için formların sonunda genel `role=alert` metni var; alan yanında ortak hata sunumu ve kapalı bölüme yönlendirme sistemi yok. İlk eksik alana erişim ile tüm hataları anlaşılır listeleme birlikte tasarlanmalı.

### E. Ortak görsel hiyerarşi eksik — orta öncelik

Kart limiti ve açılış borçlarının para alanları, kimlik alanlarından daha iri. Fakat birden çok para alanı aynı anda aynı ağırlığı taşıyor. Kartın limitini, başlangıç borcunu ve günlük işlem tutarını aynı görsel önemle sunmak yerine tek öncelikli alan belirlenmeli.

İşlem düğmelerinin bir kısmı kırmızı/yeşil, seçili durumu da çerçeveyle anlatılıyor. Finansal yön korunmalı; seçim tek başına renge dayanmasın. Metin, belirgin seçili işareti ve erişilebilir durum birlikte çalışmalı.

## Ortak form sözleşmesi

Tüm formlar aynı sırayı izler; alanları zorla aynılaştırmaz:

1. **Başlık ve bağlam:** Kredi kartı ekle / Cari ekle / İşlem ekle. Gerekirse hemen altında Yıldız Tedarik · Tedarikçi gibi kısa bağlam. Genel FİNANS etiketi ancak yararlıysa; yüksekliği büyütmemeli.
2. **Temel bilgiler:** İlk kaydı tamamlamak için gerçekten gereken alanlar. Tür gibi diğer alanları etkileyen seçim başta. Zorunluluk yalnız gerçek kurala göre belirtilir.
3. **İşleme bağlı bilgiler:** Ekstre takvimi, ödeme şekli, kaynak/hedef gibi kaydın doğruluğunu belirleyen alanlar. Bunlar sırf form kısalsın diye gizlenmez.
4. **İsteğe bağlı ayrıntılar:** Az sayıda anlamlı bölüm; başlık altında girilen bilgiyi özetler. Örneğin İletişim · Telefon eklendi veya Tedarikçi bilgileri · 2 POS, Pzt/Çrş/Cuma.
5. **Sonuç özeti:** Yalnız finansal anlam taşıyan kayıtlarda kısa, metinli etki açıklaması. Ayrı onay ekranı zorunlu değil; form içinde kaydetmeden önce görünür. Eksik veri varsa sonuç uydurulmaz.
6. **Sabit eylem satırı:** Vazgeç + Cariyi ekle / Kartı ekle / İşlemi kaydet. İşlem sürerken Kaydediliyor; çift gönderim korunur.

Kalıcı başlık ve alt eylemler, yalnız içerikte dikey kaydırma; içerik içinde ikinci kaydırma kutusu yok. Masaüstünde aynı pencere ailesi; ilişkili iki kısa alan yan yana olabilir, bağımsız konular keyfi iki sütuna dağılmaz. Form genişliği için 560–640 px prototip başlangıç aralığıdır, onaylı yeni token değildir. Mobilde aynı bilgi sırası ve tek sütun; dar ekranı daha iyi kullanan tam genişlikli görünüm değerlendirilebilir. Sistem klavyesi açıkken aktif alan ve eylemler gerçek cihazda ayrıca doğrulanmalı.

Inter, mevcut teal/yeşil/kırmızı/uyarı paleti, 4/8/12/16/20/24/32 boşluk ölçeği, alan/düğme minimum 44 px ve mobil 16 px giriş metni korunur. Yeni ölçüler gerekiyorsa önce mevcut rollerle karşılaştırılır. Alanlar küçültülerek veya açıklamalar silinerek sığdırılmaz.

## Üç uygulama senaryosu

### 1. Cari ekleme

Önerilen sıra: Cari türü → Kısa ad → Türe göre Ticari unvan / Ad soyad.

- **İletişim ve adres:** Telefon, e-posta, adres, vergi dairesi/numarası. Kendi içinde küçük başlıklar; her telefon için ayrı üst düzey bölüm yok.
- **Başlangıç bakiyesi:** Kapalı ve varsayılan sıfır. Açılınca tutar, Alacak/Borç, açılış tarihi ve isteğe bağlı vade. Yön açıklaması örnek cümleyle gösterilir: Bu cariden 5.000 TL alacağınız var.
- **Türe özel bilgiler:** Tedarikçide POS ve ziyaret günleri; personelde dönem/izin bilgileri. Yeni personelin henüz bulunmayan ödemelerini bağlamaya çalışmak yerine bu işlemin sonradan detay ekranında yapılabileceği belirtilir. Müşteride ilgili olmayan bölüm gösterilmez.
- **Notlar:** Ek ayrıntı alanı.

Tür değiştirildiğinde kullanıcının ortak alanları korunur; önceki türe özel girilmiş verinin kaybolacağı durumda açık uyarı/geri dönüş olmalıdır. Otomatik olarak eski ödeme/finansal işlem yaratılmaz. Düzenlemede opsiyonel cari gerekçesi kararı korunur.

### 2. Kredi kartı ekleme

- **Kart kimliği:** Banka → uygun program → değiştirilebilir kart adı → toplam limit. Banka seçilmesi zorunlu değilse Diğer / Belirtilmedi yolu korunur. Uygun program listesi mevcut kodda zaten bankaya göre süzülüyor; yeni özellikmiş gibi yeniden önerilmez. İyileştirme sıralama ve ad önerisidir.
- **Ekstre takvimi:** Aylık hesap kesim günü ile bankanın bildirdiği son ekstre kesim/son ödeme tarihi ayrı anlamlarıyla aynı grupta. Bugünün kesim günü olduğu varsayımı kullanıcıya doğrulanmış banka bilgisi gibi sunulmaz.
- **Mevcut borçla başlat:** Kapalı; açılınca toplam başlangıç borcu ve bunun içindeki ekstre borcu. Örnek: Toplam 12.000 TL = Ekstre 8.000 TL + Ekstre dışı 4.000 TL. Modeldeki diğer taksit/uzlaştırma anlamları uygulamadan önce mevcut hesaplarla doğrulanır. Ekstre kısmı toplamı aşarsa alan yanında hata.
- **Kart ayrıntıları:** Sahip, son dört hane, ödeme ağı, bağlı hesap. Bağlı hesabın otomatik ödeme oluşturmadığı kısa açıklaması korunur.

Borçsuz yeni kartta da mevcut API'nin zorunlu tuttuğu takip edilen ekstre tarihleri var. Bunları opsiyonel yapıp sadece görünümü değiştirmek doğru değil: ilk prototip mevcut zorunluluğu korur. Gerçek yeni kart için Ekstre henüz oluşmadı desteği ayrıca ürün/API/migrasyon kararı olarak değerlendirilmeli; bu çalışma bunun uygulama onayı değildir.

### 3. İşlem ekleme

Önerilen sıra: Bağlam/cari → İşlem türü → Tutar ve tarih → Tahsilat/ödeme veya aktarım bilgisi → isteğe bağlı ayrıntılar → etki özeti → kaydet.

- Cari detayından açıldıysa cari görünür ve sabit; tekrar seçtirilmez. Genel menüden açıldıysa aranabilir cari seçimi; Bağımsız işlem açık seçenek. Uzun listede yerel arama, uygun banka/kasa/kart grupları ve ayırt edici sahip/son hane bilgisi olmalı.
- Tutar tek ana para alanı; tarih yakında. Vade ile işlem tarihi karıştırılmaz, kart dönem tarihi gerektiği yerde açıklanır.
- Alış/satışta **Açık hesap / Tam ödeme-tahsilat / Kısmi ödeme-tahsilat** anlaşılır seçimleri kullanılabilir. Tamda ikinci aynı tutar girişine gerek yok; kısmi seçilince ödenen/tahsil edilen alanı açılır. Bunlar mevcut settled modeline görünüm olarak eşlenir; finansal kurallar değiştirilmez.
- Virman için Kaynak → Hedef ve tutar birlikte. Aynı hesap seçimi önlenir. Kart borcu ödeme ve karttan nakit çekme ayrı işlemler olarak görünür.
- Vade, taksit sayısı, planlanan işlem, kart dönem tarihi gerekli oldukları işlemde görünür; finansal sonucu değiştiren bir seçim belirsiz Ek bilgiler içine gizlenmez.
- Açıklama günlük kullanımda sık girildiği için erişilebilir kalabilir. Etiket, belge no ve saat ortak Ayrıntılar altında özetle gösterilebilir; kullanıcı verisi kaldırılmaz. Açıklamanın yeni kayıtta opsiyonel olması korunur.
- Personel maaş tahakkuku ile maaş ödemesi açıkça ayrılır. Düzenleme gerekçesi gereken finansal kayıtlarda görünür zorunlu alan korunur.

## Etki önizlemesi: örnekler ve sınırlar

Bunlar tasarım örnekleridir, yeni muhasebe kuralları değildir. Nihai önizleme mevcut hesaplama mantığıyla doğrulanmalıdır.

| Senaryo                                           | Kaydetmeden önce anlatılacak sonuç                                                                                                                       |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tedarikçiden 10.000 TL alış, 2.000 TL hemen ödeme | Bu alıştan 8.000 TL açık borç kalır. Seçilen banka/kasadan 2.000 TL çıkar. Cari net etkisi −8.000 TL; mevcut diğer alacak/borçlar ayrıca hesaba katılır. |
| Personele 30.000 TL maaş hak edişi                | Personele borç 30.000 TL artar. Bu kayıt banka/kasadan para çıkarmaz.                                                                                    |
| Bankadan kasaya 5.000 TL virman                   | Banka −5.000 TL, kasa +5.000 TL; toplam nakit değişmez. Gelir/gider oluşturmaz.                                                                          |
| Kredi kartıyla harcama                            | Kart borcu artar; o anda banka/kasadan ödeme çıkmaz. Taksit varsa dönem dağılımı ayrıca gösterilir.                                                      |
| Gelecek tarihe planlanan ödeme                    | Plan kaydedilir; şimdi bakiye değişmez.                                                                                                                  |

Özet yalnız yeşil/kırmızı rakam olamaz; hangi hesap/cari ve hangi etki olduğu yazmalıdır. Gerçek güncel bakiyeye erişilmiyorsa tahmini yeni bakiye gösterilmez. Önizleme sunucu doğrulamasının yerini tutmaz.

## Etkileşim, hata ve taslak kuralları — öneri

- Dokunulmamış formda X/Esc/dışarı tıklama doğrudan kapatabilir. Değişmiş formda yanlışlıkla kapanma için kısa Bu değişiklikler kaydedilmedi uyarısı; Düzenlemeye dön / Vazgeç. Bu mevcut koşulsuz kapatma kararının değişmesidir ve ayrıca onay gerektirir.
- Aynı şekilde cari/işlem türü değişikliği ilgili dolu alanları silecekse sessiz sıfırlama yapılmaz. Geçersiz alanlar API'ye gizlice gönderilmez; kullanıcının güvenli geri dönüşü tasarlanır.
- Alan hatası alan altında Türkçe; çoklu hata üstte kısa özetle alan bağlantıları. Kapalı bölüm açılır, ilk hatalı alana odaklanılır. Hata mesajları alanla programatik ilişkilendirilir, zorunluluk ve seçim durumu ekran okuyucuya iletilir.
- Kaydet düğmesi yalnız işlem sürerken kilitlenir; eksik alan nedeniyle açıklamasız pasif bırakılmaz. Gönderimde doğrulama net geri bildirim verir.
- Ağ hatasında girişler korunur. Başarıyla kaydedilene kadar form kapanmaz; zaman aşımında kör ikinci kayıt oluşturulmaz, mevcut requestId/istek koruması korunur. Uyuşmazlıkta eski veriyi sessizce ezmek yerine anlaşılır sürüm hatası.
- Takvim form içindeki alana bağlı açılır; ikinci modal veya ek blur katmanı oluşturmaz. Dışarı tıklamanın önce takvimi kapatması, taslağı kaybettirmemesi kontrol edilir.
- Şimdilik form taslağını kalıcı localStorage'a otomatik yazma önerilmez. Kapanmayı önlemek ile sonraki girişte eski finansal taslağı otomatik açmak ayrı kararlardır.
- Sık işlem için Kaydet ve yeni ekle ileride isteğe bağlı olabilir; ilk sürümün sabit üçüncü düğmesi haline getirilmez. Cari/hesap bağlamının ne kadarının taşınacağı ayrıca belirlenmeli; eski tutar/borç taşınmaz.

## Alternatiflerin değerlendirilmesi

| Yaklaşım                                      | Güçlü taraf                                                    | Bedel                                                                    | Bu ürün için öneri                                                                                     |
| --------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Bölümlü tek form, ayrıntıları gerektiğinde aç | Bağlam kaybolmaz, kısa günlük giriş hızlı, ortak kabuk korunur | Bölüm sayısı ve hata açılımı iyi tasarlanmalı                            | Varsayılan yaklaşım                                                                                    |
| Çok adımlı sihirbaz                           | İlk görünüm sade, karmaşık ilk kurulumda rehberlik             | Tek işlemi çok sayıda İleri/Geri'ye böler; önceki tutarı görmek zorlaşır | Tüm girişlere uygulanmasın; gelecekte banka verisi içe aktarma gibi özel kurulumda değerlendirilebilir |
| Ayrı tam sayfa düzenleyici                    | Çok uzun/belgeli kayıt için geniş alan ve bağlantı             | Kullanıcıyı mevcut liste bağlamından çıkarır                             | Günlük cari/kart/işlem için varsayılan olmasın; gerçekten uzun yeni bir akışta değerlendirilsin        |

Önerilen karar: aynı kabuk + aynı alan/hata/eylem sözleşmesi + kayıt türüne göre anlamlı bölüm içerikleri. Her forma aynı alanları koymak veya bütün alanları gizlemek hedef değil.

## Öncelik ve uygulama öncesi kabul ölçütleri

1. **Önce sözleşme ve prototip:** Cari (müşteri + tedarikçi), kart, tedarikçi kısmi ödeme örnekleri; masaüstü ve mobil. Zorunlu alanlar görünür; sonradan tamamlanacak olanlar açıkça ayrılır.
2. **Hata ve taslak davranışı:** Boş, kısmi, yanlış tarih/tutar, kapalı bölümde hata, Esc/X/dışarı, tür değiştirme, ağ kesintisi ve çift gönderim senaryoları.
3. **Finansal anlam:** Kısmi ödeme, açılış borcu, personel hak edişi, kart ödemesi, virman, taksit ve plan kaydında önizleme-kaydedilen sonuç eşleşmesi.
4. **Duyarlı görünüm:** 320/390/768/1440 px, uzun ad/IBAN/tutar, yazı büyütme; gerçek mobil klavye, güvenli alt alan, odak görünürlüğü. İç içe dikey kaydırma yok; alt eylem alanı aktif girdiyi örtmez.
5. **Başarı ve geri dönüş:** Doğru liste/detayda eklenen kayıt görünür; önceki bağlam ve filtreler yanlış kaydı gizlemez. Düzenleme/sürüm yetkileri korunur.
6. **Sonra yaygınlaştırma:** Banka/kasa, ekstre, araç, poliçe, kampanya ve kullanıcı formları aynı sözleşmeye göre taranır. Bu ek yüzeyler bu çalışmada etkileşimli olarak denetlenmedi.

Bu ölçütler test planıdır; yeni tasarım henüz uygulanmadığından geçmiş test başarısı gibi sunulamaz. İlk görünümde kaydırma azalması hedeflenir, fakat tüm formları tek ekrana sığdırma veya süre yüzdesi taahhüdü verilmez.

## Yakalanan adımlar ve kanıtlar

Aşağıdaki ekranlar bu inceleme oturumunda kaydedilip görsel olarak kontrol edildi. Ölçümler aynı dizindeki evidence.json'dadır.

1. **Cari oluştur / müşteri:** Kısmen iyi; temel alanlar açık ve ek bilgiler kapalı, iletişim grupları gereğinden parçalı.

![01 — Cari oluştur](../.qa/forms-case-2026-10-28/01-cari-default.png)

2. **Cari türünü tedarikçiye değiştirme:** Sorunlu; isteğe bağlı ziyaret alanı doğrudan açık ve form uzuyor.

![02 — Tedarikçi](../.qa/forms-case-2026-10-28/02-cari-supplier.png)

3. **Kredi kartı ekle / ilk görünüm:** Sorunlu; opsiyonel alanlar önemli takvim bilgilerinden önce.

![03 — Kart başlangıç](../.qa/forms-case-2026-10-28/03-card-top.png)

4. **Boş kartı kaydetmeye çalışma:** Kısmen iyi; kayıt engellenip kart adına odaklanılıyor, hata dili/çoklu hata sunumu ortak değil.

![04 — Doğrulama](../.qa/forms-case-2026-10-28/04-card-empty-validation.png)

5. **Kart formunun altı:** Sorunlu; açılış borcu ve zorunlu ekstre bilgileri uzun kaydırma sonunda.

![05 — Kart alt bölüm](../.qa/forms-case-2026-10-28/05-card-bottom.png)

6. **Bağımsız işlem ekleme:** Kısmen iyi; işlem türleri görünür, tarih ve sonuç özeti geri planda.

![06 — Bağımsız işlem](../.qa/forms-case-2026-10-28/06-event-independent.png)

7. **Virman seçme:** Kısmen iyi; kaynak/hedef var, toplam etki ve sıralama geliştirilmeli.

![07 — Virman](../.qa/forms-case-2026-10-28/07-event-transfer.png)

8. **Tedarikçi açık hesap alış:** Kısmen iyi; cari bağlamı korunuyor, tarih/opsiyonel alan sırası tutarlı değil.

![08 — Açık hesap](../.qa/forms-case-2026-10-28/08-event-supplier.png)

9. **Hemen öde seçme:** Sorunlu; iki para alanının tam/kısmi ödeme ilişkisi yeterince açıklanmıyor.

![09 — Hemen ödeme](../.qa/forms-case-2026-10-28/09-event-supplier-immediate.png)

10. **Mobil kart formu:** Sorunlu; alt eylemler erişilebilir ancak temel kurulum için uzun tarama gerekiyor.

![10 — Mobil kart](../.qa/forms-case-2026-10-28/10-mobile-card.png)

11. **Mobil cari formu:** Kısmen iyi; temel bilgiler okunabilir, isteğe bağlı bölümler listeyi uzatıyor.

![11 — Mobil cari](../.qa/forms-case-2026-10-28/11-mobile-party.png)

12. **Mobil bağımsız işlem:** Kısmen iyi; işlem ve tutar görünür, tarih ilk görünümün altında.

![12 — Mobil işlem](../.qa/forms-case-2026-10-28/12-mobile-event.png)

Ek davranış: Kısa ad doluyken Esc ile cari taslağı kapandı; korunma/uyarı yok. Bu gözlem ayrıca evidence.json'a kaydedildi.
