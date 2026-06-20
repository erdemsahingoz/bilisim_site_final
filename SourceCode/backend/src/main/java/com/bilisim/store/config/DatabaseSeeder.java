package com.bilisim.store.config;

import com.bilisim.store.entity.Product;
import com.bilisim.store.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

/**
 * Veritabanı başlatıldığında ürün tablosu boş ise 
 * test ürünlerinin otomatik yüklenmesini sağlayan seeder.
 */
@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final ProductRepository productRepository;

    @Autowired
    public DatabaseSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            log.info("Veritabanında ürün bulunamadı. Örnek ürünler yükleniyor...");

            List<Product> defaultProducts = Arrays.asList(
                Product.builder()
                    .name("Kingston NVMe SSD 1TB")
                    .description("Ultra hızlı M.2 NVMe SSD – 3500 MB/s'ye kadar okuma hızı.")
                    .details("M.2 2280 form faktörü. 1 TB kapasitede. TLC NAND flaş bellek. Okuma: 3500 MB/s, Yazma: 2900 MB/s. Düşük güç tüketimi (2.5W). 5 yıl garanti. Oyun ve profesyonel iş yükleri için idealdir.")
                    .price(new BigDecimal("89.99"))
                    .stock(50)
                    .imagePath("https://images.unsplash.com/photo-1597424216809-3ba9864aeb18?w=600&auto=format&fit=crop")
                    .build(),

                Product.builder()
                    .name("Seagate BarraCuda HDD 2TB")
                    .description("Toplu depolama için yüksek kapasiteli 3.5\" SATA sabit disk.")
                    .details("7200 RPM mil hızı. SATA III 6 Gb/s arayüzü. 256 MB önbellek tamponu. Masaüstü bilgisayarlar, NAS sistemleri ve toplu yedekleme çözümleri için tasarlanmıştır. 2 yıl garanti.")
                    .price(new BigDecimal("64.99"))
                    .stock(35)
                    .imagePath("https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&auto=format&fit=crop")
                    .build(),

                Product.builder()
                    .name("Corsair Vengeance RGB DDR4 16GB")
                    .description("RGB ısı yayıcılı 16 GB çift kanallı DDR4 bellek kiti.")
                    .details("16 GB (2×8 GB) DDR4-3200 MHz CL16. Intel XMP 2.0 ve AMD EXPO desteği. iCUE yazılımı ile dinamik RGB aydınlatma. Intel LGA 1700 ve AMD AM5 platformlarıyla uyumludur.")
                    .price(new BigDecimal("59.99"))
                    .stock(60)
                    .imagePath("https://images.unsplash.com/photo-1562976540-1502c2145851?w=600&auto=format&fit=crop")
                    .build(),

                Product.builder()
                    .name("Logitech G203 Oyuncu Mouse")
                    .description("LIGHTSYNC RGB aydınlatmalı yüksek hassasiyetli optik oyuncu faresi.")
                    .details("HERO sensör ile 8000 DPI'ya kadar, 6 programlanabilir düğme, 200–500 IPS takip hızı. LIGHTSYNC RGB alt aydınlatma. Örgülü USB kablosu. Ağırlık: 85 g. Uyumlu: Windows, macOS, Linux.")
                    .price(new BigDecimal("39.99"))
                    .stock(80)
                    .imagePath("https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&auto=format&fit=crop")
                    .build(),

                Product.builder()
                    .name("Mekanik RGB Klavye TKL")
                    .description("Gökkuşağı RGB arka aydınlatmalı ten-keyless mekanik oyuncu klavyesi.")
                    .details("Taktil-tıklayan mavi mekanik anahtarlar. Tam N-tuş rollover (NKRO). Eloksal alüminyum üst panel. Ayrılabilir örgülü USB-C kablosu. Anti-ghosting özelliği. Compact TKL tasarım.")
                    .price(new BigDecimal("79.99"))
                    .stock(40)
                    .imagePath("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop")
                    .build(),

                Product.builder()
                    .name("Gaming PC Mid-Tower Sistem")
                    .description("RGB temperli cam kasalı, yüksek performanslı oyuncu masaüstü bilgisayarı.")
                    .details("Intel Core i7-13700K, GeForce RTX 3070 8 GB, 32 GB DDR4-3200, 1 TB NVMe SSD. Temperli cam yan panel, 3× ARGB fan. Windows 11 uyumlu. Rayzen Gaming Case.")
                    .price(new BigDecimal("1499.99"))
                    .stock(10)
                    .imagePath("https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop")
                    .build(),

                Product.builder()
                    .name("Gaming Laptop 15\" 144Hz")
                    .description("144 Hz ekranlı ve harici ekran kartlı ince 15\" oyuncu dizüstü bilgisayar.")
                    .details("Intel Core i7-12700H işlemci, NVIDIA RTX 3060 6 GB ekran kartı, 16 GB DDR5 RAM, 512 GB NVMe SSD, 15.6\" 144 Hz IPS ekran. Thunderbolt 4, Wi-Fi 6E, RGB klavye arka aydınlatması.")
                    .price(new BigDecimal("1199.99"))
                    .stock(15)
                    .imagePath("https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&auto=format&fit=crop")
                    .build(),

                Product.builder()
                    .name("Samsung Curved Monitör 27\" 165Hz")
                    .description("1 ms tepki süreli 1440p 165 Hz kavisli oyuncu monitörü.")
                    .details("2560×1440 QHD VA panel, 165 Hz FreeSync Premium, 1 ms MPRT. HDR400. HDMI 2.0 ×2, DisplayPort 1.4. Yükseklik / eğim / döndürme ergonomik sehpa. 4 yıl piksel garantisi.")
                    .price(new BigDecimal("349.99"))
                    .stock(25)
                    .imagePath("https://images.unsplash.com/photo-1527443224154-c4a573d5f5e9?w=600&auto=format&fit=crop")
                    .build()
            );

            productRepository.saveAll(defaultProducts);
            log.info("8 adet örnek ürün başarıyla veritabanına eklendi.");
        } else {
            log.info("Veritabanında ürünler mevcut. Seeder atlanıyor.");
        }
    }
}
