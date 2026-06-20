package com.bilisim.store.service;

import com.bilisim.store.dto.AnswerQuestionRequest;
import com.bilisim.store.dto.CreateQuestionRequest;
import com.bilisim.store.dto.QuestionResponse;
import com.bilisim.store.entity.Product;
import com.bilisim.store.entity.Question;
import com.bilisim.store.entity.User;
import com.bilisim.store.exception.ResourceNotFoundException;
import com.bilisim.store.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final ProductService productService;
    private final UserService userService;

    @Autowired
    public QuestionService(QuestionRepository questionRepository,
                           ProductService productService,
                           UserService userService) {
        this.questionRepository = questionRepository;
        this.productService = productService;
        this.userService = userService;
    }

    /**
     * Lists all questions for a specific product.
     */
    public List<QuestionResponse> getQuestionsByProduct(Long productId) {
        return questionRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lists all unanswered questions for the admin panel.
     */
    public List<QuestionResponse> getUnansweredQuestions() {
        return questionRepository.findByAnswerTextIsNullOrderByCreatedAtAsc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new question for a product.
     */
    @Transactional
    public QuestionResponse createQuestion(CreateQuestionRequest request, String firebaseUid) {
        User user = userService.getUserByUid(firebaseUid);
        Product product = productService.getProductEntityById(request.getProductId());

        Question question = Question.builder()
                .user(user)
                .product(product)
                .questionText(request.getQuestionText())
                .build();

        Question savedQuestion = questionRepository.save(question);
        return mapToResponse(savedQuestion);
    }

    /**
     * Answers an existing question (Admin function).
     */
    @Transactional
    public QuestionResponse answerQuestion(Long questionId, AnswerQuestionRequest request, String adminUid) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Soru bulunamadı. ID: " + questionId));

        User adminUser = userService.getUserByUid(adminUid);

        // Update answer details
        question.setAnswerText(request.getAnswerText());
        question.setAnsweredBy(adminUser);
        question.setAnsweredAt(LocalDateTime.now());

        Question updatedQuestion = questionRepository.save(question);
        return mapToResponse(updatedQuestion);
    }

    /**
     * Maps a Question entity to a QuestionResponse DTO.
     */
    public QuestionResponse mapToResponse(Question question) {
        String userDisplayName = question.getUser().getDisplayName();
        if (userDisplayName == null || userDisplayName.trim().isEmpty()) {
            userDisplayName = question.getUser().getEmail().split("@")[0];
        }

        String answeredByName = null;
        if (question.getAnsweredBy() != null) {
            answeredByName = question.getAnsweredBy().getDisplayName();
            if (answeredByName == null || answeredByName.trim().isEmpty()) {
                answeredByName = question.getAnsweredBy().getEmail().split("@")[0];
            }
        }

        return QuestionResponse.builder()
                .id(question.getId())
                .userId(question.getUser().getId())
                .userDisplayName(userDisplayName)
                .productId(question.getProduct().getId())
                .questionText(question.getQuestionText())
                .answerText(question.getAnswerText())
                .answeredByName(answeredByName)
                .createdAt(question.getCreatedAt())
                .answeredAt(question.getAnsweredAt())
                .build();
    }
}
