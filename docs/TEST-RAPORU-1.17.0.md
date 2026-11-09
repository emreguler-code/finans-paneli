# 1.17.0 doğrulama raporu

9 Kasım 2026 · Node 24, Chromium ve Playwright WebKit; izole PHP 8.3 / MariaDB 11.4 fixture'ları. Canlı veritabanı kullanılmadı.

| Kontrol | Sonuç |
| --- | --- |
| `npm ci --cache /workspace/.npm-cache` | Başarılı |
| `npm test` | Derleme, 45 birim ve 4 Sites worker testi geçti |
| `QA_DB_TMPFS=1 QA_BROWSER_BIN=/usr/bin/chromium npm run test:browser` | 702 kontrol, 0 React çalışma zamanı hatası |
| `npm run test:mobile` | Chromium 71 + WebKit 71 kontrol, iki motorda 0 React çalışma zamanı hatası |
| `npm run test:demo` | 715 finansal uzlaştırma + 105 tarayıcı kontrolü geçti |
| `npm run release:package` | İki ZIP ve SHA256 dosyaları üretildi |
| `npm run test:package` | Paket eşliği, kurulu PHP/updater ve font kontrolleri geçti |
| `git diff --check` | Temiz |

## Yeniden üretim ve regresyonlar

1.16.0 derlemesinde Ada Tasarım açık satırı hem Chromium hem WebKit'te yeniden üretildi: 364 px tablonun mobil hücresi yalnız 28,66 px genişlik alıyordu. Eski CSS native tablo satırıyla blok hücreyi karıştırıyordu. Yeni sunumda blok table/tbody/tr/hücre akışı tutarlıdır; hücre genişliği kapalı/açık durumda gerçek tablo genişliğine göre ölçülür. Eylemler ve 3 px seçim çizgisi de ayrıca kontrol edilir.

Eski mobil media kuralları drawer etiketlerini gizliyordu. Etiketlerin gerçek görünürlüğü ve kapatma kontrolü artık ölçülür. Rapor/hesap/ödeme planı özetlerindeki dikey çizgiler ve girintiler kontrol edilir. Mobil header'da odak sonrası menü/zil görünürlüğü, kullanılabilir input genişliği ve ayrı submit'in gizlenmesi doğrulanır.

Filtre kontrolleri 320 × 568, 390 × 844 ve 430 × 700 viewport'larında açıldı. Panel header ile alt gezinme arasında kalır; yalnız alanlar kaydırılır. Footer'ın panelin gerçek alt kenarında olması kontrol edilir; eski sticky `bottom:64px` boşluğu geri gelemez. İç içe tarih aralığı takvimi açıldı/kapatıldı; filtre paneli ve iptal akışı korundu. 320 px kart listesinde 100.000,00 TL dahil tutar/birim kırpılması kontrol edildi.

Mobil satırlar 320/390/430/768/960; ortak kabuk ayrıca 1440/1920 px genişliklerde ölçüldü. Önceki kapsamlı masaüstü/mobil form, gezinme, takvim, arama, finans ve yedekleme kontrolleri de çalıştı. Geçmiş testlerdeki arama genişliğine eşit mobil filtre beklentisi, onaylı tam mobil çerçeve beklentisiyle değiştirildi. Seçim çizgisi artık onu çizen hücrede ölçülür. Kontroller yalnız body taşmasına bakılarak gevşetilmedi.

## Motorlar ve sınırlar

Her iki motor için touch + mobile viewport, Türkçe yerel ayar ve İstanbul saat dilimi kullanıldı. Kaydedilen ekranlar DPR 1'dir. WebKit Linux'ta Playwright'ın kendi motorudur; fiziksel iPhone/Safari veya iOS tarayıcı arayüzü testi değildir. Gerçek mobil klavye, VoiceOver ve fiziksel safe-area davranışı bu çalışmada doğrulanmış sayılmaz. Önceki Chromium klavye yüksekliği simülasyonu regresyon paketi kapsamında korundu.

Yerel WebKit'in eksik paylaşılan kütüphaneleri yalnız `/tmp` altına açılarak çalıştırıldı. Paketler ve kütüphaneler Git'e/hosting ZIP'ine alınmadı. Yerel host ön kontrolünün kütüphane yolunu tanımaması nedeniyle yalnız bu yerel koşuda `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` kullanıldı; gerçek motor başlatıldı ve sayfalar render edildi. GitHub Actions WebKit'i standart `npx playwright install --with-deps webkit` ile kurar; bu yerel istisnayı kullanmaz.

## Kanıtlar

[Seçili hareket](tasarimlar/1.17.0/expanded-comparison.png), [menü](tasarimlar/1.17.0/menu-comparison.png), [rapor](tasarimlar/1.17.0/reports-comparison.png), [hesap listesi](tasarimlar/1.17.0/accounts-comparison.png), [filtre](tasarimlar/1.17.0/filters-comparison.png), [ödeme planı](tasarimlar/1.17.0/plan-comparison.png), [bildirim](tasarimlar/1.17.0/notifications-comparison.png). Tam görsel değerlendirme [design-qa.md](../design-qa.md) dosyasındadır.
