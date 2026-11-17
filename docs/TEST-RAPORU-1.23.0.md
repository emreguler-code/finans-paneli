# Finans Paneli 1.23.0 — doğrulama

17 Kasım 2026. [GitHub yayın koşusu](https://github.com/emreguler-code/finans-paneli/actions/runs/44066468482) başarıyla tamamlandı. Yayımlanan uygulama commit'i `cfd5e456d9361b04363ad54764b7f259cd22075f`.

- Windows: Node 26.13.1, npm 12.2.2 ve Python 3.15.2 kurulumu; temiz npm kurulumu, lint/biçim/derleme, birim/worker testleri ve Firefox/Chromium arayüz kabulü başarılı. Üretilen Firefox masaüstü görüntüsü ayrıca gözle incelendi.
- Linux: aynı araç sürümleriyle temiz kurulum, npm test, güvenlik taraması ve PHP sözdizimi kontrolü başarılı.
- İzole PHP 8.5.12 / MariaDB 12.3.3 LTS: finansal API, migrasyon ve yedekleme kontrolleri başarılı.
- Chromium/WebKit/Firefox sentetik arayüz kabulü, gerçek API ile masaüstü ve mobil senaryoları, kapsamlı demo mutabakatı ve hosting ZIP kurulumu başarılı.
- Arşiv bütünlüğü, SHA-256 ve repo içine eklenen hosting ZIP'in yayın sırasında üretilen paketle birebir eşliği başarılı.
- GitHub Release yayımlandı. İki ZIP ve iki SHA-256 dosyası Release üzerinden yeniden indirilerek arşiv bütünlüğü/checksum kontrolü yapıldı; yayımlanan hosting ZIP repo dosyasıyla birebir aynı.

[Release doğrulama kaydı](evidence/1.23.0/release-receipt.json) · [Windows kontrolleri](evidence/1.23.0/windows-checks.json) · [Windows Firefox ekranı](evidence/1.23.0/windows-firefox-desktop.png).

Önceki yerel kabulün sayısal sonuçları ve kanıtları [bağımlılık güncelleme raporunda](BAGIMLILIK-GUNCELLEME-2026-11-17.md) kayıtlıdır: 63 birim + 4 worker, 134 API, 34 migrasyon ve 77 yedekleme kontrolü; her motorda 130 sentetik arayüz kontrolü, gerçek API ile üç motorlu genişlik/mobil senaryoları. Sürüm numarasıyla yerel npm test ve ZIP kurulumu da ayrıca başarılıdır. Vite 8 geliştirme sunucusunda ana sayfa, JSX dönüşümü ve React Refresh uçları HTTP 200 ile doğrulandı.

Kullanıcının son talimatına göre hosting bağlantısı/yükleme/inceleme kapsam dışıdır; kullanıcı yapacaktır. Canlı veriye veya sunucu hizmetlerine müdahale edilmedi. Tarayıcı viewport kabulü fiziksel cihaz testi olarak sunulmaz.
