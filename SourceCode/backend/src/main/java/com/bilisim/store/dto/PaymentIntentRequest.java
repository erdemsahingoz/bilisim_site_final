package com.bilisim.store.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

/** POST /api/payments/create-intent — Stripe PaymentIntent oluşturma isteği */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentIntentRequest {
    @NotNull
    @DecimalMin(value = "0.01", message = "Tutar 0'dan büyük olmalıdır")
    private BigDecimal amount;   // USD cinsinden ödeme tutarı

    private String currency = "usd"; // Para birimi (varsayılan: USD)
}
