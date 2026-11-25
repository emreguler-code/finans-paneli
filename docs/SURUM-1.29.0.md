# 1.29.0 — Kompakt işlem kartı, sade geçmiş ve dışa aktarma

25 Kasım 2026 tarihli “kodla ve yayınla” talimatının kapsamıdır. Canlı hosting ve cron kurulumu kullanıcıya aittir.

## Formlar

Yeni işlem ve düzenleme formu, yuvarlatılmış bağımsız kartta; hareket araması/tablosu ikinci karttadır. Aralarındaki boşluk ortak bölüm ölçüsüdür. Tutar işlem seçenekleriyle üst satırda sağda, Vazgeç/Kaydet İşlemin etkisi alanındadır. Tarih/saat, vade ve taksit erişimleri kompakt takvim ikonlarıyla yan yanadır. Taksit erişimi mevcut kart harcama/iade bağlamını kullanır; cari ödeme tek kayıttır, mevcut API'nin cari taksit kısıtı sessizce aşılmaz. Diğer bölümlerin kayıt formları da ilgili içerikten ayrı karttır; cari profil kendi bilgi kartında düzenlenmeye devam eder.

Tedarikçide yeni alışın tek seçeneği Alış'tır (`purchase_invoice`). Eski faturasız işlemlerin kodları, tutarları ve geçmiş bakiyeleri korunur; yeni arayüzde ayrı alış alt seçimi yoktur. Aylık alış halkası birleşiktir. Eski kodlar API uyumluluğu için okunur/işlenir.

İşlemle birlikte ödeme/tahsilat anahtarı yeni kayıtta kapalıdır. Açılınca kaynak ve ödenen/tahsil edilen tutar görünür. Kaynak seçilince tam tutar dolar; elle değiştirilene kadar ana tutarı izler. Doğrudan ödeme/tahsilatta kaynak zorunludur; anahtar bu temel işlemi geçersiz kılmaz. Eski ödemenin düzenlenmesinde mevcut değerler korunur. İade yönteminin cari hesaptan düşme/sonra ödeme ayrımı korunur.

## Fazla ödeme

Satış ve alışta ödeme tutarı işlem tutarını aşabilir. Ana kaydın peşin tutarı brüt işlemi aşmaz; yalnız fazlalık kontrollü bağlı ödeme/tahsilat kaydıdır. Örneğin 100 TL alış ve 150 TL ödeme: ana alış 100 TL kapanır, 50 TL eski açık borca gider. Kaynaktaki toplam çıkış 150 TL'dir. Mevcut vade/tarih/kimlik sırası kullanılır; karşılanamayan fazla ödeme mevcut avans modelinde kalır.

İki kayıt aynı kilitli ve istek anahtarlı veritabanı işleminde yazılır. Bağlı kalem tek başına düzenlenemez/iptal edilemez. Ana işlem düzenlenirse eski fazlalık geri alınır ve yenisi uygulanır; kaldırılmış fazlalık sonraki iptal/geri açmada geri gelmez. Ana işlem iptali yalnız kendi aktif kontrollü fazlalığını da iptal eder; bağımsız ödeme/faturalar korunur. Geri açma yalnız bu iptalin kapattığı bağlı kalemi geri açar. Eski istemci, dağılımı bilmeden fazla ödeme içeren kaydı değiştiremez; sayfa yenileme gerekir.

İade ve geçmiş maaş düzenlemelerindeki peşin tutar işlem bedelini aşamaz. Yeni manuel Maaş Ekle yoktur; personel hakediş otomasyonu korunur. Şema 12 değişmez; mevcut olay, bağlantı ve denetim tabloları kullanılır.

## Geçmiş, iptal ve bilgi satırları

Geçmiş kısa zaman çizelgesidir. Oluşturma tek olay; düzenlemede yalnız değişen alanlar önce → sonra ve gerçek gerekçeyle görünür. Sistem kodları Türkçeleştirilir; değişmeyen alanlar dökülmez. Ayrıntılı denetim verileri silinmez. Zaman İstanbul saatidir. Profil/ücret ve tarihli çalışma planındaki değişiklikler de anlamlı alan adlarıyla gösterilir.

Silmede satır üstü çizili önizlenir; gerekçe ve Vazgeç/Kaydet aynı kompakt alanda, açıklama hemen altındadır. Kayıt başarılı olmadan bakiye değişmez. İptal satırın yerinde açılır, ikinci vurgu çizgisi yoktur. Aktif satırın eylem boşluğu azaltılır. TCKN/IBAN kopyalama ikonları satır yüksekliğini artırmadan değerle hizalanır; çerçevesiz görünüm ve erişilebilirlik korunur.

## CSV ve PDF

CSV'nin mevcut tarih/saat/açıklama/işlem/ekleyen/hesap alanları korunur; toplam/net etki ve gerçek bakiye satırları eklenir. Bütün filtrelenmiş kayıtlar aktarılır, yalnız ilk 30 değil. Satır bakiyeleri toplanmaz; iptal ve planlı kayıtlar gerçekleşmiş toplamı artırmaz. Filtreli net etki güncel bakiyeden ayrı adlandırılır. Cari/hesap/kart listelerinde toplam bakiye de bulunur.

Hareket listelerinde doğrudan PDF indirme vardır. Sade A4 ekstre, cari/hesap adı, kapsam, hareket tablosu, net/güncel bakiye, oluşturulma zamanı ve sayfa numarası içerir. Türkçe Inter gömülür; metin seçilebilir, uzun açıklamalar sarılır, tablo başlıkları her sayfada tekrarlanır. Kart dönem tarihi CSV/PDF'de korunur. Tarih aralığı bütün gerçek kayıtları kapsıyorsa doğrulanmış devreden ve dönem sonu bakiyesi gösterilir. Kesintili filtrelere sahte devreden/kapanış bakiyesi atanmaz. CSV ve PDF aynı rapor verilerinden üretilir. PDF tarayıcıda oluşturulur; hosting'e yeni servis gerektirmez. PDF kütüphanelerinin lisansları pakete dahildir.

[Doğrulama](TEST-RAPORU-1.29.0.md).
