package com.bilisim.store.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/** PATCH /api/products/{id}/stock (Admin) — Stok güncelleme isteği */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStockRequest {
    @NotNull(message = "Stok değeri zorunludur")
    @Min(value = 0, message = "Stok negatif olamaz")
    private Integer stock; // Yeni stok miktarı
}
