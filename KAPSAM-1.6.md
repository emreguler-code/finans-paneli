# Finans 1.6.0 — onaylı kapsam

13 Ekim 2026. Kullanıcı güncel notların uygulanmasını, yeni sürüm paketini ve çalışan son sürümden gerçek ekran görüntüsü kontrolünü istedi. Harici hosting yayını yapılmaz.

- Cari sütunları Tarih / Açıklama / Etiket / İşlem-Ekleyen / Tutar / Bakiye. Açıklama yalnız girilen metindir. Tutar brüt işlem toplamının cari yönünü, Bakiye net tarihsel etkiyi gösterir. Kısmi peşin tutar ayrıca belirtilir; rapor nakit hesabı değiştirilmez.
- Cari başlığındaki aşağı ok mevcut beyaz kutuyu genişletir; ayrı bilgi penceresi açmaz. Giriş kutuları ve liste etiketleri cari/hesap bağlamındaki yönle uyumludur.
- Normal masaüstü satırlarının 18 px üst-alt boşluğu korunur. Genişleyen aksiyon alanı kompakt, tek yüzeydir; iç ayırıcı yoktur, sol belirteç iki bölümü kesintisiz kapsar. Sabit işlem etiketi genişlikleri ekleyen kişinin başlangıcını hizalar.
- Hesap/kart hareketlerine işlem ve ekleyen filtreleri, tutarı düşükten yükseğe sıralama; envantere sıralama/CSV geri gelir. Saat ve belge numarası formda yeniden erişilebilir. Yeni saat Türkiye saatine göre atanır.
- Hesap araması başlıkta + ikonunun solundadır. Arşiv filtresi yanındaki ikonla sayfa içinde aşağı açılır. Hesap bilgisi/düzenleme ikonları aktif banka/kasa kartı üzerindedir. Mobil carousel ve hareket araçları daha kompakttır. Kredi kartı ikonları için ayrıca konum değişikliği yapılmadı.
- Vadesiz banka/kasa kartında boş vade sonu alanı yoktur. Vadeli hesap ve KMH türleri eklenir. KMH limit barı kullanılan ve kullanılabilir krediyi gösterir; kullanılmamış kredi nakit bakiyesi değildir.
- KMH ayarlarında isteğe bağlı günlük faiz oranı (%) vardır. Tahmin bugünkü kullanılan kredi × girilen günlük oran / 100 üzerinden bir gün içindir, kuruşa yuvarlanır. Vergi/valör dahil değildir; gerçek banka faizinin yerine geçmez ve gider kaydı oluşturmaz. Eksik oran için tutar uydurulmaz. Demo oranı örnektir, güncel banka oranı değildir.
- Ortak uyarı bileşeni KMH başlık uyarısını ve merkezde açılan bildirim listesini besler. Mevcut ödeme/tahsilat/vade, KMH ve ekstre kontrol bilgileri tek listede toplanır. Kullanıcının yarım kalan bildirim cümlesinden başka otomasyon kapsamı çıkarılmaz.
- Banka ve program işaretleri kredi kartında birlikte gösterilir. Inter dosyaları pakette yerel sunulur; yazı tipi veya ölçek değiştirilmez.
- Şema 7, hesaplara credit_limit_cents ve daily_interest_rate ekler. Yönetici kimliği/şifresi ve kurulum yapılandırması korunur. Güncellemede demo temizliği varsayılan kapalıdır; isteğe bağlıdır.
- Mobil düzeltmeler: miktar hücrelerinin 30 px eski son-kolon genişliği kaldırılır, cari başlık bakiyesi/ikonları çakışmaz, iç içe pencereler kapanınca kaydırma kilidi çözülür, arama kutuları 16 px ile iOS odak zoom riskini azaltır.

Doğrulama: gerçek PHP/MariaDB ve yerel sunucudan servis edilen derlenmiş uygulama. Fiziksel iOS Firefox testi yapılmadı; ekran görüntüleri Chromium 150 ve 320/390/768 px tarayıcı boyutlarına aittir.
