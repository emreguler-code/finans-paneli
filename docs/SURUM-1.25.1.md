# Finans Paneli 1.25.1

1.25.0 onaylı kapsamının son hesap doğrulamasında açılış bakiyesine karşı yapılan ödeme/tahsilatın aylık özetin önceki dönem satırında sayılmadığı görüldü. Bu eşleştirmeler devreden borç olarak ilgili satıra dahil edildi. Etiket “Devreden / önceki dönem borcuna ait” oldu. Cari/hesap/kart bakiyeleri ve ana aylık dağılım değişmez; yeni finansal işlem oluşmaz. Tedarikçi ve müşteri için regresyon testi eklendi.

[1.25.0 kapsamı](SURUM-1.25.0.md) bu sürümde bütünüyle korunur. Şema 12; mevcut kullanıcılar/veriler/config korunur. Hosting ZIP + SHA-256 `releases/1.25.1/` ve GitHub Release varlıklarındadır. Hosting yükleme/inceleme kullanıcıya aittir. Bu düzeltme, açıkça yetkilendirilen son tasarım/aylık özet uygulamasının doğrulama kapsamındadır.
