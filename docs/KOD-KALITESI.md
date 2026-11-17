# Kod sağlığı ve tarayıcı standardı politikası

Kısa kod hedef değil; tekrarsız, anlaşılır, desteklenen ve doğru davranan kod hedeflenir. Minify edilmiş dağıtım ile okunaklı kaynak kod birbirinden ayrıdır.

- npm run lint: tüm src JS/JSX/mjs için ESLint önerilen hata kuralları, hook kullanım kuralları, kullanılmayan import/değişken; tüm CSS için bilinmeyen özellik/birim, geçersiz renk, tekrar özellik ve boş blok denetimi. Beş ortak bileşen stilinde yinelenen seçici denetimi de zorunludur.
- npm test: lint + derleme + birim/statik worker testleri. Kullanılmayan callback parametreleri ve yakalanmış hata değişkenleri hata sayılmaz; işlevsel değişkenler sayılır.
- npm run test:layout: üç motorda gerçek bileşen geometri kontrolü; .qa/party121 altında ekranlar ve checks.json. İzole API testleri finansal doğruluğu ayrıca ölçer.
- npm audit: bilinen bağımlılık açıkları. Tüm sürümleri körlemesine en yeni ana sürüme çekmeyin; desteklenen güvenlik yamasını, ilgili resmi dokümanı ve test sonucunu kaydedin.
- Ortak stilleri sürüm adına göre yığmayın. Yeni sahip dosyalarında tekrar/çakışma eklemeyin; ölçülerin kaynağını düzeltin. Eski CSS'in tamamının kullanılmayan koddan arındırıldığı iddia edilmez; bu sürümde sorunlu ortak sahipler temizlenmiştir.
- Baseline Widely Available varsayılan seçim ölçütüdür; browserslist hedefi package.json içindedir. Vite Browserslist hedefini kendiliğinden uygulamaz; bu seçim politikasıdır, otomatik uyumluluk garantisi değildir. Bu tek başına kullanılan her API/CSS özelliğini otomatik kanıtlamaz. Mevcut istisnalar (ör. scrollbar-gutter, dvh, container queries ve :has) hedef motorlarda ayrıca test edilir; destek tablosu gerektiğinde MDN üzerinden kontrol edilir. Gerekçesiz yeni polyfill/kütüphane eklemeyin.
- Basit hareketlerde CSS transition/animation yeterliyse JavaScript animasyon bağımlılığı eklemeyin; prefers-reduced-motion korunur. Yeni View Transition API sırf yeni diye eklenmez.
- Görsel onay: tam/dar/gizli menü, aktif/düzenlenen satır, filtre çipleri, gelişmiş arama, açık/kapalı ek form, uzun metin ve büyük para değerleri. Otomatik taşma kontrolü yeterli değildir; son ekranlar da incelenir.

Resmi başvuru kaynakları: https://web.dev/baseline/ · https://eslint.org/version-support/ · https://stylelint.io/user-guide/rules/ · https://vite.dev/releases · https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries

Windows-latest üzerinde Firefox/Chromium için aynı sentetik kabul ayrıca zorunludur; Linux WebKit ve gerçek PHP akışlarının yerini tutmaz. Bu kullanıcı bilgisayarındaki tarayıcı profiline erişmek veya fiziksel cihaz testi yapmak değildir.

## 1.24.0 — Proje genelinde Prettier

- `npm run format:check`: Git üzerinden kökten otomatik keşifle tüm desteklenen kaynak, belge ve yapılandırma dosyalarını denetler; sabit dosya listesi yoktur. Yeni JS/JSX/MJS/CJS, CSS, JSON, HTML, Markdown ve YAML dosyaları otomatik kapsanır.
- `npm run format`: aynı kapsamdaki dosyaları biçimlendirir. Önce değişiklik kapsamını doğrulayın, ardından diff'i ve `npm test` sonucunu inceleyin.
- PHP, `@prettier/plugin-php` ile en düşük desteklenen PHP 8.3 sözdizimine uygun biçimlendirilir. Paylaşılan kurallar `.prettierrc.json` içindedir; PHP girintisi 4, diğer dosyalar 2 boşluk, satır sonu LF'dir.
- `.prettierignore` bağımlılıkları, derlemeyi, çalışma verilerini/gerçek config'i, üretilmiş kilit/paket dosyalarını ve geçmiş test kanıtlarını hariç tutar. Eski kanıtları sırf biçim için yeniden yazmayın.
- Python ve SQL için Prettier ayrıştırıcısı yoktur; dosya keşfi Prettier ayrıştırıcısı bulunmayan türleri biçim denetiminden geçirmiş saymaz. Python entegrasyonları, PHP sözdizimi, API/migrasyon testleri ayrı sürer.
- `npm test` ve GitHub yayın kontrolleri proje genelindeki biçim kontrolünü zorunlu çalıştırır. Dosya biçimini değiştirmek finansal model veya tasarım değişikliği yetkisi değildir.
