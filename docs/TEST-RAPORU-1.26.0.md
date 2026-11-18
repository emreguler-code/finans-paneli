# 1.26.0 doğrulama

18 Kasım 2026. Tüm senaryolar izole/sentetik verilerle çalıştırıldı; canlı hosting ve gerçek kullanıcı verisi kullanılmadı. Node 26.13.1, npm 12.2.2, Python 3.15.2; PHP 8.5.12 / MariaDB 12.3.3.

- `npm test`: ESLint, Stylelint, proje genelinde Prettier, Vite derleme; 78 birim ve 4 Sites worker testi.
- Gerçek API: 155 kontrol. Ödemesiz/tam/kısmi maaş, tek olay ve tekrar istek anahtarı, düzenleme ve iptalde nakit/cari ters kayıt etkisi, brüt hakedişin korunması; negatif/fazla/kart/kaynaksız ödeme reddi; kayıt anındaki saat ve düzenlemede eski saat/belge korunması dahil.
- Şema geçişleri: 34; yedekleme/geri yükleme güvenlik kontrolleri: 77.
- Chromium/WebKit/Firefox gerçek API mobil koşucusu başarılı. Satır içi kayıt ve düzenleme, taslak koruması, filtre/sıralama, banka/kart, 320–1920 px taşma ve odak kontrolleri. Chromium bağımsız masaüstü koşucusu da geçti. Fiziksel cihaz testi değildir.
- Sentetik arayüz matrisi: 170 kontrol/tarayıcı; sütun ölçüleri, kayıp modülde görünür kurtarma, tarih/saat, Genel yer tutucu, zorunlu hesap vurgusu, maaş ödemesinin tek gönderimi, yavaş yüklemede başlık kararlılığı, 350 ms içerik geçişi, mobil ve takvim/özet regresyonları. Kanıtlar `docs/evidence/1.26.0/` altında.
- Kapsamlı demo: 624 olay ve 29 haftada 715 finansal mutabakat kontrolü; tarayıcı kontrolleri de geçti.
- PHP kaynakları sözdizimi denetiminden geçti.
- Ham npm audit sıfır açık değildir: yamasız picomatch danışması ve bağımlı altı bildirim vardır. [Dar/süreli istisna](GUVENLIK-ISTISNASI-1.26.0.md) testleri ve `audit:security` kontrolü kullanılır; diğer bulgular durdurur.

Yerel Firefox'un salt okunur kullanıcı dizini için geçici XDG dizinleri ve bu kısıtlı ortamda içerik sandbox ayarı; WebKit'in eksik sistem kütüphaneleri için yalnız geçici dizinde kitaplıklar kullanıldı. Chromium/WebKit/Firefox gerçekte çalıştırıldı. GitHub kabulü standart Windows/Linux ortamında ayrıca yürütülür. Bu ortam ayarları ürüne/hosting paketine eklenmedi.

Kapsam [SURUM-1.26.0.md](SURUM-1.26.0.md). 1.25.1 canlı boş sayfanın kök nedeni doğrulanmadı; yeni paketin temiz kurulumu, 1.25.0 üzerine dosya yükseltmesi ve eksik modülde kurtarma senaryosu bu nedenin kesin tespiti sayılmaz. Hosting yükleme/inceleme kullanıcıya aittir.

Paket kabulü geçti: hosting/tam arşiv eşliği, temiz kurulum, 1.25.0 üzerine dosya yükseltmesinde config ve eski assets korunması, tüm yeni başlangıç referanslarının bulunması doğrulandı.

## GitHub yayın sonucu

Windows ve Linux kabulü başarılı: [44339941688](https://github.com/emreguler-code/finans-paneli/actions/runs/44339941688). Yayımlanan kaynak `4b20fb2185ad513f33354350788a0a8f6f964a2c`. [GitHub Release](https://github.com/emreguler-code/finans-paneli/releases/tag/v1.26.0) dört varlık içerir. İndirilen ZIP/checksum dosyaları yerel test çıktısıyla birebir eşleşti; hosting ZIP'i ayrıca repo dosyasıyla karşılaştırıldı. Her iki checksum ve tag/kaynak doğrulaması [yayın kaydında](evidence/1.26.0/publication.json).

İlk Linux aday koşusunda testin arka arkaya iki tam yükleme başlatması WebKit'te iptal edilmiş state isteği hatası oluşturdu. Tek temiz doküman yüklemesiyle test kurulumu düzeltildi; hata denetimi kaldırılmadı. Yukarıdaki başarılı koşu bu düzeltmeyi içerir; uygulama/hosting ZIP'i değişmedi.
