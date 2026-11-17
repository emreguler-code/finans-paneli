# Finans Paneli 1.24.0 — Doğrulama

## Yerel kabul

- Yeni kapsamla temiz `npm ci` ve `npm test`: lint, genel biçim kontrolü, derleme, 63 birim + 4 worker testi başarılı.
- Geçici, henüz Git'e eklenmemiş JS/PHP dosyalarıyla keşif denemesi: her iki dosya otomatik bulundu, biçim hataları kontrolü durdurdu; `format` sonrası kontrol geçti. Gerçek config ve tarihsel kanıt istisnaları doğrulandı; Python için desteklenmeyen ayrıştırıcı sonucu doğrulandı. Deneme dosyaları kaldırıldı.
- Prettier `--debug-check` tüm kapsamdaki dosyalarda başarılı. İlk geçişte PHP eklentisinin iki dosyada ikinci normalleştirme istemesi nedeniyle biçimlendirme iki kez uygulandı; bu dosyaların orijinal ve son PHP AST'leri Prettier'ın normalleştirilmiş ayrıştırmasıyla ayrıca eşleştirildi. Son biçimlendirme sabittir.
- İzole PHP API 134, migrasyon 34 ve yedekleme 77 kontrolü başarılı. Üç motorlu sentetik arayüz kabulü başarılı.
- Önceki 1.23.0 derlemesiyle 1440, 390 ve 320 px genişliklerde kapalı/açık satır ekranları karşılaştırıldı. Yalnız sürüm metni aynılaştırıldı; altı karşılaştırmanın tamamında ekran PNG'leri birebir aynıydı.

Kanıtlar `docs/evidence/1.24.0/` altındadır. Windows/Linux tam kabulü ve 1.24.0 GitHub yayını başarıyla tamamlandı; doğrulama kaydı aşağıdadır. Hosting yükleme/inceleme kullanıcıya aittir. Fiziksel cihaz testi yapılmış sayılmaz.

Yerel son kapsam: 232 desteklenen dosya. Yeni eklentiyle güvenlik taraması 0 bilinen açık bildirdi. Hosting ZIP içeriği, SHA-256 ve izole kurulum testi başarılı (`.qa/da04395b7bde`); gerçek config pakete dahil değil.

## GitHub yayın kabulü

[Koşu 44070786379](https://github.com/emreguler-code/finans-paneli/actions/runs/44070786379), kaynak commit `b534dbddf6ef1c24c136e61a008cf1da296ec88d`: Windows ve Linux işleri başarılı. Her iki platformda temiz kurulum, proje genelindeki biçim kontrolü, lint/derleme/birim/worker kabulü geçti. Windows Firefox/Chromium; Linux üç motorlu arayüz ve gerçek API masaüstü/mobil kabulü, finansal API/migrasyon/yedekleme, demo mutabakatı ve ZIP kurulumu başarılı. Repo hosting ZIP eşliği ve arşiv doğrulamaları geçti.

[1.24.0 Release](https://github.com/emreguler-code/finans-paneli/releases/tag/v1.24.0) yayımlandı. Tam/hosting ZIP ve iki SHA-256 dosyası yeniden indirildi; bütünlük ve checksum kontrolü başarılı, hosting ZIP repo dosyasıyla birebir aynı. Gerçek config pakette yok. Ayrıntılar [yayın doğrulama kaydında](evidence/1.24.0/release-receipt.json).

Son rapor ve AGENTS.md güncellemesinden sonra genel biçim kontrolü tekrar çalıştırıldı. Geçmiş test kanıtları değiştirilmedi; hosting bağlantısı veya canlı kurulum yapılmadı.
