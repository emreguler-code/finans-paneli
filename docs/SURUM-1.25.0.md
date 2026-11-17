# Finans Paneli 1.25.0 — Cari çalışma ekranları

Kullanıcının 17 Kasım 2026 tarihli açık uygulama ve GitHub yayın talimatıyla son tasarımlar ve biriken notlar uygulanır. Şema 12 korunur; canlı hosting kurulumu yapılmaz.

## İşlem ekleme ve düzenleme

Cari hareketlerinin sonunda Yeni işlem ekle, boş bir taslak satırı açar. Tarih ve kullanıcı hazır gelir; işlem türü ve pozitif tutar seçilmeden kayıt düğmesi etkinleşmez. Tarih, açıklama, etiket, işlem, ekleyen, tutar ve bakiye sütunları korunur. Ek bilgiler başlangıçta kapalıdır; açılması ana alanların yerini veya genişliğini değiştirmez. Ödeme, hesap, vade, saat ve belge alanları tutar sütununun sonuna kadar ayrı gridde açılır. Bakiye sütununda taslak işareti ve kompakt iptal/kaydet ikonları vardır.

Düzenleme aynı alan ve menü dilini kullanır; kayıt kimliği, sürüm kontrolü ve değişiklik gerekçesi korunur. Yeni işlem gerekçe istemez. Değişmiş taslak kapatma, gezinme, geri ve yenilemede korunur. Hesap/kart ve genel tahsilat girişleri mevcut kendi akışlarını sürdürür.

## Cari türüne göre bilgi ve takvim

- Tedarikçi: pazartesi–pazar ziyaret planı; geçmiş günün tüm hücresi nötr, bugün/gelecek ziyaret turkuaz, bugün ayrıca çerçevelidir. POS Cihazları bölümünde yerel resmî Bonus/World/Axess logoları, altında etiket olmadan kullanılır. Kampanyalar ilişkili aktif kayıtlar halinde birer satırdır.
- Müşteri: Alışveriş günleri yalnız gerçekleşmiş cari hareketlerden işaretlenir. Ünvan, TCKN/VKN, adres ve telefon kompakt gösterilir. Altı aylık geçmiş/vadeli tahsilat bilgileri açılır ayrıntıda korunur.
- Personel: Çalışma takviminde üst yarı sabah, alt yarı akşamdır; tek turkuaz vurgu kullanılır. Haftalık izin sarı-turuncu, yıllık/hastalık kırmızı ve kısa etiketlidir. Lejant tek satırdır. İzin bilgisi personel altında tekrar edilmez. Plan cari düzenlemede tarih bazında girilir; başka haftaya otomatik tekrar, devam kaydı veya finansal etki oluşturmaz. Eski izin sayıları gün planı diye yorumlanmaz.

## Aylık Özet

Masaüstünde bilgi kartının altında, mobilde ayrı sekmededir. Mevcut Recharts kullanılır; yeni grafik bağımlılığı eklenmez. Dış halka 12 px, iç halka 24 px kalınlığındadır. Tutarlar ve oranlar grafiğin yanında metin olarak da okunur.

Tedarikçide brüt faturalı/faturasız alış oranı ince dış halkada, net alışın aynı ayki nakit/banka, kredi kartı ve açık borç dağılımı iç halkadadır. İade net hacimden ve gerçekleşmiş iade tahsilatı ilgili ödeme kaynağından düşer. İadelerin fatura türüne ait açık bağlantısı bulunmadığında yapay dağıtım yapılmaz; bu yüzden dış halka açıkça **brüt alış türü** olarak adlandırılmıştır. Her halka kendi paydasında yüzde 100'dür; banka/kart borcu bu rapor değildir.

Müşteride net satışın bu ay tahsil edilen ve açık kalan payı gösterilir. Ay içi toplam net tahsilat ve eski dönem borcuna ait kısım ayrıdır. Personelde kayıtlı maaş/yemek hakedişi ve yalnız açıkça seçili aya bağlanmış ödemeler kullanılır; başka personel borçları otomatik mahsup edilmez. Ödeme bağlantısı tanımsız ay, ödenmemiş maaş diye sunulmaz.

Ay sonu kesiti mevcut açık kalem eşleştirmesiyle, yalnız o tarihe kadar gerçekleşmiş kayıtlar üzerinden hesaplanır. Gelecek, plan ve iptal kayıtları girmez. Dönem dışı avans/mahsup veya negatif dağılım varsa yanıltıcı oran çizilmez; tutar ve açıklama gösterilir. Grafik geleceğe dönük risk/ödeme gücü puanı değildir.

## Kapanış düzeltmeleri ve yayın

Arama önerilerinde X/Escape kapanıştan sonra odağın geri gelmesi pencereyi yeniden açmaz; metin ve filtreler korunur. Yeni tıklama, yazma veya aşağı ok önerileri yeniden açar. Takvim tetikleyicisine ikinci tıklama yalnız ilgili takvimi kapatır; tarih ve form korunur.

Hostinge hazır ZIP + SHA-256 `releases/1.25.0/` ve GitHub Release varlıklarında sunulur. Mevcut config, kullanıcılar, işlemler ve yedekler pakete alınmaz; canlıya yüklemeyi kullanıcı yapar.
