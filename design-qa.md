# Finans 1.12.0 tasarım doğrulaması

28 Ekim 2026 · Sonuç: **passed**. İncelenen kapsamda açık kritik/yüksek öncelikli bulgu kalmadı. Fiziksel telefon ve yardımcı teknoloji testleri yapılmış sayılmaz.

Kaynak: kullanıcının onayladığı `docs/VERI-GIRISI-VAKA-CALISMASI-2026-10-28.md` düzeni, 1.11.0 sonrası onaylı notlar ve `docs/TASARIM-ILKELERI.md`. Mobil kart için paylaşılan banka ekranının bilgi hiyerarşisi referanstır; kırmızı tema veya bankaya özgü olmayan veriler aktarılmadı. Mevcut Inter, Lucide, renk ve ölçü rolleri korunur.

## Çalışan kanıt

`.qa/design-112/final-*`: 1440/768/390/320 px cari listesi, cari/kart/işlem formu, kart detayı ve form içi tarih seçimi; masaüstü genel görünüm, genel arama önerisi/sonuçları ve 320 px genel arama. `.qa/qa112.cjs` derlenmiş uygulamada oturum açıp bu yüzeyleri kaydeder; yatay taşma veya React hatası bulunmadı. Veriler sentetiktir; testte eklenen kısmi ödeme örnekleri ekranda görünebilir. İnceleme öncesi 1.11.0 ekranları `.qa/forms-case-2026-10-28/` içinde ayrıca korunur.

## Düzeltilen bulgular

- Formların bilgi mimarisi: ortak bölüm başlıkları, kısa zorunlu temel bilgi grubu, gerektiğinde açılan ayrıntılar; kartta banka/program ilişkili satır, mobilde tek sütun. Sabit eylemler ve kaydırılabilir tek içerik alanı.
- Veri kaybı/hata: değiştirilmiş taslak için geri dönme/vazgeçme; Türkçe hata özeti, alan mesajı ve odak. Zorunlu tarih hata mesajı tetikleyici düğmeyle ilişkilidir; ikinci modal açılmaz.
- Aktif hareket çizgisi: gizli mobil hücre yerine masaüstündeki görünür tarih hücresi vurgulanır; alt eylem çizgisine birleşir, arada ayraç yoktur.
- Mobil kart yoğunluğu: limit/gösterge, iki metrik, ödeme durumu, kapalı Daha fazla. Tutar ve TL aynı parçada tutulur; 320 px'de taşma yoktur. Eylemler kendi özetinde kalır.
- Genel arama: öneri penceresi arama alanına bağlıdır; sayfayı itmez/blur eklemez. İlk denemede fazla uzayan sonuçlar yükseklik sınırı ve erişilebilir tüm sonuçlar eylemiyle düzeltildi; kategori filtre düğmesi işlevlidir.
- Ana sayfa: varsayılan dönem çipi kaldırıldı, özel dönem temizleme doğrulandı. Nakit akışı grafiği boşluğa duyarlı yayılır; alt bilgi panel altında kalır.
- Cari liste: özet iki sütunun tamamında; aşağıdaki liste/sağ sütun aynı hizadan başlar, 1,9:1 ortak oran korunur.

## Sınırlar

Kaynak finansal senaryoların anlamları mevcut modelden alınır; önizleme yeni bir muhasebe motoru değildir. Yeni kart için henüz ekstre oluşmadı durumu veri modeli değişikliği olarak uygulanmadı; mevcut zorunlu tarihler korunur. GitHub'da yayın hosting'e otomatik kurulum değildir.
