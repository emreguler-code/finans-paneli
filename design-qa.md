# Design QA — 1.30.0

## Hedef ve kanıt

Görsel başlangıç kaynağı: docs/evidence/design-audit-2026-11-26/04-supplier-form.png, 14-cards-form.png, 05-supplier-mobile.png. Hedef bunları birebir kopyalamak değildir: kullanıcının onayladığı sonraki görsel yön ve Açıklama → Etiket → Tutar değişikliği, docs/TASARIM-SOZLESMESI.md içinde ölçülebilir sözleşmeye çevrilmiştir. Yeni bir tema veya finansal model hedeflenmez.

Uygulama: docs/evidence/1.30.0 içindeki aynı numaralı yeni görüntüler. Viewport 1440 × 1000 ve 390 × 844 CSS px; deviceScaleFactor 1. Eski/yeni görüntüler aynı viewport ve aynı Alış/boş tutar veya yeni kart durumundadır. Örnek veriler sentetiktir.

Birlikte açılıp incelenen karşılaştırmalar: docs/evidence/1.30.0/form-comparison.png (2314 × 331), card-comparison.png (2314 × 569), mobile-comparison.png (804 × 874). Masaüstünde yalnız içerik bölgesi aynı koordinatlardan kırpıldı, yeniden ölçeklenmedi. Mobil tam viewport iki yana yerleştirildi. Bunlar görsel karşılaştırma kanıtıdır; üretim arayüzünün parçası değildir.

## Bulgu ve düzeltme geçmişi

- P1: başlık aşağıda, tutar bağımsız üstteydi. Başlık seçeneklerle merkezlendi; açıklama/etiket/tutar ortak giriş satırına alındı. Ortak 44 px üst/alt kenarları browser testinde kontrol edildi. Son kanıt form-comparison.png.
- P2: karttaki uzun etiketler tarih kontrollerini aşağı kaydırıyordu. İlk subgrid denemesinde display:contents mirası grid'i etkisiz bıraktı; açık grid tanımı eklendi. İç satırın bağımsız grid'i de tarih hizasını bozdu; alanlar ana subgrid'e katıldı. Son kanıt card-comparison.png: üç tarih/sayı kontrolü aynı hatta.
- P2: boş/tekrarlanan mobil önizleme ve büyük kimlik listeyi aşağı itiyordu. Kimlik sadeleştirildi, etiket/tutar aynı satıra alındı, sonuç yokken tekrarlanan mevcut bakiye kaldırıldı; boş koşul grubu yer ayırmıyor. Son kanıt mobile-comparison.png: Kaydet ve hareket listesinin başlangıcı aynı viewport'ta erişilebilir.
- P2: üç metrikli özet iki satırda boş hücre bırakıyordu. Özet kırılımı yardımcı sütundan ayrıldı; 18-plan.png içinde üç metrik bir satırda.

- P2: son ek kontrolde boş grafiğin flex-basis değeri height değerini eziyordu. Boş duruma özel 160 px flex-basis tanımlandı; yüksekliği 180 px altında tutan kabul testi eklendi. Yeni 01-overview.png boş grafik yüksekliğini doğrular.

## Beş zorunlu yüzey

- Font/tipografi: yerel Inter ve mevcut metin hiyerarşisi korunmuş; tutar/etiketler okunuyor. Mobil giriş ölçüsü sözleşmeye uygun; uzun metin kontrollü sarılıyor.
- Boşluk/geometri: ortak 12 px alan aralığı, 44 px kontrol, 8 px köşe; başlık, kontrol ve etki hizaları düzeltildi. Görsel hedefteki başlık satırından ayrılan tutar, kullanıcının sonraki tercihi doğrultusunda giriş satırındadır.
- Renk/tokenlar: mevcut porselen/beyaz/turkuaz ve finansal roller korunmuş. Yeni renk teması, gölge veya dekorasyon eklenmedi.
- Görsel/ikon kalitesi: mevcut Lucide ve marka varlıkları kullanıldı; yeni raster içerik gerekmedi. CSS ile logo/ikon taklidi üretilmedi.
- Metin/içerik: kısa işlem etkisi ve ortak Kaydet; teknik tarih yerine Türkçe çip. Veri anlamı korunur; açıklama yerine otomatik uydurma metin eklenmez.

## Etkileşim ve sınırlar

Chromium ve WebKit forms130 kontrolleri: seçenek seçimi, görünür zorunlu alan odağı, Radix Escape ile yalnız menünün kapanması, taslak koruması, düzenleme gerekçesi, profil ve farklı genişlikler. Browser console: bu kabul koşularında runtime hata yok. 320/390/760/1100 genişlikler ve 1440 masaüstü kontrol edildi. Fiziksel telefon testi yapılmadı. Firefox yerel profil açılışı ortamda engellendi; platform kabulü GitHub iş akışında ayrı kapıdır.

## Sonuç

Son görüntülerde uygulanabilir P0/P1/P2 görsel bulgu kalmadı. Kaynakta tarif edilen alanların ve gerçek finansal durumların doğal yüksekliği vardır; tüm işlem türleri tek sabit yüksekliğe zorlanmaz. Görsel kabul, finansal API ve yayın kabulünün yerine geçmez.

final result: passed
