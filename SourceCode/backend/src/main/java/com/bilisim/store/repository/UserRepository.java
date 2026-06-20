// ============================================================
// REPOSITORY: UserRepository
// Dosya: .../repository/UserRepository.java
//
// Spring Data JPA — JpaRepository tüm CRUD metodlarını sağlar:
//   save(), findById(), findAll(), deleteById() vb.
// Buradaki metodlar JPQL veya method-name sorgularıdır.
// ============================================================
package com.bilisim.store.repository;

import com.bilisim.store.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // Spring'in bu arayüzü bir Repository bean'i olarak tanımasını sağlar
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Firebase UID'sine göre kullanıcı bul.
     * Adından otomatik JPQL üretilir: SELECT u FROM User u WHERE u.uid = ?1
     */
    Optional<User> findByUid(String uid);

    /**
     * E-posta adresine göre kullanıcı bul.
     */
    Optional<User> findByEmail(String email);

    /**
     * Bu UID ile kayıtlı kullanıcı var mı?
     * Kayıt sırasında tekrar kayıt engellemek için kullanılır.
     */
    boolean existsByUid(String uid);
}
