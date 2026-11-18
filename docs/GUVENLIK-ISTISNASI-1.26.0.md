# Süreli derleme aracı güvenlik istisnası

18 Kasım 2026 yayın kontrolünde npm audit, picomatch 4.0.7 için [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) kaydını bildirdi. GitHub danışma API'sinde düzeltilmiş sürüm yoktur. npm'in önerdiği zorunlu çözüm, Vite/Stylelint ana sürümlerini düşürür; güncel araç zincirini körlemesine düşürmek uygulanmadı.

Sorun, saldırganın sağladığı tekrarlı extglob desenlerinin Node.js'te aşırı işlem süresi tüketmesidir. Bu uygulamanın dağıtımında PHP ve önceden derlenmiş tarayıcı dosyaları vardır; Node/Vite/picomatch hostingde çalışmaz. Kullanıcı araması glob değildir ve picomatch'e gönderilmez. Derleme ve lint girdileri güvenilen repo dosyaları/sabit komutlardır. Güvenilmeyen globları bu araçlara iletmek bu istisnanın kapsamı dışındadır.

`npm run audit:security` yalnız belirtilen danışma kimliği, picomatch 4.0.7 ve mevcut derleme bağımlılık zinciri için **18 Aralık 2026** tarihine kadar istisna uygular. Yeni danışma, kritik önem, değişen sürüm, bozuk/ağ hatalı denetim cevabı veya tarih aşımı yayını durdurur. İstisna testleri birim testlerine dahildir. Ham `npm audit` halen altı yüksek önem bildirimi verir; bunlar tek picomatch kaydının bağımlılık zinciridir. Açık giderildi diye raporlanmaz.

Düzeltilmiş upstream sürüm çıktığında güncellenip istisna kaldırılmalıdır. Bu kayıt gerçek kullanıcı girdisinin derleme araçlarına aktarılmasına izin vermez.
