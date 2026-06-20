package com.bilisim.store.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/** POST /api/auth/register — Firebase kullanıcısını DB'ye kaydet */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Firebase UID boş olamaz")
    private String uid;        // Firebase'den gelen benzersiz kullanıcı kimliği
    @NotBlank @Email(message = "Geçerli bir e-posta girin")
    private String email;      // Kullanıcı e-posta adresi
    private String displayName; // Görünen ad (opsiyonel, boş bırakılabilir)
}
