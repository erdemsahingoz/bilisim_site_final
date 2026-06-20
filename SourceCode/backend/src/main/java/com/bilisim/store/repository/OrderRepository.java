// ============================================================
// REPOSITORY: OrderRepository
// Dosya: .../repository/OrderRepository.java
// ============================================================
package com.bilisim.store.repository;

import com.bilisim.store.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Belirli bir kullanıcının tüm siparişlerini,
     * en yeni sipariş önce gelecek şekilde sıralar.
     * Method adından JPQL üretilir:
     *   SELECT o FROM Order o WHERE o.user.id = ?1 ORDER BY o.createdAt DESC
     */
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
