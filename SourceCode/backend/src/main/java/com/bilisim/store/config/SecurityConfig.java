package com.bilisim.store.config;

import com.bilisim.store.security.FirebaseTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // @PreAuthorize vb. anotasyonları etkinleştirir
public class SecurityConfig {

    private final FirebaseTokenFilter firebaseTokenFilter;

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Autowired
    public SecurityConfig(FirebaseTokenFilter firebaseTokenFilter) {
        this.firebaseTokenFilter = firebaseTokenFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CORS ayarlarını uygula
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // CSRF'yi devre dışı bırak (Stateless JWT/Token tabanlı sistem olduğu için)
            .csrf(csrf -> csrf.disable())
            // Session yönetimini STATELESS yap (Sunucu tarafında oturum tutulmasın)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Endpoint yetkilendirme kuralları
            .authorizeHttpRequests(auth -> auth
                // 1. Kayıt ve Kimlik Doğrulama
                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                
                // 2. Ürünler (Okuma herkese açık, yazma/güncelleme ADMIN)
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/products").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/products/*/stock").hasRole("ADMIN")
                
                // 3. Yorumlar (Okuma herkese açık, yazma USER/ADMIN)
                .requestMatchers(HttpMethod.GET, "/api/reviews/product/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/reviews").hasAnyRole("USER", "ADMIN")
                
                // 4. Sorular (Okuma herkese açık, sorma USER, cevaplama ADMIN)
                .requestMatchers(HttpMethod.GET, "/api/questions/product/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/questions/unanswered").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/questions").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/questions/*/answer").hasRole("ADMIN")
                
                // 5. Siparişler ve Ödeme (Sadece giriş yapmış kullanıcılar)
                .requestMatchers("/api/orders/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/payments/**").hasAnyRole("USER", "ADMIN")
                
                // Kalan tüm istekler kimlik doğrulaması gerektirsin
                .anyRequest().authenticated()
            );

        // FirebaseTokenFilter'ı standart Spring Security UsernamePasswordAuthenticationFilter'dan önce ekle
        http.addFilterBefore(firebaseTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList(allowedOrigins));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        configuration.setExposedHeaders(Collections.singletonList("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
