# Finans Paneli 1.18.0 — cari detayını sadeleştirme

16 Kasım 2026'da kullanıcı cari ekranı incelemesini onayladı ve kodlama/yayın istedi. Başlangıç GitHub main: b6f5e1392dfdc374e28928861e4a03845e8d18c1 (1.17.0). Bu onay aşağıdaki cari detay kapsamıyla sınırlıdır; önceki hareket modeli ve diğer modüller korunur.

- Cari adı, türü ve güncel bakiye tek kompakt yüzeydedir; bakiye sağda ve borcun/alacağın karşı tarafı açıkça yazılıdır. Gereksiz ikinci tür ve boş unvan alanı kapalı görünümden çıkarıldı.
- Aşağı ok cari bilgilerini aynı kutuda açar. Düzenle ve yeni işlem izinleri korunur. Uzun ad/tutar mobilde kontrollü satırlara geçer.
- Cari hareketlerinin arama/filtre/sıfırla/sırala/CSV araçları ilgili listede yan yanadır. Header araması bu detayda açık etiketli genel aramadır. Diğer listelerin mevcut portal düzeni değişmez; ortak ListTools yeni yerleşimi destekler.
- Cari hareket tutarları ve satır bakiyeleri nötr; yön etiketi işaretine göre renkli, iptal etiketi nötrdür. Güncel bakiye üstte renkli kalır. Tutar/Bakiye sütun sırası ve gerçek değerler korunur.
- Saat ve işlem sırasında ödeme/tahsilat bilgisi genişletilen satırdadır. Brüt tutar, peşin kısım, API party_effect net etkisi ve tarihsel bakiye ayrı anlatılır. İptal/planlanan kaydın güncel bakiyeye dahil olmadığı belirtilir.
- Tarih sırası görünür, Son hareketler kısayolu yeni→eski sıralar; API'nin kanonik işlem sonrası bakiyesi yeniden hesaplanmaz. Sayfalama korunur.
- Arama/filtre varken listelenen gerçekleşmiş ve aktif kayıtların party_effect toplamı ayrı adla görünür. Güncel cari bakiye filtrelenmez. Planlanan/iptal kayıtlar bu toplama katılmaz.
- Gövde kaydırması, 1,9:1 yeterli alan kuralı, mobil blok ledger, türe özel yardımcı bilgiler ve rol kısıtları korunur.

Finansal API, veritabanı şeması (12), canlı veri ve yönetici hesabı değişmez. Yayın GitHub sürüm paketidir; hosting kurulumu ayrıca yapılır. Yeni otomasyon tetikleyicisi yalnız sürümle eşleşen release/v* dalı veya v* etiketidir; mevcut test kapıları atlanmaz.
