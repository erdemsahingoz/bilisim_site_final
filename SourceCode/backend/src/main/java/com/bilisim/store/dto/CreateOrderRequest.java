package com.bilisim.store.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

/** POST /api/orders — Sipariş oluşturma isteği */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotEmpty(message = "Sipariş en az bir ürün içermelidir")
    private List<OrderItemRequest> items; // Sipariş kalemleri listesi

    private String stripePaymentIntentId; // Ödeme tamamlandıktan sonra frontend gönderir

    // İç sınıf: Her bir sipariş kalemi
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest {
        @NotNull
        private Long productId;   // Satın alınacak ürünün ID'si

        @NotNull
        @Min(value = 1, message = "Adet en az 1 olmalıdır")
        private Integer quantity; // Kaç adet satın alınıyor
    }
}
