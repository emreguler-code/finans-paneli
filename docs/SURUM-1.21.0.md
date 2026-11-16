# 1.21.0 — Ortak yerleşim ve kod sağlığı

Kullanıcı, 1.20.0 sonrasında gönderdiği Firefox ekranlarındaki kaymaları, harf harf bölünen filtreleri, ikon hizasını ve gereğinden büyük form/düğmeleri düzeltmeyi ve yeni GitHub sürümü yayımlamayı onayladı. Sade Netlik, Inter/Lucide ve mali model/şema 12 korunur.

## Kök nedenler ve uygulama

- Workspace 1240 px'te 1,9:1 iki sütun açarken ana ledger 880 px'ten önce daralıyordu. İki karar 1400 px güvenli workspace sınırında birlikte düzenlendi; yan bilgi alta tam genişlikte iner. Ledger/tablet/mobil dönüşümü kendi alanını izler.
- SmartSearch eski cari-search/page-search-row sınıflarından ayrıldı. Sabit ikon sütunları, sarılan içerik ve ayrı eylemler kullanır. Filtre metni tek satır, uzun etiket kontrollü kısalır; kaldırma düğmesinin erişilebilir adı tam metni içerir.
- Arama alanları en fazla 760 px genişlik ve 540 px yükseklikte, kullanılabilir viewport sınırında açılır; gövde kayar, eylemler görünür kalır.
- Ek seçenekler formun dış grid'ine yayılır. İkincil FormSection'lar tekrar iç içe açılmaz. İçerik kadar alan, kısa tarih/saat/belge ve açıklama için esneklik; kalıcı form en fazla 44dvh/420 px gövde kullanır. Kaydet bölümü gerektiğinde kendi kaydırma alanında erişilebilir kalır.
- Satır içi eylemlerde genel footer flex büyümesi iptal edildi: 36 px, dar ledger'da 44 px. Koşullu alanlar 3/2/1 sütunlu, gerekçe tam genişliktedir.
- Eski release119/release120 stil yama dosyaları kaldırılıp smart-search/composer/inline-editor/ledger-interactions/directory-interactions sahiplerine ayrıldı. Yinelenen sütun genişliği kuralları shell'den çıkarıldı. Eski kontrollü filtre kopyalayıcısı, kullanılmayan importlar/değişkenler, görünmeyen üst başlık label state'i ve CSS tekrarları temizlendi.

## Kalite ve uyumluluk

ESLint 10, React Hooks, kullanılmayan import/değişken ve Stylelint kontrolleri npm test içinde zorunludur. Vite güvenlik yaması 6.4.6'ya alındı; ana sürüm yükseltmesi yapılmadı. Baseline hedefi ve seçim ilkesi docs/KOD-KALITESI.md içinde. Fonksiyon değiştirmeyen kod temizliği finansal API testleriyle birlikte kontrol edilir.

## Kabul kapsamı

Windows Firefox/Chromium sentetik arayüz kontrolü ayrıca zorunludur. Gerçek PHP/MariaDB tarayıcı akışları Chromium/WebKit/Firefox; sentetik 75 hareketli arayüzde üç sidebar durumu, 1024–2048 arası kritik genişlikler, 320–1920 önceki kabulü, kısa pencere/zoom eşdeğeri viewportlar ve 1,5 ölçekli 1365x700 ekran görüntüsü. Son ay satırına erişim, ikon merkezi, etiket metin ölçüsü, form genişliği ve küçük eylem düğmeleri sayısal olarak doğrulanır. Kapsamlı demo 624 hareket/715 mutabakat; API/migrasyon/yedek ve ZIP kurulum kabulü sürer.

Hiçbir test tüm olası cihaz/tarayıcılarda sonsuz kusursuzluğu kanıtlamaz. Fiziksel iOS ve gerçek browser-chrome yakınlaştırma testi yapılmış sayılmaz. Ağ tabanlı sayfalama ve finansal model değişikliği kapsam dışıdır. Hosting'e canlı kurulum yapılmaz.
