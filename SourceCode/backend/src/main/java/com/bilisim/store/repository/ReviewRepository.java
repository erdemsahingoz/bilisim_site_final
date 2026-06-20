// ============================================================
// REPOSITORY: ReviewRepository
// Dosya: .../repository/ReviewRepository.java
// ============================================================
package com.bilisim.store.repository;

import com.bilisim.store.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * Belirli bir ürünün tüm yorumlarını, en yeni önce listeler.
     */
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);

    /**
     * Belirli bir kullanıcının belirli bir ürüne yorum yapıp yapmadığını kontrol et.
     * Kullanıcı tekrar yorum yaparken kullanılır (duplicate check).
     */
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

    /**
     * Bir ürünün ortalama yıldız puanını hesapla.
     * @Query ile özel JPQL yazılır.
     * AVG() → ortalama rating, NULL ise 0 döner
     */
    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM Review r WHERE r.product.id = :productId")
    Double findAverageRatingByProductId(Long productId);
}
