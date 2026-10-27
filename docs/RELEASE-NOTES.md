# Finans Paneli 1.10.0

- Hesaplar ve kredi kartları tek içerik kutusunda yatay listelenir. Bilgi/düzenleme detayda; sıralama/CSV içerikte kalır.
- Merkezi Bildirimler sayfası bölüm, kayıt, önem, tarih ve arama filtreleri sunar. Zil ve yan sütunlar en fazla 5 bildirim gösterir; tümüne aynı sayfadan erişilir.
- Hesap/kart son 5 işlem; carilerde net bakiyeyi artıran/azaltan son 5 hareket yan sütunları.
- Araçta varsayılan Özet: Poliçeler (trafik + kasko), MTV, bakım ve muayene. İşlemler: bütün türler tarih sırasıyla, ayrıntılar satır içinde.
- Demo: 4 araç, 44 araç kaydı, kısmi/tam/ödenmemiş poliçeler, MTV ve bakım; banka/kart ödemeleri bir kez bağlanır. Başlangıçta 623 finansal hareket; doğrulama senaryosu bir iptal edilmiş kontrol kaydı ekler.

Şema 10 değişmedi. Mevcut config.php korunarak ZIP yüklenir. Yeni demoyu yüklemek için yönetici update.php sayfasında demo yenilemeyi açıkça seçmelidir; bu işlem mevcut demo/iş kayıtlarını sıfırlar, yönetici hesabını ve parolasını korur. Canlı veritabanı otomatik yenilenmez.

İndirme seçenekleri: `finans-paneli-1.10.0-hosting.zip` doğrudan web dizinine açılabilir; tam ZIP ayrıca kurulum belgeleri ve başlangıç SQL dosyalarını içerir. Hosting ZIP’i mevcut 1.10.0 uygulama dosyalarının aynısıdır; yeni uygulama sürümü değildir. Güncellerken mevcut `api/config.php` korunmalıdır.
