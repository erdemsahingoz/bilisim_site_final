package com.bilisim.store.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

/** POST /api/products (Admin) — Yeni ürün ekle */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {

    @NotBlank(message = "Ürün adı zorunludur")
    private String name;

    @NotBlank(message = "Açıklama zorunludur")
    private String description;

    private String details;        // Teknik özellikler (opsiyonel)

    @NotNull(message = "Fiyat zorunludur")
    @DecimalMin(value = "0.01", message = "Fiyat en az 0.01 olmalıdır")
    private BigDecimal price;

    @NotNull(message = "Stok zorunludur")
    @Min(value = 0, message = "Stok negatif olamaz")
    private Integer stock;

    private String imagePath;      // /images/ssd.png gibi yol (opsiyonel)
}
