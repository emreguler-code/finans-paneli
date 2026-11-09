# 1.17.0 mobil görsel doğrulaması

**Kaynak ve durum**

Kullanıcının mobil ekran görüntülerinde gösterdiği sorunlar ve ardından onayladığı sekiz maddelik inceleme bu düzeltmenin hedefidir. Sorunlar mevcut 1.16.0 uygulamasında ayrıca yeniden üretildi. Canlı ürün veya kullanıcı verisi yerine aynı sentetik yerel demo üzerinde gerçek React + PHP uygulaması açıldı. Yeni tema tasarlanmadı.

- Kaynak kayıtları: `.qa/mobile117-before/webkit-{expanded,menu,reports,accounts,account,filters,plan,notifications}.png`; Chromium karşılıkları aynı klasördedir.
- Son uygulama kayıtları: `.qa/mobile117-final/` ve odaklı durumlar `.qa/mobile117-checks/`. İncelenen kalıcı kopyalar `docs/tasarimlar/1.17.0/` altındadır.
- Normalleştirme: kaynak ve son görüntüler 390 × 844 CSS/piksel, DPR 1; tarayıcı çerçevesi/telefon süsü yoktur. Yan yana panolar 804 × 872 px; görüntüler ölçeklenmeden araya 24 px boşluk ve 28 px etiket alanı eklenmiştir. Ek küçük filtre kanıtı 320 × 568 px'dir.
- Aynı rota, veri, tema ve açık/kapalı durumlar birlikte incelendi. Menü karşılaştırmasında yalnız drawer bileşeni esas alındı; arka plandaki kaydırma/odak ayrıntıları piksel eşleşmesi sayılmadı. Gönderilen fiziksel cihaz görüntüsündeki iOS durum çubuğu emülasyon görüntülerine eklenmedi.

**Karşılaştırmalar ve düzeltmeler**

1. [P1, düzeltildi] Açık cari satırı 364 px tabloda 28,66 px hücreye sıkışıyordu. Native tablo ve blok hücre kuralları çakışıyordu. Tek blok akışı uygulandı; kapalı/açık hücre, metadata, eylem genişliği ve seçim çizgisi iki motorda ölçüldü. Kanıt: [expanded-comparison.png](docs/tasarimlar/1.17.0/expanded-comparison.png).
2. [P1, düzeltildi] Geniş mobil drawer yalnız ikon gösteriyordu. Eski viewport gizleme kuralları kaldırıldı; bölüm adları, marka ve kapatma düğmesi görünür. Masaüstü ikon şeridi korundu. Kanıt: [menu-comparison.png](docs/tasarimlar/1.17.0/menu-comparison.png).
3. [P2, düzeltildi] Özetlerde mobilde kalan masaüstü kenar/ayraçları ve yüksek boşluklar vardı. Ortak mobil metrik satırları uygulandı; kapalı cari özeti yeniden kontrol edildi. Kanıt: [reports-comparison.png](docs/tasarimlar/1.17.0/reports-comparison.png), [account-comparison.png](docs/tasarimlar/1.17.0/account-comparison.png).
4. [P2, düzeltildi] Hesap listesi karşılaştırma için çok uzun alan tüketiyordu. Banka/ad/bakiye önceliklendirildi; sahip/IBAN/tür detayda kaldı. Kanıt: [accounts-comparison.png](docs/tasarimlar/1.17.0/accounts-comparison.png).
5. [P2, düzeltildi] Filtre dar/uzun açılıyor, eski sticky footer panelin altında 64 px boşluk bırakıyordu. Panel genişliği ve görünür yüksekliği uyarlandı; yalnız alan gövdesi kaydırılır, eylemler gerçek alt kenarda kalır. Son kontrol footer ile panel altının çakışmasını da ölçer. Kanıt: [filters-comparison.png](docs/tasarimlar/1.17.0/filters-comparison.png), [320 px kaydırılmış alanlar](docs/tasarimlar/1.17.0/webkit-filters-320.png).
6. [P2, düzeltildi] Header arama ipucu kesiliyor, arama odaklandığında menü/zil gizleniyordu. Mobil submit gizlendi, kısa ipucu ve klavye Ara/Enter korundu; odak diğer kontrolleri saklamaz. Önce/sonra tüm panolarda görülebilir.
7. [P2, düzeltildi] Ödeme planı kontrolleri ve bildirimlerin geniş renk zeminleri aşırı alan/ağırlık oluşturuyordu. Plan iki kontrol satırına indirildi; temel hedefler 44 px'dir. Bildirimde kırmızı önem metni/ikonu, beş özet ve tam liste korunur. Kanıt: [plan-comparison.png](docs/tasarimlar/1.17.0/plan-comparison.png), [notifications-comparison.png](docs/tasarimlar/1.17.0/notifications-comparison.png).
8. [P2, regresyonda bulundu ve düzeltildi] 320 px kart listesinde 100.000,00 TL kullanılabilir limitin birimi kırpılıyordu. Dar görünümde finansal metrikler etiket/tutar satırlarına geçti; tutar ve birim geometrisi iki motorda doğrulandı. Kanıt: [webkit-cards-320.png](docs/tasarimlar/1.17.0/webkit-cards-320.png).

**Beş görsel yüzey**

- Tipografi: yerel Inter 400/500/600 ve sayfa başlığı/gövde rolleri korundu. Mobil rapor sayıları 24 px, temel bakiye 27 px; yazılar genel olarak küçültülmedi. Mobil arama ve filtre girdileri 16 px. Açık satırdaki kelime kelime daralma giderildi.
- Boşluk/yerleşim: ortak kabuk ve 1,9:1 geniş düzen korunur. Mobilde aynı kenarlı özetler, kısa listeler, tutarlı açık satır ve kullanılabilir filtre gövdesi vardır. Takvim artık ödeme planında daha erken görünür.
- Renk/tokenlar: Sade Netlik ve finansal yön renkleri korunur. Bildirim zemini sakinleştirildi, önem metin/ikonla sürer. Yeni ham renk veya tema seçici eklenmedi.
- Görsel/ikon kalitesi: mevcut finans markası, banka işaretleri ve Lucide ikonları kullanılır; görsel taklidi veya yeni raster UI yoktur. Menü adları gerçek metindir.
- İçerik: finansal hesaplama ve alan anlamları değişmedi. Detayda korunmuş ikincil hesap bilgileri dışında bilgi kaldırılmadı. Testteki büyük tutar metni yalnız DOM stres girdisidir; veritabanına yazılmadı.

**Doğrulama ve sınırlar**

702 mevcut tarayıcı kontrolü; izole mobil pakette Chromium 71 + WebKit 71 kontrolü geçti. İki motorda çalışma zamanı hatası yok. Finansal demo uzlaştırması ve paket kurulumu da geçti; [test raporu](docs/TEST-RAPORU-1.17.0.md). Son görüntüler yeniden çekildi ve yukarıdaki ortak panolarda karşılaştırıldı. Açık P0/P1/P2 bulgusu kalmadı.

Fiziksel iPhone/Safari, VoiceOver, gerçek mobil klavye ve iOS safe-area testi yapılmadı. WebKit viewport/touch emülasyonu gerçek cihaz doğrulaması olarak sunulmaz. Görüntüler tam erişilebilirlik uyumu veya bütün veri uzunluklarında kusursuzluk garantisi değildir.

- [x] Kullanıcıdaki temel bozulma iki motorda yeniden üretildi.
- [x] Başlangıç bulguları ve sonradan yakalanan footer/kart tutarı sorunları düzeltildi.
- [x] Son durumlar aynı viewportta yeniden çekildi; ortak karşılaştırma ve odaklı alanlar incelendi.
- [x] Regresyon, finans ve kurulum kontrolleri tamamlandı.

final result: passed
