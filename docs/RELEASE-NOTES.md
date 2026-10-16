# Finans Paneli 1.7.2

Sayfa geçişinde ortak aramanın kısa süreliğine içerikte belirmesi engellendi. Ortak aramada 3 karakter / 300 ms otomatik arama, büyüteç düğmesi ve hareket paneliyle aynı kenarlık rengi. Fat. Alış / Fatsız. Alış etiketleri ve daha dar işlem alanı.

Hesap uyarıları ayrılmış sağ sütunda tüm aktif banka/kasa/KMH hesapları için görünür. Uyarı ilgili hesabı, sekmeyi ve hareket satırını açar; hareketsiz uyarılar hesap bilgisini gösterir. Dar ekranda sabit Uyarılar düğmesi vardır. Tablet hareket açıklamalarının harf harf bölünmesi giderildi.

Kesim sonrası kartlar arası borç aktarımının kaynak kartta eski ekstreye girmesi düzeltildi; hedef karttaki ödeme görünümü korunur. Ekstre listesine önceki dönem borcunu görünür kılan devir satırı eklendi; mevcut borç hesabı değişmedi.

Paket içindeki update.php → Demo verilerini yenile seçeneği eski kayıtları silip 588 kayıtlı yeni demoyu oluşturur; yönetici şifresi korunur. İsteğe bağlı yönetici demo yenilemesi yedi aylık kapsamlı sentetik veri oluşturur; finans uzlaştırması, ay/hafta raporları ve yoğun veri tarayıcı kontrolleri eklendi. Şema 7, yönetici ve config korunur. Demo yenilemesi işlem verilerini siler; yalnız bu açık seçenek seçilince çalışır.

---

# Finans Paneli 1.7.1

16 Ekim 2026. 1.7.0 arayüz gerilemelerini ve güncelleme ekranının açıklamasını düzelten bakım sürümü.

- Sağ üst tarih/gün bilgisi ve masaüstü Ctrl K ipucu geri getirildi. Tek ortak arama ve onaylı filtre davranışı korundu.
- Arama, filtre ve Ara düğmeleri tüm sayfalarda aynı 44 px satıra hizalandı; arama ve içerik aynı esnek çerçeveyi kullanır. Mobil ekle düğmeleri başlıkla aynı satırdadır.
- Genel bakıştaki gereksiz sıfırlama satırı kaldırıldı. Hesap/kart listesi ile hareket tablosunun sıralama ve CSV araçları yeniden bağımsızdır; tablo araçları sağa hizalanır.
- Ekran yüksekliği hızla küçüldüğünde işlem penceresinin eski ekran yüksekliğine göre taşması engellendi.
- Carousel kenar maskesi/silikliği, ok yerleşimi ve bölüm boşlukları düzeltildi. Embla korunur.
- Grafik sütunu ve gösterge rengi eşitlendi. Son hareketler planlanan ve ileri tarihli kayıtları göstermez; planlar ödeme takviminde ve gelecek dönem sekmelerinde kalır.
- Hatırlanan filtreler açık gezinme hedeflerini geçersiz kılmaz; hesap/bildirim/ödeme türü geçişleri düzeltildi.
- Güncelleme ekranı, dosya yüklemesi ile veritabanı migrasyonunu açıkça ayırır. Şema güncelse gereksiz güncelleme düğmesi gösterilmez; eski şemada etkinleşir.

Veritabanı şeması 7 olarak kalır. Mevcut yönetici, işlem verileri ve api/config.php korunur. ZIP içindeki hosting/ içeriğini yükleyin; şema zaten 7 ise ek veritabanı işlemi gerekmez. Önce dosya/veritabanı yedeği alın; demo yenileme seçeneğini kapalı bırakın.

---

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
