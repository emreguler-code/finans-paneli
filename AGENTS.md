# Finans Paneli — Codex çalışma kuralları

Sürüm Finans 1.13.1, şema 11’dir. Onaylı kapsam docs/SONRAKI-SURUM-NOTLARI.md içindedir. Bildirimler, filtreler ve tüm takvimler tıklanan alana bağlı, bulanıklık ve sayfa kayması olmadan açılır. Kayda ait eylemler ilgili kayıt kapsamında kalır. Hesap/kredi kartı yatay liste özetlerinde info/düzenle ikonları yoktur; işlevler detay ekranındadır. Kampanya puanları TL bakiyesine eklenmez; araç ödemeleri mevcut hareketlere bağlanır ve ikinci finansal işlem üretmez. Ürün dili Türkçe, tasarım dili Sade Netlik'tir.
Önce README.md, docs/TASARIM-ILKELERI.md ve docs/CODEX-BASLANGIC.md dosyalarını okuyun.

26 Ekim 2026 için onaylı ve 1.9.0 kapsamında uygulanan tasarım kapsamı sonraki sürüm notlarında ve tasarım incelemesindedir. Takvim kuralı artık hem tek gün hem tarih aralığını kapsar: tıklanan alana bağlı açılmalı, ek blur/karartma veya sayfa kayması oluşturmamalıdır; önceki tek gün modal istisnası kaldırılmıştır. Not alma aşaması ile kodlama/yayın aşamasını karıştırmayın.

## Değişiklik kapsamı
- Kullanıcı yalnızca not veya analiz istiyorsa kod değiştirmeyin. Uygulama onayı verildiyse işi tamamlayın ve uygun testleri çalıştırın.
- İstenmeyen sütun sırası, yön, renk, tipografi veya yerleşim değişikliği yapmayın. Önceki sürümle diff üzerinden karşılaştırın.
- Başka projelerdeki tasarım dilini taşımayın; safir mavisi bu projeye ait değildir.
- Para işaretleri, cari etkisi, nakit hareketi ve kredi kartı borcu farklı bağlamlardır. Birini diğerine göre kestirerek değiştirmeyin; mevcut hesap modelini ve testleri inceleyin.
- Üretim verisi, kullanıcı bilgisi, şifre, api/config.php, yedek veya oturum dosyası commit etmeyin. Şema/migrasyonları koruyun. Testler sentetik veri kullanmalı.
- Veritabanı değişikliğinde mevcut yönetici hesabını koruyun. Açıkça istenmeden canlı veriyi sıfırlamayın, demo üretmeyin veya canlıya dağıtım yapmayın.

## Doğrulama
- npm ci; npm test (derleme, birim testleri, Sites worker testleri).
- PHP değişikliklerinde php -l çalıştırın; hesaplama/API değişikliklerini izole test veritabanında uygun entegrasyon senaryolarıyla doğrulayın.
- Arayüz değişikliklerinde çalışan uygulamada masaüstü ve dar ekran kontrolü yapın, ekran görüntüsüyle inceleyin. Gerçekte yapılmayan tarayıcı/cihaz testini yapılmış gibi bildirmeyin.
- Sonuçta ne değiştiğini, testleri ve kalan sınırları kısaca açıklayın.

Hesap/kart carousel kaldırılmıştır; yatay liste → detay akışı kullanılır. Cari/hesap/kart başlıklarında geri/yeni işlem dışta, özet altta; bilgi/düzenleme özette kalır. İlişkili metrikler tek özet yüzeyindedir. Ana/sağ sütun oranı 1,9:1; alt menüler başlangıçta kapalıdır. Kart hesap bağlantısı yalnız metadata, sonraki tarihler tahmindir; finansal işlem üretmez.

1.10.0 geçmiş kapsamı: Hesaplar ve Kredi kartları onaylı 3 numaralı yatay liste düzenini paylaşır. İçerik araçları içerikte kalır. Merkezi Bildirimler sayfası bölüm/önem/kayıt/tarih filtrelerini taşır; önizlemeler en fazla 5 kayıt gösterir. Cari yan sütunları net party_effect işaretine dayanır. Araçlarda 2 numaralı Poliçeler özeti ve birleşik İşlemler uygulanmıştır. Demo 4 araç, 44 araç kaydı içerir; ödemeler mevcut gerçek hareketlere bir kez bağlanır. Kullanıcının toplu kodlama/paketleme/yayın onayı alınmış ve uygulanmıştır.

1.11.0 onaylı düzeltmeler uygulandı: mobilde hareket meta bilgisi ve işlem sonrası bakiye yalnız seçili satırda; masaüstü sütunlar korunur. Cari listesinde tek Son 5 işlem; detayda türe bağlı Durum ve bilgiler vardır. Personel ödemeleri açıkça kaleme/aya bağlanır, izin haftası pazartesi başlar. Tedarikçi ziyaret günleri plan bilgisidir; gerçekleşme takibi yoktur. Araçlar yataydır; bakım aralıkları gerçek aşınma değildir. Sonraki not aşaması ifadeleri önceki karar geçmişidir; kullanıcının son toplu kodlama/yayın onayı bu kapsamı yürürlüğe almıştır.

1.12.0: Bölümlü tek form ve ortak Türkçe doğrulama kullanılır; değişmiş taslak Esc/X/dışarı/Vazgeç ile kapatılmadan kullanıcıya seçim sunulur (önceki koşulsuz iptal kuralını değiştirir). Ana bölüm menüsü temiz ana listeye gider; detaydan geri ve tarayıcı geçmişi liste tercihlerini korur. Paylaşılan hosting uyumlu hash rotası sayfa/kayıt/sekme/hedef hareketi temsil eder; eski seçili detay belleği kullanılmaz. Genel bakış araması kategorili genel aramadır; diğer sayfalar bağlamsal kalır. Varsayılan Bu Ay döneminin filtre rozeti olmaz. Cari durum özeti iki sütunu kapsar, mobil kart özeti kısadır ve Daha fazla ayrıntıları korur. Şema 11; banka/veri bağlantısı yoktur.

1.13.0: Ayarlar yalnız yöneticilere açıktır ve Görünüm ve bilgiler üstündedir. Yedekler web kökü dışında saklanır; özel klasör, config.php ve yedekler commit/paket edilmez. Geri yükleme ve demo temizliği öncesi güvenlik yedeği zorunludur; mevcut yönetici parolası korunur. Diğer oturumlar işlem sonrası geçersiz kılınır. Gerçek veri modu demo_clear ile silinemez. Aynı veritabanındaki ilişkisiz tablolar kapsam dışıdır; SQL/DDL yedekten yürütülmez, FK denetimi kapatılmaz. Otomatik yedek yönetici etkinliği veya yalnız CLI cron ile günlük/haftalık çalışır; cron hostinge kendiliğinden kurulmaz. `npm run test:backups` finansal API değişiklikleriyle birlikte çalıştırılmalı. Yedekleme kılavuzu docs/YEDEKLEME.md.

1.13.1: Standart hosting web kökü altındaki kurulumlarda özel yedek dizini web kökü dışına seçilir; HTTP ve CLI yolu aynıdır. Dizinin güvenliği mkdir öncesinde denetlenir. Ayarlar ilk yükleme hatası sonsuz yükleniyor göstermez; güvenli hosting yapılandırması ve Yeniden dene sunar. Web kökü koruması gevşetilmez.
