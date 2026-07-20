package com.prenippon.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false, length = 20)
    private String status; // AVAILABLE, PREORDER, OUT_OF_STOCK, DISABLED

    private Integer quantity = 0; // Inventory stock count

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "character_name")
    private String character;

    private String scale;
    private String material;
    private String height;

    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private PreorderCampaign campaign;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public Product() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCharacter() { return character; }
    public void setCharacter(String character) { this.character = character; }

    public String getScale() { return scale; }
    public void setScale(String scale) { this.scale = scale; }

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }

    public String getHeight() { return height; }
    public void setHeight(String height) { this.height = height; }

    public PreorderCampaign getCampaign() { return campaign; }
    public void setCampaign(PreorderCampaign campaign) { this.campaign = campaign; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
