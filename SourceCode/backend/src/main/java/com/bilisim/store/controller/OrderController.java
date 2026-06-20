package com.bilisim.store.controller;

import com.bilisim.store.dto.CreateOrderRequest;
import com.bilisim.store.dto.OrderResponse;
import com.bilisim.store.security.SecurityUser;
import com.bilisim.store.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Lists current user's order history.
     */
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal SecurityUser securityUser) {
        List<OrderResponse> orders = orderService.getMyOrders(securityUser.getUid());
        return ResponseEntity.ok(orders);
    }

    /**
     * Places a new order after successful payment.
     */
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal SecurityUser securityUser) {
        
        OrderResponse createdOrder = orderService.createOrder(request, securityUser.getUid());
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }
}
