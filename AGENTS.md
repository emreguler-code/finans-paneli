# Finans Paneli — Codex çalışma kuralları

Bu depo Finans 1.6.0 kaynaklarıdır. Ürün dili Türkçe, tasarım dili Sade Netlik'tir.
Önce README.md, docs/TASARIM-ILKELERI.md ve docs/CODEX-BASLANGIC.md dosyalarını okuyun.

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
