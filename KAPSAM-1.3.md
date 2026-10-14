# Finans 1.3 — 12 Ekim onayları

GUNCELLEME-1.3.md işlev listesini, TEST-RAPORU-1.3.md gerçekten yapılan ve yapılamayan kontrolleri açıklar. Bu kapsam önceki 1.2 kurallarını yalnız aşağıdaki konularda günceller:

- Borç/alacak kaydında vade zorunlu değildir. Boş vade ile işlem tarihi farklıdır. Eski vade tarihleri geçişte korunur.
- Tahsilat & Ödeme yalnız gerçekleşmiş ilgili hareketleri listeler. Tarihli/gelecek/geçmiş açık kalemler, kart ödemeleri ve hesap vade sonları Ödeme Planı’nda; vadesiz açık kayıtlar ayrı bölümde.
- Plan gün/hafta/ay, dönem gezintisi, arama, filtre, sıralama ve CSV içerir. Ödeme/tahsilat/maturity ayrı; plan gerçek nakit değildir. Planın gerçekleşmesi kullanıcı formuyla yeni ödeme/tahsilat olayına bağlanır.
- Yeni borç/alacak Son Hareketler’de görünür; nakit raporunu şişirmez.
- Bütün ilgili listelerde aynı arama + filtre/sıfırla/sırala/CSV ikon-only dizilimi; alt ikon yazıları yoktur. Filtre/sıralama seçenekleri sayfaya göre değişir.
- Net cari bakiye sağ hizalı, cari türü ayrı sütun. Rakamların önceki renkleri korunur; işlem etiketi aynı satırdaki gösterilen +/− etkiyle renklenir. Global virman ve sıfır etki nötrdür.
- Beş işlem seçeneği: Alış/Satış/Tahsilat/Ödeme/Virman. Açıklama isteğe bağlı. Tutar noktalı binlik gruplama + virgüllü kuruş. Cari detayından açılan form cariyi sabitler ve başlıkta gösterir.
- Kredi kartı ödeme hesabıdır; kartla ödeme cariyi azaltabilir ve kart borcunu artırır, kasayı değiştirmez. Bankadan karta borç ödeme transferdir, cariyi yeniden kapatmaz. Eski kart olayları korunur.
- Login sorunu klavye açılışından bağımsız ilk ekran sığmasıdır. Küçük viewport kuralları ve CSS yükleme sırası düzeltildi; fiziksel iOS Firefox sonucu doğrulanmamıştır.
- Yalnız bu projenin finans. / porselen / mineral turkuaz / Inter / Lucide tasarımı kullanılır. Safir mavisi ve eski projenin marka/kuralları yoktur.
