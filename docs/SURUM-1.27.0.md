# 1.27.0 — Ortak satır içi kayıt ve aylık personel hakedişleri

Kullanıcının 18 Kasım 2026 tarihli açık kodlama ve GitHub Release talimatı uygulanır. Hosting yükleme/inceleme ve cron kurulumu kullanıcıya aittir.

## İşlem ve kayıt girişi

Cari hareketlerinde sıra Tarih / İşlem / Açıklama / Etiket / Ekleyen / Tutar / Bakiye'dir. Taslak durumu bakiye alanında tire yerine görünür; iptal/kaydet giriş satırına hizalanır. Ek bilgiler gerçek tablo sütun sınırlarını kullanır; alanın gerektirdiği genişliğe göre bitişik sütunları birleştirir ve yeniden boyutlandırmada tekrar hesaplanır. Dar ekranda okunabilir tek/iki alan akışı kullanılır.

Banka/kasa, kart ve genel finansal işlemler liste sonunda aynı satır içi formu kullanır. Cari/hesap/kart/araç/kullanıcı/kampanya kimliği oluşturma ve düzenleme kendi liste/kart bölgesinde açılır; finansal yedi sütun metadata formlarına zorlanmaz. Ekstre kendi hesap bağlamında, plan kaydı seçili günün gündeminde açılır. Eski sayfa altı otomatik giriş alanı kaldırıldı. Zorunlu ek alanların açılması/vurgusu, tarih-saat birlikteliği, modern seçimler, taslak koruması, id/version/gerekçe ve atomik API davranışı korunur.

## Özetten kaynak kayda

Son hareketler, Son 5 işlem, dikkat isteyenler ve bildirimlerde tekil kayıt tıklaması görüntüleme penceresi açmaz. İlgili cari/hesap/kart ve dönemine gider; hedef hareket seçilir, ayrıntıları açılır ve görünür alana alınır. Araç/kampanya kayıtları kendi bölümüne gider. Banka/kart özetinin bağlamı korunur; genel bağlantıda ilişkili cari önceliklidir. Hedef mevcut filtrenin dışında kalıyorsa filtre tercihi silinmeden ayrıca gösterildiği belirtilir. Normal tıklama ödeme/düzenleme üretmez; açıkça seçilen gerçekleştirme eylemi ayrıdır.

## Personel

IBAN, aylık maaş ve aylık yemek hakedişi profil JSON'unda tutulur. Dolu TCKN/IBAN yanında kopyalama vardır; başarısız kopya başarılı gösterilmez. Türk IBAN biçimi ve kontrol numarası sunucuda doğrulanır.

Yeni manuel işlem seçeneklerinden Maaş Ekle kaldırıldı; geçmiş maaş kayıtları korunur ve düzenlenebilir. CLI görev `api/staff-cron.php`, İstanbul saatiyle ayın 1, 2 ve 3. günlerinde 12.00 saat diliminde kontrol yapar. Her gün yalnız bir sonuç kaydedilir. Tanımlı pozitif maaş/yemek bağımsız brüt hakedişlerdir; kasa/bankadan otomatik ödeme yapılmaz. Dönem başlangıcı açıkça seçilir, varsayılan sonraki aydır; geçmiş aylara otomatik doldurma ve kıst ücret hesabı yoktur. Pasif personel atlanır.

Dönem tutarları mevcut audit_log içinde sabitlenir. Bakım kilidi + benzersiz dönem/personel/kalem istek anahtarı eşzamanlı ve tekrar çağrıda mükerrer kaydı önler. Başarılı personel kayıtları korunur; sonraki gün yalnız eksikler denenir. İptal edilen otomatik hakediş sessizce yeniden üretilmez. Üçüncü gün 12.00 sonrasında eksik kalem varsa, cron hiç çalışmamış olsa dahi sitede kritik bildirim görünür. Site/bildirim için uygulamanın yüklenmesi gerekir; dış e-posta/SMS servisi eklenmedi.

[Personel cron kılavuzu](PERSONEL-CRON.md). Genel kira/abonelik tekrarlama ekranı bu sürümün seçilmiş tasarımı değildir. Şema 12; yeni tablo/migrasyon gerekmez. Mevcut yedekleme audit ve profil alanlarını içerir; yedek cron takvimi değiştirilmez.

[Doğrulama](TEST-RAPORU-1.27.0.md) · [Onaylı yayılım taslağı](SATIR-ICI-YAYILIM-TASLAGI.md).
