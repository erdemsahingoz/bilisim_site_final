package com.bilisim.store.service;

import com.bilisim.store.dto.CreateProductRequest;
import com.bilisim.store.dto.ProductResponse;
import com.bilisim.store.dto.UpdateStockRequest;
import com.bilisim.store.entity.Product;
import com.bilisim.store.exception.ResourceNotFoundException;
import com.bilisim.store.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Lists all products.
     */
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Gets a product by its ID as a Response DTO.
     */
    public ProductResponse getProductById(Long id) {
        return mapToResponse(getProductEntityById(id));
    }

    /**
     * Gets a product entity by its ID (internal use).
     */
    public Product getProductEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ürün bulunamadı. ID: " + id));
    }

    /**
     * Creates a new product (Admin function).
     */
    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .details(request.getDetails())
                .price(request.getPrice())
                .stock(request.getStock())
                .imagePath(request.getImagePath() != null ? request.getImagePath() : "")
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    /**
     * Updates the stock of a product (Admin function).
     */
    @Transactional
    public ProductResponse updateStock(Long id, UpdateStockRequest request) {
        Product product = getProductEntityById(id);
        product.setStock(request.getStock());
        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    /**
     * Maps a Product entity to a ProductResponse DTO.
     */
    public ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .details(product.getDetails())
                .price(product.getPrice())
                .stock(product.getStock())
                .imagePath(product.getImagePath())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
