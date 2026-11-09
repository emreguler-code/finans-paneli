# Finans Paneli 1.16.0

9 Kasım 2026 · Şema 12; veritabanı geçişi yok.

- Onaylı dokuz bölge tüm sayfalarda ortak React kabuğuyla yönetilir. Header, içerik ve hızlı işlem aynı kenarlara hizalanır; ana kaydırma sahibi içeriktir.
- Sidebar tam, ikon şeridi ve gizli durumlarına sahiptir. Geniş ekranda da manuel seçim yapılır; tercih tarayıcıda korunur. Mobil menü odak korumalı panel olarak açılır.
- Sütunlar monitör adına göre değil, kullanılabilir içerik genişliğine göre düzenlenir. Yeterli alanda 1,9:1; dar alanda yardımcı bilgiler ana içeriğin altındadır. Tablolar kendi bölgelerinin genişliğinde okunabilir kompakt satırlara geçer.
- Hızlı işlem alt bölgesi kendi yüksekliği kadar yer ayırır. İçerik, yardımcı bilgiler ve footer üstüne binmez; dar ekranda alanlar sarılır, mobil klavyeye göre yükseklik sınırlanır.
- Taslaktan vazgeçme onayı alt satıra sıkışmaz: bağımsız merkezi katman, okunabilir iki eylem, odak koruması ve taslağı saklayan Escape/dışarı tıklama.
- Renk değerleri tema dosyasında, kabuk ölçüleri yerleşim dosyalarındadır. Mevcut Sade Netlik korunur. Yeni tema veya tema seçici bu sürümde yoktur.
- Finansal hesaplama, kayıt hedefleri, yedekleme kuralları ve mevcut veriler aynı davranışı korur.

## Hosting paketi

`finans-paneli-1.16.0-hosting.zip` yalnız web dosyalarıdır. `api/config.php` ve özel yedek dizinini koruyun. Mevcut şema 12 için ek veritabanı güncellemesi gerekmez; daha eski kurulumda standart `update.php` akışını izleyin. GitHub sürümü kullanıcının ayrıca verdiği yayın talimatıyla hazırlanır; hosting üzerine canlı kurulum yapılmaz.

Ayrıntılar: [Yerleşim sözleşmesi](GLOBAL-YERLESIM-SOZLESMESI.md), [test raporu](TEST-RAPORU-1.16.0.md).
