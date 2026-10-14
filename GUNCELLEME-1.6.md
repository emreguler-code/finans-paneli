# Finans 1.6.0 güncellemesi

1. ZIP'i açın. `hosting/` klasörünün içeriğini finans panelinizin mevcut dizinine yükleyin. Mevcut `api/config.php` dosyanız korunur; pakette bu dosya bulunmaz.
2. Yönetici hesabınızla giriş yapıp aynı dizindeki `update.php` sayfasını açın.
3. “Güncellemeyi uygula” düğmesini kullanın. Şema 7'ye geçiş otomatik yapılır; manuel SQL importu gerekmez. Güncelleme öncesi veritabanı yedeği bu sayfadan indirilebilir.
4. Yeni sürümü açıp bir kez sayfayı yenileyin. Cari Tutar/Bakiye sırasını, filtreleri ve mobil görünümü kontrol edin.

Yönetici kullanıcı adı ve mevcut şifre değişmez. İşlem kayıtları varsayılan olarak korunur. Demo yenileme kutusu kapalıdır; yalnız varsayımsal kayıtları değiştirmek istediğinizde açın. Demo sıfırlama yönetici dışındaki deneme içeriklerini siler, yönetici girişini korur ve KMH dahil örnek hesaplar oluşturur.

KMH oluşturmak için Hesap ekle / Hesabı düzenle altında “Kredili Mevduat Hesabı” seçin; limiti ve isterseniz bankanın bildirdiği günlük yüzde oranını girin. Günlük tahmin vergisiz, valörsüz bir göstergedir; hesaba otomatik masraf işlemez. Oran boş kalabilir. “Vadeli hesap” için isteğe bağlı vade sonu girilir; vadesiz banka/kasa kartında bu alan gösterilmez.

`source/` geliştirme kaynağıdır. `docs/ekranlar/` son derlenmiş sürümün canlı test görüntülerini, `TEST-RAPORU-1.6.md` doğrulama kapsamını içerir. Hosting'inize yalnız `hosting/` içeriğini yükleyin.
