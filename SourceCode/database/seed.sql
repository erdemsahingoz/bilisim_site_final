-- ============================================================
-- BİLİŞİM MAĞAZASI — Örnek Ürün Verileri (Seed)
-- Dosya: SourceCode/database/seed.sql
--
-- Önce schema.sql çalıştırılmalıdır!
-- Çalıştırma:
--   psql -U postgres -d bilisim_db -f seed.sql
--
-- Not: image_path alanında Unsplash CDN URL'leri kullanılmıştır
--      böylece frontend'de ek dosya gerekmez.
-- ============================================================

-- Mevcut ürünleri temizle (tekrar çalıştırılabilir olması için)
TRUNCATE TABLE order_items, orders, reviews, questions, products RESTART IDENTITY CASCADE;

-- ──────────────────────────────────────────────────
-- PRODUCTS TABLOSUNA 8 ÜRÜN EKLENİYOR
-- ──────────────────────────────────────────────────
INSERT INTO products (name, description, details, price, stock, image_path) VALUES

-- 1. Kingston NVMe SSD
(
  'Kingston NVMe SSD 1TB',
  'Ultra hızlı M.2 NVMe SSD – 3500 MB/s''ye kadar okuma hızı.',
  'M.2 2280 form faktörü. 1 TB kapasitede. TLC NAND flaş bellek. Okuma: 3500 MB/s, Yazma: 2900 MB/s. Düşük güç tüketimi (2.5W). 5 yıl garanti. Oyun ve profesyonel iş yükleri için idealdir.',
  89.99,
  50,
  'https://images.unsplash.com/photo-1597424216809-3ba9864aeb18?w=600&auto=format&fit=crop'
),

-- 2. Seagate BarraCuda HDD
(
  'Seagate BarraCuda HDD 2TB',
  'Toplu depolama için yüksek kapasiteli 3.5" SATA sabit disk.',
  '7200 RPM mil hızı. SATA III 6 Gb/s arayüzü. 256 MB önbellek tamponu. Masaüstü bilgisayarlar, NAS sistemleri ve toplu yedekleme çözümleri için tasarlanmıştır. 2 yıl garanti.',
  64.99,
  35,
  'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&auto=format&fit=crop'
),

-- 3. Corsair Vengeance DDR4 RAM
(
  'Corsair Vengeance RGB DDR4 16GB',
  'RGB ısı yayıcılı 16 GB çift kanallı DDR4 bellek kiti.',
  '16 GB (2×8 GB) DDR4-3200 MHz CL16. Intel XMP 2.0 ve AMD EXPO desteği. iCUE yazılımı ile dinamik RGB aydınlatma. Intel LGA 1700 ve AMD AM5 platformlarıyla uyumludur.',
  59.99,
  60,
  'https://images.unsplash.com/photo-1562976540-1502c2145851?w=600&auto=format&fit=crop'
),

-- 4. Logitech G203 Oyuncu Mouse
(
  'Logitech G203 Oyuncu Mouse',
  'LIGHTSYNC RGB aydınlatmalı yüksek hassasiyetli optik oyuncu faresi.',
  'HERO sensör ile 8000 DPI''ya kadar, 6 programlanabilir düğme, 200–500 IPS takip hızı. LIGHTSYNC RGB alt aydınlatma. Örgülü USB kablosu. Ağırlık: 85 g. Uyumlu: Windows, macOS, Linux.',
  39.99,
  80,
  'https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&auto=format&fit=crop'
),

-- 5. Mekanik RGB Klavye
(
  'Mekanik RGB Klavye TKL',
  'Gökkuşağı RGB arka aydınlatmalı ten-keyless mekanik oyuncu klavyesi.',
  'Taktil-tıklayan mavi mekanik anahtarlar. Tam N-tuş rollover (NKRO). Eloksal alüminyum üst panel. Ayrılabilir örgülü USB-C kablosu. Anti-ghosting özelliği. Compact TKL tasarım.',
  79.99,
  40,
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop'
),

-- 6. Gaming PC Kasa Sistemi
(
  'Gaming PC Mid-Tower Sistem',
  'RGB temperli cam kasalı, yüksek performanslı oyuncu masaüstü bilgisayarı.',
  'Intel Core i7-13700K, GeForce RTX 3070 8 GB, 32 GB DDR4-3200, 1 TB NVMe SSD. Temperli cam yan panel, 3× ARGB fan. Windows 11 uyumlu. Rayzen Gaming Case.',
  1499.99,
  10,
  'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop'
),

-- 7. Gaming Laptop
(
  'Gaming Laptop 15" 144Hz',
  '144 Hz ekranlı ve harici ekran kartlı ince 15" oyuncu dizüstü bilgisayar.',
  'Intel Core i7-12700H işlemci, NVIDIA RTX 3060 6 GB ekran kartı, 16 GB DDR5 RAM, 512 GB NVMe SSD, 15.6" 144 Hz IPS ekran. Thunderbolt 4, Wi-Fi 6E, RGB klavye arka aydınlatması.',
  1199.99,
  15,
  'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop'
),

-- 8. Samsung Curved Gaming Monitör
(
  'Samsung Curved Monitör 27" 165Hz',
  '1 ms tepki süreli 1440p 165 Hz kavisli oyuncu monitörü.',
  '2560×1440 QHD VA panel, 165 Hz FreeSync Premium, 1 ms MPRT. HDR400. HDMI 2.0 ×2, DisplayPort 1.4. Yükseklik / eğim / döndürme ergonomik sehpa. 4 yıl piksel garantisi.',
  349.99,
  25,
  'https://images.unsplash.com/photo-1527443224154-c4a573d5f5e9?w=600&auto=format&fit=crop'
);

-- ──────────────────────────────────────────────────
-- Eklenen ürünleri doğrula
-- ──────────────────────────────────────────────────
SELECT id, name, price, stock FROM products ORDER BY id;
