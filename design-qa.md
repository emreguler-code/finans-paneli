# Finans 1.9.1 tasarım doğrulaması

Kaynak görseller:
- `docs/tasarimlar/cari-detay-ortak-ozet-taslagi-2026-10-26.png`
- `docs/tasarimlar/kredi-karti-detay-ortak-ozet-taslagi-2026-10-26.png`

Uygulama kanıtı: `.qa/design-implementation-20261026/` altındaki `cari-desktop.png`, `card-desktop.png` ve `evidence.json`. Karşılaştırma panoları: `cari-comparison.png`, `card-comparison.png`; kaynak ve çalışan ekran aynı panoda yan yana incelendi. Bunlar Git dışında yerel inceleme kanıtlarıdır.

Pencere: masaüstü 1487×1058 CSS px, deviceScaleFactor=1. Her iki taslak 1487×1058 piksel; uygulama aynı boyutta yakalandı. Ek 1100×900, 390×900 ve 320×900 CSS px kontrolleri yapıldı. Raster taslaktaki optik yazı büyüklükleri yerine kullanıcının onaylı mevcut Inter 27/24/16/14/12 px rolleri korundu.

Durum: Ada Tasarım / iki gerçek sentetik hareket; Garanti Bonus Kart / dönem içi işlemler. Aynı tutarlar, kart ve bakiye senaryosu kullanıldı. Çalışma alanı demo tarihi 13 Ekim olduğu için 20 Ekim son ödeme geçmiş olarak işaretlenmedi; görsel taslaktaki 26 Ekim gününden farklı olması beklenen veri farkıdır. Kartın 16.000 TL toplamı ve 4.000 TL ödemesi 12.000 TL kalan ile karıştırılmaz. Kullanılabilir 63.500 TL gerçek modelden gelir. Mevcut marka çizimleri korunur; taslaktaki temsili bar renkleri/oranları yerine gerçek limit bölümleri kullanılır.

## Bulgular ve yineleme

İlk yakalama: `cari-desktop.png` içinde hareket paneli başlığı eksikti; `card-desktop.png` içinde sekmeler tablodan ayrı yüzeydeydi (P2). Cari hareketleri başlığı eklendi; sekmeler, sıralama/CSV ve mevcut aktarım eylemi ilgili hareket panelinde toplandı. Yeniden yakalanan ekranlar ve iki karşılaştırma panosu bu düzeltmelerden sonradır. Böylece başlık → tek özet → hareket paneli sırası iki sayfada ortak oldu.

Tam görünümde başlık hizaları, geri/yeni işlem yerleşimi, bilgi/düzenleme ikonlarının özette kalması ve tek dış çerçeve kontrol edildi. Odaklı incelemede özet alanları, ekstre/ödenen/kalan ayrımı, sekmeler ve tablo sütunları açılıp okunarak karşılaştırıldı. Mobilde takvim gezinme kontrolleri birbirinden ayrıldı, sekmeler kendi içinde kayar ve uyarı düğmesi tutarların üzerine sabitlenmez. Uzun uyarı listeleri kendi içinde kayar.

- **Yazı ve tipografi:** Yerel Inter, tabular para değerleri; mevcut başlık/bölüm/yardımcı metin rolleri korunuyor. Tutarlar bölünmüyor. Uzun kimlik alanları sarılıyor.
- **Boşluk ve düzen:** Ortak başlık/özet bileşeni; standart 24/16 px panel dolgusu, 20 px sütun boşluğu ve 1,9:1 ana/sağ sütun. 1100 px ve altında tek sütun. Onaylı tablo hücreleri korunuyor.
- **Renkler:** Mevcut Sade Netlik paleti ve çizgi rengi, bakiye/işlem yönleri korunuyor. Rapor net nakit vurgu rolü genel bakışla aynı.
- **Varlıklar:** Mevcut yerel fontlar, Lucide ve mevcut banka/program işaretleri kullanılıyor. Yeni raster varlığı gerekmiyor. Taslak yeni logo üretme talebi değildir.
- **Metin ve içerik:** Cari ve kartın alanları kendi anlamını koruyor; kartta bağlı hesap, tahmini sonraki tarihler ve son ekstre bilgisi var. Özet yeni finansal hareket üretmiyor. Banka logosundan hesap ataması yapılmıyor.

## Etkileşim doğrulaması

Grid açılışı, klavye ile kayıt seçimi, geri dönüş, arama/filtre, üç karakter araması, bilgi/düzenleme, hareket ekleme, ekstre sekmeleri ve CSV; masaüstü/mobil gezinme, açılır kampanya alt menüsü, iç içe formda tek gün ve filtre içinde tarih aralığı takvimi incelendi. Takvimler ek backdrop üretmez; Esc üst formu açık bırakır. Gerçek Chromium üzerinde otomatik kontroller ve ekran görüntüleri kullanıldı. Tarayıcı çalışma zamanı hata kaydı boş; fiziksel telefon/ekran okuyucu testi yapılmadı.

P0/P1/P2 açık bulgu yok. P3: çok uzun finansal içeriklerin mobilde doğal dikey kaydırma gerektirmesi beklenir; gelecekte isteğe bağlı özet yoğunluğu ayrıca değerlendirilebilir. Mevcut kapsamda veri gizlenmedi.

1.9.1 bakım doğrulaması: aynı görsel durumlar yeniden yakalandı. Detayda liste kapsamlı arama eşleşen kaydı seçiyor; boş sonuçta geri dönüş ve tüm hesap uyarıları erişilebilir. Yeni iki tarayıcı regresyon kontrolüyle toplam 416 kontrol geçti. Yerleşim ve finansal hesaplar değişmedi.

final result: passed
