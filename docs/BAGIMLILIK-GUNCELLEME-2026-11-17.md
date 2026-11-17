# 17 Kasım 2026 — Bağımlılık güncellemesi

Kullanıcının “güncellemelerin tamamını gerçekleştir” talimatıyla uygulandı. Taban GitHub `main` / 1.22.0, commit `069a2c1`. Önceki 1.17.0 yerel kaynakları bu tabana fast-forward ile eşleştirildi; kullanıcının çalışma kuralları ve analiz notları korundu. Bu analiz ve ilk yerel kabul 1.22.0 tabanında hazırlandı. Sonraki kullanıcı talimatıyla değişiklikler 1.23.0 olarak yayımlandı; nihai GitHub/Windows/Linux doğrulaması `TEST-RAPORU-1.23.0.md` içindedir. Aşağıdaki yerel sonuçlar ilk uygulama aşamasının kaydıdır.

| Bileşen | Önce | Sonra |
| --- | --- | --- |
| React / React DOM | 19.2.9 | 19.3.1 |
| Lucide React | 1.57.0 | 1.74.0 |
| Vite | 6.4.6 | 8.3.8 |
| @vitejs/plugin-react | 5.0.4 | 6.3.0 |
| Playwright | 1.64.1 | 1.65.1 |
| Node.js | 24 dalı | 26.13.1 LTS |
| npm | Sabitlenmemiş | 12.2.2 |
| Python otomasyonu | Sabitlenmemiş | 3.15.2 |
| PHP test imajı | 8.3 | 8.5.12 |
| MariaDB test imajı | 11.4 | 12.3.3 LTS |
| Inter | 4.001 dosyaları | 4.1 dağıtımı |
| actions/checkout | v5 | v7.0.1 |
| actions/setup-node | v5 | v7.1.0 |
| actions/upload-artifact | v6 | v7.0.2 |
| actions/setup-python | Yok | v7.1.0 |

Recharts 3.10.1, ESLint 10.15.0, @eslint/js 10.0.1, eslint-plugin-react-hooks 7.1.1, eslint-plugin-unused-imports 4.4.1, globals 17.14.0, Prettier 3.10.1 ve Stylelint 18.0.0 zaten günceldi; aynı sürümler korunarak kesin sürümlerle sabitlendi. Uyumlu dolaylı bağımlılıklar da `npm update --package-lock-only` ile yenilendi. Kilit dosyasındaki paket kaydı 263'ten 239'a indi. Dolaylı paketlere üst paketlerinin desteklemediği ana sürümler zorlanmadı.

`.node-version`, `.nvmrc`, `.python-version`, npm engine şartı ve CI ayarları eşleştirildi. PHP ve MariaDB imajları içerik digestleriyle sabitlenir. PHP test imajı etiketi taban digestinden türetilir; eski `finans-php-test:latest` önbelleği yeni PHP testini atlatamaz. Font dosyaları ve OFL lisansı resmi Inter 4.1 paketinden alındı; yerel font sunumu sürer.

## Doğrulama

- Node 26.13.1 / npm 12.2.2 ile temiz `npm ci`, ardından `npm test`: lint, biçim kontrolü, Vite 8 derlemesi, 63 birim testi ve 4 worker testi başarılı.
- `npm ls --all`: bağımlılık ağacı geçerli. `npm outdated --json`: `{}`; 14 doğrudan paketin tamamı kontrol anındaki npm latest sürümünde.
- `npm audit --json`: toplam 0 bilinen açık.
- Python 3.15.2 / PHP 8.5.12 / MariaDB 12.3.3 ile izole API 134, migrasyon 34 ve yedekleme 77 kontrolü başarılı.
- PHP 8.5 ile 12 PHP dosyasında sözdizimi kontrolü başarılı.
- Sentetik arayüz ve yerleşim: Chromium, WebKit, Firefox için 130'ar kontrol başarılı. Üç menü modu, dar/geniş ekranlar, filtre çipleri, sıralama, satır içi düzenleme, taslak koruması ve yetkiler dahil.
- Gerçek izole PHP API ile masaüstü tarayıcı senaryosu başarılı. Üç motorlu mobil/genişlik senaryosunda Chromium 146, WebKit 145, Firefox 145 kontrol başarılı.
- Kapsamlı sentetik demo/mali mutabakat, iki ZIP'in içerik eşliği ve hosting paketinin boş veritabanına kurulumu başarılı. İki ZIP'in SHA-256 ve arşiv bütünlüğü kontrolleri başarılı.
- Masaüstü ve WebKit mobil ekran görüntüleri ayrıca gözle incelendi.
- İş akışı YAML dosyaları ayrıştırıldı. Yeni GitHub Actions sürümlerinin GitHub sunucularında çalışması ve Windows kabulü bu yerel çalışmada yürütülmedi.

Kanıtlar: [sürümler](evidence/dependency-updates-2026-11-17/versions.json), [npm denetimi](evidence/dependency-updates-2026-11-17/npm-audit.json), [arayüz](evidence/dependency-updates-2026-11-17/frontend-checks.json), [masaüstü API akışı](evidence/dependency-updates-2026-11-17/browser-checks.json), [üç motorlu API akışı](evidence/dependency-updates-2026-11-17/mobile-checks.json).

## Ortam ve kapsam sınırları

Güncellenen PHP/MariaDB sürümleri izole test ortamına aittir. Canlı hosting PHP'si veya veritabanı yükseltilmedi; mevcut PHP 8.3+ hosting gereksinimi korunur. Docker motoru yönetilen çalışma ortamının hizmetidir, uygulama bağımlılığı olarak yükseltilmedi. GitHub'a push, Release veya canlı kurulum yapılmadı; finansal uygulama kodu, şema 12 ve canlı veri değiştirilmedi.

Bu bulut ortamında yeni Playwright tarayıcıları için eksik Debian kütüphaneleri `/tmp` altında açılıp yerel yükleme yollarıyla sağlandı. WebKit'in indirilen yerel başlatıcısına bu kütüphane yolu aktarıldı. Sistem ldconfig önbelleği bu geçici dizini göstermediğinden yalnız Playwright'ın host ön kontrolü atlandı; gerçek motorlar ve bütün senaryolar çalıştırıldı. Firefox için geçici XDG dizinleri ve konteynerin izin vermediği iç sandbox katmanlarını kapatan ortam değişkenleri kullanıldı. Bu ayarlar depoya/ürüne eklenmedi. Bu testler fiziksel cihaz veya Windows testi olarak değerlendirilmez.

Resmi geçiş kaynakları: https://vite.dev/guide/migration · https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react · https://nodejs.org/dist/index.json · https://www.php.net/releases/ · https://github.com/rsms/inter/releases/tag/v4.1

## Son yayın sonucu

Kullanıcının ek talimatı ve son kapsam düzeltmesiyle 1.23.0 GitHub sürümü yayımlandı; Windows ve Linux tam kabulü başarılıdır. Hostinge hazır ZIP + SHA-256 repo içine ve Release varlıklarına eklendi, birebir eşliği doğrulandı. Önceki “GitHub/Windows çalıştırılmadı” ifadeleri ilk yerel aşamaya aittir. Hosting yükleme ve inceleme kullanıcı tarafından yürütülür; bağlantı veya canlı dağıtım yapılmadı. Ayrıntılar [nihai test raporunda](TEST-RAPORU-1.23.0.md).
