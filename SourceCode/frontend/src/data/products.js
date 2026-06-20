// Ürün veri kümesi
// customImage: /public/images/ klasöründen yüklenir

// Her ürünün sahip olduğu alanlar:
// id        → ürünü tanımlayan benzersiz numara
// name      → ürün adı
// description → kısa açıklama (kartlarda gösterilir)
// details   → uzun teknik açıklama (detay sayfasında gösterilir)
// price     → fiyat (sayı, 2 ondalık ile gösterilir)
// picsumId  → veri modelinde zorunlu alan (şu an customImage ile ezilmiş)
// customImage → yerel resim yolu (/public/images/ klasöründen)

export const products = [
  {
    id: 1,
    name: "Kingston NVMe SSD",
    description: "Ultra hızlı M.2 NVMe SSD – 3500 MB/s'ye kadar okuma hızı.",
    details:
      "M.2 2280 form faktörü. 500 GB, 1 TB ve 2 TB kapasitelerinde mevcuttur. TLC NAND flaş bellek. Düşük güç tüketimi. 5 yıl garanti. Oyun ve profesyonel iş yükleri için idealdir.",
    price: 89.99,
    picsumId: 0,
    customImage: "/images/ssd.png",
  },
  {
    id: 2,
    name: "Seagate BarraCuda HDD 2TB",
    description: "Toplu depolama için yüksek kapasiteli 3.5\" SATA sabit disk.",
    details:
      "7200 RPM mil hızı. SATA III 6 Gb/s arayüzü. 256 MB önbellek tamponu. Masaüstü bilgisayarlar, NAS sistemleri ve toplu yedekleme çözümleri için tasarlanmıştır.",
    price: 64.99,
    picsumId: 0,
    customImage: "/images/hdd.png",
  },
  {
    id: 3,
    name: "Corsair Vengeance DDR4 RAM",
    description: "RGB ısı yayıcılı 16 GB çift kanallı DDR4 bellek kiti.",
    details:
      "16 GB (2×8 GB) DDR4-3200 MHz CL16. Intel XMP 2.0 ve AMD EXPO desteği. iCUE yazılımı ile dinamik RGB aydınlatma. Intel LGA 1700 ve AMD AM5 platformlarıyla uyumludur.",
    price: 59.99,
    picsumId: 0,
    customImage: "/images/ram.png",
  },
  {
    id: 4,
    name: "Logitech G203 Oyuncu Mouse",
    description: "LIGHTSYNC RGB aydınlatmalı yüksek hassasiyetli optik oyuncu faresi.",
    details:
      "HERO sensör ile 8000 DPI'ya kadar, 6 programlanabilir düğme, 200–500 IPS takip hızı. LIGHTSYNC RGB alt aydınlatma. Örgülü USB kablosu. Ağırlık: 85 g.",
    price: 39.99,
    picsumId: 0,
    customImage: "/images/mouse.png",
  },
  {
    id: 5,
    name: "Mekanik RGB Klavye",
    description: "Gökkuşağı RGB arka aydınlatmalı tam boyut mekanik oyuncu klavyesi.",
    details:
      "Taktil-tıklayan mavi mekanik anahtarlar. Tam N-tuş rollover (NKRO). Eloksal alüminyum üst panel. Ayrılabilir örgülü USB-C kablosu. Anti-ghosting özelliği.",
    price: 79.99,
    picsumId: 0,
    customImage: "/images/keyboard.png",
  },
  {
    id: 6,
    name: "Gaming PC Kasa (Mid-Tower)",
    description: "RGB kasalı, temperli cam yan panelli güçlü oyuncu masaüstü bilgisayarı.",
    details:
      "Intel Core i7-13700K / AMD Ryzen 7 7700X, GeForce RTX 3070 8 GB, 32 GB DDR4-3200, 1 TB NVMe SSD. Temperli cam yan panel, 3× ARGB fan. Windows 11 uyumlu.",
    price: 1499.99,
    picsumId: 0,
    customImage: "/images/pc_case.png",
  },
  {
    id: 7,
    name: "Gaming Laptop 15\"",
    description: "144 Hz ekranlı ve harici ekran kartlı ince 15\" oyuncu dizüstü bilgisayar.",
    details:
      "Intel Core i7-12700H işlemci, NVIDIA RTX 3060 6 GB ekran kartı, 16 GB DDR5 RAM, 512 GB NVMe SSD, 15.6\" 144 Hz IPS ekran. Thunderbolt 4, Wi-Fi 6E, RGB klavye arka aydınlatması.",
    price: 1199.99,
    picsumId: 0,
    customImage: "/images/laptop.png",
  },
  {
    id: 8,
    name: "Samsung Curved Gaming Monitör 27\"",
    description: "1 ms tepki süreli 1440p 165 Hz kavisli oyuncu monitörü.",
    details:
      "2560×1440 QHD VA panel, 165 Hz uyarlamalı senkronizasyon, 1 ms MPRT. HDR400, FreeSync Premium. HDMI 2.0 ×2, DisplayPort 1.4. Yükseklik / eğim / döndürme ergonomik sehpa.",
    price: 349.99,
    picsumId: 0,
    customImage: "/images/monitor.png",
  },
];

// Tüm ürünleri döndüren fonksiyon → Home sayfasında kullanılır
export const getAllProducts = () => products;

// ID'ye göre tek ürün bulan fonksiyon → Detay sayfasında kullanılır
// Number(id) → URL'den gelen id string olduğu için sayıya çevriliyor
export const getProductById = (id) => products.find((p) => p.id === Number(id));
