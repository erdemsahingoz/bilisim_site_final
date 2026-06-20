// ============================================================
// ENTITY: User (Kullanıcı)
// Dosya: .../entity/User.java
//
// Firebase Authentication ile senkronize çalışır.
// Her kullanıcının Firebase'den gelen benzersiz uid'si vardır.
// @Entity → JPA bu sınıfı veritabanı tablosuna eşler
// @Table  → Eşlenecek tablo adı: "users"
// ============================================================
package com.bilisim.store.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Data               // Lombok: Getter + Setter + toString + equals + hashCode
@NoArgsConstructor  // Lombok: Argümansız constructor (JPA zorunlu kılar)
@AllArgsConstructor // Lombok: Tüm alanları alan constructor
@Builder            // Lombok: Builder pattern için
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // BIGSERIAL → otomatik artan PK
    private Long id;

    @Column(nullable = false, unique = true, length = 128)
    private String uid;           // Firebase Auth UID — her kullanıcıya özgü

    @Column(nullable = false, unique = true)
    private String email;         // Kullanıcı e-posta adresi

    @Column(name = "display_name")
    private String displayName;   // Görünen ad (opsiyonel)

    @Column(nullable = false, length = 20)
    private String role;          // "USER" veya "ADMIN"

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // Hesap oluşturulma tarihi

    // Kullanıcının siparişleri (OneToMany ilişki)
    // mappedBy → Order entity'sinde "user" alanı bu ilişkiyi yönetir
    // LAZY → siparişler yalnızca erişildiğinde yüklenir (performans)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders;

    // Kullanıcının yazdığı yorumlar
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Review> reviews;

    // Kullanıcının sorduğu sorular
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Question> questions;

    // Entity kaydedilmeden önce otomatik olarak createdAt alanını doldur
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
