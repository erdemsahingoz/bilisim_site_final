package com.bilisim.store.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/** POST /api/questions — Yeni soru oluşturma isteği */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateQuestionRequest {

    @NotNull(message = "Ürün ID zorunludur")
    private Long productId;

    @NotBlank(message = "Soru metni boş olamaz")
    private String questionText; // Sorunun içeriği
}
