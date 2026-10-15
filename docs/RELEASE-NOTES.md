# Finans Paneli 1.7.0

15 Ekim 2026. Arama, kart gezinmesi ve ödeme takvimini birleştiren arayüz ve bakım sürümü.

- Her sayfada tek üst arama alanı; sayfaya özgü filtre paneli aramanın altında açılır. Metin ve filtreler Enter/Ara ile birlikte uygulanır, Esc taslağı iptal eder. Aktif filtreler kaldırılabilir etiketlerle görünür; son aramalar sayfa bazında oturum boyunca korunur.
- Hesap/kart araması ile seçili hesabın hareket araması ayrı kapsamlardır. Kullanıcılarda ad, rol ve aktiflik araması eklendi. Liste sıralama, CSV ve yeni kayıt araçları korunur.
- Banka ve kredi kartları ortak Embla carousel kullanır. Dokunma/fare sürüklemesi, karta hizalanma, döngü, klavye ve azaltılmış hareket tercihi desteklenir. Hareket listesi geçiş tamamlandığında seçilen hesaba güncellenir.
- Ödeme Planı takvim olarak kalır. Gün hücreleri ödeme/tahsilat özeti gösterir; seçilen gün masaüstünde sağ panelde, mobilde takvimin altında açılır. Gecikmiş/vadesiz kayıtlar, dönem dışındaki arama sonuçlarına geçiş ve okunabilir altı haftalık aylar desteklenir. Kanban eklenmedi.
- Ortak Inter yazı ölçeği, boşluklar, ikonlar, kontrast ve mobil dokunma alanları düzenlendi. Genel bakış işlem ekle düğmesi diğer sayfalarla aynı 44 × 44 px ölçüdedir.
- Vite 6.4.4, React/React DOM 19.2.9, Lucide 1.57.0 ve güvenlik yamaları; Node.js 24 LTS geliştirme/derleme ortamı; haftalık npm ve Actions Dependabot takibi.
- Actions Node.js 20 uyarısı giderildi. Hostingde Node.js gerekmez. Yeni kurulumlar için PHP 8.3+ ile MySQL 8.4 LTS veya MariaDB 11.4 LTS önerilir.

Veritabanı şeması 7 olarak kalır; mevcut yönetici ve işlem verileri korunur. Güncellemeden önce dosya/veritabanı yedeği alın, mevcut api/config.php dosyasını koruyun ve ZIP içindeki GUNCELLEME.md belgesini izleyin. Demo yenileme seçeneğini kapalı bırakın.

---

## Önceki sürüm

Finans Paneli 1.6.1 bakım sürümü. PHP 8.3+ ve MySQL/MariaDB gerektirir; hostingde Node.js gerekmez.

- Statik derlemeler PHP ve gerçek config dosyalarını içermez; PHP hosting paketi ayrı oluşturulur.
- Eski ve ulaşılamayan ekran/API kodları temizlendi. Cari, form, geçmiş ve kullanıcı bileşenleri ayrıldı.
- CSV ve para girişi ortaklaştırıldı; vadesiz hesaplar ödeme planında vade hatırlatması üretmez.
- Cari araması ve kapama hesaplamalarında tekrar taramalar azaltıldı. CSS tek girişte toplandı; mevcut tasarım korunur.
- İzole finans API, migrasyon/kurtarma ve masaüstü/mobil tarayıcı testleri Release iş akışına eklendi.

Şema 7 ve mevcut yönetici/işlem verileri korunur. Güncellemeden önce yedek alın, mevcut api/config.php dosyanızı koruyun ve ZIP içindeki GUNCELLEME.md belgesini izleyin. Demo yenileme seçeneğini kapalı bırakın.
