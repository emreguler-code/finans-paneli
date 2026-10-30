# Finans Paneli 1.13.0

**Ayarlar → Veritabanı yedekleri ve gerçek veriye geçiş** eklendi. Menü, Görünüm ve bilgiler satırının hemen üstündedir ve yalnız yöneticilere açıktır.

- Yedek al, indir, dosyadan yükle ve geri yükle.
- Günlük/haftalık otomatik yedek; son 14 otomatik yedek. Uygulama kapalıyken çalıştırmak için hosting cron desteği.
- Demo verilerini zorunlu güvenlik yedeğiyle temizle; yönetici hesapları ve parolaları korunur, finansal çalışma alanı boşalır.
- Geri yükleme öncesi güvenlik yedeği; dosya bütünlüğü ve şema kontrolü; hata durumunda tüm değişikliğin geri alınması.

**Yükleme:** `finans-paneli-1.13.0-hosting.zip` içeriğini doğrudan web köküne yükleyin; mevcut `api/config.php` dosyanızı koruyun. Şema 11 olarak kalır; `update.php` üzerinden durumu kontrol edin.

Sonrasında yönetici hesabıyla **Ayarlar → Demo verilerini temizle** adımını kullanın. Hostingdeki kayıtlar paket yüklenince kendiliğinden silinmez.

Yedek dizini web kökü dışında ve PHP için yazılabilir olmalı. Gerekirse config.php içinde `backup_dir` tanımlayın. Cron betiği: `api/backup-cron.php` (yalnız PHP CLI). Ayrıntılar: [Yedekleme kılavuzu](https://github.com/emreguler-code/finans-paneli/blob/main/docs/YEDEKLEME.md).
