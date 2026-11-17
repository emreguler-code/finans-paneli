# 1.22.0 — Aramadan filtreleme, başlıktan sıralama

17 Kasım 2026: Kullanıcı son notlara dayanarak yeni sürüm kodlamasını onayladı. Sade Netlik / Inter / Lucide / şema 12 ve mali hesap modeli korunur.

- Ayrı Arama alanları formu, aşağı ok ve tüm ilgili form/CSS kodu kaldırıldı. Öneri listesi kaldı; yeni bir filtre formuna dönüşmez. Odakta alan adları, yazarken alan/değer önerileri gösterilir.
- Mevcut tüm filtreler komutla erişilir. Örnekler: `etiket:otomotiv`, `işlem:"Faturalı Alış"`, `ekleyen:Emre`, `tarih:2026-05-01..2026-05-31`, `tarih:"bu ay"`, `tutar:1.000,50..5.000`, `tutar:>=1.000`, `enaz:500`, `ençok:2000`, `vade:vadesiz`, `durum:açık`, `vadedurumu:gecikmiş`, `arşiv:evet`, `iptal:hayır`. Seçenek adlarında boşluk varsa tırnak kullanılır veya öneriden seçilir. Tarihte GG.AA.YYYY de kabul edilir.
- Sayı/tarih aralıkları doğrulanır; eksik tırnak/yanlış komut kısmen uygulanmaz. Aynı alanda VEYA / alanlar arasında VE sürer. Öneri seçiminde önceden yazılmış komutlar kaybolmaz. Çipler tek tek, arama bütünü tek düğmeyle temizlenir.
- Ayrı Sırala ikonu/penceresi kaldırıldı. Cari, banka/kart ve ortak hareket tablolarında tarih/açıklama/etiket/işlem/ekleyen/hesap/tutar/bakiye başlıkları bağlama göre sıralar. Aynı başlık yön değiştirir; sadece etkin başlıkta ok ve aria-sort vardır. Metinler Türkçe, rakamlar işaretli sayısal olarak sıralanır. Tarih/tutar/bakiye ilk seçimde azalan, metin artan başlar.
- Sıralama tüm sonuçları ve CSV'yi kapsar; 30 satırlık yükleme dilimine sıkışmaz. İşlem sonrası bakiyeler kayıtla bağlı kalır. Tarih dışı sıralamada aylık bakiye ara satırları gösterilmez. Düzenleme taslağı varsa sıralama da taslak korumasını kullanır.
- Mobilde aynı başlıklar tablonun üzerinde kompakt, sarılan başlık satırında erişilebilir. Tablosuz kart/araç/takvim/bildirim/yedek listelerinde menü yerine doğrudan sıralama alan adları kullanılır; mevcut kayıt modelleri değişmez.
- Cari dizinin ve hareketlerin sıralama tercihleri ayrıldı. Cari/tür/net bakiye dizin başlıkları da tıklanabilir. Arama + CSV aynı satırda, panel içinde boşluklu ve dikey merkezlidir.
- Ana sayfada ardışık bölüm aralığı ortak token'a bağlandı; yaklaşan ödemelerde tutar/TL tek satır, satır iç boşlukları kompaktlaştırıldı.

Kontroller: mevcut ESLint/Stylelint/biçim denetimi, yeni komut/sıralama birim testleri; Windows Firefox/Chromium ve Linux Chromium/WebKit/Firefox; gerçek PHP/MariaDB arayüz akışları, API/migrasyon/yedekleme, kapsamlı demo ve ZIP kurulumu. Fiziksel iOS veya kullanıcının gerçek tarayıcı profili test edilmiş sayılmaz. Hosting'e canlı kurulum yapılmaz.
