# Finans Paneli 1.29.0

1.29.0: Bağımsız kompakt işlem kartı, ödeme anahtarı ve fazla ödeme dağıtımı; sade geçmiş/iptal, hizalı kimlik bilgileri ve toplamlı CSV/PDF ekstre. [Kapsam](docs/SURUM-1.29.0.md) · [Doğrulama](docs/TEST-RAPORU-1.29.0.md).

1.28.0: Üstte ortak kompakt işlem ekleme/düzenleme formu, yeniden eskiye işlem sırası, kart içinde cari bilgisi düzenleme, gerçek hafta personel takvimi ve yalnız hamburger ile mobil gezinme. [Kapsam](docs/SURUM-1.28.0.md) · [Doğrulama](docs/TEST-RAPORU-1.28.0.md).

1.27.0: Bölümlerde ortak satır içi kayıt, özetlerden kaynak satıra yönlendirme, personel IBAN/kopyalama ve mükerrer kayıt korumalı aylık maaş/yemek hakedişleri. [Kapsam](docs/SURUM-1.27.0.md) · [Test ve yayın sonucu](docs/TEST-RAPORU-1.27.0.md) · [Cron kurulumu](docs/PERSONEL-CRON.md).

1.26.0: Hizalı satır içi giriş, zorunlu alanlara göre Ek bilgiler, birleşik tarih/saat, maaşla tam/kısmi ödeme, kararlı liste başlığı ve yumuşak sayfa geçişleri. [Kapsam](docs/SURUM-1.26.0.md) · [Test ve yayın sonucu](docs/TEST-RAPORU-1.26.0.md).

1.25.1: Aylık özette açılış bakiyesine yapılan ödemeler devreden borç ayrımına dahil edildi. [Düzeltme kapsamı](docs/SURUM-1.25.1.md).

1.25.0: Cari işlemler liste sonunda modern satır içi eklenir ve düzenlenir; ek bilgiler kapalı başlar. Tedarikçi/müşteri/personel takvimleri, kompakt bilgiler ve aylık çalışma grafikleri eklendi. Arama ve takvim kapanışları düzeltildi. Şema 12. [Sürüm kapsamı](docs/SURUM-1.25.0.md).

1.24.0: Prettier biçim kontrolü proje geneline genişletildi. Desteklenen kaynaklar, belgeler ve yapılandırmalar otomatik keşfedilir; PHP resmi eklentiyle kapsanır. Şema 12. [Sürüm kapsamı](docs/SURUM-1.24.0.md) · [Kod kalite politikası](docs/KOD-KALITESI.md).

1.21.0: içerik genişliğine bağlı tutarlı yerleşim, yalıtılmış arama/form stilleri ve Firefox dahil otomatik geometri kabulü. [Güncel kapsam](docs/SURUM-1.21.0.md) · [1.21.0 test raporu ve ekranlar](docs/TEST-RAPORU-1.21.0.md) · [Kod kalite politikası](docs/KOD-KALITESI.md).

Akıllı arama/filtre çipleri, satır içinde işlem türü ve tutar düzenleme, son 30 hareketten kademeli yükleme, gerçek ay sonu bakiye özeti ve boşluk bırakmayan hızlı giriş. Şema 12 korunur. [Bölüm bazında analiz ve sürüm kapsamı](docs/SURUM-1.20.0.md) · [Test raporu ve canlı ekranlar](docs/TEST-RAPORU-1.20.0.md) · [Tasarım ilkeleri](docs/TASARIM-ILKELERI.md).

Sade Netlik tasarımında cari hesaplar, banka/kasa, kredi kartları, ödeme planı ve raporlar. React/Vite arayüz; PHP/MySQL API. Banka bağlantısı yoktur.

Bu depo kullanıcı/işlem veritabanı, yönetici şifresi veya hosting erişim bilgisi içermez. Örnek veri SQL'i çıkarılmıştır. Yalnızca şema, migrasyon ve sentetik test fixture'ları korunur; isteğe bağlı demo oluşturma kodu uygulama özelliği olarak mevcuttur.

## Geliştirme

Node.js 26.13.1 LTS, npm 12.2.2, PHP 8.3+ (pdo_mysql), MySQL/MariaDB gerekir. `.node-version` / `.nvmrc` geliştirme sürümünü sabitler. Paketleme/test otomasyonu Python 3.15.2 kullanır (`.python-version`). Güncel izole kabul ortamı PHP 8.5.12 ve MariaDB 12.3.3 LTS kullanır; mevcut hosting için PHP 8.3+ desteği korunur.

```sh
npm ci
npm test
```

API için boş yerel veritabanına database/schema.sql yükleyin. public/api/config.example.php dosyasını public/api/config.php olarak kopyalayıp yalnızca yerel test bilgileri, rastgele kurulum anahtarı ve yerel HTTP için require_https=false ayarlayın. Yerel API üzerinden ilk yönetici kurulumunu yapın, ardından update.php akışıyla güncel yerel şemaya (12) geçin. Ayrıntılı güncelleme akışı docs/GUNCELLEME.md dosyasındadır. Üretim config dosyasını kopyalamayın. npm run dev PHP API'yi 8088 portunda başlatır ve Vite geliştirme sunucusunu açar; MySQL ayrıca çalışmalıdır.

```sh
npm run dev -- --host 127.0.0.1
```

## Biçim kontrolü

`npm run format:check` tüm desteklenen proje dosyalarını değiştirmeden kontrol eder. `npm run format` aynı kapsamı otomatik biçimlendirir. Yeni dosyalar listeye eklenmeden otomatik kapsanır. Ortak kurallar `.prettierrc.json`, üretilmiş/özel dosya istisnaları `.prettierignore` içindedir. JS/JSX, CSS, JSON, HTML, Markdown, YAML ve PHP desteklenir; Python ve SQL kendi test araçlarıyla doğrulanır. `npm test` bu denetimi de çalıştırır.

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

Hostinge hazır ZIP + SHA-256 dosyası ayrıca `releases/<sürüm>/` altında depoda bulunur. Kodlama onayı aynı kapsamın GitHub yayınına da izin verir. Hosting yükleme ve canlı incelemeyi kullanıcı yürütür; hosting bağlantısı/otomatik dağıtım kapsam dışıdır.

`npm run release:package` derlenmiş arayüz, PHP API, boş şema ve Türkçe kurulum belgesini `dist/releases/finans-paneli-<sürüm>.zip` dosyasında toplar; yanında SHA-256 dosyası üretir. Gerçek `api/config.php` ve çalışma zamanı verileri pakete alınmaz. ZIP içindeki `hosting/` içeriği web dizinine yüklenir; diğer dosyalar web dizini dışında tutulur. Ayrıntılar [hosting kurulum belgesinde](docs/HOSTING-KURULUM.md).

Her sürümde iki ZIP üretilir: `finans-paneli-<sürüm>-hosting.zip` yalnız doğrudan web dizinine yüklenecek uygulama dosyalarıdır; `finans-paneli-<sürüm>.zip` kurulum belgeleri ve başlangıç SQL'i içeren tam pakettir. Mevcut kurulum güncellemelerinde hosting ZIP'i yeterlidir; `api/config.php` korunur. Her ZIP'in ayrı SHA-256 dosyası vardır.

GitHub Actions `Hosting release` iş akışı `v<package.json sürümü>` etiketi GitHub'a gönderildiğinde testleri çalıştırır, paketi hazırlar ve GitHub Release'e ekler. Örneğin 1.14.0 için `v1.14.0`. İş akışı ve paketleme dosyaları önce ilgili commit'te bulunmalıdır. Actions'ın depoda etkin ve iş akışının Release yazma yetkisine sahip olması gerekir. Manuel `workflow_dispatch` çalıştırması yalnızca indirilebilir Actions artifact'ı üretir; Release yayımlamaz.

## İzole API ve tarayıcı testleri

Docker gerekir. Test koşucusu kendi MariaDB/PHP konteynerlerini ve rastgele yerel kimlik bilgilerini oluşturur; mevcut `public/api/config.php` veya geliştirme veritabanına bağlanmaz. Her koşu sonrasında yalnızca oluşturduğu konteynerleri kaldırır. Test çıktıları Git dışında `.qa/` altında tutulur.

```sh
npm run test:api
npm run test:migrations
npm run release:package
npx playwright install --with-deps chromium
npm run test:package
npm run test:browser
npx playwright install --with-deps webkit
npm run test:mobile
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

Çalışır demo ve giriş bilgileri yalnız Git dışında `.qa/current-demo` dosyasının gösterdiği klasördeki `local-session.json` içinde saklanır. Bu dosyayı paylaşmayın. Yerel sunucu yalnız 127.0.0.1'de dinler; dış hosting yayını değildir. `demo:stop` yalnız bu demo koşusunun konteynerlerini ve yerel kimlik bilgilerini kaldırır. Ortam yeniden başlarsa `demo:start` yeniden çalıştırılır. Ayrıntılı bulgular `docs/TEST-RAPORU-1.14.0.md` içindedir.

`npm run test:backups`, yalnız koşucunun oluşturduğu izole veritabanında yedekleme, bozuk dosya/ilişki, geri alma, kullanıcı yetkileri, cron ve demo temizliği senaryolarını doğrular. Canlı veritabanı hedeflemez.

`test:mobile`, aynı izole fixture üzerinde Chromium ve WebKit motorlarıyla mobil açık/kapalı satır, menü, filtre/takvim, tutar ve özet düzenlerini doğrular. Her iki motorun kurulması gerekir. `QA_BROWSER_ENGINES=chromium` yalnız hedefli yerel kontrol içindir; sürüm kabulünde iki motor birlikte çalışır. WebKit emülasyonu fiziksel iPhone testi değildir.

1.18.0 itibarıyla GitHub bağlantısı üzerinden yayın için `release/v<sürüm>` dalına yapılan push da aynı tam kabul iş akışını çalıştırır. Dal adı package.json sürümüyle tam eşleşmelidir. Bütün kontrollerden sonra ilgili commit hedeflenerek sürüm etiketi ve iki ZIP yayımlanır; cPanel'e otomatik dağıtım yapılmaz. `npm run test:party-ui` derlenmiş arayüzü sentetik API üzerinde Chromium ve WebKit ile ayrıca kontrol eder.

## 1.27.0 personel hakedişleri

Personel profilindeki aylık maaş/yemek tutarları ayrı CLI göreviyle dönem başında cari hakediş oluşturur. Hosting görevi kendiliğinden kurulmaz; [personel cron kılavuzunu](docs/PERSONEL-CRON.md) izleyin. Mevcut yedek cron görevi ayrıdır. Satır içi kayıt ve kaynak satıra yönlendirme kapsamı [1.27.0 sürüm belgesindedir](docs/SURUM-1.27.0.md).
