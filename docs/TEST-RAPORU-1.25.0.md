# 1.25.0 doğrulama

17 Kasım 2026. Tüm veri senaryoları izole/sentetiktir; canlı hosting veya gerçek kullanıcı verisi kullanılmadı. Node 26.13.1, npm 12.2.2, Python 3.15.2; izole PHP 8.5.12 / MariaDB 12.3.3.

- `npm test`: ESLint, Stylelint, tüm desteklenen proje dosyalarında Prettier, Vite derleme; 73 birim ve 4 Sites worker testi.
- Yeni hesaplama senaryoları: faturalı/faturasız payları, nakit/kart/açık borç, eski borç tahsilatı, iptal/plan/gelecek hariç kesit, iade ve sonradan alınan iade bedeli, tanımsız personel ödeme bağlantısı, dönem dışı avansın sahte borca dönüşmemesi.
- Finansal API: 138 senaryo. Tarih bazlı vardiya/izin gidiş-dönüşü, geçersiz gün/tür/listenin reddi ve finansal kayıtlara etki etmemesi dahil.
- Migrasyon: 34 senaryo; mevcut şema 12 ve kullanıcı/veri koruması. Yedekleme/geri yükleme/sıfırlama korumaları: 77 kontrol.
- Gerçek PHP/MariaDB tarayıcı akışı: satır içi yeni işlem yalnız bir kayıt üretir; düzenleme aynı id/version/gerekçeyle çalışır. Mobil koşucu aynı akışı Chromium, WebKit ve Firefox'ta doğruladı.
- Sentetik arayüz: Chromium/WebKit/Firefox, 320–2048 px, üç sidebar durumu, dar/kısa ve ölçekli viewport; yeni takvim, grafik, form, menü, arama ve kapanış durumları. Son koşuda çalışma zamanı hatası yoktur. [Kontrol listesi](evidence/1.25.0/checks.json).
- Demo mutabakatı ve tarayıcı kontrolleri geçti. Paket kurulum testi hosting ZIP ile tam paket dosyalarının birebir eşliğini, config/şifre içermediğini, temiz kurulum ve demo mutabakatını doğruladı.
- 12 PHP dosyası sözdizimi kontrolünden geçti. `npm audit --audit-level=moderate`: 0 güvenlik açığı.

[Tasarım karşılaştırması](../design-qa.md) ve [kapsam](SURUM-1.25.0.md). Fiziksel iPhone/Safari ve canlı hosting testi yapılmadı. Windows/Linux GitHub yayın sonucu, koşu tamamlandıktan sonra bu rapora eklenir.
