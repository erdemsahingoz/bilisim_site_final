// ============================================================
// REPOSITORY: ProductRepository
// Dosya: .../repository/ProductRepository.java
// ============================================================
package com.bilisim.store.repository;

import com.bilisim.store.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Belirli bir ürünün stok miktarını günceller.
     * @Modifying → Bu sorgunun veri değiştirdiğini belirtir (UPDATE/DELETE için zorunlu)
     * @Transactional → İşlem atomik olsun (hata halinde geri alınsın)
     * @Query → JPQL ile özel güncelleme sorgusu
     */
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.stock = :stock WHERE p.id = :id")
    int updateStock(Long id, Integer stock);
}
