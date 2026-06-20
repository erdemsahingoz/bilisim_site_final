// ============================================================
// BİLİŞİM MAĞAZASI — Spring Boot Ana Sınıfı
// Dosya: SourceCode/backend/src/main/java/com/bilisim/store/StoreApplication.java
//
// @SpringBootApplication: Üç anotasyonu bir arada içerir:
//   @Configuration     → Bu sınıf Spring yapılandırma kaynağıdır
//   @EnableAutoConfiguration → Spring Boot otomatik yapılandırmayı etkinleştirir
//   @ComponentScan     → com.bilisim.store altındaki tüm bean'leri tarar
// ============================================================
package com.bilisim.store;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StoreApplication {

    /**
     * Uygulamanın giriş noktası.
     * Çalıştırmak için: mvn spring-boot:run
     */
    public static void main(String[] args) {
        SpringApplication.run(StoreApplication.class, args);
    }
}
