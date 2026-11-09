# Finans Paneli 1.17.0

9 Kasım 2026 · Şema 12; veritabanı geçişi yok.

- Mobilde seçilen cari hareketinin dar bir şeride sıkışması düzeltildi. Tür, tarih, açıklama, bakiye ve satıra ait eylemler aynı genişliği kullanır. Eski mobil tablo CSS çakışmaları kaldırıldı.
- Mobil menüde bölüm adları ve finans markası görünür; belirgin kapatma düğmesi vardır. Masaüstü tam/kompakt/gizli tercihi korunur.
- Mobil rapor, hesap ve ödeme planı özetlerinde ortak sol kenar ve yatay ayraçlar; daha az dikey boşluk. Cari kapalı özeti kompakt kalır.
- Banka/kasa listesinde banka, hesap adı ve bakiye öne çıkar. Sahip, IBAN ve hesap türü detayda korunur. Çok dar kredi kartı listesinde tutar ve TL'nin kırpılması engellendi.
- Mobil filtre görünür genişliği kullanır; başlık ve Vazgeç/Temizle/Uygula eylemleri erişilebilir kalır, alanlar kendi gövdesinde kaydırılır. İç içe takvim aynı bağımsız bağlı katman davranışını korur.
- Mobil header'da ayrı Ara ikonu gizlendi; kısa arama ipucu ve klavye Ara/Enter eylemi vardır. Arama odağı menü/bildirimi gizlemez. Masaüstü Ara düğmesi korunur.
- Ödeme planında dönem ve görünüm kontrolleri iki kompakt satırda düzenlendi. Bildirim önizlemelerinde ağır renkli zeminler kaldırıldı; önem ikonu/metni, beş özet ve tam liste bağlantısı korundu.
- Chromium ve WebKit için mobil kabul paketi eklendi; GitHub sürüm akışı iki motoru da çalıştırır. Finansal hesaplama, API, yedekleme ve mevcut veriler değişmedi.

## Hosting güncellemesi

`finans-paneli-1.17.0-hosting.zip` dosyasını mevcut web dosyalarını güncellemek için kullanın; `api/config.php` ve özel yedek dizinini koruyun. Şema 12 kurulumunda ek geçiş gerekmez. Daha eski kurulumlar standart `update.php` akışını kullanır. Bu sürüm GitHub'a yayımlanır; hosting üzerinde canlı kurulum veya veri sıfırlama yapılmaz.

[Test raporu](TEST-RAPORU-1.17.0.md) · [Görsel karşılaştırma](tasarimlar/1.17.0/expanded-comparison.png).
