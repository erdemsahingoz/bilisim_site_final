package com.bilisim.store.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

/** GET /api/questions/product/{id} yanıt nesnesi */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
    private Long id;
    private Long userId;
    private String userDisplayName;   // Soran kişinin adı
    private Long productId;
    private String questionText;
    private String answerText;        // NULL → henüz cevaplanmamış
    private String answeredByName;    // Cevap veren adminin adı
    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;
}
