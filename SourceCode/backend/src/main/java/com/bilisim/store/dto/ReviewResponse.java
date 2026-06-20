package com.bilisim.store.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/** GET /api/reviews/product/{id} yanıt nesnesi */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long userId;
    private String userDisplayName;  // Yorum yapanın görünen adı (anonim yerine)
    private Long productId;
    private Integer rating;          // 1–5 yıldız
    private String comment;
    private LocalDateTime createdAt;
}
