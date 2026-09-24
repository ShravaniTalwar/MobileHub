package com.mobilehub.controller;

import com.mobilehub.dto.CreateReviewRequest;
import com.mobilehub.dto.PageResponse;
import com.mobilehub.dto.ReviewDTO;
import com.mobilehub.entity.Review;
import com.mobilehub.security.UserPrincipal;
import com.mobilehub.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Reviews", description = "Customer reviews and moderation")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get approved reviews for a specific product")
    public ResponseEntity<List<ReviewDTO>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    @PostMapping
    @Operation(summary = "Submit a review for a purchased product")
    public ResponseEntity<ReviewDTO> addReview(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateReviewRequest request) {
        return new ResponseEntity<>(reviewService.addReview(userPrincipal.getId(), request), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all reviews for moderation (Admin only)")
    public ResponseEntity<PageResponse<ReviewDTO>> getAllReviews(
            @RequestParam(required = false) Review.ReviewStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(reviewService.getAllReviews(status, page, size));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update review status (Admin only)")
    public ResponseEntity<ReviewDTO> updateReviewStatus(
            @PathVariable Long id,
            @RequestParam Review.ReviewStatus status) {
        return ResponseEntity.ok(reviewService.updateReviewStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a review (Admin only)")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
