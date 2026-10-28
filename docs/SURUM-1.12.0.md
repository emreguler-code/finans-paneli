# Finans Paneli 1.12.0

28 Ekim 2026 · Şema 11.

Yeni cari, kredi kartı ve işlem formları ortak bölümlü tek form düzenini kullanır. Temel ve işleme bağlı bilgiler açık, isteğe bağlı ayrıntılar anlamlı bölümlerdedir. Türkçe alan hataları, ilk hatalı alana odak ve değiştirilmiş taslağı kapatmadan önce geri dönme/vazgeçme seçimi eklenmiştir. Diğer kayıt formları ortak doğrulama ve taslak korumasını paylaşır.

- Alış/satış/iade kayıtlarında açık hesap, tam ve kısmi ödeme seçenekleri; mevcut hesaplama modeliyle işlem etkisi açıklaması. Tutar ve işlem tarihi öncelikli, belge/saat/etiket ayrıntılarda. Maaş hak edişi, kart borcu ve gerçek nakit ayrı anlamlarıyla korunur.
- Genel bakışta üç karakter ve 300 ms sonrası cari, açıklaması eşleşen işlem, hesap/kart sahibi ve ruhsat sahibi dahil kategorili genel arama. Alana bağlı öneri penceresi, klavye seçimi, kategorili sonuç sayfası, arşiv/iptal kapsamı ve kayıt/hedef harekete geçiş. Ana sayfanın dönem filtresinden bağımsız; diğer menülerde bağlamsal arama korunur. Oturumda API'den yetkili olarak yüklenen veriler yerel olarak aranır; her tuşta ilave API isteği üretilmez.
- Paylaşılan hosting'de rewrite gerektirmeyen hash rotaları. Sayfa/kayıt/sekme/hedef hareket URL'de; yenileme ve Geri/İleri mevcut bağlamı korur. Sol ana menü temiz ana listeye, detaydan geri önceki liste tercihlerine döner. Alt menüler yalnız ilgili bölümde kalır; çıkışta oturum belleği ve rota temizlenir. Kaldırılmış kayıtlar için listeye dönüş vardır.
- Genel bakış varsayılan Bu Ay dönemi artık etkin filtre çipi/sayısı değildir; özel dönemde çip görünür, temizleme Bu Ay'a döner. Nakit akışı grafiği panel yüksekliğini okunabilir bir üst sınırla kullanır; alt bilgi aşağıda kalır.
- Cari liste durum özeti iki sütunun üzerinde tam genişliktedir. Masaüstü aktif hareket çizgisi görünür ana satırdan alt eylemlere kesintisiz uzanır.
- Mobil kart özeti: kullanılabilir limit/gösterge, iki kompakt metrik, belirgin ödeme durumu ve mevcut ekstre ödeme eylemi; sahip/bağlı hesap/diğer tarihler Daha fazla içinde korunur. Masaüstü bilgileri korunur.

## Güncelleme

`finans-paneli-1.12.0-hosting.zip` doğrudan web köküne yüklenecek dosyalardır. `api/config.php` korunmalıdır. `update.php` üzerinden şema kontrol edilir; zaten şema 11 kullanan kurulumda yeni veritabanı geçişi yoktur. Eski kurulumların mevcut geçiş zinciri pakette korunur. Yönetici hesabı ve mevcut kayıtlar korunur. Demo verisi yenileme ayrı ve isteğe bağlıdır; bu sürüm canlı veriyi sıfırlamaz.

Tam ZIP kurulum belgeleri ve başlangıç şemasını da içerir. İki ZIP'in SHA-256 dosyası ayrıdır. Yerel test ortamı veya oturum bilgileri paketlere girmez. GitHub Release uygulamanın kullanıcının hosting'ine otomatik dağıtıldığı anlamına gelmez.
