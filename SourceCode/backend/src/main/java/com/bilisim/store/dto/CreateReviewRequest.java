package com.bilisim.store.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/** POST /api/reviews — Yeni yorum oluşturma isteği */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateReviewRequest {

    @NotNull(message = "Ürün ID zorunludur")
    private Long productId;

    @NotNull(message = "Puan zorunludur")
    @Min(value = 1, message = "Puan en az 1 olmalıdır")
    @Max(value = 5, message = "Puan en fazla 5 olabilir")
    private Integer rating;    // 1–5 yıldız

    private String comment;    // Yorum metni (boş bırakılabilir)
}
