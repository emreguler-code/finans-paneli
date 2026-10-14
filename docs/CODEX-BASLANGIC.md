# 1.6.0 geliştirme devri

Bu kaynak aktarımı, uygulamanın mevcut 1.6.0 sürümünü veri taşımadan sürüm kontrolüne almak içindir. Eski sohbetin tamamı kendiliğinden Codex'e aktarılmaz; kalıcı kurallar AGENTS.md ve tasarım belgesindedir. KAPSAM-1.6.md ve TEST-RAPORU-1.6.md sürümün ayrıntılarını içerir; önceki kapsam dosyaları tarihsel kayıttır.

## Hesap modeli
- Cari türleri tedarikçi/müşteri/personeldir. Cari virman yoktur; aktarım kasa/banka/kart bölümündedir.
- Tedarikçi: faturalı alış, faturasız alış, iade, ödeme. İki alış türünün hesap etkisi aynıdır; fatura ayrımı raporlama içindir. İade borçtan düşme veya tahsilat alt seçeneğine göre işlenir.
- Müşteri: satış, tahsilat, iade. Personel: maaş tahakkuku, personele satış/harcama, tahsilat, ödeme. Maaş eklemek nakit hareketi oluşturmaz; ödeme oluşturur.
- Kredi kartı: ekstre / dönem içi / gelecek dönem; açılış sekmesi dönem içidir. Gelecek dönem taksitleri ve taksit iadeleri ayrı izlenir. Banka/kasa: hesap hareketleri ve gelecek dönem hareketleri.
- Kart işlemi gerçekleştiği gün cari etkisi oluşur. Ekstre kesimi aynı harcamayı veya nakit çıkışını yeniden üretmez. Manuel ekstre ile bilinen hareket farkı tanımlanmamış bakiye olarak uzlaştırılır.
- Vade opsiyoneldir; bugün otomatik vade atanmaz. Planlanan işlem gerçekleşmeden bakiyeye girmez. Gelecek kart taksitleri limit kullanımını etkiler.
- KMH limiti nakit değildir. Tahmini faiz, kullanıcı oran girdiyse negatif bakiye üzerinden bir günlük tahmindir; vergi/valör içermez ve otomatik muhasebeleşmez.

## Ortam ve doğrulama
Node.js 22 ve npm; API için PHP 8.3+, pdo_mysql ve MySQL/MariaDB gerekir. Önce npm ci ve npm test çalıştırın. API/UI incelemesi için izole yerel veritabanı oluşturun; config.example.php'den yerel config.php hazırlayın. Gerçek hosting bilgisi veya gerçek kullanıcı şifresi kullanmayın. API kurulumu için README.md'yi izleyin. npm run dev PHP'yi 8088'de ve Vite'ı başlatır; yerel MySQL'i ayrıca başlatın.

Tarihsel Python entegrasyonları `tests/historical/` altındadır; güncel kabul testleri olarak çalıştırmayın. Güncel API, migrasyon ve tarayıcı senaryoları README içindeki izole Docker koşucusuyla çalıştırılır. tests/fixtures/legacy-v1.json yalnızca sentetik geçiş testi verisidir; otomatik uygulama kurulumu bunun içeriğini yüklemez. İsteğe bağlı yönetici demo üretme özelliği korunmuştur, açılışta demo yüklenmez.

Aktarımda yeniden çalıştırılan kontroller ayrı aktarım raporunda belirtilir. TEST-RAPORU-1.6.md önceki sürüm doğrulamasıdır. Fiziksel iOS Firefox testi yapılmış kabul edilmez.

## Codex'te ilk görev önerisi
“AGENTS.md ve docs altındaki tasarım/devir notlarını oku. Önce uygulamayı izole boş veritabanında çalıştır, mevcut testleri çalıştır ve sonucu bildir. Ben istemeden hesap modelini, sütun sırasını, tasarım dilini veya canlı veriyi değiştirme.”

## 1.6.1 bakım güncellemesi

Güncel test yolları ve komutları README içindedir. Eski API betikleri `tests/historical/` altında referans olarak tutulur. `scripts/test-integration.py` her koşu için ayrı Docker veritabanı ve PHP sunucusu başlatır; canlı/yüklü veritabanını hedeflemez. Şema 7'dir. CSS tek girişten, bileşen amaçlarına göre `src/styles/` altında yüklenir; tasarımın cascade sırası korunur.
