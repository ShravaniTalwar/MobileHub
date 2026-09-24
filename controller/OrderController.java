package com.mobilehub.controller;

import com.mobilehub.dto.CheckoutRequest;
import com.mobilehub.dto.OrderDTO;
import com.mobilehub.dto.PageResponse;
import com.mobilehub.security.UserPrincipal;
import com.mobilehub.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order placement, tracking, and management")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Place order from active cart")
    public ResponseEntity<OrderDTO> placeOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CheckoutRequest checkoutRequest) {
        return new ResponseEntity<>(orderService.placeOrder(userPrincipal.getId(), checkoutRequest), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get order history for logged-in customer")
    public ResponseEntity<PageResponse<OrderDTO>> getUserOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(orderService.getUserOrders(userPrincipal.getId(), page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details by order ID")
    public ResponseEntity<OrderDTO> getOrderById(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(userPrincipal.getId(), id));
    }

    @GetMapping("/number/{orderNumber}")
    @Operation(summary = "Get order by order number or tracking ID")
    public ResponseEntity<OrderDTO> getOrderByOrderNumber(@PathVariable String orderNumber) {
        return ResponseEntity.ok(orderService.getOrderByOrderNumber(orderNumber));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order")
    public ResponseEntity<OrderDTO> cancelOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.cancelOrder(userPrincipal.getId(), id));
    }
}
