# 1.28.0 tasarım kontrolü

Seçilen bağımsız kompakt form, mevcut Inter/Lucide ve Sade Netlik renkleriyle uygulandı. Yeni/düzenleme aynı üst formu kullanır; hücre içi giriş ve bakiye/eylem çakışması kaldırıldı. Finansal ve metadata formları ortak alan/eylem ölçülerini paylaşır, alan içerikleri kendi anlamlarını korur.

Çalışan ekranlar Chromium, WebKit ve Firefox ile 320–1440 px aralığında kontrol edildi. İlk görsel inceleme sonrasında metadata erişimleri tek satıra toplandı, mobil tutar/açıklama uygun genişlikte eşlendi, ödeme seçimi bağlı tutar/kaynak alanlarından önce yerleştirildi ve mobil önizleme kısaltıldı. Kaynak ve kısmi tutar gibi zorunlu alanlar görünür bırakıldı; gereken ek yüksekliği kesen sabit ölçü uygulanmadı. Form kapalıyken yalnız Yeni işlem ekle satırı yer kaplar.

Personel ve tedarikçide gerekli alan sayısı temel müşteri formundan fazladır; bütün formları aynı yüksekliğe zorlamak yerine doğal genişleme kullanılır. Fiziksel cihaz/klavye testi yapılmadı; motor emülasyonu fiziksel iOS kabulü sayılmaz.

Çalışan ekran kanıtları [evidence/1.28.0](evidence/1.28.0/), kapsam [SURUM-1.28.0.md](SURUM-1.28.0.md).
