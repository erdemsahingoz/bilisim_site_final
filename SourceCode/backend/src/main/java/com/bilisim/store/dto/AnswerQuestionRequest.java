package com.bilisim.store.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/** PATCH /api/questions/{id}/answer (Admin) — Soruya cevap yazma isteği */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerQuestionRequest {
    @NotBlank(message = "Cevap metni boş olamaz")
    private String answerText; // Admin tarafından yazılan cevap
}
