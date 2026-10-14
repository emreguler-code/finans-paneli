# Finans 1.6.0 — test ve görsel kontrol

13 Ekim 2026. Varsayımsal, ayrı PHP 8.3 / MariaDB veritabanında kontrol edildi. Kullanıcının hosting sunucusuna bağlanılmadı ve yayın yapılmadı.

| Kontrol | Sonuç |
|---|---|
| Gerçek PHP/MariaDB entegrasyonu | 69 geçti |
| Para, tarih, dönem, yön ve KMH yardımcıları | 18 geçti |
| Paketleme/Worker kontrolleri | 4 geçti |
| Çalışan derlenmiş uygulama, Chromium 150 | 58 geçti |
| PHP sözdizimi | 9 dosya geçti |
| Üretim derlemesi | Geçti |

Toplam 149 davranış kontrolü, ayrıca PHP sözdizimi ve build. Önceki sürüm testleri bu sayıya eklenmedi. Kanıtlar `docs/v16-*` ve `docs/ekranlar/checks.json` içinde.

## Finansal doğrulama

Kısmi ve tamamen tahsil edilmiş işlemlerde brüt tutar/net cari etki ayrımı; maaş tahakkuku; personel borçlandırma; kartlı cari ödeme; sonraki iade tahsilatı/ödemesi; manuel ekstre farkı ve gerçek kart ödemesi; taksitlerin kuruş toplamı; virman/nakit avans/kart aktarımı; planlanan hareketin gerçekleşmesi; iptal/düzenleme; idempotent istekler ve sürüm çakışması test edildi.

KMH limiti ve günlük oran kaydediliyor; geçersiz limit/negatif oran reddediliyor; oran boşsa null kalıyor. Ayar/tahmin değişikliği hesap bakiyesini veya işlem listesini değiştirmiyor. Saat ve belge numarası aynen saklanıyor. Yönetici girişi demo temizliğinden sonra çalışıyor.

## Canlı ekran ve etkileşim kontrolü

Ekranlar HTML mockup veya sunucu render çıktısı değildir. Son Vite üretim derlemesi yerel HTTP sunucusunda gerçek PHP API ile çalıştırıldı; giriş yapıldı ve arayüzde işlemler gerçekleştirildi. Masaüstü 1440×1000; dar görünümler 320×844, 390×844 ve 768×1024; küçük pencere kontrolü 320×568.

Cari başlığı aynı kutuda açılıyor; Etiket ayrı; Tutar önce, Bakiye sonra. 18.500 TL kısmi tahsil edilmiş satış toplamı korunuyor, peşin 5.000 TL ayrı görünüyor. Form kutuları cari bağlamına uygun renkte. Açıklamada otomatik cari adı yok. Satırın üst ve alt alanında tek zemin ve kesintisiz sol belirteç doğrulandı.

Arşiv filtresi Hesaplar başlığında aşağı açılıyor. Bilgi/düzenle ikonları kartta. Carousel okları, fare sürükleme ve Chromium touch emülasyonu hesap değiştiriyor. Hesap listesi CSV indirmesi ve gerçek formdan para/saat/belge numarası kaydı kontrol edildi. Hareket filtreleri, artan tutar sıralaması, kartın varsayılan dönem sekmesi, banka/program işaretleri ve KMH uyarısının bildirim listesine yansıması kontrol edildi.

Beş ana sayfada 320/390/768 px yatay sayfa taşması yok. Cari başlık bakiyesi, cari/banka hareket tutarları kesilmiyor; Hesaplar açılışında hareket görünüyor. Mobil işlem penceresi ve iç içe takvim ekrana sığıyor; kapanınca body kaydırma kilidi çözülüyor. Yerel Inter yüklü. React çalışma zamanı hatası yok.

Canlı görüntü incelemesinde ilk turda bulunan cari başlık sıkışması ve mobil alt belirtecin gizlenmesi düzeltildi; son derlemede yeniden doğrulandı. Inter, 27/14/12 px temel ölçek, Lucide çizgileri ve Sade Netlik paleti korunuyor. Uzun işlem adları sabit etiket alanında hizalı, tutar renkleri mevcut semantiği koruyor.

## Sınır

Paylaşılan dört iOS Firefox ekran görüntüsü incelendi: önceki sürümde sağdan kesilen tutarlar, kırpılan hesap kartı alt bilgisi ve yüksek üst yerleşim görülüyor. Yeni sürümün dar ekran karşılığı düzeltildi. Fiziksel iPhone/iOS Firefox, iOS tarayıcı çubukları, gerçek sanal klavye ve touch sürükleme bu ortamda test edilmedi. Bu nedenle “iOS Firefox cihaz testi geçti” sonucu verilmez. Tarayıcı kontrolleri Chromium ölçümleridir.

Bildirim listesi mevcut finansal uyarıları ve KMH bilgisini toplar. Diğer bildirim türlerine ilişkin yarım kalmış talimattan yeni otomasyon oluşturulmadı. Günlük faiz oranı kullanıcı tarafından girilir; demo oranı örnektir. Tahmin vergiyi/valörü veya bankanın dönemsel tahakkukunu temsil etmez.
