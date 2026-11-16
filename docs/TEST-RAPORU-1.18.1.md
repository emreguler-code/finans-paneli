# Finans Paneli 1.18.1 — doğrulama raporu

Tarih: 16 Kasım 2026. Uygulama kaynağı: a85fd201a6bb15da043ecfbde605e632baeea2b9. Başlangıç: 1.17.0, b6f5e1392dfdc374e28928861e4a03845e8d18c1. Şema 12; finansal API ve veritabanı modeli değişmedi.

[Başarılı yayın koşusu](https://github.com/emreguler-code/finans-paneli/actions/runs/43865282799) · [Yayımlanan sürüm](https://github.com/emreguler-code/finans-paneli/releases/tag/v1.18.1)

## Sonuçlar

- Yerel npm test ve aynı komutun GitHub koşusu: derleme, 47 birim testi ve 4 Sites worker testi başarılı.
- PHP sözdizimi, izole finansal API, veri geçişi/kurtarma ve yedekleme paketleri başarılı.
- Yeni cari arayüz kabulü: Chromium 46, WebKit 46 kontrol başarılı. Deterministik sentetik API kullanır; finansal API kabulünün yerine geçmez.
- Mevcut masaüstü/dar ekran gerçek PHP/MySQL tarayıcı kabulü başarılı.
- Mevcut mobil kabul: Chromium 71, WebKit 71 kontrol başarılı.
- Kapsamlı demo/rapor uzlaştırması ve iki hosting ZIP'inin kurulum testleri başarılı. ZIP bütünlük ve SHA-256 kontrolleri geçti; yayında tam ve hosting paketi, her ikisinin checksum dosyaları bulunuyor.

## Kontrol edilen davranışlar

Cari kimliği ve güncel bakiye tek yüzeyde; bilgi aşağı okla aynı yüzeyde açılıyor. Önceki onaylı sütun sırası korunuyor. Tutar ve satır bakiyesi nötr; yön etiketleri renkli. 913 TL alış, 200 TL peşin ödeme ve -713 TL net etki ayrı gösteriliyor. Liste araması/filtreleri güncel cari bakiyeyi değiştirmiyor; filtre toplamı net etkiyi kullanıyor. İptal ve planlanan kayıtlar toplam dışında. Son hareketler sıralaması tarihsel bakiyeyi yeniden hesaplamıyor. Sayfalama ve filtre taslak/Uygula ayrımı çalışıyor.

320, 390, 430, 768, 960, 1385 ve 1920 px genişliklerde tutarlar ve açılan satır/eylem alanının geometrisi denetlendi. 390 px normal tutarlı başlık 210 px altında kalıyor; daha dar veya büyük tutarlı durumda ikonlar alt satıra geçiyor. Açıklama satırları genel dl kenarlık/padding stillerinden yalıtıldı. Mobil bakiye ayrıntıda bir kez gösteriliyor.

## Görsel inceleme ve sınırlar

Başarılı yayın koşusundaki party-ui-evidence artifact'ından son ekranlar indirildi ve açılarak incelendi: Chromium masaüstü açık hareketi, Chromium 390 px kapalı liste/başlık, WebKit 390 px açık hareketi ve WebKit 320 px başlık. Tipografi, yön rengi/nötr rakam ayrımı, ortak ikonlar, çizgisiz aktif yüzey ve kompakt başlık gözden geçirildi. Görseller sentetik test verileri içerir; canlı cPanel verisi değildir.

Yerel komut ortamı headless Chromium'un soketini açamadı; paylaşılan tarayıcı yerel sunucuya bağlanamadı ve dosya protokolünü kabul etmedi. Tarayıcı kabulü bu nedenle GitHub'ın izole çalıştırıcısında yapıldı. Fiziksel iPhone/iOS Firefox/Safari testi veya cPanel üzerine canlı kurulum yapılmadı. WebKit viewport kontrolü gerçek cihaz testi olarak sunulmaz.
