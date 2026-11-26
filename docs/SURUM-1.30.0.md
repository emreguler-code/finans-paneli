# Finans 1.30.0

26 Kasım 2026 — Tek tasarım sözleşmesi ve ortak form sistemi.

## Problem ve sonuç

Tarihsel belgeler birbiriyle çelişen tasarım kuralları taşıyor, formlar aynı ölçüleri farklı hizalarda kullanıyordu. Geçerli kurallar TASARIM-SOZLESMESI.md içinde tekleştirildi. Eski iki tasarım belgesi bu kaynağa yönlenir; önceki içerikleri ve AGENTS sürüm tarihçesi docs/tarihce altında korunur. AGENTS güncel çalışma/güvenlik/doğrulama kurallarını taşır.

Ortak SelectControl Radix UI Select kullanır. Klavye, typeahead, portal ve odak dönüşü kütüphaneden gelir; yerel select aynası FormData ve zorunluluk doğrulamasını korur. Radix'in iç form kontrolü taslak karşılaştırmasına ikinci kayıt olarak alınmaz. Doğrulama görünür tetikleyiciyi işaretler/odaklar; Escape açık menüyü kapatırken taslağı korur.

Finansal işlem formunda başlık/işlem seçenekleri merkezlenir; Açıklama → Etiket → Tutar ortak giriş satırıdır. Etiket ve kontrol hatları, 44 px yükseklik ve CSS Grid/subgrid paylaşılır. Ek bilgiler, kaynak ve finansal anlamlar korunur. Etki özetindeki iç yatay çizgiler kaldırılır; rakamlar sağa hizalıdır. Mobilde tekrarlanan mevcut bakiye gizlenir, sonuç varsa korunur; kimlik ve form daha kompakt olur.

Hesap/cari/kart/araç formları ortak seçim altyapısı ve alan hizalarını kullanır. Kısa/normal/uzun alan rolleri farklı sütun payları alır; iç satırlar ana ızgaraya katılır. Kart/araç isteğe bağlı ayrıntıları yeni kayıtta kapalıdır. Oluşturma eylemleri Kaydet olarak ortaklaştırılır.

Boş nakit akışı grafiği ve boş uyarı/son işlem alanları kısalır; Tümünü göster (0) gösterilmez. Özet yoğunluğu yan sütun kırılımından ayrılır: yeterli gerçek genişlikte metrik sayısı kadar sütun, dar durumda kontrollü akış. Tarih aralığı çipleri Türkçe gösterilir.

## Korunan sınırlar

Finansal hesaplama, API, şema 12, mevcut kayıtlar, yedekleme/cron, rol izinleri, atomik işlem ve mükerrer kayıt koruması değiştirilmedi. Gerçek config/veri/yedek paketlenmez. Hosting/cron kurulumu kullanıcıya aittir.

## Kanıt

Ön inceleme: TASARIM-ENVANTERI-2026-11-26.md. Güncel ekranlar: evidence/1.30.0. Kabul: TEST-RAPORU-1.30.0.md. Görsel karşılaştırma: kökte design-qa.md. Radix yalnız altyapıdır; tüm ekranların birebir aynı alanlara zorlanması hedeflenmez.
