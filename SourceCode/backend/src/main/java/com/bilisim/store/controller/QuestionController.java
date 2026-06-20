package com.bilisim.store.controller;

import com.bilisim.store.dto.AnswerQuestionRequest;
import com.bilisim.store.dto.CreateQuestionRequest;
import com.bilisim.store.dto.QuestionResponse;
import com.bilisim.store.security.SecurityUser;
import com.bilisim.store.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    /**
     * Lists questions for a specific product.
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByProduct(@PathVariable Long productId) {
        List<QuestionResponse> questions = questionService.getQuestionsByProduct(productId);
        return ResponseEntity.ok(questions);
    }

    /**
     * Lists unanswered questions for admin.
     */
    @GetMapping("/unanswered")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<QuestionResponse>> getUnansweredQuestions() {
        List<QuestionResponse> questions = questionService.getUnansweredQuestions();
        return ResponseEntity.ok(questions);
    }

    /**
     * Users post a question.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<QuestionResponse> createQuestion(
            @Valid @RequestBody CreateQuestionRequest request,
            @AuthenticationPrincipal SecurityUser securityUser) {
        
        QuestionResponse createdQuestion = questionService.createQuestion(request, securityUser.getUid());
        return new ResponseEntity<>(createdQuestion, HttpStatus.CREATED);
    }

    /**
     * Admins answer a question.
     */
    @PatchMapping("/{id}/answer")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QuestionResponse> answerQuestion(
            @PathVariable Long id,
            @Valid @RequestBody AnswerQuestionRequest request,
            @AuthenticationPrincipal SecurityUser securityUser) {
        
        QuestionResponse answeredQuestion = questionService.answerQuestion(id, request, securityUser.getUid());
        return ResponseEntity.ok(answeredQuestion);
    }
}
