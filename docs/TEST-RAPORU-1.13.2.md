# 1.13.2 doğrulama raporu

30 Ekim 2026. Yalnız koşucunun oluşturduğu izole PHP/MariaDB ortamları ve sentetik veriler kullanıldı; hostingde finansal kayıt veya yedek silinmedi.

- npm ci, npm test: derleme, 43 birim ve 4 worker kontrolü geçti.
- Yedekleme/geri yükleme: 65 kontrol geçti (`.qa/9fea4ce88043/backup-checks.json`). Önceki güvenlik senaryolarına ek olarak İstanbul 02.59/03.00/gündüz, UTC saat dönüşümü, aynı gece tekrar, tarayıcıdan tekrar çağrı, tüm türlerde toplam 5 dosya, en yeni 5 dosyanın kimliği, otomatik dosyanın silinmesinden sonra günlük kayıt, eski haftalık ayarın dönüşümü ve en eski dosyadan güvenlik yedeğiyle geri yükleme doğrulandı.
- Tarayıcı: 504 kontrol, sıfır React hatası (`.qa/080a374e80aa/browser/checks.json`). Otomatik seçeneğin kaydedilmesi ve Ayarlar'ın tekrar açılması yedek/tick isteği üretmiyor. 768/390/320 px taşma ve eylem ölçüleri, indirme/yükleme, demo temizliği ve geri yükleme geçti. Mobil ekran görüntüsü incelendi.
- İlk tarayıcı koşusunda yeni navigasyon testi genel bakışın gerçek başlığı yerine menü adını bekliyordu; testin kullandığı ara sayfa Hesaplar olarak düzeltilip tüm koşu tekrarlandı. Ürün hatası değildi.

- PHP sözdizimi kontrolü ve hosting ZIP kurulum/güncelleme testleri geçti (`.qa/e1a308200fa2`). Paket kaynakları ve hosting dosyaları eşleşiyor; config.php/özel yedekler pakete alınmıyor.

Cron görevinin hostingde kurulması ve saat dilimi ayarı gereklidir; uzaktan kurulmuş gibi raporlanmaz. Sıkıştırma eklenmedi; mevcut biçim ve 32 MB sınırı korundu.
