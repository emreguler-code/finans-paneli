# 1.20.0 — Akıllı arama, satır içi düzenleme ve ortak hareket akışı

Kullanıcı son notları birlikte uygulamamızı, uygun davranışları cari dışındaki bölümlere taşımamızı ve yeni sürümü GitHub'a yüklememizi onayladı. Sade Netlik, yerel Inter/Lucide, mevcut font/ölçü/renk rolleri korunur. Şema 12 ve finansal API modeli değişmez.

## Bölüm bazında uygulama analizi

| Bölüm                                          | Uygulanan ortak davranış                                                                                                                                      | Bölüme özgü sınır                                                                                                                   |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Cari listesi ve hareketleri                    | Tek arama çubuğu, kaldırılabilir filtreler; hareketlerde son 30/kademeli yükleme, tek ayrıntılı tarih, satır içi tür/tutar düzenleme, varsayılan işlem girişi | Ay satırı gerçek cari devreden/artış/azalış/ay sonu Net bakiyesidir                                                                 |
| Banka ve kasa hareketleri                      | Aynı arama, kompakt satır, tarih, kademeli yükleme, satır içi düzenleme, varsayılan giriş ve yüzer +                                                          | Ay bakiyesi hesaba özgü nakit etkisinden türetilir; virmanın iki yönü kendi hesabında kalır                                         |
| Kredi kartı hareketleri                        | Aynı arama, tarih, satır, kademeli yükleme, satır içi düzenleme ve varsayılan giriş                                                                           | Ekstre/dönem içi/gelecek dönem ayrımı korunur. Ekstreye genel nakit ay toplamı eklenmez. Hedef kart sabittir                        |
| Tahsilat & Ödeme                               | Akıllı arama, kompakt satır ve tarih, kademeli yükleme, satır içi düzenleme, varsayılan giriş                                                                 | Karışık hesapların toplamı tek bir hesabın bakiyesi gibi gösterilmez                                                                |
| Raporlar                                       | Akıllı arama, kompakt hareketler, tek tarih, kademeli yükleme ve işlem düzeltme                                                                               | Varsayılan giriş formu açılmaz. Aylık giriş/çıkış analizi raporda kalır; metrikler yüklenen 30 satırdan hesaplanmaz                 |
| Araçlar                                        | Ortak arama/filtre etiketleri; kompakt satır eylem ikonları                                                                                                   | Poliçe/bakım/ödeme bağı özel kayıt modelidir. Finansal ledger'a veya yeni nakit hareketine dönüştürülmez; kendi kayıt formu korunur |
| Ödeme Planı                                    | Aynı arama/filtre etiketleri, tarih/kaynak/tür kapsamı                                                                                                        | Günlük/haftalık/aylık takvim ve mevcut ajanda görünümü korunur; hareket tablosuna çevrilmez                                         |
| Bildirim, kullanıcı, kampanya, yedek listeleri | Aynı arama bileşeni, filtre çipleri ve gerektiğinde çubuk içinden alan/tarih seçimi                                                                           | Kayıt türleri, rol izinleri ve güvenlik onayları korunur; para bakiyesi/finansal kayıt düzenleme kuralları eklenmez                 |

## Akıllı arama

Normal metin araması yanında `etiket:otomotiv`, `işlem:"Faturalı Alış"`, `ekleyen:Emre`, `durum:Açık` ve `tarih:2026-05-01..2026-05-31` gibi alan komutları kullanılır. Yazarken alan/değer önerileri çıkar; seçim çubuk içinde × ile kaldırılabilen etikete dönüşür. Aynı alandaki çoklu değerler VEYA, farklı alanlar VE'dir. Türkçe büyük/küçük harfler karşılaştırılır. Yanlış/eksik komut hata verir, önceki sonuçları sessizce değiştirmez.

Ayrı Ara/Filtrele/Sıfırla düğmeleri kaldırılır. Sırala ve CSV kendi kapsamlarında kalır. Karmaşık tarih/tutar/arşiv seçeneklerine yine arama çubuğunun içindeki aşağı okla erişilir; bu çubuğa bağlı panel, bağımsız modal/blur değildir. Tümünü temizle çubuğun içindeki × ile yapılır.

## Hareket yükleme ve bakiye

Cari/banka/kart açılışında tarih artan sıra ve en yeni 30 kayıt esas alınır, görünüm son kayda konumlanır. Önceki 30 işlem üstten eklenir; o anki satırın ekran konumu korunur. Kullanıcı başka sıralama seçerse bu sıralama korunur, sonraki dilim uygun yönde eklenir. Sayfa numaraları yoktur. Arama, CSV, rapor ve ay bakiyeleri henüz DOM'a yüklenmemiş kayıtları da kapsar.

Bu sürüm satırların aşamalı görüntülenmesini uygular. Mevcut state API tüm veriyi yüklemeye devam eder; sunucu üzerinde ağ bazlı sayfalama/akış eklendiği iddia edilmez.

Ay sonu: `Devreden + artış − azalış = Net`. Rakamlar integer kuruştan gelir. Cari için API party_effect/party_balance, banka/kasa için seçili hesabın nakit etkisi ve güncel API bakiyesi kullanılır. İptal/planlanan kayıtlar dahil edilmez. Filtre ve 30 satırlık pencere gerçek ay sonu bakiyesini değiştirmez. Etiketler “Artı/Eksi” yerine yeşil + ve kırmızı − ikonlarıdır; uzun kapsam yazısı kaldırılmıştır.

## Düzenleme ve giriş

İşlem türü, tutar, açıklama, etiket ve tarih aynı aktif satırda düzenlenir. Gereken hesap/iade/kısmi ödeme/vade alanları satır altında açılır. Eski türün uyumsuz ödeme/hesap seçimi korunmaz; yeniden seçim istenir. Mevcut/yeni etki ve zorunlu değişiklik gerekçesi gösterilir. Bakiye salt hesaplanan bilgidir. ✓ kaydeder, × iptal eder; aynı hareket id/version ile güncellenir, yeni hareket yaratılmaz. Hesap, kart, cari ve ekstre etkilerinin yeniden uygulanması mevcut atomik API yolunda kalır. Roller, eski sürüm çakışması ve log kuralları sürer. Aynı anda tek satır düzenlenir; taslak varken başka satıra/sayfaya geçiş korunur.

Aktif satırda tarih sadece bir yerde iki satırdır: 12 px/500 ana renk `15 Mayıs 2026`, 12 px/400 ikincil renk `Cuma · 16:15:22`. Alt eylem alanında yinelenmez. Mobilde de tek tarih vardır.

Giriş formu gizlenince bütün grid yüksekliği bırakılır; içerik boşalan yere yayılır. Yüzer + kapanma × düğmesinin aynı ekran koordinatındadır. Taslak DOM'da korunur, gezinme koruması devam eder. Düzenleme sırasında yeni giriş formu ayrıca açık tutulmaz.

## Doğrulama

`npm test`, sentetik API ile Chromium/WebKit 1.20 kabulü, izole PHP/MariaDB tarayıcı kontrolleri, mobil Chromium/WebKit, finansal API/migrasyon/yedekleme, kapsamlı 624 kayıtlı demo mutabakatı ve ZIP kurulum testleri çalıştırılır. Önceki 1.19 UI betikleri geçmiş sürümün kabul kaydı olarak korunur; kaldırılan sayfalama/filtre düğmeleri yerine güncel 1.20 kullanıcı akışları test edilir. Fiziksel iOS Firefox testi yapılmış sayılmaz.

GitHub sürüm/kod/paket yükleme yetkilidir. Hosting'e canlı kurulum, gerçek veri temizliği veya veritabanını sıfırlama kapsamda değildir.
