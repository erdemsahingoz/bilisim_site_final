package com.bilisim.store.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/** GET /api/orders/my — Sipariş geçmişi yanıt nesnesi */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private BigDecimal totalPrice;      // Toplam sipariş tutarı
    private String status;             // PENDING | PAID | CANCELLED
    private LocalDateTime createdAt;   // Sipariş tarihi
    private List<OrderItemResponse> items; // Siparişteki ürünler

    // Her bir sipariş kalemi
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private Long productId;
        private String productName;       // Ürün adı
        private String productImagePath;  // Ürün resmi
        private Integer quantity;         // Adet
        private BigDecimal unitPrice;     // Sipariş anındaki birim fiyat
    }
}
