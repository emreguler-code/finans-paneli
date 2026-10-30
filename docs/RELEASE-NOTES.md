# Finans Paneli 1.13.1

Alt klasöre hosting kurulumunda yedek dizininin web kökü içinde kalması düzeltildi. Standart hosting kökleri dikkate alınır; web ve CLI cron aynı özel dizini kullanır. Güvensiz yol klasör oluşturulmadan reddedilir.

Ayarlar sayfasındaki sonsuz yükleniyor durumu giderildi. Yapılandırma hatasında açıklama ve Yeniden dene gösterilir. Güvenlik yedeği olmadan demo temizliği yapılmaz.

Şema 11 korunur. Hosting paketini yüklerken mevcut api/config.php dosyanızı koruyun. Özel dizine yazma izni yoksa [yedekleme kılavuzunu](https://github.com/emreguler-code/finans-paneli/blob/main/docs/YEDEKLEME.md) izleyerek backup_dir tanımlayın.
