# Finans Paneli 1.13.2

1.13.2, otomatik yedeklemeyi tarayıcıdan ayırır: cron ile her gün Türkiye saatiyle 03.00'te bir kez; tüm yedek türleri için toplam 5 dosya sınırı. Şema 11 korunur. [Sürüm kapsamı](docs/SURUM-1.13.2.md) · [Yedekleme kılavuzu](docs/YEDEKLEME.md).

Sade Netlik tasarımında cari hesaplar, banka/kasa, kredi kartları, ödeme planı ve raporlar. React/Vite arayüz; PHP/MySQL API. Banka bağlantısı yoktur.

Bu depo kullanıcı/işlem veritabanı, yönetici şifresi veya hosting erişim bilgisi içermez. Örnek veri SQL'i çıkarılmıştır. Yalnızca şema, migrasyon ve sentetik test fixture'ları korunur; isteğe bağlı demo oluşturma kodu uygulama özelliği olarak mevcuttur.

## Geliştirme

Node.js 24, PHP 8.3+ (pdo_mysql), MySQL/MariaDB gerekir.

```sh
npm ci
npm test
```

API için boş yerel veritabanına database/schema.sql yükleyin. public/api/config.example.php dosyasını public/api/config.php olarak kopyalayıp yalnızca yerel test bilgileri, rastgele kurulum anahtarı ve yerel HTTP için require_https=false ayarlayın. Yerel API üzerinden ilk yönetici kurulumunu yapın, ardından update.php akışıyla güncel yerel şemaya (11) geçin. Ayrıntılı güncelleme akışı docs/GUNCELLEME.md dosyasındadır. Üretim config dosyasını kopyalamayın. npm run dev PHP API'yi 8088 portunda başlatır ve Vite geliştirme sunucusunu açar; MySQL ayrıca çalışmalıdır.

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

Her sürümde iki ZIP üretilir: `finans-paneli-<sürüm>-hosting.zip` yalnız doğrudan web dizinine yüklenecek uygulama dosyalarıdır; `finans-paneli-<sürüm>.zip` kurulum belgeleri ve başlangıç SQL'i içeren tam pakettir. Mevcut kurulum güncellemelerinde hosting ZIP'i yeterlidir; `api/config.php` korunur. Her ZIP'in ayrı SHA-256 dosyası vardır.

GitHub Actions `Hosting release` iş akışı `v<package.json sürümü>` etiketi GitHub'a gönderildiğinde testleri çalıştırır, paketi hazırlar ve GitHub Release'e ekler. Örneğin 1.13.2 için `v1.13.2`. İş akışı ve paketleme dosyaları önce ilgili commit'te bulunmalıdır. Actions'ın depoda etkin ve iş akışının Release yazma yetkisine sahip olması gerekir. Manuel `workflow_dispatch` çalıştırması yalnızca indirilebilir Actions artifact'ı üretir; Release yayımlamaz.

## İzole API ve tarayıcı testleri

Docker gerekir. Test koşucusu kendi MariaDB/PHP konteynerlerini ve rastgele yerel kimlik bilgilerini oluşturur; mevcut `public/api/config.php` veya geliştirme veritabanına bağlanmaz. Her koşu sonrasında yalnızca oluşturduğu konteynerleri kaldırır. Test çıktıları Git dışında `.qa/` altında tutulur.

```sh
npm run test:api
npm run test:migrations
npm run release:package
npx playwright install --with-deps chromium
npm run test:package
npm run test:browser
```

`test:api` sentetik veride finansal işlemleri; `test:migrations` eski verilerin korunmasını, yedeği, başarısız geçişi ve tekrar denemeyi; `test:browser` derlenmiş arayüzü masaüstü ve dar ekranlarda doğrular. `test:browser` öncesinde `npm run build` çalıştırın. Yerel Chromium kullanmak için `QA_BROWSER_BIN=/usr/bin/chromium` tanımlanabilir. Release iş akışı bu kontrollerin hepsini çalıştırır. Eski API sözleşmesi testleri `tests/historical/` altında ayrılmıştır.

Statik çıktı yalnızca arayüz ve yerel fontları içerir; PHP/config dosyaları statik çıktıya kopyalanmaz. Sites adaptörü API sağlamaz. PHP hosting ZIP'i API'yi ayrıca paketler ve gerçek config dosyalarını hariç tutar.

Salt refaktörlerde önceki yayımlanmış arayüzle piksel karşılaştırması ayrıca `QA_COMPARE_RELEASE=1` ile etkinleştirilir; onaylı tasarım değişikliklerinde eski ekranın birebir aynı olması beklenmez.

GitHub API erişimi olmayan istemciler için etiketli yayınların sonucu `release-status/v<sürüm>` açıklamalı Git etiketine kaydedilir. Bu otomatik kayıt iş akışı sonucunu, yayın bağlantısını ve paket SHA-256 değerini içerir; uygulama sürüm etiketi `v<sürüm>` olmaya devam eder.

## Kapsamlı yerel demo ve çapraz kontrol

```sh
npm run build
npm run test:demo  # izole demo, finans uzlaştırması ve tarayıcı kontrolleri; sonra temizler
npm run demo:start # aynı kontrolleri çalıştırır, başarılı yerel demoyu çalışır bırakır
npm run demo:stop
```

Yerel Chromium gerekiyorsa `QA_BROWSER_BIN=/usr/bin/chromium` tanımlayın. Docker gereklidir. Kapsamlı demo Nisan–Ekim 2026 geçmişi, 4 banka/kasa/KMH hesabı, 10 cari, 3 kart, geçmiş ekstreler ve gelecek taksitler içerir. Tarih 13 Ekim 2026'ya sabitlenir. Normal demo yenileme de bu geniş profili oluşturur; mevcut verileri silen yönetici onayı korunur. `profile=compact` yalnız küçük kabul testi fixture'ıdır.

Çalışır demo ve giriş bilgileri yalnız Git dışında `.qa/current-demo` dosyasının gösterdiği klasördeki `local-session.json` içinde saklanır. Bu dosyayı paylaşmayın. Yerel sunucu yalnız 127.0.0.1'de dinler; dış hosting yayını değildir. `demo:stop` yalnız bu demo koşusunun konteynerlerini ve yerel kimlik bilgilerini kaldırır. Ortam yeniden başlarsa `demo:start` yeniden çalıştırılır. Ayrıntılı bulgular `docs/TEST-RAPORU-1.13.2.md` içindedir.

`npm run test:backups`, yalnız koşucunun oluşturduğu izole veritabanında yedekleme, bozuk dosya/ilişki, geri alma, kullanıcı yetkileri, cron ve demo temizliği senaryolarını doğrular. Canlı veritabanı hedeflemez.
