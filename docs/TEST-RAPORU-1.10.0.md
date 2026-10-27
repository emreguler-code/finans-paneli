# Finans Paneli 1.10.0 doğrulaması

26 Ekim 2026. İzole MariaDB/PHP ortamları ve Chromium kullanıldı; canlı hosting verisine dokunulmadı.

- Derleme, 33 birim ve 4 worker kontrolü.
- 117 API ve 27 migrasyon kontrolü; şema 10, mevcut yönetici bilgileri korunur.
- 436 tarayıcı kontrolü geçti. Masaüstü ve 320/390/1100 px arayüz kontrolleri; merkezi filtreler, net cari etkisine göre yan sütunlar, detay düzenleme erişimi ve araç açılır satırları.
- 715 finansal/demo çapraz kontrolü geçti (624 hareket, 29 hafta; biri iptal edilmiş doğrulama kaydı). Geniş demoda açılış + gerçek hareket = hesap bakiyesi; net cari etkiler, ekstre/borç/limit, haftalık ve aylık rapor toplamları bağımsız hesapla karşılaştırıldı.
- 4 araç ve 44 kaydın ödeme bağlantıları, tam/kısmi/ödenmemiş örnekler ve tahmini kaydın ödeme yaratmaması kontrol edildi.
- Hosting ZIP'i boş kurulum, eski şema geçişleri, demo yenileme ve yönetici parolasının korunmasıyla test edildi. GitHub yayın süreci aynı kontrolleri yeniden çalıştırır.

Görsel karşılaştırma ve sınırlamalar: [design-qa.md](../design-qa.md). Fiziksel cihaz ve ekran okuyucu testi yapılmadı.

## 27 Ekim — yalnız hosting paketi

Aynı uygulama dosyaları `-hosting.zip` içinde web köküne doğrudan açılacak biçimde paketlendi. Orijinal GitHub Release ZIP’indeki `hosting/` dosyalarıyla birebir içerik karşılaştırması geçti. API migrasyonları ve Inter lisansı korunur; config.php, belgeler, bağımsız SQL şeması ve çalışma verileri bu arşivde yoktur. Paket entegrasyonu bu arşivi izole web köküne açarak kurulum, migrasyon/API, kapsamlı demo ve iki kez demo yenileme/yönetici parolası koruma kontrollerinden geçti. Uygulama sürümü veya finansal hesaplama değişmedi.
