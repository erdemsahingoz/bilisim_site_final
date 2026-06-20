package com.bilisim.store.controller;

import com.bilisim.store.dto.PaymentIntentRequest;
import com.bilisim.store.service.StripeService;
import com.stripe.model.PaymentIntent;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final StripeService stripeService;

    @Autowired
    public PaymentController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    /**
     * Creates a Stripe PaymentIntent and returns the client secret.
     */
    @PostMapping("/create-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@Valid @RequestBody PaymentIntentRequest request) {
        try {
            PaymentIntent paymentIntent = stripeService.createPaymentIntent(
                    request.getAmount(),
                    request.getCurrency()
            );

            Map<String, String> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("id", paymentIntent.getId());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
