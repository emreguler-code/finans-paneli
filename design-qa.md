# Finans 1.11.0 tasarım doğrulaması

27 Ekim 2026. Sonuç: onaylı mobil yoğunluk ve son kullanıcı düzeltmeleri uygulandı; açık P0/P1/P2 bulgu yok.

## Kaynak ve kanıt

Kaynak: `docs/tasarimlar/mobil-cari-kompakt-liste-hareketler-2026-10-27.png` (1299×1211 piksel tasarım panosu). Kullanıcının son düzeltmesi, kapalı satırdaki etiket/ekleyen/bakiye bilgisinin gizlenmesi ve yalnız seçilince açılmasıdır. Araçlarda önceki iki sütunlu resmin yerini kullanıcının tek sütun/yatay satır talimatı alır.

Chromium 154, yerel PHP/MariaDB uygulaması; deviceScaleFactor=1. Çalışan görüntüler `.qa/design-111/` içinde: `parties`, `staff`, `supplier`, `customer`, `cards`, `vehicles`, `vehicle-overview`; mobil 390/320, tablet 768/1100 ve masaüstü 1600×1100 CSS px. Mobil tam sayfa görüntülerinin yanında `*-viewport.png` (390×900/320×900) kayıtları bulunur. Tam sayfa görüntüsünde sabit navigasyon ilk görünümün altında kalır; bu görüntü tek ekran yüksekliği sayılmaz.

Yan yana karşılaştırmalar: `comparison-list.png`, `comparison-detail.png`, `comparison-selected.png`. Kaynak panosunun ilgili ekranı, genişliği 390 px olacak şekilde orantılı (yaklaşık 0,668) ölçeklendi; uzatılmadı. Kaynak içerik yüksekliği yaklaşık 740 px, uygulama görünümü 900 px; çerçeve ve yükseklik farkı açıkça etiketlendi. Demo tarihi 13 Ekim ve gerçek sentetik 10 cari, kaynaktaki 27 Ekim ve 8 temsili cari yerine kullanılır. Finansal rakamlar ve saatler taslağa uydurulmak için değiştirilmedi.

Tam görünümde başlık/ekle hizası, tek özet ve ana/sağ sütun oranı; odaklı karşılaştırmada kapalı hareket ve açılmış meta/eylem alanı incelendi. Kaynak üçüncü satırı, uygulama ilk satırı seçili gösterir; değerlendirme aynı genişleyen durumun yapısıdır, satır içeriğinin piksel eşitliği iddia edilmez.

## Bulgular ve düzeltme geçmişi

- [P2, düzeltildi] İlk mobil cari detayında dört özet alanı alt alta gereksiz yükseklik oluşturdu. Kapalı durumda bakiye öne alındı; ek alanlar bilgi düğmesiyle açılır. Masaüstü tüm alanları korur. Son kanıt: `staff-390-viewport.png`.
- [P2, düzeltildi] Eski grid kuralı mobil detay başlığındaki ekle düğmesini alt satıra taşıdı. Mobil başlık esnek tek satıra alındı; 390/320 px geometrisi otomatik doğrulandı. Son kanıt: `comparison-detail.png`.
- [P2, düzeltildi] Uzun araç bakım alanları ve iki sütunlu kategori kutuları dengesiz boşluk üretti. Kategoriler tek sütun yatay satırlar; her bakım kalemi bağımsız süre/km göstergesi. Mobilde alanlar okunabilir biçimde sarılır, üst araç özeti iki kısa bilgi sütunudur. Son kanıt: `vehicle-overview.png`, `vehicle-overview-390.png`.
- [P2, düzeltildi] Önceki cari sağ sütunu hareket tablosunu tekrar ediyordu. Liste yalnız son 5 işlem; detay türe bağlı bilgi/uyarı gösterir. Net cari işareti korunur. Kanıt: `staff.png`, `supplier.png`, `customer.png`.

## Zorunlu görsel yüzeyler

- **Yazı:** Yerel Inter; mevcut 24/16/14/12 px roller, tabular tutarlar, yardımcı metin 1,5 satır yüksekliği. Kaynağın optik/raster yazıları yeni font kuralı sayılmadı. Uzun açıklamalar sarılır; para değerleri gizlenmez.
- **Boşluk/düzen:** Kompakt kapalı hareket; yalnız aktif işlemde meta ve 44 px dokunma hedefli eylemler. Aynı renk yüzeyinde eylem satırı, arada çizgi yok. İçerik araçları içerikte kalır. 1,9:1 masaüstü yan sütun ve dar ekranda alt alta geçiş korunur. Gerçek ondalıklı özet tutarları ve saklanan bilgi/düzenleme kontrolleri nedeniyle özet, temsili resimden biraz daha yüksektir; işlev/veri kaybı yaratılmaz.
- **Renk:** Sade Netlik porselen/beyaz/teal; net cari etki ve kart borcu anlamları ayrı. Kritik/dikkat/bilgi ikon ve metinle desteklenir; yalnız renk kullanılmaz.
- **Varlık:** Mevcut yerel logo/fontlar ve Lucide; araç türlerinde Motorbike/Truck/Car/CarFront. Yeni raster, CSS resim veya başka marka dili eklenmedi. Kart banka/program tekrarları gösterimde kaldırılır, özel ad saklanan değer olarak korunur.
- **Metin/veri:** Cari tipi doğru alan adını kullanır. Ziyaret planı gerçekleşme takibi değildir. İzin kullanılan/hak biçimindedir; maaş/yemek ödemeleri açık referanslıdır. Müşteri ortalaması son 6 tamamlanmış ayın brüt satışıdır; vadesiz veriden başarı yüzdesi çıkarılmaz. Araç göstergeleri tanımlı aralık/süreyi anlatır, aşınma ölçümü değildir.

## Etkileşimler ve sınırlar

457 Chromium kontrolü: arama/filtre, takvimde blur/sayfa kayması olmaması, klavye ile kayıt seçimi, satır açma, meta gizleme/gösterme, düzenleme ve ödeme erişimleri, ziyaret günü kaydetme, araç türü/bakım kalemi kaydetme, taksit önizleme, yatay araç kategorileri ve 320/390/768/1100 px taşma kontrolleri. Çalışan demo ek yakalamalarında konsol hatası yok; sayfa yatay taşmıyor. Fiziksel telefon, Safari ve ekran okuyucu testi yapılmadı.

P3: Çok uzun açıklamalar ve tam araç geçmişi doğal dikey kaydırma gerektirir. İlk görselin kısa temsili içerik yüksekliğini korumak için veri kesilmedi.

final result: passed
