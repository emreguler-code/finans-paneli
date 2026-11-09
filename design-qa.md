# 1.16.0 tasarım doğrulaması

**Kaynak ve karşılaştırma kapsamı**

- Görsel yön: `/workspace/generated_images/exec-cd6bd876-04d7-4e5b-8416-8f180d289e77.png` (1756 × 895 px).
- Dokuz bölge şeması: `/workspace/generated_images/exec-a1e64e49-6c7c-48df-afc6-1dcb3b0c7d50.png` (1536 × 1024 px).
- Sonraki yazılı onaylar önceliklidir: [global sözleşme](docs/GLOBAL-YERLESIM-SOZLESMESI.md). Özellikle hızlı işlem bölgesi yardımcı içeriğin arasına girmez; kendi grid satırında yer ayırır.
- Gerçek React + PHP uygulaması, izole sentetik veritabanı ve Chromium üzerinde açıldı. Kaynaklar birden fazla temsili pencere içeren kavramsal panolardır; aynı rota/alanlar karşılaştırıldı, bire bir viewport/piksel eşleşmesi iddia edilmedi. Kaynaktaki örnek tarihler, unvanlar ve hareket sayıları gerçek fixture ile aynı değildir.
- Chromium ekran görüntüleri DPR 1: masaüstü 1920 × 1080, bölünmüş pencere 1268 × 1000, mobil 390 × 844, onay 320 × 600 CSS px. Piksel boyutları CSS boyutlarıyla aynıdır. Karşılaştırma panolarında kaynak/uygulama yalnız orantılı küçültüldü; özgün kayıtlar ayrıca saklandı.
- Birlikte incelenen tam görünüm: `docs/tasarimlar/1.16.0/karsilastirma.png`; bölge karşılaştırması: `docs/tasarimlar/1.16.0/bolgeler.png`. Ayrı görüntüleri yan yana görülmüş saymak yerine ortak karşılaştırma panoları açılarak incelendi.
- Odaklı inceleme: `docs/tasarimlar/1.16.0/etkilesimler.png`, `masaustu.png`, `bolunmus-pencere.png`, `mobil.png`, `taslak-onayi.png` ve `buyuk-tutar-960.png`.

**Bulgular ve düzeltme geçmişi**

1. [P1, düzeltildi] Tema ayrımında vurgu üzerindeki yazı rolü tanımsız kaldığında Kaydet/Düzenlemeye dön metni koyu görünüyordu. `--text-on-accent: #fff` tanımlandı; gerçek hesaplanan düğme rengine tarayıcı kontrolü eklendi. Önceki odaklı kayıt `etkilesimler-renk-oncesi.png`; aynı viewport/durumda yeniden çekilen `etkilesimler.png` beyaz yazıyı doğrular.
2. [P2, düzeltildi] 960 px pencerede büyük hareket tutarı, altı sütunlu tablonun ayrılmış tutar alanını aşıyordu. Önceki kayıt `buyuk-tutar-960-oncesi.png`. Ledger'ın kendi genişliği için kompakt sunum eşiği 880 px yapıldı; sonraki `buyuk-tutar-960.png` tam tutarı ve okunabilir açıklamayı doğrular. Yalnız body taşmasına bakılmadı; görünen tutar hücrelerinin kendi scroll/client genişlikleri de kontrol edildi.
3. [P2, düzeltildi] Ara genişlikte kompakt satırın TL birimi eski masaüstü küçük metin kuralını devralıyordu. Para birimi tutarla aynı satırda tutuldu; kompakt satırların görünür birimleri ayrıca kontrol edildi.

**Zorunlu görsel yüzeyler**

- Tipografi: mevcut yerel Inter 400/500/600 korundu; başlık, bölüm, gövde ve yardımcı metin rolleri aynı. Metinler küçültülerek sığdırılmadı. Uzun ticari unvan kırılır; kritik tutar tek parça görünür. Gerçek cihaz font rasterizasyonu ayrıca ölçülmedi.
- Boşluk/yerleşim: ortak kenarlar native scrollbar payıyla hizalı. Geniş ekranda 1,9:1; yetersiz içerik genişliğinde yardımcı bölge altta. Başlık ve özet ayrı görevlerde, özet tek yüzey. İşlem çubuğunda iç boşluk, 44 px eylemler ve bağımsız onay görünür. Footer'a kaydırılarak erişim doğrulandı.
- Renk/tokenlar: mevcut Sade Netlik ve finansal işaret renkleri korundu. CSS renkleri ve grafik boyaları tema değerlerinden gelir. Vurgu rengini değiştirmenin bölge geometrisini değiştirmediği ölçüldü. Bu çalışma yeni tema veya genel kontrast sertifikasyonu değildir.
- Görseller/ikonlar: mevcut finans logosu ve Lucide ailesi korundu; yeni illüstrasyon, taklit logo veya raster UI eklenmedi. İkon kontrolleri gerçek tıklanabilir bileşenlerdir.
- Metin/içerik: Türkçe ürün metinleri ve finansal alan anlamları korundu. Şemadaki kutu adları ürün ekranına açıklama olarak taşınmadı. Büyük tutar stres kayıtları yalnız test DOM'unda değiştirildi; finansal API verisine yazılmadı.

**Etkileşim ve kabul**

Menü tam/kompakt/gizli, yeniden açma, resize/reload sonrası tercih, mobil menü odak izolasyonu, tek içerik kaydırması, yardımcı alanın akışı, footer erişimi, gerçek yüksekliğine yer ayrılan işlem alanı, taslak koruması, merkezi onay odağı, Escape/dışarı tıklama ve vazgeçme sonrası kilitlerin bırakılması tarayıcıda denendi. Mevcut form/takvim/arama/geçmiş/yedekleme regresyonları ve React çalışma zamanı hataları ayrıca kontrol edildi; ayrıntı [test raporunda](docs/TEST-RAPORU-1.16.0.md).

**Kabul edilen farklar ve sınırlar**

Kavramsal panonun örnek verisi ve tek tek görsel oranları aynen kopyalanmadı. Mevcut onaylı sütunlar, yerel ikonlar, mobil bakiye özeti ve erişilebilir menü/arama korundu. Kullanıcı tercihi düğmesi header'a eklendi. Bunlar sonraki yazılı onayların ve mevcut ürün davranışının korunmasının sonucudur. Yardımcı bilgiler uzun liste/sonraki sayfalama sonrasında akışta erişilebilir; her veri uzunluğunda aynı ekrana sığma hedeflenmez.

Fiziksel telefon, iOS/Safari, Firefox ve işletim sistemi düzeyinde gerçek tarayıcı zoom testi yapılmadı. Farklı CSS viewport'ları, kısa yatay ekran ve visualViewport klavye simülasyonu kontrol edildi; bunlar gerçek cihaz testinin yerine geçmiş sayılmaz.

**Uygulama kontrol listesi**

- [x] Onaylı bölge düzeni ve mevcut tema birlikte incelendi.
- [x] Görülen yerleşim/renk sorunları düzeltildi ve yeniden görüntülendi.
- [x] Geniş, bölünmüş ve mobil görünüm; kritik eylemler ve taslak akışı doğrulandı.
- [x] Son para birimi düzeltmesi aynı viewportta yeniden görüntülendi; 82 odaklı kontrol ve güncel demo kontrolleri geçti.

final result: passed
