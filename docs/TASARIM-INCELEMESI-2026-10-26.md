# Finans Paneli — ortak tasarım incelemesi

26 Ekim 2026. **Durum: incelemedeki A1–A4 ve B1–B10 önerilerinin tamamı kullanıcı tarafından onaylandı; uygulama bekliyor.** Uygulama kodu değiştirilmedi, paket veya yayın hazırlanmadı. Kullanıcının sonraki takvim hatırlatması da bütün tek gün ve tarih aralığı seçimlerini kapsayan bulanıklıksız bağlı pencere kuralı olarak sonraki sürüm notlarına eklendi.

## Kapsam ve kanıt

Finans 1.8.0, şema 9, bu inceleme için oluşturulmuş izole PHP/MariaDB demosu. Canlı hosting veya gerçek veriler incelenmedi/değiştirilmedi. Gezinme, başlıklar, özetler, iki sütun düzenleri, ikonlar ve boşluklar; on menü ve ilgili detaylar üzerinde tarandı. 1440 × 1000 masaüstü, 1100 × 900 tablet ve 390 × 844 mobil pencereler kullanıldı.

Bu koşuda Playwright ve yerel Chromium ile 24 güncel ekran yakalandı; kaydedilen görüntülerin tamamı açılıp incelendi. Geçmiş ekran görüntüleri kanıt olarak kullanılmadı. DOM, hesaplanmış CSS ve kontrol sınırlarıyla ölçümler desteklendi. Sayfa yatay taşması ve React çalışma zamanı hatası gözlenmedi; bununla birlikte bazı kontroller kendi kapsayıcılarında örtüşüyor. Dolayısıyla yalnız `scrollWidth` kontrolü yeterli değil.

- Görsel rapor ve adım adım ekranlar: [report.html](../.qa/design-audit-20261026/report.html).
- Ölçümler: `.qa/design-audit-20261026/measurements.json` ve `focus-measurements.json`.
- Her ekranın erişilebilir DOM görüntüsü aynı dizinde `*-dom.txt` dosyasında.
- Tarihlerde görünen 13 Ekim 2026, sabit sentetik demo günüdür; inceleme tarihi değildir.

## Genel sonuç

Sitede tamamen farklı bir görsel sistem yok: Inter, Lucide, sayfa başlıkları, ortak arama ve ana eylemler çoğunlukla aynı dili kullanıyor. Asıl ayrışma sayfa kompozisyonunda: özetlerin paketlenmesi, sağ sütunun genişliği, detay başlığı ve sekme/araç gruplarının yerleşimi. Öncelik ikon ailesini veya bütün CSS'i değiştirmek değil, bu ortak iskeleti ve doğrulanmış mobil örtüşmeleri düzeltmek olmalı.

**Korunacaklar:** Ölçülen ana başlıklar masaüstünde 27 px, mobilde 24 px. Standart bölüm başlıkları 16 px. Ana ekle/sırala/CSV kontrolleri çoğunlukla 44 × 44 px, eylem çizimleri 18 px. Ortak arama ve bağlı filtre davranışı tutarlı. Finansal tabloların sütun sırası, 18 px satır dolgusu, bakiye/tutar anlamları ve mevcut hesap modeli bu tasarım çalışması nedeniyle değiştirilmemeli.

## A. Önceden onaylanmış, henüz uygulanmamış kararların karşılığı

### A1 — Raporlarda özet yüzeyi: yüksek öncelik

**Kanıt:** Adım 9 ve 17. Raporlar masaüstünde dört bağımsız panel, mobilde dört ayrı tam genişlikli kutu kullanıyor. Finansal görünümdeyse tek çerçeve içinde bölümlenmiş özet var. Mobilde ayrı kartlar grafiği ekranın oldukça altına itiyor.

**Öneri:** Rapor metriklerini aynı tek özet bileşeninin içine alın. İç metrik sayısı ve etiketler sayfaya özgü kalsın. Dönem özeti ile güncel bakiye açıkça ayrı adlandırılsın. Mobilde tek dış çerçeve korunarak okunabilirliğe göre 2×2 veya tek kolon iç düzen uygulansın. Yeni finansal hesaplama gerekmez.

Kaynak: `src/Reports.jsx:10`, `src/styles/system.css:8`; referans `src/styles/base.css:414`.

### A2 — Sağ sütun oranları: yüksek öncelik

**Kanıt:** Aynı 1440 px görünümde:

| Ekran | Ana / sağ sütun | Oran | Ara boşluk |
|---|---:|---:|---:|
| Finansal görünüm | 746,9 / 393,1 px | 1,90:1 | 20 px |
| Hesaplar | 860 / 280 px | 3,07:1 | 20 px |
| Ödeme Planı | 852 / 290 px | 2,94:1 | 18 px |

Adım 1, 4 ve 5. Hesaplar ve Ödeme Planı sağ sütunları referansa göre daha dar; tarih, tutar ve açıklamalar daha yoğun sarılıyor.

**Öneri:** Sağ sütun kullanılan ekranlarda ortak masaüstü 1,9:1 ve 20 px boşluk uygulayın. Daralınca ortak, okunabilirliği koruyan kırılımlar kullanın. Takvimde gün hücreleri sıkışıyorsa bu, sayfaya özel başka bir oran tanımlamak yerine ortak tek sütun kırılımıyla çözülmeli. Raporlar veya Kullanıcılar gibi sayfalara sırf simetri için sağ sütun eklenmemeli.

Kaynak: `src/styles/base.css:472`, `src/styles/system.css:174`, `src/styles/calendar.css:2`.

### A3 — Kredi kartları ve Hesaplar: onaylı grid/detail geçişi

**Kanıt:** Adım 5–6 ve 18–19. Her iki bölüm hâlâ carousel, sayaç, oklar ve seçili kaydın hareketlerini aynı sayfada gösteriyor. Telefonda hareket sekmeleri ve eylemler farklı satırlara dağılıyor.

**Öneri:** Daha önce onaylanan grid liste → ayrı detay akışını uygulayın. Detay başında ortak dilde yatay özet; altında hareket sekmeleri. Kartın kendi bilgi/düzenleme ikonları kendi üzerinde kalmalı. Hesap türüne özgü alanlar, tüm hesapların uyarıları ve kredi kartı dönem ayrımları korunmalı. Hesaplar'ın alan ayrıntıları kullanıcının istediği sonraki görüşmede netleştirilecek.

### A4 — Alt menü görünürlüğü: onaylı değişiklik

**Kanıt:** Adım 1, 7 ve 24. Kampanyalar masaüstünde sürekli görünür. Mobil Diğer menüsünde Kredi kartları ve Kampanyalar aynı hiyerarşide ayrı satır.

**Öneri:** Alt menüler başlangıçta kapalı olsun; üst menüye tıklanınca açılsın. Kampanyalar, Kredi kartları altında görünsün. Üst öğede açık/kapalı yön ikonu ve `aria-expanded`; klavye ve mobilde aynı davranış. Mevcut sağa oklar ile aç/kapat göstergeleri aynı anlamda kullanılmamalı.

## B. Bu taramada eklenen düzeltme önerileri

### B1 — Mobil Ödeme Planı kontrolleri örtüşüyor: yüksek öncelik

**Kanıt:** Adım 20, ayrıca `focus-measurements.json`. 390 px ekranda Önceki dönem düğmesinin sağı 63 px, tarih alanının solu 54 px: **9 px örtüşme**. Sonraki dönem sağı 343,5 px, Bugün solu 334,5 px: yine **9 px örtüşme**. Tarih alanı 32 px, Bugün 18 px yüksekliğinde. Ekranda Bugün yazısı kısmen örtülüyor. Belgenin yatay taşmaması bu sorunu engellemiyor.

**Öneri:** Dönem gezinmesini `44 px / esnek tarih / 44 px` yapısında çözün; Bugün eylemini bu dar satıra zorlamayın. Aynı panel içinde uygun bir satırda konumlandırın. Tarih tetikleyicisi ve görünüm sekmeleri en az 44 px etkileşim yüksekliğine ulaşmalı. Takvim ve tarih seçimi mantığı korunmalı.

### B2 — Mobil hesap uyarısı tutarın üzerine geliyor: yüksek öncelik

**Kanıt:** Adım 18. 137,3 × 44 px Uyarılar düğmesi, −200,00 TL tutar hücresini yaklaşık 8,6 px dikey olarak örtüyor; DOM sınırlarının kesişimi ayrıca ölçüldü.

**Öneri:** Uyarılara sürekli erişim korunmalı; ancak düğme veri satırlarının üzerine bindirilmemeli. Hareket alanında ayrılmış bir uyarı eylemi veya yer ayrılan sabit eylem bölgesi kullanılabilir. Yalnız z-index veya tutarın rengini değiştirmek çözüm değildir. Grid/detail düzeninde hem liste hem detay için bu erişim planlanmalı.

### B3 — Ödeme Planı başlığı ve özet aynı satıra sıkışıyor: orta/yüksek öncelik

**Kanıt:** Adım 4 ve 20. Üç özet değer masaüstünde sayfa başlığının sağında, mobilde kutusuz bir satırda. Finansal görünümün başlık → özet → içerik sırası burada değişiyor; mobil değerler 14 px seviyesine kadar küçülüyor.

**Öneri:** Sayfa başlığı ayrı satırda kalsın; mevcut üç bilgi hemen altında ortak özet kutusuna taşınsın. Özet sayfaya özgü olabilir, dış görünüş ortak olmalı. Bu, A1 ile aynı bileşende çözülebilir.

### B4 — Panel boşlukları ve başlık hizaları: orta öncelik

**Kanıt:** Adım 2, 8, 11–13. Cari özet 24 px, araç özeti 20 px, araç hatırlatmaları ve hesap uyarıları 16 px kullanıyor. Cari detay başlığı ayrıca 20/22 px dolgulu dış panelin içinde; diğer sayfa başlıkları doğrudan içerik kenarında. Araç detayında geri dönüş bağlantısı başlık ve özet arasında ayrı bir satır oluşturuyor. Raporlarda özet açıklamasının ayrı flex öğesi olması kutular ve grafik arasında ek dikey boşluk üretiyor.

**Öneri:** Aynı rol için ortak ölçü tanımlayın: standart bölüm panelinde masaüstü 24 / mobil 16 px; ana bölümler arasında 24 / 16 px; ilişkili alt öğelerde mevcut 8/12/16/20 ölçeği. Daha yoğun liste/uyarı varyantı gerekiyorsa açık bir ortak varyant olsun. Cari ve araç detaylarında geri dönüş/kimlik/özet yerleşimi ortaklaştırılsın. Her 16 veya 20 px değer hata değildir; tablo hücrelerinin onaylı 18 px ölçüsünü ve yoğun masaüstü satır eylemlerinin 32 px ölçüsünü körlemesine değiştirmeyin.

### B5 — Araç hatırlatmaları listeyi aşağı itiyor: yerleşim önerisi

**Kanıt:** Adım 8. Yaklaşan araç işleri, gridin önünde bütün içerik genişliğini kaplıyor. Üç uyarı bile kartların başlangıcını yaklaşık 497 px seviyesine getiriyor; daha çok uyarı alanı daha da uzatır.

**Öneri:** Masaüstünde araç gridini ana alana, yaklaşan işleri ortak 1,9:1 düzende sağ sütuna almak uygun olur. Mobilde uyarı sayısı/özetinden ayrıntıya erişim korunarak uzun uyarı listesinin gridin önünü kaplaması önlenebilir. Bu öneri, inceleme sonrası verilen toplu onay kapsamındadır; henüz uygulanmadı.

### B6 — Sekmelerin duyarlı yerleşimi ortak değil: orta öncelik

**Kanıt:** Adım 19 ve 22. Kredi kartında Gelecek Dönem ikinci satıra düşüyor. Araç sekmelerinde iki satırdaki boşluk dağılımı dengesiz; alt satırda Bakım ve Muayene birbirinden çok uzak. Araç sekmeleri 36 px, kredi kartı sekmeleri yaklaşık 43 px.

**Öneri:** Ortak sekme başlığı kullanın: en az 44 px etkileşim yüksekliği, tutarlı aralık; dar alanda kapsayıcı içinde kaydırılabilir tek satır. İlgili hareket/kayıt ekleme araçları aynı panelin eylem grubunda kalsın; sayfanın üstüne ayrı, bağlamsız araç satırı eklenmesin. Yeni tasarım onayı olmadan finansal tablo sütunlarını yeniden sıralamayın.

### B7 — İkon ailesi tutarlı; adlandırma ve kullanım bağlamı düzelmeli

**Kanıt:** Adım 5–6, 10, 18–19 ve 24. Lucide ortak; sıralama/CSV/kalem/bilgi çizimleri 18 px. Kredi kartı kontrollerinin erişilebilir adları ise hâlâ Hesap bilgileri ve Hesabı düzenle. Cari hesaplar ve Kullanıcılar menülerinde aynı Users simgesi kullanılıyor. Hesap/Kredi kartı başlıklarında sıralama + CSV + ekle varken diğer başlıklarda yalnız ekle bulunuyor; bu, dar ekranda başlık alanını farklı daraltıyor.

**Öneri:** İşlev başına tek ikon eşlemesi: ekle +, düzenle kalem, bilgi i, sıralama çift ok, dışa aktar indirme. Kart bağlamında Kart bilgileri/Kartı düzenle adları kullanılsın. Üst menü açılımı için açık/kapalı chevron ayrı ele alınsın. Cari ve kullanıcı simgelerini ayırmak yararlı olabilir; ikisi aynı olduğu için bir işlev bozukluğu yok. Grid geçişinde liste sıralama/CSV araçlarını gridin kendi başlığına almak, sayfa başlığını birincil eylemle sade tutabilir; bu yeni yerleşim önerisidir. Marka/program logoları ve kart kimlik simgeleri eylem ikonlarıyla aynı boyuta zorlanmamalı.

### B8 — Mobil dokunma hedefleri: orta öncelik

**Kanıt:** Adım 16–20 ve 22. Filtre çipleri 32 px, sayfalama 36 px, araç sekmeleri 36 px, araç listesine dönüş 21 px. Bazı anasayfa metin eylemleri de 27 px. Ana ekle/sırala/CSV ve bilgi/düzenle düğmeleri mobilde çoğunlukla 44 px; bunların hepsini yeniden tasarlamak gerekmiyor.

**Öneri:** Küçük görünen metin/ikon korunabilir, ama etkileşim alanı en az 44 px olsun ve komşularla çakışmasın. 1100 px dokunmalı tablet kullanımında kart üzerindeki 32 px kontroller de gözden geçirilmeli. 44 px proje hedefinden sapma tek başına bütün WCAG kriterleri için hüküm değildir.

### B9 — Başlık ve grafik rolleri: düşük/orta öncelik

**Kanıt:** Adım 1, 8–9 ve 13. Ana başlıklar 27/24 px ve standart panel başlıkları 16 px ile tutarlı. Araç kart adı ve kampanya detay başlığı 20 px ile ayrı bir rol oluşturuyor. Genel bakış grafik ekseni 32 bin gibi kısa değerler; rapor ekseni 32000 ve daha uzun tarihler kullanıyor. Aynı net nakit sonucu genel bakışta vurgu, rapor özetinde kırmızı gösteriliyor.

**Öneri:** 20 px varlık başlığı gerekiyorsa bunu adlandırılmış ortak rol yapın; yoksa uygun mevcut başlık rolünü kullanın. Grafik ekseni, tarih/birim yazımı ve gösterge dilini ortaklaştırın. Toplu onay doğrultusunda aynı finansal anlam için aynı renk rolü kullanılmalı; hesap etkisi veya para işaretleri değiştirilmemeli. Hesap etkisi ve tutar rengi birbirine karıştırılmamalı.

### B10 — Sayfaya uymayan dipnot ve açıklamalar: düşük öncelik

**Kanıt:** Adım 10 ve 23. Kullanıcılar sayfasında da Banka bağlantısı yok ve Tutarlar Türk lirası dipnotları var. Adım 7 ve 13'te kampanya açıklaması liste önünde ek yer kaplıyor.

**Öneri:** Sayfa altı yardımcı bilgileri bağlama göre gösterin. Kampanya açıklamasını ilgili özet/koşul grubuyla ilişkilendirin. Az kullanıcı veya az kampanya nedeniyle boş kalan alanı doldurmak için gereksiz özetler üretmeyin.

## Önerilen uygulama sırası

1. Mobilde doğrulanmış kontrol/tutar örtüşmelerini giderin; veri ve eylemler erişilebilir kalsın.
2. Ortak sayfa başlığı, tek bölümlü özet ve 1,9:1 içerik iskeletini oluşturun. İlk karşılaştırma Finansal görünüm ↔ Raporlar ↔ Ödeme Planı olsun.
3. Hesap ve kredi kartı grid/detail geçişini, alt menü kuralını bu iskeletle uygulayın. Hesap alan ayrıntıları sonraki kullanıcı görüşmesine bağlıdır.
4. Ortak panel dolgu, sekme ve ikon/eylem varyantlarını diğer menülere taşıyın. Araç sağ sütunu dahil topluca onaylanmış yerleşim önerilerini uygulayın; hesap alanlarının daha ayrıntılı görüşülmesi kararını koruyun.
5. 1440/1100/390/320 px üzerinde, az/çok kayıt ve uzun başlıklarla tekrar görsel kontrol yapın. Tablo içi yatay kaydırma ile bütün sayfanın taşmasını ayrı kontrol edin; güncel bakiye/filtrelenmiş toplam davranışlarını koruyun.

Önerilen küçük ortak bileşen seti: sayfa başlığı, bölümlü özet, ana/sağ sütun iskeleti, bölüm paneli, sekme başlığı ve bağlama göre adlandırılan ikonlu eylem. Büyük bir yeniden yazım veya yeni ikon/kaydırma kütüphanesi gerekmiyor. Ortak kuralların sayfa başına çoğaltılması yerine mevcut bileşen ve tokenlar üzerinden merkezileştirilmesi önerilir.

## Ekran adımları ve genel durum

Aşağıdaki her adımın kabul edilmiş görüntüsü, notuyla birlikte görsel raporda bulunur.

| Adım | Ekran | Genel durum |
|---:|---|---|
| 1 | Finansal görünüm, 1440 | Ortak referans; menü kuralı bekliyor |
| 2 | Cari hesaplar listesi, 1440 | Özetin boş alan/hizası iyileştirilebilir |
| 3 | Tahsilat & Ödeme, 1440 | Büyük ölçüde tutarlı |
| 4 | Ödeme Planı, 1440 | Özet ve sütun oranı ayrışıyor |
| 5 | Hesaplar, 1440 | Grid/detail ve ortak oran bekliyor |
| 6 | Kredi kartları, 1440 | Grid/detail bekliyor; ikon adları bağlamsız |
| 7 | Kampanyalar listesi, 1440 | Temel düzen tutarlı; hiyerarşi bekliyor |
| 8 | Araçlarım listesi, 1440 | Uyarılar listeyi aşağı itiyor |
| 9 | Raporlar, 1440 | Özet kutuları ortak dile uymuyor |
| 10 | Kullanıcılar, 1440 | Temel düzen tutarlı; dipnot bağlamsız |
| 11 | Cari detay, 1440 | Başlık ve özet ortaklaştırılabilir |
| 12 | Araç detay, 1440 | Geri dönüş/özet/boşluk düzeni ayrışıyor |
| 13 | Kampanya detay, 1440 | Metrik hiyerarşisi ve başlık rolü iyileştirilebilir |
| 14 | Anasayfa filtresi, 1440 | Bağlı pencere davranışı uygun |
| 15 | Hesaplar, 1100 | Uyarı erişimi var; tablet hedefleri gözden geçirilmeli |
| 16 | Finansal görünüm, 390 | Tek özet yüzeyi korunuyor; küçük metin eylemleri var |
| 17 | Raporlar, 390 | Ayrı özet kartları grafiği aşağı itiyor |
| 18 | Hesaplar, 390 | Uyarı düğmesi tutarı örtüyor |
| 19 | Kredi kartları, 390 | Sekmeler/araçlar farklı satırlara dağılıyor |
| 20 | Ödeme Planı, 390 | Tarih gezinme kontrolleri örtüşüyor |
| 21 | Kampanyalar, 390 | İçerik ve ana düğmeler sığıyor |
| 22 | Araç detay, 390 | Sekmeler dağınık ve küçük hedefler var |
| 23 | Kullanıcılar, 390 | Temel düzen tutarlı; finans dipnotu gereksiz |
| 24 | Mobil Diğer menüsü, 390 | Kampanyalar yanlış hiyerarşide sürekli görünür |

## Kanıt sınırları

Bu çalışma tam erişilebilirlik sertifikasyonu veya tüm işlevlerin doğruluk testi değildir. Fiziksel telefon, ekran okuyucu ve tüm klavye sıraları denenmedi. Ekrandaki ölçümler ve DOM semantiğiyle görülebilen erişim riskleri belirtildi. 320 px, boş durumlar, tüm çok uzun adlar ve farklı roller bu tasarım taramasının ekran kapsamına dahil edilmedi; uygulama sonrası kontrol planına eklendi. İncelemede finansal kayıt düzenleme/silme/kaydetme veya canlı veri erişimi yapılmadı; yeni demo yalnız bağımsız test veritabanında üretildi.
