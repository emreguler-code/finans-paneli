# Finans Paneli 1.18.1

1.18.0 kapsamındaki onaylı cari detay düzeni ve tüm test kapıları korunur. Ekran görüntüsü incelemesi sonrası ek düzeltmeler:

- Genel dl satırlarının kenarlık/padding/display kuralları cari bilgi ve işlem etki açıklamasından yalıtıldı. Açık hareket tek yüzeyde, daha kısa ve çizgisizdir.
- Mobilde işlem sonrası bakiye yalnız hesap etkisi ayrıntısında bir kez gösterilir.
- Cari başlığında bakiye ve ikonlar yer olduğunda aynı satırda; büyük tutar veya çok dar ekranda değer küçültülmeden ayrı satırlardadır.
- Yeni görsel kabul testleri gereksiz bilgi satırı çizgileri/boşluklarını ve 390 px başlık yoğunluğunu denetler.

Finansal model, şema 12, rol izinleri ve mevcut veriler korunur. Önceki tasarım incelemesinin onaylı kapsamı docs/SURUM-1.18.0.md içindedir. GitHub yayını cPanel'e canlı kurulum yapmaz.
