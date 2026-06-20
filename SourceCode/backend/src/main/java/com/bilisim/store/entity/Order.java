// ============================================================
// ENTITY: Order (Sipariş)
// Dosya: .../entity/Order.java
//
// Bir kullanıcının verdiği tek bir siparişi temsil eder.
// Sipariş birden fazla ürün içerebilir (OrderItem üzerinden).
// ============================================================
package com.bilisim.store.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Siparişi veren kullanıcı (ManyToOne → her siparişin bir sahibi var)
    // @JoinColumn → "orders" tablosunda "user_id" sütunu FK olarak kullanılır
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice; // Toplam sipariş tutarı

    @Column(name = "stripe_payment_intent_id")
    private String stripePaymentIntentId; // Stripe'dan dönen "pi_xxx" ID

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING"; // PENDING | PAID | CANCELLED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Sipariş kalemleri (OneToMany)
    // CascadeType.ALL → sipariş silinince kalemleri de silinir
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
