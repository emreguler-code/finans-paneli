# Finans 1.5.0 — Uygulanan kapsam

13 Ekim 2026 kullanıcı onayıyla 1.4.1 üzerine uygulanmıştır. Bağımsız finans. projesi; Sade Netlik, Inter ölçekleri ve Lucide korunur. Safir mavisi kullanılmaz. Harici hosting yayını yapılmaz; hazır güncelleme paketi teslim edilir.

- Tüm pencereler, filtre/sıralama ve tarih seçimleri merkezde; blur ve arka ekran etkileşim engeli. İçeriğe bağlı boyut, ekran sınırları ve iç kaydırma. Satır içi aksiyonlar ve log/takvim günü baloncukları ilgili özel istisnalardır.
- Cari, tahsilat/ödeme, banka/kasa ve kart hareketlerinde sağa hizalı tutar; tıklanan satır altında kompakt Düzenle/Log/Sil. Ayrıntı oku kaldırıldı. Log formatı korunur. Küçük ikonların dokunma alanları kullanılabilir kalır.
- Üç cari türü: Tedarikçi, Müşteri, Personel. Diğer yeni kayıt seçeneklerinde yok. Carilerde virman yok.
- Tedarikçi: Faturalı Alış/Faturasız Alış/İade/Ödeme. Faturalı/faturasız rapor filtresi. Bağımsız tahsilat kutusu yok; mevcut iadenin tahsilatı bağlı işlem olarak yapılır.
- Müşteri: Satış/Tahsilat/İade. Personel: Maaş Ekle/Borçlandır/Tahsilat/Ödeme. Borçlandır: alışveriş veya şirketçe karşılanan kişisel ödeme. Maaş hak edişi kasayı etkilemez; Ödeme→Maaş gerçek para çıkışı yapar.
- Dinamik alanlar, kısmi peşin ödeme/tahsilat, borçtan düşülen veya sonra geri ödenen/tahsil edilen iadeler, isteğe bağlı vade. Cari bağlamında kimlik sabit; açıklama isteğe bağlı; tutar canlı üçlü gruplama.
- İşlem yönü ile rapor amacı ayrı tutulur: iade satış/alış adıyla, maaş mal alışı adıyla sınıflanmaz. Tek etiket, isteğe bağlı, boşsa Genel. Gıda/Kırtasiye/Otomotiv önerileri ve serbest etiket girişi.
- Ödeme Planı sağ özet sütunu: Dikkat isteyenler/Hesaplarım. Aylık nokta ve gün baloncuğu; haftalık günlük ödeme/tahsilat toplamı; günlük satır dökümü. Aylık en/boy, haftalık en uyarlanır.
- Banka/kasa ve kart carousel: merkezde tek aktif kart, kısmi komşular, kenar fade, mouse/touch drag, birer kartlık oklar, döngü; aramayla doğrudan hesap seçimi. Altta aktif hesabın listesi. Banka/kasa: Hesap hareketleri/Gelecek dönem hareketleri. Kart: Ekstre/Dönem içi işlemler/Gelecek Dönem; varsayılan Dönem içi işlemler.
- Kompakt kredi kartında maskeli dört grup numara, sahip, banka/program markası, kesim/son ödeme. Desktop 1,618 hedef oran, çok dar ekranda okunurluğa öncelik. Üç bölümlü bar kalan ekstre/dönem ve gelecek taksit limit kullanımı/kullanılabilir limit.
- Manuel ekstre toplamı ayrı referanstır. Detayı girilmemiş fark gerçek ödemeye veya tekrar borca dönüştürülmez; negatif fark görünür. Gerçek ödeme iptali banka ve kalan borcu değiştirir. Yeni ekstre eski borcu ikinci kez eklemez.
- Cari kartlı ödeme işlem günü cariye/karta yansır. Ekstre kesimi gider oluşturmaz. Kart ödemesi kasa/bankada bir gerçek çıkıştır, yeniden harcama değildir. Kart taksitleri ve taksitli iadeler gelecekte ayrı listelenir; kuruş toplamı korunur.
- Planlanan banka/kasa hareketi gerçekleşene kadar bakiye etkilemez; gerçekleşme ayrı kaydedilir. Ödeme Planı cari kapamayı ve kalan kart borcunu esas alır.
- Aktarım: kasa/banka virmanı, kart borcu ödeme, karttan nakit kullanımı, karttan karta borç aktarımı ayrı anlam ve etkilerle sunulur. Cariler bu akışa dahil edilmez.
- Şema 6, idempotent yazılar, eşzamanlı sürüm kontrolü, finansal değişiklik gerekçesi ve audit korunur. Hesap/kart ayar gerekçeleri isteğe bağlıdır.
- Kullanıcı yetkisiyle varsayımsal veri temizliği ve demo üretimi; yönetici kullanıcı/şifre/config korunur. Gerçek kullanıma geçişteki sıfırlama bu güncellemenin dışında sonraki aşamadır.

Doğrulama sınırları TEST-RAPORU-1.5.md içinde açıkça belirtilmiştir.
