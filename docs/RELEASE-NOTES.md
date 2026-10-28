# Finans Paneli 1.12.0

Cari, kredi kartı ve işlem ekleme pencereleri ortak **bölümlü tek form** düzenine geçti. Temel bilgiler ve işleme bağlı alanlar açık; ayrıntılar gerektiğinde açılır. Türkçe hata gösterimi, taslağı yanlışlıkla kapatmadan koruma, tam/kısmi ödeme ve işlem etkisi açıklaması eklendi.

- Ana sayfada kategorili genel arama: cari, işlem açıklaması, hesap/kart sahibi ve araç bilgileri. Üç karakter sonrası öneriler; ilgili kayda geçiş ve filtrelenebilir tüm sonuçlar sayfası. Diğer menülerde bağlamsal arama korunur.
- Ana menü temiz ana listeyi açar. Detaydan geri önceki listeyi korur. URL tabanlı gezinme sayesinde yenilemede açık kayıt korunur; Geri/İleri ve alt menü davranışları düzeltildi. Paylaşılan hosting için özel rewrite gerekmez.
- Varsayılan Bu Ay dönemi etkin filtre gibi görünmez; özel tarih aralığı temizlenebilir. Nakit akışı grafiği paneldeki yüksekliği kullanır.
- Cari bakiye özeti iki sütunu kapsar. Aktif hareketin sol çizgisi ana satır ve eylemleri kesintisiz kapsar.
- Mobil kart özeti kompakt hale geldi; limit, ekstre/dönem tutarları ve ödeme durumu önde, diğer bilgiler Daha fazla bölümünde.

## İndirme ve yükleme

**Mevcut hosting'i güncellemek için:** `finans-paneli-1.12.0-hosting.zip` içeriğini doğrudan web köküne yükleyin. Mevcut **`api/config.php` dosyasını koruyun**. Sonrasında `update.php` üzerinden durumu kontrol edin.

Şema **11** olarak kalır; zaten şema 11 kullanan kurulumda yeni veritabanı geçişi gerekmez. Önceki şemalardan geçiş dosyaları pakette korunur. Mevcut yönetici hesabı ve kayıtlar korunur. Hostingde Node.js gerekmez.

Tam paket ayrıca kurulum belgeleri ve başlangıç şemasını içerir. Her ZIP'in ayrı SHA-256 dosyası vardır. Demo yenileme ayrı ve isteğe bağlıdır; canlı kayıtlar otomatik sıfırlanmaz. Bu sürüm GitHub'da yayımlanır; hosting'e otomatik kurulmaz.
