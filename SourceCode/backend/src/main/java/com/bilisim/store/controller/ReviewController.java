package com.bilisim.store.controller;

import com.bilisim.store.dto.CreateReviewRequest;
import com.bilisim.store.dto.ReviewResponse;
import com.bilisim.store.security.SecurityUser;
import com.bilisim.store.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /**
     * Gets all reviews for a product.
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByProduct(@PathVariable Long productId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    /**
     * Submits a new review for a product (Authenticated user).
     */
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal SecurityUser securityUser) {
        
        ReviewResponse createdReview = reviewService.createReview(request, securityUser.getUid());
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
    }
}
