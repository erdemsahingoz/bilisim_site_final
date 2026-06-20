package com.bilisim.store.service;

import com.bilisim.store.dto.CreateReviewRequest;
import com.bilisim.store.dto.ReviewResponse;
import com.bilisim.store.entity.Product;
import com.bilisim.store.entity.Review;
import com.bilisim.store.entity.User;
import com.bilisim.store.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;
    private final UserService userService;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository,
                         ProductService productService,
                         UserService userService) {
        this.reviewRepository = reviewRepository;
        this.productService = productService;
        this.userService = userService;
    }

    /**
     * Lists all reviews for a product.
     */
    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Submits a review for a product.
     * Throws an error if the user has already reviewed the product.
     */
    @Transactional
    public ReviewResponse createReview(CreateReviewRequest request, String firebaseUid) {
        User user = userService.getUserByUid(firebaseUid);
        Product product = productService.getProductEntityById(request.getProductId());

        // Check if the user has already reviewed this product
        if (reviewRepository.findByUserIdAndProductId(user.getId(), product.getId()).isPresent()) {
            throw new IllegalArgumentException("Bu ürüne zaten yorum yaptınız.");
        }

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment() != null ? request.getComment() : "")
                .build();

        Review savedReview = reviewRepository.save(review);
        return mapToResponse(savedReview);
    }

    /**
     * Calculates the average rating of a product.
     */
    public Double getAverageRating(Long productId) {
        return reviewRepository.findAverageRatingByProductId(productId);
    }

    /**
     * Maps a Review entity to a ReviewResponse DTO.
     */
    public ReviewResponse mapToResponse(Review review) {
        String displayName = review.getUser().getDisplayName();
        if (displayName == null || displayName.trim().isEmpty()) {
            displayName = review.getUser().getEmail().split("@")[0]; // Fallback to email prefix
        }

        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userDisplayName(displayName)
                .productId(review.getProduct().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
