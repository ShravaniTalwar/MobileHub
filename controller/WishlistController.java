package com.mobilehub.controller;

import com.mobilehub.dto.ProductDTO;
import com.mobilehub.security.UserPrincipal;
import com.mobilehub.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@Tag(name = "Wishlist", description = "Customer wishlist management")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    @Operation(summary = "Get all products in the user's wishlist")
    public ResponseEntity<List<ProductDTO>> getWishlist(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(wishlistService.getWishlist(userPrincipal.getId()));
    }

    @PostMapping("/{productId}")
    @Operation(summary = "Add a product to wishlist")
    public ResponseEntity<Map<String, String>> addToWishlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long productId) {
        wishlistService.addToWishlist(userPrincipal.getId(), productId);
        return ResponseEntity.ok(Map.of("message", "Product added to wishlist successfully"));
    }

    @DeleteMapping("/{productId}")
    @Operation(summary = "Remove a product from wishlist")
    public ResponseEntity<Map<String, String>> removeFromWishlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long productId) {
        wishlistService.removeFromWishlist(userPrincipal.getId(), productId);
        return ResponseEntity.ok(Map.of("message", "Product removed from wishlist"));
    }

    @GetMapping("/check/{productId}")
    @Operation(summary = "Check if a product is in the user's wishlist")
    public ResponseEntity<Map<String, Boolean>> checkInWishlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long productId) {
        boolean exists = (userPrincipal != null) && wishlistService.isInWishlist(userPrincipal.getId(), productId);
        return ResponseEntity.ok(Map.of("inWishlist", exists));
    }
}
