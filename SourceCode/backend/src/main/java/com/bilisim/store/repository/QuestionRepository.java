// ============================================================
// REPOSITORY: QuestionRepository
// Dosya: .../repository/QuestionRepository.java
// ============================================================
package com.bilisim.store.repository;

import com.bilisim.store.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    /**
     * Belirli bir ürünün tüm sorularını, en yeni önce listeler.
     * Frontend'de detay sayfasında gösterilir.
     */
    List<Question> findByProductIdOrderByCreatedAtDesc(Long productId);

    /**
     * Henüz cevaplanmamış tüm soruları getirir.
     * Admin panelinde "bekleyen sorular" sekmesinde kullanılır.
     * answerText NULL olan → cevaplanmamış demek
     */
    List<Question> findByAnswerTextIsNullOrderByCreatedAtAsc();
}
