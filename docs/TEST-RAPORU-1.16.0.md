# 1.16.0 doğrulama raporu

9 Kasım 2026 · Node 24, Chromium 154, PHP 8.3 ve MariaDB 11.4. Tüm veri/API kontrolleri izole sentetik test ortamında yapıldı. Canlı kurulum kullanılmadı; şema 12 ve PHP/API kaynakları değişmedi.

| Kontrol                                                               | Sonuç                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------- |
| `npm ci --cache /workspace/.npm-cache`                                | Başarılı                                                      |
| `npm test`                                                            | Derleme + 45 birim + 4 Sites worker testi geçti               |
| `QA_DB_TMPFS=1 QA_BROWSER_BIN=/usr/bin/chromium npm run test:browser` | 697 kontrol, 0 React çalışma zamanı hatası                    |
| Son para birimi CSS düzeltmesinden sonra odaklı yerleşim paketi       | 82 kontrol, 0 React çalışma zamanı hatası                     |
| Kapsamlı demo finansal uzlaştırma                                     | 715 kontrol geçti                                             |
| Güncel derleme ile kapsamlı demo tarayıcı kontrolü                    | 105 kontrol, 0 React çalışma zamanı hatası                    |
| `npm run release:package`                                             | Tam paket + doğrudan hosting ZIP ve SHA256 dosyaları üretildi |
| `QA_DB_TMPFS=1 QA_BROWSER_BIN=/usr/bin/chromium npm run test:package` | Arşiv eşliği, PHP/updater ve yerel font doğrulaması geçti     |
| `git diff --check`                                                    | Temiz                                                         |

697 kontrol içindeki yeni yerleşim senaryoları sonrasında, kompakt para biriminin aynı satırda kalması için küçük bir CSS düzeltmesi yapıldı. Son derlemede odaklı paket 82 kontrole çıkarılarak ve kapsamlı demo tekrar çalıştırılarak doğrulandı; geniş paketin sayısı bu odaklı tekrarın sayısıyla toplanmış bir ölçüm değildir.

## Yerleşim ve erişilebilirlik kapsamı

- 2540/1920/1440/1268/1180/1100/1024/960/768/390/320 CSS px genişlikler; 844 × 390 kısa yatay pencere. Ara genişlikler yalnız “mobil/masaüstü” etiketiyle değerlendirilmedi.
- Sidebar tam/kompakt/gizli, kullanılabilir alanın geri kazanılması, resize/reload sonrası tercih, gizli menüyü tekrar açma; mobil panel izolasyonu/Escape ve odak dönüşü.
- Gerçek içerik genişliğine bağlı 1,9:1 veya alt alta sütunlar; tablo bölgesine bağlı kompakt sunum; uzun unvan ve 999.999.999,99 TL tutarının özet ve görünür hareket hücresinde kırpılmaması.
- Ortak header/çerçeve/işlem kenarları, yalnız ana içeriğin kaydırılması, erişilebilir footer, ayrı satırdaki işlem bölgesinin içerik üstüne binmemesi, küçük ekranda iki onay eyleminin erişilebilirliği.
- Merkezi onay için body portalı, Tab/Shift+Tab, Escape/dışarı tıklamada taslağın korunması, vazgeçme sonrası inert/kaydırma kilitlerinin bırakılması. Mevcut takvim, form doğrulama, menüyle ayrılma, geçmiş ve kayıt akışları korundu.
- Görünür klavye yüksekliği simülasyonu, değişen alanlara rağmen taslak korunması, 44 px mobil hedefler. Renk değişkeninin bölge geometrisini değiştirmediği ve vurgu düğmelerinin beyaz yazısının korunduğu kontrol edildi.
- Tüm ana bölümler yarım pencere genişliğinde açıldı; hesap/kart ödemeleri, güncelleme, yedekleme ve sıfırlama regresyonları yalnız test veritabanında çalıştı.

## Görsel kanıt ve sınırlar

[Karşılaştırma](tasarimlar/1.16.0/karsilastirma.png), [bölünmüş pencere](tasarimlar/1.16.0/bolunmus-pencere.png), [mobil](tasarimlar/1.16.0/mobil.png), [merkezi onay](tasarimlar/1.16.0/taslak-onayi.png), [büyük tutar](tasarimlar/1.16.0/buyuk-tutar-960.png). Ayrıntılı görsel değerlendirme proje kökündeki [design-qa.md](../design-qa.md) dosyasındadır.

Mobil kontroller Chromium viewport emülasyonudur. Fiziksel telefon, Safari/Firefox ve işletim sistemi düzeyinde gerçek tarayıcı zoom testi yapılmadı. 125/150/200% zoom sonucunda karşılaşılabilecek dar CSS genişlikleri kapsandı; bu, gerçek tarayıcı zoom testi olarak raporlanmaz.

Test altyapısında isteğe bağlı `QA_DB_TMPFS=1`, geçici veritabanı dosyalarını RAM alanına alır. Test bitiminde anonim Docker volume'larının da temizlenmesi sağlandı. Bunlar uygulamanın hosting/veri davranışını değiştirmez.
