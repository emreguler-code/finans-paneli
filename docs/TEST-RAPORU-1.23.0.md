# Finans Paneli 1.23.0 — doğrulama

17 Kasım 2026. Güncellenen bağımlılıkların yerel kabulü [bağımlılık güncelleme raporunda](BAGIMLILIK-GUNCELLEME-2026-11-17.md) ve `docs/evidence/dependency-updates-2026-11-17/` altında kayıtlıdır: temiz npm kurulumu, 63 birim + 4 worker testi, lint/biçim/derleme, 134 API, 34 migrasyon, 77 yedekleme kontrolü; Chromium/WebKit/Firefox arayüz ve gerçek API akışları, demo mutabakatı ve ZIP kurulumu başarılıdır. npm güvenlik taraması 0 bilinen açık bildirdi.

1.23.0 sürüm numarasıyla derleme, paketleme ve hosting paketi kurulumu ayrıca doğrulanır. GitHub yayın iş akışı Windows Firefox/Chromium kabulünü ve Linux tam kabulünü başarıyla tamamlamadan Release yayımlamaz. Bu dosyanın ilk sürümü yayın öncesi durumu anlatır; GitHub koşusu ve canlı dağıtım sonucu doğrulandıktan sonra ayrıca kaydedilir. Fiziksel cihaz testi yapılmış sayılmaz.

Yerel 1.23.0 doğrulaması: sürüm numarasıyla `npm test`, ZIP üretimi, arşiv bütünlüğü/SHA-256, repo ZIP eşliği ve izole hosting ZIP kurulumu başarılı (`.qa/129a042a3cac`). Son kullanıcı talimatıyla hosting bağlantısı/yükleme/inceleme kapsamdan çıkarıldı; bu işleri kullanıcı yapacak.
