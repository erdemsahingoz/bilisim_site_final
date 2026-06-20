package com.bilisim.store.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${app.firebase.service-account-path}")
    private Resource serviceAccount;

    @Bean
    public FirebaseApp firebaseApp() {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }

        try {
            if (serviceAccount.exists()) {
                try (InputStream stream = serviceAccount.getInputStream()) {
                    FirebaseOptions options = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(stream))
                            .build();
                    log.info("Firebase Admin SDK başarıyla başlatıldı.");
                    return FirebaseApp.initializeApp(options);
                }
            } else {
                log.warn("Firebase Hizmet Hesabı dosyası bulunamadı: {}. Mock/Geliştirici modu etkin olabilir.", 
                        serviceAccount.getDescription());
            }
        } catch (Exception e) {
            log.error("Firebase Admin SDK başlatılırken hata oluştu: ", e);
        }
        return null;
    }
}
