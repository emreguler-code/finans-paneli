# 1.26.0 tasarım kontrolü

Sonuç: çalışan ekranlarda incelendi. Kullanıcının 18 Kasım düzeltmeleri 1.25 tasarım referansına uygulanır. Ana sütun sırası değiştirilmez; aynı hücrenin metin başlangıcı ile giriş metni hizalanır. Aktif çizgi ana ve ek satırda ortak iç gölgeyle çizilir. Yeni tarih 44 px ikon, seçili tarih düz metindir. Ek alanların açılması ana sütunların x/genişliklerini değiştirmez.

1920 px maaş/kısmi ödeme ve zorunlu hesap görünümü; 390 px zorunlu alan görünümü; plan/izin ve kompakt aylık özet ekran görüntüleri incelendi. Zorunlu kaynak alanı açık ve erişilebilir, açıklama alanı ayrı bir kutu kolonuna dönüşmeden alt not olarak kalır. Grafikte sıfır kalemler ve tek türde gereksiz ince halka kaldırılır. Kaydet/iptal 44 px ikon hedefleridir.

Kanıt: [test raporu](docs/TEST-RAPORU-1.26.0.md), `docs/evidence/1.26.0/`. Canlı hosting ve fiziksel iPhone/Safari testi yapılmadı. Aşağıdaki 1.25.1 incelemesi tarihsel tasarım referansıdır.

---

# 1.25.1 tasarım karşılaştırması · 1.25.0 kapsamı

final result: passed

## Referans ve kanıt

- Görsel gerçeklik: `docs/tasarimlar/islem-ekleme-satir-ici-modern-kapali-2026-11-17.png` (1660×947); tedarikçi (1312×1199), müşteri ve personel görselleri aynı klasördedir. Personel görselindeki eski yazı/izin satırı, kullanıcının sonraki **Çalışma takvimi / tek vurgu / tek satırlık lejant** talimatlarıyla değiştirilir.
- Çalışan ekran: izole sentetik API, Chromium/WebKit/Firefox. Masaüstü 1920×1080, mobil 320/390×844; geometri matrisi 320–2048 CSS px ve üç sidebar durumunu kapsar. Fiziksel iPhone/Safari testi değildir.
- Tam görünüm kanıtları: `docs/evidence/1.25.0/tedarikci-masaustu.png`, `musteri-masaustu.png`, `satir-ici-ek-bilgiler.png`, `personel-mobil-takvim.png`, `personel-mobil-aylik.png`.
- Odak karşılaştırması: `docs/evidence/1.25.0/inline-comparison.png`. Kaynak tablo/alan bölgesi 1660 px genişlikten, çalışan 929 px ana sütun bölgesi 1100 px ortak sunum genişliğine ölçeklendi; orijinal tarayıcı kanıtı 1× yoğunluktadır. Örnek tutarlar/adlar farklıdır; bunlar piksel hatası sayılmaz. Görseldeki menü yukarıda, uygulamada yeterli alan bulunduğunda aşağıda açılır; ikisi de alana bağlıdır. Bu bir yerleşim hatası değildir.
- `personel-bilgileri.png` ve `personel-aylik-ozet.png`, gerçek DOM elemanlarının 489 px genişlikte ekran görüntüleridir. 12/24 px halkalar ve kompakt satırlar ayrıca incelendi.

## Karşılaştırma ve düzeltme geçmişi

1. İlk çalışan görüntüde tarih iki satıra kırılıyor, yeni satıra eklenen başlık gereksiz yükseklik oluşturuyordu (P2). Tarih kompakt gün/ay metnine çekildi; tam tarih takvim ve başlık yardımında korundu, fazladan başlık kaldırıldı. Son kanıt: `inline-comparison.png`.
2. Genel `dl > div` stili müşteri/personel bilgilerine gereksiz 13 px üst/alt boşluk ve çizgi ekliyordu (P2). Bileşen içinde padding/border ve sabit `dt` genişliği sıfırlandı. Son kanıt: `personel-bilgileri.png`; satır yüksekliği tarayıcıda ≤30 px doğrulandı.
3. İlk halka renkleri onaylanan kategori anlamlarından sapıyordu (P2). Dış halka turkuaz/açık turkuaz; nakit/ödenen yeşil, kart nötr, borç/kalan uyarı rengine döndürüldü. Son kanıt: `personel-aylik-ozet.png` ve tedarikçi aylık ekranları.
4. POS çizimleri yerine resmî kaynak görüntüleri yerel varlık olarak kullanıldı; kaynaklar `src/assets/pos/SOURCES.md` içindedir. Son kanıt: `tedarikci-masaustu.png`.

5. Son etkileşim incelemesinde varsayılan “Genel” etiketinin açılır listede diğer etiketleri gizlediği görüldü (P2). Ok tüm seçenekleri, yazma yalnız eşleşenleri gösterir; ikinci ok tıklaması menüyü kapatır. Etiket ve işlem menülerinde aşağı ok/Enter seçimi üç tarayıcıda ayrıca doğrulandı. Son tarayıcı kanıtı 152 kontrol/tarayıcı içerir.

Bu düzeltmelerden sonraki yakalamalar yeniden açılıp referanslarla birlikte incelendi. Açık P0/P1/P2 bulgusu yoktur.

## Beş zorunlu yüzey

- **Tipografi:** mevcut yerel Inter, 14 px ana / 12 px yardımcı metin; Türkçe etiketler ve TL rakam hizaları korunur. Takvim lejantı tek satırda kısa etiketlidir. Maketin büyük sunum yazıları uygulamaya doğrudan büyütülmemiştir.
- **Yerleşim:** yedi cari sütunu, satır içi ana alanlar, sağ eylem sınırı ve aşağı açılan ek bilgi gridi doğrulandı. Ek bilgiler x/width ölçülerini değiştirmez. Masaüstü sağ sütun ve mobil sekmeler çalışır; yatay sayfa taşması yoktur.
- **Renkler:** Sade Netlik tokenları; geçmiş ziyaret tüm hücrede nötr, aktif gün turkuaz, haftalık izin uyarı, yıllık/hastalık kırmızı. Maaş borcuna kesinti/devamsızlık anlamı eklenmedi.
- **Varlık kalitesi:** yerel orijinal Bonus/World/Axess görüntüleri bozulmadan, `object-fit: contain` ile gösterilir. İkonlar mevcut Lucide kitaplığından; bulanık raster arayüz veya ekran resmiyle oluşturulmuş sahte form yoktur.
- **Metin ve finansal anlam:** boş taslak gerçek bakiyeye katılmaz; düzenleme gerekçesi korunur. Tutar hücreleri mevcut üretim kuralıyla nötr, işaret ve cari bakiye anlamına göre renklidir. Dış alış halkası, iadenin fatura türü bağlantısı uydurulmaması için açıkça **brüt** olarak etiketlidir. Dönem dışı mahsup/tanımsız ödeme bağlantısında sahte oran gösterilmez.

## Etkileşim kontrolü ve sınırlar

Üç tarayıcıda ekleme, düzenleme, gerekçe, taslak koruması, modern menü/klavye, arama X/Escape/yeniden açma, takvim ikinci tıklama, mobil sekmeler, tek satır lejant ve görüntü taşması test edildi. Gerçek API ile yeni satır tek finansal kayıt oluşturdu; düzenleme aynı kimliğin sürümünü artırdı. Son sentetik tarayıcı koşusunda çalışma zamanı hatası yoktur; özet `docs/evidence/1.25.0/checks.json` içindedir.

Küçük görsel farklılıklar: mevcut global kabuk, aylık mutabakat satırı ve dokunma hedefleri korunur; örnek görseldeki maskeli bilgiler gerçek alanlara zorunlu maskeleme getirmez. Bunlar bilinçli ürün kurallarıdır. Canlı hosting incelemesi ve fiziksel cihaz testi yapılmadı.

## 1.25.1 son kontrol

Devreden borç satırı açılış bakiyelerine karşı yapılan ödemeleri de kapsar; ana grafik ve alan yerleşimi korunur. Son çalışan tedarikçi aylık ekranı `docs/evidence/1.25.1/tedarikci-aylik.png`, mobil personel ekranı `docs/evidence/1.25.1/personel-mobil.png` içindedir. Chromium/WebKit/Firefox'ta 152'şer kontrol ve sıfır çalışma zamanı hatası tekrar doğrulandı; `docs/evidence/1.25.1/checks.json`. Kaynak görsel karşılaştırması ve önceki P2 düzeltmeleri yukarıdaki kayıtlarla aynıdır.
