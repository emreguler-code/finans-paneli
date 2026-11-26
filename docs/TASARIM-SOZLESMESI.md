# Sade Netlik — tek güncel tasarım sözleşmesi

Sözleşme sürümü 1.30, 26 Kasım 2026. Kullanıcının tasarım analizi sonrası açık uygulama talimatıyla yürürlüğe girer. Önceki tasarım belgeleri ve AGENTS sürüm paragrafları tarihçedir. Çelişki halinde bu belge kullanılır; yeni bir kullanıcı kararı uygulamaya alınırken bu belge de güncellenir. Bu belge ürünün finansal hesaplama modelini değiştirmez.

## 1. Konsept ve görsel roller

Ürün dili Türkçe. Amaç yoğun finansal bilgiyi sade, karşılaştırılabilir ve güvenilir sunmak. Yerel Inter, Lucide, tabular rakamlar kullanılır. Porselen #F5F7F8 sayfa, beyaz yüzey, #202C39 metin, #596879 ikincil metin, #087F8C turkuaz vurgu, #147D59 olumlu, #B54343 olumsuz, #955F12 uyarı, #DDE3E8 çizgi. Renk tek başına durum anlatmaz. Palet `theme.css`, tipografi ve bileşen ölçüleri `tokens.css`, kabuk geometrisi `layout-tokens.css` içindedir.

Başlık 27/24 px masaüstü/mobil; bölüm 16 px/600; alt başlık 14 px/500; metin 14 px; yardımcı 12 px; mobil giriş 16 px. Para tek satır kalır; anlamlı büyük tutar kırpılmaz. Kontrol/düğme 44 px asgari; masaüstü tablo içi ikincil eylem 32 px olabilir, mobil hedef 44 × 44 px. İkonlar eylemde 18, yön için 16, gezinmede 20 px. Kontrol köşesi 8, panel 12, zorunlu merkezi onay 14 px. Boşluk ölçeği 4/8/12/16/20/24/32 px. Kompaktlık yazı veya hedef küçülterek sağlanmaz.

## 2. Ortak kabuk

Sidebar, Header, Content, sayfa başlığı, özet, ana içerik, yardımcı içerik, Footer ve form bölgesi ortak sorumluluklardır; her sayfa bağımsız kabuk üretmez. Başlık/kart/içerik kenarları ortak hizadadır. Gerekmeyen bölge boş kart olarak gösterilmez. İçerik en fazla 1500 px; geniş/orta/mobil kenarlar 32/24/12 px; bölüm aralığı 24/16 px; sütun arası 20 px. Genişlik gerçek içerik container'ından değerlendirilir.

Ana/yardımcı oran yeterli alanda 1,9:1. Ana alanın okunabilirliği bozulacaksa yardımcı alan alta geçer; güncel güvenli workspace eşiği 1400 px, ledger kompakt eşiği kendi içinde 880 px. Çok geniş tablo için istisnai yerel yatay kaydırma olabilir; sayfa taşmaz. Ana dikey kaydırmanın sahibi main-content; paneller varsayılan bağımsız scrollbar veya eşit yüksekliğe zorlama kullanmaz.

Sidebar tam/ikon/gizli tercihini korur; dar ekranda erişilebilir drawer olur. Mobilde alt gezinme yoktur; header menüsü kullanılır. Ortak header arama/menü/bildirimleri taşır; liste araçları kendi listesinde kalır. İkincil tarih/kısayol önce sadeleşir. Tarih/filtre/bildirim tetikleyicisine bağlı açılır, sayfayı itmez ve blur oluşturmaz. Menü, arama ve bildirim erişimi korunur.

## 3. Formlar ve hizalama

Finansal işlem ekleme/düzenleme, hareket listesinin üstünde ayrı yuvarlatılmış karttır. Liste arama kutusundan itibaren ayrı karttır; standart bölüm aralığı kullanılır. Sabit alt işlem çubuğu ve finansal hareketin tablo hücrelerinde düzenlenmesi kullanılmaz. Kayıt düzenlenirken listedeki hedef seçili/salt okunur kalır. Cari profil bilgileri kendi Durum ve bilgiler alanında düzenlenir.

Ortak alan grubu etiket, kontrol, yardım/hata rollerini paylaşır. Etiket uzadığında komşu kontrollerin üst/alt kenarı bozulmaz. Alan genişliği veri anlamına bağlıdır: kısa sayı/tarih, tutar, normal metin, uzun metin ve kaynak seçimi. Kutu bir veya birkaç ortak sütunu kapsar; her form aynı sayıda sütuna zorlanmaz. Daralınca anlamlı gruplar alt satıra geçer; metin ve tutar girişini engelleyen dar kutu oluşmaz.

Finansal formda üstte Yeni işlem/İşlemi düzenle ve doğrudan işlem seçenekleri vardır. Sonraki giriş sırası **Açıklama → Etiket → Tutar**; tutar sağda, etiketler ortak hatta, kontrol yükseklikleri ortaktır. Mobilde açıklama tam satır; etiket ve tutar birlikte ikinci satırdır. Tarih/vade/taksit kısa araç grubudur; ek bilgi açılması ana değerlerin sırasını değiştirmez. İşlem hesabı/amaç/karşı hesap anlamlı gruptadır.

Sağdaki İşlemin etkisi alanında etiket solda, para sağda, sonuç bakiye daha belirgindir. İç yatay bölücüler yoktur; ana formdan tek ayırıcıyla ayrılabilir. Vazgeç ve Kaydet burada yer alır. Mobilde etki/eylem kısa alt gruptur. Metadata formlarına sahte finansal etki eklenmez; aynı düğmeler ve alan sistemi kullanılır. Oluşturmada Kaydet, finansal düzenlemede Güncelle, beklerken Kaydediliyor…; bağlam başlıkta açıklanır.

Radix Select ortak seçim altyapısıdır; görünümü ortak tokenlarla oluşturulur. Yerel FormData/doğrulama korunur. Serbest etiket ve banka araması gerçek combobox görevini korur; bunlar basit seçim menüsüyle karıştırılmaz. Klavye, odak dönüşü, Escape ve ekran sınırlarına bağlı portal davranışı doğrulanır.

İşlem seçilmeden işlem ek bilgileri gösterilmez. Zorunlu boş alan ana akışta görünür veya ilgili bölüm açık gelir; kısa vurgu reduced-motion tercihini gözetir. İsteğe bağlı ayrıntı varsayılan kapalıdır; düzenlemede mevcut ilgili veri gizlenerek kaybolmaz. İşlem tarihi başlangıçta ikon, seçim sonrası kısa tarih olabilir; saat aynı pencerededir. Dokunulmamış yeni saat kayıt anındaki uygulama saati; düzenlemede eski saat korunur. Aynı takvim tetikleyicisi tekrar tıklanınca kapanır.

## 4. Liste, özet ve boş durumlar

Cari sütun sırası Tarih / İşlem / Açıklama / Etiket / Ekleyen / Tutar / Bakiye. Varsayılan işlem tarihi yeniden eskiye; kullanıcı tercihi korunur. Kayıt zamanı ile işlem tarihi karıştırılmaz. Arama/öneri/çip, sütun başlığıyla sıralama ve dışa aktarma listede birliktedir; eski ayrı filtre/sırala formu geri getirilmez.

Seçili satır tek yüzey ve tek kesintisiz sol vurgu taşır. İkincil eylemler veri satırına yakın, simetrik boşlukla gösterilir. Tutar, brüt işlem, cari etki ve tarihsel/güncel bakiye ayrı anlamlardır. Mobilde ikincil metadata seçili satırda açılır. Son hareket/uyarı bağlantısı hedef sayfa ve hareketi seçer; gereksiz kayıt modalı açmaz.

İlişkili özetler tek dış yüzeyde, ortak etiket/değer/birim/yardım sırasıyla gösterilir. 2/3/4 metrik için içerik genişliğiyle uyumlu düzen kullanılır; boş bir metrik hücresi varmış gibi alan ayrılmaz. Grafik, rapor ve takvim kendi görevini korur. Boş grafik/listeler kısa EmptyState ritmini kullanır. Sıfır uyarı kompakt gösterilir; Tümünü göster (0) eylemi gösterilmez. Dolu grafik ve uyarılar kırpılmaz.

Kullanıcıya görünen tarih Türkçe biçimlenir; API'nin ISO saklama biçimi değişmez. Eylem ikonlarının erişilebilir adı ve gerektiğinde ipucu vardır. Yeni etiket Genel yer tutucusudur; kullanıcı yazmak için önce eski varsayılanı silmek zorunda kalmaz.

## 5. Bağlamsal içerik ve finansal açıklık

Müşteri Satış/Tahsilat/İade, tedarikçi Alış/İade/Ödeme, personel Ödeme/Tahsilat/Borçlandır bağlamını korur. Yeni alış tek Alış etiketidir; tarihsel faturalı/faturasız kayıtlar silinmez. Ana tutar ile anlık ödeme/tahsilat ayrıdır. Kaynak seçildiğinde tam ödeme doldurulur; daha azı kısmi, fazlası mevcut eski borç/avans kurallarına göre işlenir. Doğrudan ödeme/tahsilatta kaynak zorunludur. Görsel düzen finansal mantığı değiştirmez.

Durum ve bilgiler türe uygun olur. Tedarikçi ziyaret, müşteri işlem günleri, personel çalışma takvimi mevcut haftayı gösterir. Sabah/akşam aynı vurgu renginin üst/alt yarısı; haftalık izin uyarı, yıllık/hastalık kırmızı. Geçmiş ziyaret nötr arka planla bütün gün kutusunu kapsar. POS marka logoları etiket tekrarı olmadan, oran korunarak gösterilir. Kampanyalar kompakt satırlardır. TCKN/IBAN kopyalama ikonu çerçevesizdir; satır yüksekliğini bozmaz.

Aylık özet yalnız seçili ayın anlamlı bağlı kayıtlarını kullanır; eksik ödeme bağlantısında oran uydurulmaz. Masaüstünde yardımcı alanda, mobilde bağlamsal sekmede gösterilebilir. Maaş/yemek otomasyonu ve finansal şema bu tasarımla değiştirilmez.

Geçmiş kısa zaman çizelgesidir: oluşturuldu/değiştirildi/iptal, tarih-saat/kişi, yalnız değişen alanlarda eski → yeni ve gerekçe. Denetim verisi saklanır. İptal önizlemesi üstü çizili satır, kısa zorunlu gerekçe ve yanında Vazgeç/Kaydet içerir; açıklama alttadır. Kayıt fiziksel silinmez.

## 6. Etkileşim, erişilebilirlik ve kabul

Taslak terk etme koruması menü, geri, kapatma ve yenilemede sürer; Escape/dışarı tıklama veri kaybına dönüşmez. Onay katmanı bağımsız portal, kontrollü odak ve inert arka planla çalışır. Kayıt sırasında tekrar gönderme önlenir. Gezinme yaklaşık 350 ms ve reduced-motion uyumludur. Başlık yüklenirken ölçüsü/varlığı kararsızlaşmaz.

Kabul; yalnız taşmama veya test sayısı değildir. Çalışan derlemede masaüstü, dar içerik, mobil, uzun ad/etiket, büyük para, boş/dolu, ek bilgi açık/kapalı, hata, klavye ve taslak durumları doğrulanır. Ekran görüntüsüyle hizalama/boşluk incelenir. Fiziksel cihaz testi yapılmadıysa belirtilir. Finansal hesap testleri görsel testlerden ayrıdır.

Yeni ekran ortak bileşenleri kullanır. Yeni bir ölçü/istisna gerekiyorsa gerekçesi ve kapsamı bu sözleşmeye eklenir; sayfaya özgü ek CSS yamasıyla gizli tasarım kuralı üretilmez. Sürüm notları değişiklik tarihçesidir, bu sözleşmeye paralel ikinci tasarım kaynağı değildir.
