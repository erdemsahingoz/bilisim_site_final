// ============================================================
// ENTITY: Question (Soru)
// Dosya: .../entity/Question.java
//
// Kullanıcıların ürünler hakkında sorduğu sorular ve
// admin kullanıcıların verdiği cevaplar.
// answer_text NULL → cevaplanmamış soru
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
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Soruyu soran kullanıcı
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Sorunun ait olduğu ürün
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText; // Soru içeriği

    @Column(name = "answer_text", columnDefinition = "TEXT")
    private String answerText;   // Admin cevabı (NULL = cevaplanmamış)

    // Cevap veren admin kullanıcısı
    // ON DELETE SET NULL → admin silinirse bu alan NULL olur ama soru kalır
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "answered_by")
    private User answeredBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt; // Soru tarihi

    @Column(name = "answered_at")
    private LocalDateTime answeredAt; // Cevaplanma tarihi (NULL ise henüz cevaplanmadı)

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
