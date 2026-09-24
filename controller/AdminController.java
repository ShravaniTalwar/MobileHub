package com.mobilehub.controller;

import com.mobilehub.dto.*;
import com.mobilehub.entity.Inventory;
import com.mobilehub.entity.Order;
import com.mobilehub.service.AdminService;
import com.mobilehub.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Administrator dashboard, orders, inventory, and user management")
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;

    public AdminController(AdminService adminService, OrderService orderService) {
        this.adminService = adminService;
        this.orderService = orderService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard statistics, charts data, and KPI cards")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/orders")
    @Operation(summary = "Get all customer orders with status filter and pagination")
    public ResponseEntity<PageResponse<OrderDTO>> getAllOrders(
            @RequestParam(required = false) Order.OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(orderService.getAllOrders(status, page, size));
    }

    @PutMapping("/orders/{id}/status")
    @Operation(summary = "Update order status and tracking details")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request));
    }

    @GetMapping("/inventory")
    @Operation(summary = "Get inventory status with optional stock status filter")
    public ResponseEntity<PageResponse<Inventory>> getInventory(
            @RequestParam(required = false) Inventory.StockStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(adminService.getInventory(status, page, size));
    }

    @PutMapping("/inventory")
    @Operation(summary = "Update stock level and threshold for a product")
    public ResponseEntity<Inventory> updateInventory(@Valid @RequestBody InventoryUpdateDTO dto) {
        return ResponseEntity.ok(adminService.updateInventory(dto));
    }

    @GetMapping("/customers")
    @Operation(summary = "Get all registered customers")
    public ResponseEntity<PageResponse<UserProfileDTO>> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        return ResponseEntity.ok(adminService.getAllCustomers(page, size));
    }

    @PutMapping("/customers/{id}/status")
    @Operation(summary = "Enable or disable a customer account")
    public ResponseEntity<UserProfileDTO> updateCustomerStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {
        return ResponseEntity.ok(adminService.updateCustomerStatus(id, active));
    }
}
