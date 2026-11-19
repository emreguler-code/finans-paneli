# 1.27.0 doğrulama

Kontroller izole/sentetik verilerle çalıştırılır; canlı hosting ve gerçek kullanıcı verisi kullanılmaz. Node 26.13.1, npm 12.2.2, Python 3.15.2; PHP 8.5.12 / MariaDB 12.3.3.

- `npm test`: ESLint, Stylelint, proje genelinde Prettier, derleme; 86 birim ve 4 Sites worker testi.
- Gerçek API: 168 kontrol. Önceki finansal kabulün yanında IBAN ve ücret doğrulama, eşzamanlı cron, günlük tek deneme, kısmi hata, dönem tutarının korunması, ayrı brüt maaş/yemek, kasa bakiyesinin değişmemesi, iptal edilen kaydın yeniden üretilmemesi ve üç günlük sonuç kaydı.
- Şema geçişleri: 34; yedekleme/geri yükleme güvenlik kontrolleri: 77.
- Chromium/WebKit/Firefox sentetik arayüz kontrolleri: 181 kontrol/tarayıcı. Yeni metadata girişleri kendi listesinde, taslak terk etme koruması, modern seçimler, eski oluşturma bağlantısı, IBAN/TCKN kopya başarı/hata bildirimi, Son 5 işlemden tam kaynak satıra yönlendirme ve 390–1920 px sütuna bağlı ek alanlar dahil.
- Gerçek API ile Chromium masaüstü ve Chromium/WebKit/Firefox mobil akışları: banka/kart kaydı bir kez, kaynak hesap/kart korunması, düzenleme, takvim, arama, eylem hedefleri ve taşma kontrolleri.
- Kritik bildirim testleri üçüncü gün 12.00 eşiğini, cron hiç çalışmamasını, iptal edilen kaydın dönem sahipliğini ve güncel ücret değişse bile dönem planının kullanılmasını doğrular.
- PHP kaynakları sözdizimi denetiminden geçti. `audit:security` son taraması bilinen açık bildirmedi; önceki dar/süreli picomatch istisna politikası korunur, yeni bulgular geçiş izni almaz.

Geçici ortam yeniden başlatılınca araçlar `/tmp` altında yeniden kuruldu. WebKit için eksik sistem kitaplıkları yalnız geçici dizine çıkarıldı; tarayıcıların yerel test adreslerine proxy üzerinden gitmesi engellendi. Bu ayarlar ürün/hosting paketine eklenmedi. Fiziksel iPhone veya canlı cPanel testi yapılmadı.

Kapsam [SURUM-1.27.0.md](SURUM-1.27.0.md). Hosting yükleme/inceleme ve cron kurulumu kullanıcıya aittir. Genel kira/abonelik tekrarlama ekranı bu sürümün seçilmiş kapsamı değildir.

Kapsamlı demo ve tarayıcı kabulü başarılı. Sütun sırası sonrası banka açıklama genişliği kontrolünün yakaladığı daralma düzeltildi; açıklamalar, ekstre girişleri, kaynak satır seçimi ve 320–1920 px taşma kontrolleri son derlemeyle geçti. Sentetik ekran kanıtları `docs/evidence/1.27.0/` altındadır.

Paket kabulü başarılı: hosting/tam ZIP eşliği, temiz kurulum ve 1.25.0 üzerine dosya yükseltmesinde config/eski assets korunması doğrulandı. Paket içindeki yeni CLI/API modülleri dahil 168 API kontrolü, kapsamlı demo ve iki ardışık demo yenilemesinde yönetici/veri güvenliği kontrolleri geçti. 624 olay, yedi ay ve 29 hafta üzerinde 715 finansal mutabakat kontrolü başarılı; kapsamlı demo tarayıcı kabulü 105 kontroldür. Canlı veri üzerinde yenileme/sıfırlama yapılmadı.
