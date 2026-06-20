package com.bilisim.store.security;

import com.bilisim.store.entity.User;
import com.bilisim.store.repository.UserRepository;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(FirebaseTokenFilter.class);

    private final UserRepository userRepository;
    private final FirebaseApp firebaseApp;

    @Autowired
    public FirebaseTokenFilter(UserRepository userRepository, @Autowired(required = false) FirebaseApp firebaseApp) {
        this.userRepository = userRepository;
        this.firebaseApp = firebaseApp;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7).trim();
        SecurityUser securityUser = null;

        // ─── 1. MOCK TOKEN GÜVENLİK GEÇİŞİ (TESTLER VE HIZLI ÇALIŞTIRMA İÇİN) ───
        if ("mock-admin-token".equals(token)) {
            log.info("Mock Admin Token algılandı. Geliştirici modunda geçiş yapılıyor.");
            securityUser = getOrCreateMockUser("mock-admin-uid", "admin@bilisim.com", "ADMIN");
        } else if ("mock-user-token".equals(token)) {
            log.info("Mock User Token algılandı. Geliştirici modunda geçiş yapılıyor.");
            securityUser = getOrCreateMockUser("mock-user-uid", "user@bilisim.com", "USER");
        } else if (firebaseApp == null) {
            // Firebase API credentials are not set up yet
            log.error("Firebase Admin SDK başlatılmamış ve geçerli bir Mock Token sunulmadı.");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Firebase Config is missing and no mock token provided.");
            return;
        } else {
            // ─── 2. GERÇEK FIREBASE DOĞRULAMA AKIŞI ───
            try {
                FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
                String uid = decodedToken.getUid();
                String email = decodedToken.getEmail();
                String displayName = decodedToken.getName();

                // Get or create user in local PostgreSQL database to ensure relationships work
                User user = userRepository.findByUid(uid).orElseGet(() -> {
                    String role = "USER";
                    if (email != null && email.toLowerCase().contains("admin")) {
                        role = "ADMIN";
                    }
                    User newUser = User.builder()
                            .uid(uid)
                            .email(email != null ? email : uid + "@firebase.com")
                            .displayName(displayName != null ? displayName : "")
                            .role(role)
                            .createdAt(LocalDateTime.now())
                            .build();
                    return userRepository.save(newUser);
                });

                securityUser = new SecurityUser(user.getUid(), user.getEmail(), user.getRole());

            } catch (Exception e) {
                log.error("Firebase token doğrulama hatası: ", e);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Geçersiz token: " + e.getMessage());
                return;
            }
        }

        if (securityUser != null) {
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    securityUser, null, securityUser.getAuthorities()
            );
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Helper to get or create a user for testing (Mock Mode)
     */
    private SecurityUser getOrCreateMockUser(String uid, String email, String role) {
        User user = userRepository.findByUid(uid).orElseGet(() -> {
            User newUser = User.builder()
                    .uid(uid)
                    .email(email)
                    .displayName(role.equals("ADMIN") ? "Bilişim Admin" : "Test Kullanıcı")
                    .role(role)
                    .createdAt(LocalDateTime.now())
                    .build();
            return userRepository.save(newUser);
        });
        return new SecurityUser(user.getUid(), user.getEmail(), user.getRole());
    }
}
