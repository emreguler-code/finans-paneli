# Finans Paneli 1.6.0

Sade Netlik tasarımında cari hesaplar, banka/kasa, kredi kartları, ödeme planı ve raporlar. React/Vite arayüz; PHP/MySQL API. Banka bağlantısı yoktur.

Bu depo kullanıcı/işlem veritabanı, yönetici şifresi veya hosting erişim bilgisi içermez. Örnek veri SQL'i çıkarılmıştır. Yalnızca şema, migrasyon ve sentetik test fixture'ları korunur; isteğe bağlı demo oluşturma kodu uygulama özelliği olarak mevcuttur.

## Geliştirme

Node.js 22, PHP 8.3+ (pdo_mysql), MySQL/MariaDB gerekir.

```sh
npm ci
npm test
```

API için boş yerel veritabanına database/schema.sql yükleyin. public/api/config.example.php dosyasını public/api/config.php olarak kopyalayıp yalnızca yerel test bilgileri, rastgele kurulum anahtarı ve yerel HTTP için require_https=false ayarlayın. Yerel API üzerinden ilk yönetici kurulumunu yapın, ardından update.php akışıyla güncel şemaya (7) geçin. Ayrıntılı güncelleme akışı GUNCELLEME-1.6.md dosyasındadır. Üretim config dosyasını kopyalamayın. npm run dev PHP API'yi 8088 portunda başlatır ve Vite geliştirme sunucusunu açar; MySQL ayrıca çalışmalıdır.

```sh
npm run dev -- --host 127.0.0.1
```

## Dosyalar

- src/: arayüz ve hesap yardımcıları
- public/api/: PHP API ve yapılandırma şablonu
- public/update.php: güncelleme arayüzü
- database/: boş şema ve migrasyonlar
- tests/: birim, entegrasyon, geçiş ve tarayıcı senaryoları
- worker/: Sites için statik barındırma adaptörü; PHP API'nin yerini tutmaz
- docs/: tasarım ilkeleri ve Codex devir notları

npm test derleme, birim ve Sites worker testlerini çalıştırır. API testleri ayrıca izole PHP/MySQL ortamı ister. npm run build çıktısı dist/client altındadır; derlenmiş dosyalar Git'e alınmaz. Bu depo aktarımı hosting'e otomatik dağıtım yapmaz.

Codex değişiklik yapmadan AGENTS.md dosyasını okumalıdır. Geçmiş sürüm belgeleri KAPSAM-*.md; son sürüm ayrıntıları KAPSAM-1.6.md ve TEST-RAPORU-1.6.md içindedir.

## Kuruluma hazır sürüm paketi

`npm run release:package` derlenmiş arayüz, PHP API, boş şema ve Türkçe kurulum belgesini `dist/releases/finans-paneli-<sürüm>.zip` dosyasında toplar; yanında SHA-256 dosyası üretir. Gerçek `api/config.php` ve çalışma zamanı verileri pakete alınmaz. ZIP içindeki `hosting/` içeriği web dizinine yüklenir; diğer dosyalar web dizini dışında tutulur. Ayrıntılar [hosting kurulum belgesinde](docs/HOSTING-KURULUM.md).

GitHub Actions `Hosting release` iş akışı `v<package.json sürümü>` etiketi GitHub'a gönderildiğinde testleri çalıştırır, paketi hazırlar ve GitHub Release'e ekler. Örneğin 1.6.0 için `v1.6.0`. İş akışı ve paketleme dosyaları önce ilgili commit'te bulunmalıdır. Actions'ın depoda etkin ve iş akışının Release yazma yetkisine sahip olması gerekir. Manuel `workflow_dispatch` çalıştırması yalnızca indirilebilir Actions artifact'ı üretir; Release yayımlamaz.
