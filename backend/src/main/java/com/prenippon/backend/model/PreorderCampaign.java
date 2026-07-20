package com.prenippon.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "preorder_campaigns")
public class PreorderCampaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore
    private Product product;

    @Column(name = "open_date", nullable = false)
    private LocalDateTime openDate;

    @Column(name = "close_date", nullable = false)
    private LocalDateTime closeDate;

    @Column(name = "release_date", nullable = false)
    private String releaseDate; // Q4 2026, December 2026, etc.

    @Column(name = "deposit_percentage", nullable = false)
    private Double depositPercentage = 30.0;

    @Column(name = "deposit_amount", nullable = false)
    private Double depositAmount;

    @Column(name = "limit_quantity", nullable = false)
    private Integer limitQuantity;

    @Column(name = "ordered_quantity")
    private Integer orderedQuantity = 0;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE"; // UPCOMING, ACTIVE, CLOSED, COMPLETED

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public LocalDateTime getOpenDate() { return openDate; }
    public void setOpenDate(LocalDateTime openDate) { this.openDate = openDate; }

    public LocalDateTime getCloseDate() { return closeDate; }
    public void setCloseDate(LocalDateTime closeDate) { this.closeDate = closeDate; }

    public String getReleaseDate() { return releaseDate; }
    public void setReleaseDate(String releaseDate) { this.releaseDate = releaseDate; }

    public Double getDepositPercentage() { return depositPercentage; }
    public void setDepositPercentage(Double depositPercentage) { this.depositPercentage = depositPercentage; }

    public Double getDepositAmount() { return depositAmount; }
    public void setDepositAmount(Double depositAmount) { this.depositAmount = depositAmount; }

    public Integer getLimitQuantity() { return limitQuantity; }
    public void setLimitQuantity(Integer limitQuantity) { this.limitQuantity = limitQuantity; }

    public Integer getOrderedQuantity() { return orderedQuantity; }
    public void setOrderedQuantity(Integer orderedQuantity) { this.orderedQuantity = orderedQuantity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
