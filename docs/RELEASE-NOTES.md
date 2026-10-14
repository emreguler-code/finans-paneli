Finans Paneli 1.6.1 bakım sürümü. PHP 8.3+ ve MySQL/MariaDB gerektirir; hostingde Node.js gerekmez.

- Statik derlemeler PHP ve gerçek config dosyalarını içermez; PHP hosting paketi ayrı oluşturulur.
- Eski ve ulaşılamayan ekran/API kodları temizlendi. Cari, form, geçmiş ve kullanıcı bileşenleri ayrıldı.
- CSV ve para girişi ortaklaştırıldı; vadesiz hesaplar ödeme planında vade hatırlatması üretmez.
- Cari araması ve kapama hesaplamalarında tekrar taramalar azaltıldı. CSS tek girişte toplandı; mevcut tasarım korunur.
- İzole finans API, migrasyon/kurtarma ve masaüstü/mobil tarayıcı testleri Release iş akışına eklendi.

Şema 7 ve mevcut yönetici/işlem verileri korunur. Güncellemeden önce yedek alın, mevcut api/config.php dosyanızı koruyun ve ZIP içindeki GUNCELLEME.md belgesini izleyin. Demo yenileme seçeneğini kapalı bırakın.
