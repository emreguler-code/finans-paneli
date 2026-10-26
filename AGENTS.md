# Finans Paneli — Codex çalışma kuralları

Sürüm Finans 1.9.1, şema 10’dur. Onaylı kapsam docs/SONRAKI-SURUM-NOTLARI.md içindedir. Bildirimler, filtreler ve tüm takvimler tıklanan alana bağlı, bulanıklık ve sayfa kayması olmadan açılır. Karta ait tüm bilgi/ayar/düzenleme ikonları kendi kartının üzerinde olmalıdır. Kampanya puanları TL bakiyesine eklenmez; araç ödemeleri mevcut hareketlere bağlanır ve ikinci finansal işlem üretmez. Ürün dili Türkçe, tasarım dili Sade Netlik'tir.
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

Hesap/kart carousel kaldırılmıştır; grid → detay akışı kullanılır. Cari/hesap/kart başlıklarında geri/yeni işlem dışta, özet altta; bilgi/düzenleme özette kalır. İlişkili metrikler tek özet yüzeyindedir. Ana/sağ sütun oranı 1,9:1; alt menüler başlangıçta kapalıdır. Kart hesap bağlantısı yalnız metadata, sonraki tarihler tahmindir; finansal işlem üretmez.
