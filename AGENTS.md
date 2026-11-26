# Finans Paneli — Codex çalışma kuralları

## 17 Kasım 2026 — Kullanıcının geçerli çalışma talimatı

- Kullanıcının paylaştığı her değişiklik talebi, veri ve düzeltme önce `docs/SONRAKI-SURUM-NOTLARI.md` içinde yeni sürüm notları taslağı olarak düzenlenir. Not alma, görüşme, analiz veya tasarım onayı kodlama ya da yayın talimatı sayılmaz.
- Kullanıcı açık ve kesin uygulama talimatı vermeden kodlamaya veya notlardaki değişiklikleri uygulamaya başlanmaz. Yalnızca açıkça istenen belge düzenlemeleri kendi kapsamlarında yapılabilir; bu izin uygulama kodunu değiştirme yetkisi vermez.
- Kullanıcının açık kodlama/uygulama onayı, biriken notların yetkilendirilen kapsamını uygulama, doğrulama, GitHub deposunu güncelleme ve yeni GitHub Release yayımlama yetkisini birlikte verir. Bu kapsam için ayrıca GitHub yayın onayı istenmez. Not alma, analiz veya tasarım onayı bu yetkiyi vermez.
- Önceki sürümlere ait toplu kodlama, paketleme veya yayın onayları yalnız o sürümlerin kapsamına aittir; yeni taleplere otomatik olarak taşınmaz. Bu çalışma talimatı, aşağıdaki tarihsel onayların yeni işler için sürekli yetki olarak yorumlanmasını engeller.
- Her yayında hostinge doğrudan yüklenmeye hazır ZIP ve SHA-256 dosyası `releases/<sürüm>/` altında depoya commit edilir ve GitHub Release varlıklarına da eklenir. Gerçek yapılandırma, şifre, veri veya yedek paketlenmez.
- Hosting bağlantısı, canlıya yükleme ve canlı hosting incelemesi çalışma kapsamı dışındadır; bunları kullanıcı yürütür. Hosting erişimi istemeyin, bağlantı/dağıtım otomasyonu eklemeyin ve canlı kurulum başlatmayın. Veri silme veya sıfırlama yetkisi verilmiş sayılmaz.
- Her sürümde `npm run format:check`, Prettier’ın desteklediği tüm proje kaynaklarını/belgelerini/yapılandırmalarını (PHP dahil) otomatik keşifle kontrol eder; sabit dosya listesine dönmeyin. Yeni desteklenen dosyalar otomatik kapsanır. Özel/üretilmiş dosya istisnaları `.prettierignore`, ortak kurallar `.prettierrc.json` içindedir.
- Bu kural sonraki oturumlarda da uygulanır; kullanıcı açıkça değiştirmedikçe geçerlidir.

## Tek güncel tasarım kaynağı

- Arayüz değişikliğinden önce `docs/TASARIM-SOZLESMESI.md` okunur. Bu belge tüm önceki tasarım kararlarının yerine geçer; sürüm notları ve tarihçe otomatik talimat kaynağı değildir.
- Kullanıcı yeni karar verirse önce sonraki sürüm notlarına alınır. Uygulama talimatıyla sözleşme aynı değişiklikte güncellenir. Çelişen aktif belgeler bırakılmaz; eski karar tarihçeye taşınır.
- Ürün Türkçe, tema Sade Netlik. Finansal anlamlar, izinler, veri güvenliği ve taslak koruması görsel sadeleştirmeyle değiştirilmez.
- Sayfaya özel yeni releaseNNN.css yamaları eklemeyin. Ortak bileşen, geometri ve tema sorumluluklarını ayrı tutun.

## Güvenlik ve finansal sınırlar

- Para işaretleri, cari etkisi, nakit hareketi ve kredi kartı borcu farklıdır. Tutar, net etki, tarihsel bakiye ve güncel bakiye birbirine çevrilmez. Kampanya puanları TL bakiyesine eklenmez; araç ödemeleri mevcut hareketlere bağlanır.
- Gerçek config, veri, oturum, şifre ve yedek commit/paket edilmez. Canlı veri silme/sıfırlama veya hosting kurulumu yapılmaz. Testler izole sentetik veriler kullanır.
- Şema/migrasyonlar, atomik kayıt, id/version/gerekçe, mükerrer kayıt koruması ve yedek güvenliği korunur. PHP/API/hesaplama değişikliğinde ilgili entegrasyon ve yedek testleri zorunludur.

## Doğrulama ve yayın

- Node/npm/Python sürümleri proje sürüm dosyalarından alınır. `npm test`, gerekli API/migrasyon/yedek testleri ve güvenlik denetimi çalıştırılır.
- Arayüz değişikliği çalışan derlenmiş uygulamada geniş/dar ve mobil ekran görüntüleriyle incelenir. Yalnız taşmama yeterli değildir: okunabilirlik, kritik eylemler, uzun etiket/tutar, odak, hata ve taslak kontrol edilir.
- `npm run test:party-ui`, `npm run test:browser`, `npm run test:mobile` güncel davranışı doğrular; tarihsel testler güncel kabul diye sunulmaz. Fiziksel cihaz testi yapılmadıysa açıkça belirtilir.
- GitHub yayını Windows/Linux kabulünden sonra tamamlanır. Release varlıkları indirilerek checksum ve depodaki hosting ZIP eşliği doğrulanır. Kaynak/tag/CI/yayın kaydı raporlanır.
- Son yayımlanmış sürüm ve yeni sürümün gerçek durumu `package.json`, GitHub Release ve ilgili `docs/SURUM-<sürüm>.md`/test raporundan okunur. Planlanan sürüm yayımlanmış diye sunulmaz.

Önceki sürüm açıklamaları [tarihsel AGENTS kaydında](docs/tarihce/AGENTS-1.29.md) korunur. Bunlar yeni taleplere uygulama izni vermez.
