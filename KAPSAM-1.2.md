# Finans 1.2 — onaylanan kapsam ve kabul ölçütleri

Bu dosya 10 Ekim 2026 tarihli konuşmanın uygulama sözleşmesidir. Bağımsız finans projesidir; başka projelerin safir paleti, marka ve mobil tercihleri alınmaz.

## Tasarım
Asıl styles.css Inter/Lucide/Sakin netlik tipografisi, ölçüler, renkler ve bildirim dili korunur. Cari formu: kısa ad, ticari unvan, tür, kapalı açılış bakiyesi; telefon/e-posta/diğer alanlar kapalı. Net bakiye tek kalem, pozitif yeşil negatif kırmızı; sıfırda Alacak/Borç yazısı yok. Türler Tedarikçi/Müşteri/Personel/Diğer. Cari AJAX araması 3 karakter/400ms. Tek kelimelik sabit genişlikli etiket ve hizalı gerçek kullanıcı kısa adı.

## İşlemler
Global Hareketler tüm finans olaylarını bir kez listeler. Virman tek satır Kaynak → Hedef; iki hesap etkisi birlikte. Genel arama, işlem yönü/personel/hesap/tarih ve iptal kayıtları filtreleri. Ortak form ve işlem ayrıntısı. Borç & alacak menüsü artık Tahsilat & Ödeme. Bağımsız kasa giriş/çıkışı cari gerektirmez. Cari seçili tahsilat/ödeme ilgili yöndeki açık kalemleri kapatır; fazlası alınan/verilen avans. Yeni alış/satış borç/alacak kaydı nakdi etkilemez; mevcut avans uygun yöndeki faturaya otomatik uygulanır. Kalem-vade ve avans eşleşmeleri izlenebilir. Aynı carinin bağımsız alacağı ve borcu otomatik mahsup edilmez. İşlem günü/vade/ödeme günü ayrıdır. Yalnız alınmış ürün/gerçekleşmiş hizmet kaydı vardır; gelecek hizmet planlama yok. Vade gelmesi yalnız hatırlatma üretir; kullanıcı ödeme onayı vermeden kasa değişmez. Kısmi kapama ve açık kalan vade desteklenir.

## Bakiye ve iptal
Her işlem tek kimlik altında cari/kasa/kart etkilerini birlikte oluşturur. Tutarlar tamsayı kuruştur. Cari detay işareti cari bakiye yönü, global nakit satırı işareti nakit yönü. Virman toplam nakdi değiştirmez. Kart harcaması banka çıkışı değildir, kart ödemesi yeni harcama değildir. Raporlar nakit akışı/bakiye/açık kalem/avans/vade içindir, muhasebe/stok/maliyet/kâr-zarar yok. Açılış gelir/gider değildir. Gerçek iade yeni işlemdir; yanlış kayıt iptali özgün kaydı çizili korur. İptal normal toplamlardan dışlanır. Fatura iptali ayrı gerçek ödemeyi iptal etmez; ödeme avansa dönebilir. Bağlı tek olayın iki etkisi atomik iptal edilir. Fiziksel finans kaydı silme yok. Eski tutar/tarih dahil her alan değişikliği, oluşturan, düzenleyen, zaman, gerekçe ve önce/sonra logu; log arayüzden değiştirilemez/silinemez.

## Yönetim
Hesap/kasa ekleme-düzenleme/arşiv, IBAN/banka/sahip; kart ekleme-düzenleme/arşiv, limit/hesap kesim/son ödeme, harcama/iade/ödeme/geçmiş ve ekstre dönemi takibi. Bağlı geçmişi bozacak fiziksel silme yok. Boş kurulumla kullanılabilir; sabit örnek hesap kimlikleri yok.
Yönetici tüm yetkiler; düzenleyici görüntüle/ekle/düzenle ama iptal yok; kullanıcı görüntüle/ekle ama düzenleme/iptal yok; gözlemci yalnız görüntüleme. Kullanıcı oluşturma/rol verme/pasifleştirme, güncelleme ve iptalden geri açma sadece yönetici. Sunucu tarafı denetim; son aktif yöneticinin kaybını engelle. Gerçek kullanıcı kısa adı ayrı alan. Başka kullanıcı kimliği taklit edilemez.

## Güncelleme ve doğrulama
SQL içe aktarma istenmez; update.php yönetici oturumu ile mevcut sürümü kontrol edip eksik adımları tek tuşla uygular. Mevcut config korunur. Yedek, yazma kilidi, tekrarlanabilir geçiş, hata/başarı günlüğü. 1.0 ve 1.1 verileri korunur; belirsiz eski kişi/işlem bilgisi uydurulmaz. Dosya yükleme kullanıcı tarafından; otomatik indirme kapsam dışı.
Gerçek PHP/DB entegrasyonu, migration tekrar/arıza, rol bypass, kesin kuruş, avans/fatura eşleşmesi, iptal/düzenleme/geri açma, kart/virman ve rapor tutarlılığı testleri. Son kodla tekrar koşu. Masaüstü/tablet/telefon, login ve bütün form türleri, uzun içerik, açık klavye görünür alanı, scroll/focus/Kaydet erişimi ve hata durumları kontrol edilir. Fiziksel iOS/Android klavye testi yapılmadıysa açıkça belirtilir. Pazartesi 12 Ekim sabahı kullanıcının hostinge yükleyeceği paket hedeflenir; eksik iş sessizce tamamlandı sayılmaz.
