# Finans 1.7.2 — Uygulama, kapsamlı demo ve çapraz kontrol raporu

16 Ekim 2026. Bu rapor kaynak değişiklikleri ve izole ortamda çalışan derlenmiş uygulama içindir. GitHub yayın durumu Release sayfası ve otomatik yayın kaydıyla takip edilir; canlı hostinge dağıtım bu işlemin dışındadır. Şema 7 korundu.

## Uygulanan kapsam

- Ortak arama: hareket paneliyle aynı çizgi rengi, erişilebilir büyüteç düğmesi, üç karakterden itibaren 300 ms beklemeli otomatik arama; Enter/ikonla anında arama. Temizleme sonuçları geri getirir, filtre taslakları uygulanmadan sorguyu değiştirmez. Cari API aramasının AbortController ile eski yanıt iptali korunur; diğer ekranlar güncel veri üzerinde yerel filtreler.
- Fat. Alış / Fatsız. Alış etiketleri; tam ad ipucunda kalır. 100 px etiket alanı ve hizalı ekleyen sütunu.
- Hesap uyarıları her zaman yer ayrılan sağ sütundadır; uyarı oluşunca carousel ve hareketler aşağı itilmez. Sütun seçili hesaptan ve arama kapsamından bağımsızdır. Mevcut KMH/vade bildirimlerine yaklaşan/gecikmiş planlı banka/kasa hareketleri eklendi.
- Uyarı ilgili hesabı, hareket sekmesini, sayfalama konumunu ve satırı seçer. Filtreler hedefi gizlemeyecek şekilde temizlenir; arşivli bir hedef varsa görünür yapılır. Faiz/vade uyarısında salt okunur hesap bilgisi açılır. Dar ekranlarda merkezde açılan sabit Uyarılar düğmesi vardır.
- Tablet incelemesinde açıklama sütununun harf harf bölündüğü görüldü; masaüstü/tablette okunabilir asgari tablo genişliği ve panel içi kaydırma ile düzeltildi. Telefonda mevcut kart satırları korunur.

## Demo kapsamı

Varsayılan kapsamlı demo 588 finansal kayıt üretir. Doğrulama sırasında eklenen düzenle/iptal/geri aç test kaydıyla çalışan son demoda **589 kayıt** vardır: 7 aylık gerçek işlem geçmişi, 29 haftalık rapor kapsamı, 4 hesap (banka/birikim/kasa/KMH), 10 cari, 3 kredi kartı, 19 manuel ekstre. Gelecek planlı banka/kasa kayıtları ve Mart 2027'ye uzanan taksitler ayrıca bulunur. Demo günü 13 Ekim 2026'dır; sistem saatini değiştirmez.

Nisan–Ekim satışları, kısmi tahsilat ve alış ödemeleri, faturalı/faturasız alışlar, giderler, maaş tahakkuk/ödemeleri, müşteri/tedarikçi iadeleri, virman, kart harcaması/iadesi, ekstre kısmi ödemesi, nakit avans, kartlar arası aktarım, KMH kullanımı/geri yatırma, iptal edilmiş işlem ve kuruşlu altı taksit kapsanır.

Demo yenileme kullanıcı tarafından seçilen yıkıcı bir yönetici işlemidir. Bu çalışmada yalnız test koşucusunun oluşturduğu ayrı veritabanı yenilendi; mevcut geliştirme veritabanı, canlı veri, yönetici şifresi ve gerçek config değiştirilmedi. Geniş profil uygulamanın isteğe bağlı demo yenilemesinde de mevcuttur. Kompakt profil yalnız eski kabul testlerinin sabit senaryosunu korur.

## Finansal çapraz kontrol

**641 kontrol geçti.** Beklenen banka/kasa nakdi API'nin cash_effect alanını kullanarak değil, işlem türü, brüt tutar ve peşin kısımdan yeniden hesaplandı. Açılış + gerçekleşmiş giriş − çıkış ± virman her hesabın bakiyesine eşit. Virmanlar tüm hesaplarda birbirini götürür; aylık/haftalık net rapor toplamı toplam bakiye değişimine eşit.

Her carinin yön ve kısmi ödeme etkisi bakiyesine eşit. Maaş tahakkuku nakdi değiştirmez. Planlanan işlemler nakdi etkilemez. Düzenleme eski etkiyi değiştirir; iptal kaldırır; geri açma yalnız bir kez geri getirir. Altı taksitin toplamı tam 123.457 kuruştur.

Ek incelemede önceki ekstre devrinin üst toplamda yer aldığı halde hareket listesinde görünmediği bulundu. Listeye salt sunum amaçlı **Önceki ekstre devri** satırı eklendi; gerçek finansal kayıt veya borç üretilmez. Üç kartta listelenen kalemlerin neti ekstre toplamı eksi ödemelerle ayrıca eşleştirildi.

Aynı satır toplamı denetimi, kartlar arası borç aktarımının kaynak kartta kesim sonrası yeni borç olduğu halde eski ekstre listesine de girdiğini yakaladı. Ekstre filtresi kaynak ve hedef kartı ayıracak şekilde düzeltildi; kaynakta dönem içi borç, hedefte ekstre ödemesi olarak görünür. API bakiyeleri değiştirilmedi. Bu ayrım için ayrı bir regresyon testi eklendi.

Kart borçları son ekstre − ödemeler + dönem/gelecek hareketleri ile; kullanılabilir limit limit − toplam borç ile eşleştirildi. Her manuel ekstre için devir + bilinen hareket + tanımlanmamış fark = ekstre toplamı doğrulandı. Ekstre farkı bir hata veya otomatik yeni gider değildir; demo bu uzlaştırma uyarılarını özellikle içerir.

### Aylık nakit karşılaştırması (TL)

| Ay      | Gerçek kayıt |     Giriş |     Çıkış |        Net |
| ------- | -----------: | --------: | --------: | ---------: |
| 2026-04 |           82 | 28.308,00 | 40.656,00 | -12.348,00 |
| 2026-05 |           82 | 28.742,00 | 40.806,00 | -12.064,00 |
| 2026-06 |           82 | 29.176,00 | 40.956,00 | -11.780,00 |
| 2026-07 |           82 | 29.610,00 | 41.106,00 | -11.496,00 |
| 2026-08 |           82 | 30.044,00 | 41.256,00 | -11.212,00 |
| 2026-09 |           82 | 30.478,00 | 41.406,00 | -10.928,00 |
| 2026-10 |           70 | 21.413,00 | 52.239,00 | -30.826,00 |

Tüm yedi ayın değerleri Raporlar ekranındaki kutularla tarayıcıda karşılaştırıldı. 29 haftanın toplamları aylık toplamlarla aynı; ayrıca 6 Nisan, 13 Temmuz ve 5 Ekim haftalarının tarih aralıkları arayüzde seçilerek karşılaştırıldı. Haftalık grafik gruplaması aylık toplamı değiştirmiyor. Tablo kayıt sayısı nakit etkisi olmayan cari/kart gerçeklerini de içerir; planlı ve iptal edilmiş kayıtlar yukarıdaki gerçek kayıt sayısına dahil değildir.

## Ekran ve düğme incelemesi

1. **Ortak arama — başarılı.** İki karakter otomatik sorgu başlatmaz; üçüncü karakter sonucu günceller. Temizleme ve Enter çalışır. Belge yeniden yüklenmez. Büyüteç erişilebilir adı ve arama/panel kenarlıkları doğrulandı.
2. **Hesaplar ve uyarılar — başarılı.** Tüm hesapların uyarıları farklı hesap seçiliyken de görünür. Uyarı kasa hesabını ve doğru gelecek hareket satırını açar. Hesap düzeyi uyarı salt okunur bilgiyi açar. Sıralama, envanter CSV, aktarım ve işlem ekleme kontrolleri denendi. [Masaüstü ekranı](.qa/19a7322cdd9a/demo/accounts-warnings-desktop.png)
3. **Raporlar — başarılı.** Yedi ay, üç örnek hafta, günlük/haftalık grafik seçimi, hesap/etiket dağılımı, cari/avans ayrıntıları ve CSV denendi. [Haftalık rapor](.qa/19a7322cdd9a/demo/reports-weekly-desktop.png)
4. **Cari hareketleri — başarılı.** API üzerinden otomatik arama, cari seçimi, kompakt alış etiketi ve tam ad ipucu doğrulandı. [Cari geçmişi](.qa/19a7322cdd9a/demo/party-history-desktop.png)
5. **Kredi kartları ve ekstre — başarılı.** Üç kartın Ekstre / Dönem içi / Gelecek Dönem sekmeleri, eski ekstre seçimi, toplamların eşleşmesi, yeni ekstre ve ekstre düzeltme pencereleri denendi. [Kart ekranı](.qa/19a7322cdd9a/demo/statement-1.png)
6. **Genel bakış — başarılı.** Son beş gerçek kayıt tarih/saat/ID sırasıyla kaynak kayıtlarla karşılaştırıldı; satırdan işlem ayrıntısı açıldı. Planlı/iptal edilmiş kayıtlar bu listeye girmedi. [Genel bakış](.qa/19a7322cdd9a/demo/overview-rich-desktop.png)
7. **Tablet ve telefon — başarılı.** 1440, 1100, 768, 390, 320 px yoğun veri hesap düzeni; açıklama genişliği, sayfanın taşmaması ve mobil uyarı penceresi doğrulandı. 1920 px masaüstü ayrıca incelendi. Mevcut kabul paketi sekiz sayfayı 2540 px dahil altı genişlikte denetler. [Telefon ekranı](.qa/19a7322cdd9a/demo/accounts-390.png) · [Tablet ekranı](.qa/19a7322cdd9a/demo/accounts-768.png)

Güncel yerel görüntüler açılıp incelendi. Yoğun veri için **105 tarayıcı kontrolü**, mevcut senaryolar için **397 tarayıcı kontrolü** başarılı. İncelenen akışlarda çalışmayan düğme veya çalışma zamanı React hatası bulunmadı.

## Diğer doğrulamalar

- Üretim derlemesi, 23 birim ve 4 worker testi başarılı.
- İzole API: 73; eski şema/yedek/başarısız migrasyon ve kurtarma: 15 başarılı.
- Değişen iki PHP dosyası sözdizimi kontrolünden geçti.
- Hosting ZIP'i üretildi; izole paket kurulumunda migrasyon ve API kontrolleri geçti. Gerçek config ve kimlik bilgileri arşivde yoktur.
- Yayın iş akışına kapsamlı demo denetimi eklendi. Etiketli yayında aynı denetimler yeniden çalıştırılır.
- Bulut kurulum taslağında Node 24 ve yerel demo yeniden başlatma talimatları güncellendi; taslak kaydı ortam snapshot'ının yayımlandığı anlamına gelmez.

## Çalışır ortam ve sınırlar

Yerel PHP/MariaDB demo servisi çalışır bırakıldı. Başlatma: `npm run build` ve `QA_BROWSER_BIN=/usr/bin/chromium npm run demo:start`. Durdurma: `npm run demo:stop`. Yeniden başlatma/durdurma akışı denendi. Yalnız bu koşunun konteynerleri yönetilir. Özel giriş bilgileri `.qa/current-demo` dosyasının gösterdiği klasördeki `local-session.json` içindedir; rapora veya Git'e alınmaz.

Doğrulama Chromium 154, PHP 8.3 ve MariaDB 11.4 ile yerelde yapıldı. Fiziksel iOS/Android, Safari/Firefox, gerçek hosting, banka entegrasyonu ve tüm rol/izin kombinasyonlarında tüm düğmelerin eksiksiz denemesi yapılmadı. Tarayıcı erişilebilir ad, klavye ve dokunma boyutu kontrolleri tam erişilebilirlik sertifikası değildir. Ekran görüntüleri Git dışında bu çalışma ortamındadır. Finansal sonuçlar sentetik senaryolar için doğrulanmıştır; gerçek banka ekstresiyle uzlaşma iddiası yoktur.

## Güncel ekran görüntüleri

![Hesap uyarıları](.qa/19a7322cdd9a/demo/accounts-warnings-desktop.png)

![Haftalık rapor](.qa/19a7322cdd9a/demo/reports-weekly-desktop.png)

![Ekstre ve devreden borç](.qa/19a7322cdd9a/demo/statement-1.png)

![Telefon görünümü](.qa/19a7322cdd9a/demo/accounts-390.png)

## Paket üzerinden demo yenileme kabulü

Paketin kendi update.php ekranından kutu işaretlenmeden silme yapılmadığı, ardından iki kez demo yenilendiğinde her seferinde 588 kayıt / 4 hesap / 10 cari / 3 kart oluştuğu doğrulandı. Eski doğrulama işlemi silindi; kayıtlar çoğalmadı. Her iki yenileme sonrasında aynı yönetici şifresiyle giriş başarılı. Bu akış 12 ek paket arayüz kontrolüyle denetlenir. Paket ayrıca kapsamlı demoda 641 finansal kontrolden geçer.

GitHub'ın Chromium 156 denetimi, sayfa geçişinde ortak aramanın üst alana taşınmadan önce içerikte kısa süreliğine çizilebildiğini yakaladı. Portal yerleşimi useLayoutEffect ile ilk boyamadan önce tamamlanacak şekilde düzeltildi; tek arama alanı denetimi korunur.
