# 1.28.0 doğrulama

Sentetik ve izole veriler kullanılır. Canlı hosting ve fiziksel iPhone testi yapılmaz. Node 26.13.1, npm 12.2.2, Python 3.15.2; PHP 8.5.12 ve MariaDB 12.3.3.

- `npm test`: ESLint/Stylelint, tüm desteklenen dosyalarda Prettier, derleme; 88 birim ve 4 Sites worker testi başarılı.
- Gerçek API: 168; migrasyon: 34; yedekleme/geri yükleme: 77 kontrol başarılı.
- Tarayıcı başına 65 kontrol ile yeni arayüz koşucusu `tests/forms128-browser.cjs`: üç cari türünün farklı alanları, kısmi ödeme/kaynak, salt okunur tablo, eski etkiyi çıkaran düzenleme önizlemesi, zorunlu gerekçe, yerinde profil düzenleme ve dört metadata formu.
- 320/390/760/1100 px uyumu, mobil alt menünün DOM'dan kaldırılması ve hamburger erişimi. Chromium, WebKit ve Firefox motorları kullanılır.
- İstanbul pazar gecesinden pazartesiye geçişi sahte tarayıcı saatiyle, yeniden yüklemeden doğrulanır; eski vardiyanın yeni haftaya taşınmadığı kontrol edilir.
- Önceki gerçek API tarayıcı koşucusunun finansal kayıt, arama, CSV, takvim, araç ve kaynak hesap/kart kontrolleri yeni form seçicilerine uyarlandı. Önceki satır geometrisine özel sentetik koşucu tarihsel dosya olarak korunur; yeni davranışlar yeni koşucudadır.
- Güvenlik denetimi bilinen açık bildirmedi. Mevcut dar ve süreli güvenlik istisna politikası korunur.

Görseller çalışan derlemeden alınır. İncelemede formun ilk yüksekliği azaltıldı: ödeme/tarih/etiket/ayrıntılar aynı araç satırına toplandı, mobilde tutar/açıklama uygun genişlikte eşlendi ve önizleme kısaltıldı. Zorunlu alanlar açıldığında doğal ek yükseklik korunur; içerik kesilmez. Ekranlar `docs/evidence/1.28.0/` altına alınır.

Gerçek API ile Chromium masaüstü ve üç motorlu mobil akışlar başarılı. Kapsamlı demo 624 olay, 29 hafta ve 715 mutabakat kontrolü; demo tarayıcı kabulü başarılı. Hosting/tam ZIP eşliği, temiz kurulum, önceki 1.25.0 üzerine dosya yükseltmesinde config/eski assets korunması ve başlangıç dosyaları doğrulandı. GitHub yayın sonucu tamamlandığında bu belgeye eklenir. Hosting yükleme/inceleme ve cron kurulumu kullanıcıya aittir.
