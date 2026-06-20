// ============================================================
// ENTITY: Review (Yorum)
// Dosya: .../entity/Review.java
//
// Kullanıcıların ürünlere yaptığı yıldızlı yorumlar.
// UNIQUE kısıtı: Bir kullanıcı bir ürüne yalnızca 1 yorum yapabilir.
// ============================================================
package com.bilisim.store.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
    name = "reviews",
    // Veritabanı seviyesinde UNIQUE kısıtı: aynı kullanıcı aynı ürüne 2 yorum yapamaz
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "product_id"})
)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Yorumu yapan kullanıcı
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Yorumu yapılan ürün
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer rating;   // 1-5 arası yıldız sayısı

    @Column(columnDefinition = "TEXT")
    private String comment;   // Yorum metni (boş bırakılabilir)

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
