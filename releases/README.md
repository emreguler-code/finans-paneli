# Hostinge hazır sürüm paketleri

Her sürümün klasöründe doğrudan web dizinine açılacak `finans-paneli-<sürüm>-hosting.zip` ve SHA-256 dosyası bulunur. Aynı uygulama dosyaları GitHub Release varlıklarında da sunulur. Tam kurulum paketi ayrıca Release üzerinden indirilir.

Hosting yükleme ve canlı inceleme kullanıcıya aittir. Önce mevcut dosyalar/veritabanı yedeklenir; `api/config.php` ve özel yedek dizini korunur. Paket kullanıcı verisi veya gerçek yapılandırma içermez. Demo yenileme/veri sıfırlama güncellemenin parçası değildir. Ayrıntılar `docs/HOSTING-KURULUM.md` içindedir.
