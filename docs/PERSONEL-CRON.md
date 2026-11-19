# Personel aylık hakediş cron kurulumu

1.27.0 dosyalarını mevcut config ve veriler korunarak yükledikten sonra kullanılabilir. Görev hostinge kendiliğinden kurulmaz. Canlı cron denemesi bu sürüm çalışmasında yapılmadı. Kullanıcının hosting desteğine ulaşamadığı için ertelediği kurulum kararı geçerlidir.

## Ön hazırlık

Personel bilgilerinde aylık maaş/yemek tutarlarını ve otomatik hakediş başlangıç ayını belirleyin. Varsayılan sonraki aydır; boş/sıfır kalemler ve pasif personel işlenmez. Para gönderilmez, yalnız personel cari borcu oluşur.

cPanel'deki PHP Selector 8.3 ile phpMyAdmin'in PHP 8.4.27 bilgileri, cron'un PHP CLI sürümünü veya sunucunun zaman dilimini kanıtlamaz. PHP 8.3+ ve pdo_mysql etkin CLI yolu doğrulanmadan mevcut komutu değiştirmeyin. Ekrandaki `/usr/local/bin/php` yolu ancak bu koşulları sağladığı doğrulandığında kullanılmalıdır.

## cPanel alanları

Sunucu zaman dilimine bağlı kalmamak için her beş dakikada CLI denetimi çalıştırılabilir; betik kendi içinde İstanbul tarih/saatini kontrol eder ve yalnız ayın 1–3. günlerinde 12.00–12.59 arasında, o gün bir kez hakediş denemesi yapar.

| Alan      | Değer |
| --------- | ----- |
| Dakika    | `*/5` |
| Saat      | `*`   |
| Gün       | `*`   |
| Ay        | `*`   |
| Hafta içi | `*`   |

Komut, doğrulanmış PHP CLI yolu ve gerçek kurulum diziniyle şu biçimdedir:

```text
<PHP_CLI_YOLU> /home/gulemar/public_html/finans/api/staff-cron.php
```

Bu komut üretimde finansal hakediş kaydı oluşturabilir; dosyayı tarayıcıdan çağırmayın ve deneme amacıyla sistem tarihini değiştirmeyin. cPanel cron e-postasını ilk çalışmalarda açık tutun; çıktıyı `/dev/null` ile gizlemeyin. Başarısız günün ertesi günü tekrar deneme olur; üçüncü gün sonrası eksikler kritik site bildirimidir. Betik veya PHP hiç başlayamasa bile eksik hakediş bildirimi uygulama açıldığında hesaplanır.

## Tekrarlanma ve bakım

Dönem/personel/kalem anahtarı benzersizdir. Eşzamanlı iki çağrı aynı hakedişi çoğaltmaz; bakım/yedekleme kilidiyle çakışma engellenir. Başarılı kayıtlar sonraki denemede atlanır. Bir kalemin iptali o dönem için otomatik yeniden üretim yetkisi vermez. Dönem başındaki ücret görüntüsü korunur; sonraki ücret değişiklikleri geçmiş hakedişi değiştirmez.

Üç günden sonra manuel teşhis ve düzeltme gerekir; sistem sınırsız geçmiş dönem üretmez. Genel tekrarlayan kira/abonelik işlemleri için ayrı tasarım henüz yoktur.

Yedekleme ayrı görevdir: [YEDEKLEME.md](YEDEKLEME.md). Mevcut 03.00 yedek görevini silmeyin veya personel göreviyle değiştirmeyin. Ekranda görülen eski `cron/yedek.php` yolunun varlığı yeni `api/backup-cron.php` görevinin doğru kurulduğunu kanıtlamaz; PHP yolu ve zaman dilimi doğrulandıktan sonra ilgili kılavuzla ayrı incelenmelidir.
