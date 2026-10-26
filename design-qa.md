# Finans 1.10.0 tasarım doğrulaması

26 Ekim 2026. Onaylı kaynaklar: `docs/tasarimlar/hesaplar-stil-3-yatay-kartlar-2026-10-26.png`, `araclar-2-policeler-ozeti-2026-10-26.png` ve `araclar-3-islem-gunlugu-2026-10-26.png` (son ikisi aynı klasörde).

Çalışan uygulama Chromium'da 1600×1100 CSS px, deviceScaleFactor=1 ile yakalandı. `.qa/design-110/` içinde hesap/kart/cari, araç özeti ve açık işlem satırı görüntüleri ile üç `comparison-*` yan yana panosu bulunur. Bunlar Git dışında yerel test kanıtıdır. Ek kontroller 1100×900, 390×900 ve 320×900; regresyon taraması 768/1440/2540 px genişlikleri de kapsar.

Referans ve çalışan uygulama karşılaştırıldı: yatay kayıtlar tek dış panelde; sıralama/CSV içerikte; liste bilgi/düzenle ikonları kaldırılmış, detay işlevleri korunmuş. Araçta Poliçeler ortak bölme, MTV/bakım/muayene ayrı özetler; yalnız Özet/İşlemler; karışık türler tarih sırasıyla ve eylemler satır içinde. Sağ sütun 1,9:1 ortak orandadır.

İlk yakalamada eski `align-items:start` kuralı yatay kayıtları daraltıyordu (P2): kayıtlar tam genişliğe ve ortak kolon hizalarına alındı; regresyon testi gerçek panel genişliğini karşılaştırıyor. Eski global dl stilleri araç özetini uzatıyordu (P2): alanlar bileşen kapsamında sadeleştirildi. Son yakalamalar bu düzeltmelerden sonradır.

- Tipografi: mevcut yerel Inter ve 27/24/16/14/12 px roller, tabular para değerleri; taslaktaki raster yazılar aynen kopyalanmadı.
- Yüzey/boşluk: ortak çerçeve, ayırıcı, token dolguları; dar ekranda alanlar alt alta. Uzun açıklamalar kesilmez.
- Renk: kritik kırmızı, dikkat amber, bilgi teal; ikon ve metin desteği. Finansal işaretler değişmedi.
- Varlıklar: mevcut banka/program işaretleri ve Lucide; yeni görsel varlık gerekmedi.
- İçerik: referanstaki temsili araç/tutarlar yerine gerçek sentetik 35DEMO110 verisi ve sabit demo tarihi 13 Ekim 2026 kullanılır. Geçerlilik ile ödeme ayrı; tahminler gerçek gider sayılmaz.

Bildirim kaynak/önem/temizleme/boş durum, önizleme 5 sınırı, net cari etkiye göre son hareketler, detay düzenleme ve araç açılır satırları otomatik Chromium kontrolleriyle doğrulandı. Mobilde taşma yok; işlem listesi doğal dikey kayar. Ekran okuyucu ve fiziksel cihaz testi yapılmadı. Açık P0/P1/P2 bulgu yok.

final result: passed
