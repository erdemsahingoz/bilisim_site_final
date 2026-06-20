package com.bilisim.store.service;

import com.bilisim.store.dto.CreateOrderRequest;
import com.bilisim.store.dto.OrderResponse;
import com.bilisim.store.entity.Order;
import com.bilisim.store.entity.OrderItem;
import com.bilisim.store.entity.Product;
import com.bilisim.store.entity.User;
import com.bilisim.store.repository.OrderRepository;
import com.bilisim.store.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final ProductService productService;

    @Autowired
    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserService userService,
                        ProductService productService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userService = userService;
        this.productService = productService;
    }

    /**
     * Retrieves all orders for the current user.
     */
    public List<OrderResponse> getMyOrders(String firebaseUid) {
        User user = userService.getUserByUid(firebaseUid);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new order.
     * Validates stock for all items, decreases stock, and saves order details.
     */
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, String firebaseUid) {
        User user = userService.getUserByUid(firebaseUid);

        Order order = Order.builder()
                .user(user)
                .stripePaymentIntentId(request.getStripePaymentIntentId())
                .status("PAID") // By the time frontend makes this call, payment was captured by Stripe
                .totalPrice(BigDecimal.ZERO)
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal grandTotal = BigDecimal.ZERO;

        for (CreateOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productService.getProductEntityById(itemReq.getProductId());

            // Stock check
            if (product.getStock() < itemReq.getQuantity()) {
                throw new IllegalArgumentException("Yetersiz stok: " + product.getName() + 
                        " (Mevcut: " + product.getStock() + ", İstenen: " + itemReq.getQuantity() + ")");
            }

            // Deduct stock
            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);

            // Compute subtotal
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            grandTotal = grandTotal.add(itemTotal);

            // Create OrderItem
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();

            orderItems.add(orderItem);
        }

        order.setTotalPrice(grandTotal);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    /**
     * Maps an Order entity to an OrderResponse DTO.
     */
    public OrderResponse mapToResponse(Order order) {
        List<OrderResponse.OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderResponse.OrderItemResponse.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .productImagePath(item.getProduct().getImagePath())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }
}
