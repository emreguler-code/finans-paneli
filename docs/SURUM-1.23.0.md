# Finans Paneli 1.23.0

17 Kasım 2026. Kullanıcı bağımlılık güncellemelerini uygulama, GitHub'da yeni sürüm yayımlama talimatı verdi. Son düzeltmesiyle hosting yükleme ve incelemeyi kendisi devraldı; kodlama onayının sonraki işlerde GitHub yayınını da kapsamasını ve hostinge hazır ZIP dosyasının repo içine eklenmesini istedi.

Kapsam: React/React DOM 19.3.1, Lucide 1.74.0, Vite 8.3.8, @vitejs/plugin-react 6.3.0, Playwright 1.65.1; Node.js 26.13.1 LTS, npm 12.2.2 ve Python 3.15.2. Güncel kalan diğer doğrudan bağımlılıklar da kesin sürümlerle sabitlendi, uyumlu dolaylı bağımlılıklar yenilendi. GitHub Actions sürümleri ve araç sürüm dosyaları eşleştirildi. Inter 4.1; izole PHP 8.5.12 / MariaDB 12.3.3 LTS imajları içerik digestleriyle sabitlendi. PHP test imajının önbellek kimliği taban digestine bağlandı.

Finansal uygulama kodu ve veritabanı şeması 12 değişmez. Hosting üzerinde Node/Python kurulumu gerekmez. Hosting bağlantısı, yükleme ve canlı inceleme kullanıcı tarafından yürütülür. Hostinge hazır ZIP + SHA-256, `releases/1.23.0/` altında depoda ve GitHub Release varlıklarında sunulur. Kullanıcı yükleme sırasında mevcut yapılandırma ve özel yedek dizinini korumalı, dosya/veritabanı yedeğini almalıdır. Sunucu PHP/veritabanı hizmeti değiştirilmez; veri silme veya demo yenileme yapılmaz.

Ayrıntılı bağımlılık karşılaştırması ve yerel kanıtlar [güncelleme raporunda](BAGIMLILIK-GUNCELLEME-2026-11-17.md). [Sürüm test raporu](TEST-RAPORU-1.23.0.md).
