# Finans Paneli 1.24.0 — Proje genelinde biçim kontrolü

Kullanıcının kapsamı genişletme talimatıyla Prettier'ın 14 dosyalık listesi kaldırıldı. `scripts/format.mjs`, Git tarafından izlenen ve henüz eklenmemiş, ignore dışındaki dosyaları otomatik keşfeder; Prettier’ın desteklediği kaynakları, belgeleri ve yapılandırmaları kontrol eder. `npm run format` aynı kapsamı düzeltir. `.prettierrc.json` kuralları sabitler; resmi `@prettier/plugin-php` PHP dosyalarını PHP 8.3 hedefiyle kapsar.

Bağımlılıklar, derlemeler, özel çalışma/config dosyaları, üretilmiş kilit/ZIP/checksum dosyaları ve geçmiş test kanıtları `.prettierignore` içinde hariçtir. Python/SQL Prettier kapsamında değildir; mevcut entegrasyon ve migrasyon kontrolleri sürer. İlk geçişte biçim farkları topluca düzenlenir; finansal davranış ve şema 12 korunur.

`npm test` ve GitHub yayını genel biçim kontrolünü çalıştırır; yeni desteklenen dosyalar sonraki sürümlerde de otomatik denetlenir. Hosting ZIP + SHA-256 depo içinde ve GitHub Release varlıklarında sunulur. Hosting yükleme/inceleme kullanıcıya aittir.
