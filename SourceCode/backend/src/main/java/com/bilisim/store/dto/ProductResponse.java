package com.bilisim.store.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/** GET /api/products ve GET /api/products/{id} yanıt nesnesi */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private String details;
    private BigDecimal price;
    private Integer stock;
    private String imagePath;
    private LocalDateTime createdAt;
}
