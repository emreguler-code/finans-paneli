# 1.25.1 doğrulama

1.25.0 tasarım ve işlev kapsamı korunur. Seçili ayda açılış bakiyesine karşı yapılan ödeme/tahsilatın devreden borç satırına dahil edilmesi düzeltildi.

- `npm test`: ESLint, Stylelint, proje genelinde Prettier, Vite; 74 birim ve 4 Sites worker testi geçti.
- Yeni regresyon aynı senaryoyu tedarikçi ve müşteri için doğrular: 8.000 kuruş açılış borcu, bu ay 10.000 kuruş yeni alış/satış ve 10.000 kuruş ödeme/tahsilat. Devreden borca 8.000, bu ayın hacmine 2.000, bu aydan açık kalan 8.000 olarak ayrılır.
- Hosting ZIP/tam paket eşliği, config/şifre hariçliği, temiz kurulum ve mutabakat testleri geçti.
- 1.25.0'ın Windows/Linux tam kabulü başarılı: [44119212287](https://github.com/emreguler-code/finans-paneli/actions/runs/44119212287). API 138, migrasyon 34 ve yedekleme 77 senaryo; Chromium/WebKit/Firefox'ta 152'şer arayüz kontrolü. Kaynak raporu [1.25.0](TEST-RAPORU-1.25.0.md).

1.25.1'in bağımsız Windows/Linux yayın sonucu tamamlandığında bu rapora eklenir. Canlı hosting veya fiziksel cihaz testi yapılmadı. Şema 12; finansal kayıt/bakiye değişmedi.
