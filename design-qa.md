# Finans 1.13.2 bakım doğrulaması

Otomatik yedekleme kartı günlük Türkiye saati 03.00, cron gerekliliği ve tüm türlerde 5 kopya sınırını açıklar; haftalık/sıklık seçimi kaldırılmıştır. 504 tarayıcı kontrolü geçti. 390 px görüntü incelendi; 768/390/320 px taşma yok. Kanıt `.qa/080a374e80aa/browser/settings-backups-390.png`. Fiziksel cihaz veya canlı cron testi yapılmadı.

# Finans 1.13.1 bakım doğrulaması

Ayarlar yükleme hatası sonlanır ve yeniden deneme sunar. Yapılandırma açıklaması 1440, 390 ve 320 px genişliklerinde taşma olmadan gösterilir; 390 px görüntü incelendi. Diğer sayfa tasarımı değiştirilmedi. Kanıt `.qa/632abd4f3aba/browser/settings-storage-error-*.png`; 502 tarayıcı kontrolü geçti. Fiziksel cihaz veya canlı hosting testi yapılmadı.

# Finans 1.13.0 tasarım doğrulaması

30 Ekim 2026 · Sonuç: **passed**. Ayarlar ekranı mevcut Sade Netlik düzenine eklendi; önceki sayfa tasarımları korunur.

Kaynak: kullanıcının Ayarlar menüsü, yedekleme/geri yükleme/otomatik yedek ve boş veriye geçiş talebi; docs/TASARIM-ILKELERI.md. İşlem ve tehlikeli eylem onayları ortak Sheet/EntryForm dilini paylaşır.

Kanıt: `.qa/2e36f7bae663/browser/settings-*` ve geniş veride `.qa/design-113/settings-*`, `empty-start.png`. 1440 px masaüstü ve 768/390/320 px dar görünümde gerçek derlenmiş uygulama incelendi. Yatay taşma yok; yedek satırı eylemleri en az 44 px. Tam sayfa mobil ekranındaki sabit alt navigasyon, ilk görünüm yüksekliğinde yakalanır; tek ekran yüksekliği iddiası değildir.

- Ayarlar, Görünüm ve bilgiler üstünde; yalnız yöneticilerde ve mobil Diğer menüsünde görünür.
- Tek tam genişlik durum özeti; 1,9:1 içerik/yan sütun, ortak kırılımlarla dar ekranda tek sütun. Yerel Inter, Lucide, renk/boşluk/köşe rolleri korunur.
- Listeye ait sıralama içerikte, yedek indirme/geri yükleme kendi satırındadır. Arama ve tür/tarih filtreleri ortak üst satırdadır; tarih seçimi ek blur/sayfa kayması oluşturmaz.
- Yüklemenin henüz geri yükleme olmadığı, mevcut yönetici parolasının korunacağı, ön güvenlik yedeği ve gerçek modda temizliğin kapalı olması metinle açıklanır. Otomatik yedeğin yönetici etkinliği ile cron arasındaki farkı görünürdür.
- Dolu demo → boş gerçek mod → yedekten aynı dolu veri akışı arayüzden tamamlandı. Ardından yerel ortam boş gerçek modda bırakıldı. Canlı hosting kendiliğinden değiştirilmez.

Sınırlar: fiziksel mobil cihaz/ekran okuyucu testi ve kullanıcının hosting cron kurulumu yapılmış sayılmaz. Yedek dosyaları ve oturum bilgileri görsel rapora/depoya eklenmez; ekranlar sentetik veridir.
