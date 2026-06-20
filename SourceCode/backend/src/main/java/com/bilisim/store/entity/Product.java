// ============================================================
// ENTITY: Product (Ürün)
// Dosya: .../entity/Product.java
//
// Mağazadaki her ürünü temsil eder.
// "products" tablosuna eşlenir.
// ============================================================
package com.bilisim.store.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;         // Ürün adı (örn: "Kingston NVMe SSD")

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;  // Kısa açıklama (ürün kartlarında gösterilir)

    @Column(columnDefinition = "TEXT")
    private String details;      // Uzun teknik özellikler (detay sayfasında)

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;    // Fiyat — BigDecimal ile hassas ondalık

    @Column(nullable = false)
    private Integer stock;       // Stok adedi (Admin tarafından güncellenebilir)

    @Column(name = "image_path")
    private String imagePath;    // Resim yolu: "/images/ssd.png"

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // Ürünün eklenme tarihi

    // Bu ürüne yapılan yorumlar (OneToMany)
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews;

    // Bu ürüne sorulan sorular (OneToMany)
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Question> questions;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
