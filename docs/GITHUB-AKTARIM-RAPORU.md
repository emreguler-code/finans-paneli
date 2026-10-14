# 1.6.0 kaynak aktarımı — 14 Ekim 2026

Kaynak: yayımlanan finans-v1.6.0 paketinin source dizini. Finansal hesaplama ve arayüz davranışı değiştirilmedi.

- database/sample-data.sql çıkarıldı; gerçek veritabanı, yerel yapılandırma, yönetici hesabı/parolası ve çalışma zamanı dosyaları aktarılmadı.
- Şema/migrasyonlar ve sentetik test fixture'ları korundu. İsteğe bağlı demo üretme kodundaki kişi adı anonim örnek adla değiştirildi; ilgili tarihsel render beklentisi eşlendi.
- Eski AGENTS.md güncel çalışma kurallarıyla değiştirildi; tasarım ilkeleri, Codex devir notları ve depoya uygun README eklendi.
- npm test ve npm run test:unit komutları eklendi. Bağımlılıklar değiştirilmedi.
- Yeniden doğrulama: derleme başarılı, 18 birim testi ve 4 Sites worker testi başarılı; 9 PHP dosyası sözdizimi kontrolü başarılı.
- API entegrasyonu ve tarayıcı testleri bu kaynak aktarımı için yeniden çalıştırılmadı. TEST-RAPORU-1.6.md önceki sürüm testlerini belgeler.
- GitHub yüklemesi ve Codex Cloud ortam bağlantısı bu dosyanın hazırlanması sırasında henüz tamamlanmadı. Hosting dağıtımı yapılmadı.
