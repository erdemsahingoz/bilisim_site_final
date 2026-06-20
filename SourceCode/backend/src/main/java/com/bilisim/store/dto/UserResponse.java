package com.bilisim.store.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/** GET /api/auth/register yanıtı — kayıt olan kullanıcının bilgileri */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String uid;          // Firebase UID
    private String email;
    private String displayName;
    private String role;         // "USER" veya "ADMIN"
    private LocalDateTime createdAt;
}
