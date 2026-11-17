# Finans 1.15.0 test raporu

2 Kasım 2026 · Şema 12. İzole PHP/MariaDB ve Chromium ortamları, yalnız sentetik veri.

| Kontrol                            | Sonuç                                                |
| ---------------------------------- | ---------------------------------------------------- |
| Üretim derlemesi / birim testleri  | 45 birim + 4 worker testi geçti                      |
| PHP sözdizimi                      | Geçti                                                |
| Finansal API                       | 134 kontrol geçti                                    |
| Şema geçişi ve kurtarma            | 34 kontrol geçti                                     |
| Yedekleme, geri yükleme, sıfırlama | 77 kontrol geçti                                     |
| Masaüstü ve mobil arayüz           | 616 kontrol; 0 çalışma zamanı hatası                 |
| Geniş demo çapraz kontrolü         | 715 kontrol, 624 işlem, 29 hafta                     |
| Geniş demo arayüzü                 | 105 kontrol geçti                                    |
| Hazır hosting ZIP kurulumu         | Geçti; 1.15.0 tam/hosting arşiv içerikleri eşleşiyor |

Komutlar: `npm test`, PHP lint, `npm run test:api`, `npm run test:migrations`, `npm run test:backups`, `QA_BROWSER_BIN=/usr/bin/chromium npm run test:browser`, `QA_BROWSER_BIN=/usr/bin/chromium npm run test:demo`, `npm run release:package`, `npm run test:package`. GitHub yayın akışı bunları tekrar çalıştırır; hazır ZIP ayrıca temiz kurulumdan geçirilir.

Yeni senaryolar: cari düzenleme adresini yenileme ve dolu değerler, açıklamasız düzenlemede kimlik/bakiye korunması; tek satır kontrol hizası; ikon tarih ve yedi eşit takvim sütunu; kart detayında başka kart seçememe; harcama, ödeme ve tedarikçi alışının görüntülenen karta kaydı; kaynakta kredi kartını API'de reddetme; yeni kartlar arası aktarımı reddederken eski kayıtları koruma. Aynı gün elle yedekte dosya oluşturmadan/silmeden onay; gerçek rotasyon kurbanı bilgisi ve aynı istek anahtarı tekrarında tek dosya; sıfırlamada parola/yazılı onay; yalnız mevcut yönetici ve parola özetini koruma; gerçek veri modunda da sıfırlama; güvenlik yedeğinden finansal verilerin geri gelmesi.

Kanıtlar: API `.qa/17a8ac893819`, migration `.qa/f248299d4820`, yedek `.qa/664477e3acc2`, tarayıcı `.qa/7cc508d1cc7a`, demo `.qa/06054e5e9015`, paket `.qa/0d77dce50f61`; görsel inceleme kökteki design-qa.md dosyasında. Bu özel runtime dizinleri pakete/depoya eklenmez.

Sınırlar: Chromium mobil viewport ve klavye benzetimi; fiziksel iOS/Android veya canlı hosting cron testi değildir. Kullanıcının hosting verisi temizlenmedi/sıfırlanmadı. Güncelleme dosyaları api/config.php ve özel yedek dizini korunarak yüklenir; mevcut şema 12 değişmez.
