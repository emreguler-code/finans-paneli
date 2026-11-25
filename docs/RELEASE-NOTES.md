# 1.29.0 — Kompakt işlem kartı ve PDF ekstre

- İşlem formu ve hareket listesi ayrı kartlarda; tutar üst satırda sağda, eylemler İşlemin etkisi bölümünde. Tarih/vade/taksit için kompakt ikonlar.
- Yeni tedarikçi alışında tek Alış seçeneği. Ödeme anahtarı, otomatik tam tutar, kısmi ödeme ve eski borca kontrollü fazla ödeme/avans dağıtımı.
- Kısa önce → sonra geçmişi; satırda kompakt silme önizlemesi, tek vurgu çizgisi ve daha dar aktif satır.
- TCKN/IBAN kopyalama hizası; mevcut alanları koruyan toplamlı CSV ve Türkçe, çok sayfalı PDF ekstre.

Şema 12. Hosting ZIP + SHA-256 `releases/1.29.0/` altında ve Release varlıklarında. Hosting yükleme/inceleme ve cron kurulumu kullanıcıya aittir. [Kapsam](SURUM-1.29.0.md) · [Doğrulama](TEST-RAPORU-1.29.0.md).

---

# 1.28.0 — Kompakt formlar ve sade mobil gezinme

- İşlem ekleme ve düzenleme, tablonun üstünde aynı kompakt formda; müşteri/tedarikçi/personel için uygun işlem ve ödeme alanları.
- Hareketler işlem tarihine göre yeniden eskiye; düzenleme önizlemesi bakiyeye yalnız değişiklik farkını uygular.
- Cari bilgileri kendi kartında düzenlenir; bakiye yanındaki gereksiz düğmeler kaldırıldı, IBAN/TCKN kopyalama sadeleştirildi.
- Personel takvimi gerçek İstanbul haftasını gösterir; eski vardiyalar yeni haftaya kopyalanmaz.
- Mobil alt gezinme tamamen kaldırıldı; hamburger menü ve taslak koruması sürer. Ortak kayıt formlarında yazılı eylemler ve anlamlı alan grupları.

Şema 12. Hostinge hazır ZIP + SHA-256 `releases/1.28.0/` altında ve Release varlıklarında. Hosting yükleme/inceleme ve cron kurulumu kullanıcıya aittir. [Kapsam](SURUM-1.28.0.md) · [Doğrulama](TEST-RAPORU-1.28.0.md).

---

# 1.27.0 — Satır içi kayıt ve personel otomasyonu

- Yeni kayıt ve düzenleme ilgili liste/kart içinde; banka/kart hareketleri ortak satır içi formda. Sayfa altı otomatik giriş alanları kaldırıldı.
- Cari sütunları Tarih / İşlem / Açıklama / Etiket / Ekleyen / Tutar / Bakiye; kompakt taslak eylemleri ve çözünürlüğe göre sütunlara hizalanan ek alanlar.
- Özet ve bildirimlerde işlem tıklaması ilgili sayfada kaynak satırı seçer; görüntüleme penceresi açılmaz.
- Personel IBAN/TCKN kopyalama; profilden aylık maaş/yemek, üç günlük tekrar ve mükerrer kayıt korumalı CLI hakediş görevi, eksik hakedişte kritik bildirim.

Şema 12. Hosting ZIP + SHA-256 `releases/1.27.0/` altında ve bu Release varlıklarında. Hosting yükleme/inceleme ve cron kurulumu kullanıcıya aittir; kurulum yapılmadı. [Kapsam](SURUM-1.27.0.md) · [Cron kılavuzu](PERSONEL-CRON.md). Güvenlik denetiminde yeni bulgular yayını durdurur; önceki dar picomatch istisna politikası korunur.

---

# 1.26.0 — Kararlı işlem girişi ve personel ödemeleri

- Satır içi giriş ve düzenlemede hizalama, kesintisiz aktif çizgi ve kompakt tarih; etiket yazımı kolaylaştırıldı.
- Ek bilgiler işlem seçimine ve boş zorunlu alanlara göre açılır. Tarih ve saat aynı pencerede düzenlenir.
- Maaşla birlikte tam/kısmi kasa veya banka ödemesi; personel aylık özetinde doğru ödeme ayrımı ve kompakt grafik.
- Yüklemede kararlı cari başlıkları, hareket azaltma destekli 350 ms sayfa geçişi ve modül yükleme hatasında görünür kurtarma ekranı.

Şema 12. Hosting ZIP + SHA-256 `releases/1.26.0/` altında; hosting yükleme/inceleme kullanıcıya aittir. 1.25.1 canlı boş sayfa bildiriminin kök nedeni doğrulanamadı; paket ve hata kurtarma kontrolleri genişletildi. [Kapsam](SURUM-1.26.0.md).

---

# 1.25.1 — Devreden bakiye ödemelerinin aylık ayrımı

1.25.0 kapsamındaki satır içi işlem ekleme/düzenleme, cari takvimleri ve aylık özetler korunur. Seçili ayda açılış bakiyesine karşı yapılan ödeme/tahsilat, “Devreden / önceki dönem borcuna ait” satırına dahil edilir. Ana grafik, finansal kayıtlar ve bakiyeler değişmez. Tedarikçi ve müşteri senaryoları ayrı doğrulandı.

Hostinge hazır ZIP + SHA-256 `releases/1.25.1/` altında ve Release varlıklarındadır. Şema 12; hosting yükleme/inceleme kullanıcıya aittir. [Ana kapsam](SURUM-1.25.0.md) · [Düzeltme](SURUM-1.25.1.md).

---

# 1.25.0 — Cari çalışma ekranları ve satır içi işlemler

- Yeni işlem listenin sonunda taslak satırı açar; düzenleme aynı modern alan ve açılır menü dilini paylaşır. Ek bilgiler kapalı başlar, ana sütunlar sabit kalır; kaydet/iptal bakiye sütunundadır.
- Tedarikçi ziyaret takvimi, etiketsiz POS logoları ve kompakt kampanya listesi; müşteride alışveriş günleri ve bilgiler; personelde vardiya/izin takvimi ve tarih bazlı plan düzenleme.
- Aylık Özet masaüstünde bilgi sütununun altında, mobilde sekmededir. İnce alış/hakediş halkası ve ödeme dağılımı; iadeler, eski dönem ödemeleri ve tanımsız bağlantılar ayrı değerlendirilir.
- Arama önerilerinin X/Escape ile kapanışı ve takvim ikonunun tekrar tıklandığında kapanması düzeltildi. Taslak koruması ve finansal düzenleme gerekçesi sürer.

Şema 12; gerçek veriler ve yapılandırma korunur. Hosting ZIP + SHA-256 `releases/1.25.0/` altında ve Release varlıklarındadır. Hosting yükleme/inceleme kullanıcıya aittir. [Ayrıntılı kapsam](SURUM-1.25.0.md).

---

# 1.24.0 — Prettier proje genelinde

- Sabit dosya listesi kaldırıldı; desteklenen tüm kaynak, belge ve yapılandırmalar otomatik keşifle kontrol edilir.
- `npm run format:check` denetler; `npm run format` otomatik biçimlendirir. Ortak ayarlar `.prettierrc.json` içinde sabitlendi.
- PHP dosyaları resmi Prettier eklentisi ve PHP 8.3 hedefiyle kapsama alındı. Üretilmiş/özel dosyalar ve tarihsel test kanıtları hariç tutuldu.
- Mevcut kaynaklar ortak biçime getirildi. Finansal davranış ve şema 12 korunur; Python/SQL mevcut test araçlarıyla doğrulanır.

Hostinge hazır ZIP + SHA-256 `releases/1.24.0/` altında ve Release varlıklarındadır. Hosting yükleme/incelemeyi kullanıcı yürütür.

---

# 1.23.0 — Bağımlılıklar ve geliştirme ortamı güncellendi

- React ve React DOM 19.3.1, Lucide React 1.74.0, Vite 8.3.8 / React eklentisi 6.3.0 ve Playwright 1.65.1 kullanılır.
- Node.js 26.13.1 LTS, npm 12.2.2 ve Python 3.15.2 sürümleri geliştirme ve CI ortamlarında eşleştirildi. GitHub Actions bileşenleri güncellendi.
- İzole test ortamı PHP 8.5.12 ve MariaDB 12.3.3 LTS'ye, yerel Inter fontları 4.1 dağıtımına taşındı. Eski PHP test imajının önbellekten kullanılması engellendi.
- 14 doğrudan npm paketi güncel kararlı sürümlerde; uyumlu dolaylı bağımlılıklar yenilendi. Yerel güvenlik taramasında bilinen açık bulunmadı.

Hostinge hazır ZIP ve SHA-256 ayrıca `releases/1.23.0/` klasöründe repoya eklendi. Hosting yükleme ve canlı incelemeyi kullanıcı yürütür.

Şema 12 ve mali model korunur. Hosting ZIP'i mevcut `api/config.php` ve özel yedekler korunarak yüklenir; demo oluşturma veya veri sıfırlama yapılmaz. Hostingde Node.js gerekmez, PHP 8.3+ desteği korunur. Ayrıntılar `docs/SURUM-1.23.0.md` ve `docs/TEST-RAPORU-1.23.0.md`.

---

# 1.22.0 — Aramadan filtreleme, başlıktan sıralama

- Ayrı filtre formu ve açma oku kaldırıldı. Tüm filtreler arama komutları, öneriler ve kaldırılabilir çiplerle yönetilir; tarih, TL aralığı, vade, arşiv ve iptal dahil.
- Sıralama ikonu ve penceresi kaldırıldı. Sütun başlığı sıralar, tekrar tıklama yönü değiştirir; yalnız etkin başlıkta yön oku görünür. Tüm sonuçlar sıralanır, kayıtların işlem sonrası bakiyeleri korunur.
- Cari dizinde arama ve CSV aynı satırda hizalanır. Genel bakış panel aralıkları ve yaklaşan ödemelerde tutar/TL satırı düzeltildi.
- Windows Firefox/Chromium ve Linux Chromium/WebKit/Firefox kontrolleri, gerçek PHP/MariaDB akışları, API, migrasyon, yedekleme, demo mutabakatı ve ZIP kurulumu başarılı.

Şema 12 ve mali model korunur. Hosting ZIP'i mevcut api/config.php korunarak yüklenir; canlı hosting'e otomatik kurulum yapılmaz. Ayrıntılar docs/SURUM-1.22.0.md ve docs/TEST-RAPORU-1.22.0.md.

---

# 1.21.0 — Yerleşim ve kod sağlığı

- Cari, hesap/kart ve ortak listelerde ana/yardımcı sütun geçişleri tablonun kullanılabilir genişliğiyle uyumlu hale getirildi.
- Arama ikonlarının dikey hizası, filtre etiketlerinin harf harf bölünmesi ve genişleyen arama alanları düzeltildi.
- Ek işlem alanları tüm form genişliğini kullanır; satır içi kaydet/iptal ikonları genişlemez. Son ay bakiyesine kaydırarak erişim doğrulanır.
- Sürüm bazlı iki CSS yama dosyası kaldırılıp bileşen sahiplerine ayrıldı; kullanılmayan import/değişkenler ve eski filtre kodu temizlendi.
- ESLint, Stylelint, biçim ve bağımlılık açık denetimi eklendi; Vite güvenlik yaması uygulandı.
- Windows Firefox/Chromium, Linux Chromium/WebKit/Firefox kabulü, finansal API, migrasyon, yedekleme, demo mutabakatı ve ZIP kurulumu geçti.

Şema 12 ve mali model değişmedi. Mevcut api/config.php korunarak hosting ZIP'i ile güncellenir; canlı hosting'e otomatik kurulum yapılmaz. Ayrıntılar docs/SURUM-1.21.0.md ve docs/TEST-RAPORU-1.21.0.md.

---

# Finans Paneli 1.20.0

Onaylanan son notlar ve uygun ortak davranışlar cari dışındaki bölümlere uygulandı. Arama/filtre aynı çubukta öneriler ve kaldırılabilir etiketlerle çalışır. Finansal hareketler işlem türü dahil kendi satırında düzenlenir. Son 30 hareket gösterilir, önceki kayıtlar sayfa numarası olmadan konum korunarak yüklenir. Aktif satırda iki satırlı tek ayrıntılı tarih vardır.

Cari ve banka ay satırları devreden/artış/azalış/Net bakiyeyi gösterir; filtreler gerçek ay sonunu değiştirmez. Gizli işlem girişi içerikte boşluk bırakmaz. Banka/kart/ödeme girişleri aynı varsayılan form ve yüzer + davranışını paylaşır. Ekstre, rapor, araç ve takvim kendi finansal anlamlarını korur.

Şema 12; gerçek veri/hesaplama modeli değişmez. [Bölüm bazında analiz ve kapsam](SURUM-1.20.0.md). GitHub yayını hosting kurulumu değildir.
