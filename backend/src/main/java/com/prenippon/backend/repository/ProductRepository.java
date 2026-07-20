package com.prenippon.backend.repository;

import com.prenippon.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
    Optional<Product> findBySku(String sku);
}
