package com.bilisim.store.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class StripeService {

    @Value("${app.stripe.secret-key}")
    private String secretKey;

    @PostConstruct
    public void init() {
        // Initialize Stripe API key
        Stripe.apiKey = secretKey;
    }

    /**
     * Creates a Stripe PaymentIntent for the given amount (in USD/TL) and currency.
     * Stripe expects amount in cents/smallest currency unit.
     */
    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency) throws StripeException {
        // Convert to cents (e.g. 10.50 USD -> 1050 cents)
        long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency(currency != null ? currency.toLowerCase() : "usd")
                // Automatic payment methods (card, etc.)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        return PaymentIntent.create(params);
    }
}
