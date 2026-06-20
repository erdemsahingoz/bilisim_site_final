// ============================================================
// ENTITY: OrderItem (Sipariş Kalemi)
// Dosya: .../entity/OrderItem.java
//
// Bir sipariş içindeki tek bir ürün kalemini temsil eder.
// Örn: Sipariş #5 → 2 adet Kingston SSD + 1 adet Mouse
// ============================================================
package com.bilisim.store.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ait olduğu sipariş (ManyToOne)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Satın alınan ürün (ManyToOne)
    // RESTRICT → ürün silinmek istenirse hata fırlatır (sipariş geçmişini koru)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;  // Kaç adet satın alındığı

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice; // Sipariş ANINDA geçerli olan fiyat
    // Not: Sonradan fiyat değişse bile bu değer sabit kalır
}
