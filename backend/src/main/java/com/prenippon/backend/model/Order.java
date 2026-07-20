package com.prenippon.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "order_code", nullable = false, unique = true, length = 50)
    private String orderCode;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "required_deposit", nullable = false)
    private Double requiredDeposit = 0.0;

    @Column(name = "deposit_paid")
    private Double depositPaid = 0.0;

    @Column(name = "remaining_paid")
    private Double remainingPaid = 0.0;

    @Column(nullable = false, length = 20)
    private String status = "PENDING"; // PENDING, DEPOSIT_PAID, ORDERED, SHIPPING, ARRIVED, READY, COMPLETED, CANCELLED, REFUNDED

    @Column(name = "payment_status", nullable = false, length = 20)
    private String paymentStatus = "UNPAID"; // UNPAID, PARTIALLY_PAID, FULLY_PAID

    @Column(name = "recipient_name", nullable = false, length = 100)
    private String recipientName;

    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @Column(name = "shipping_address", nullable = false, columnDefinition = "TEXT")
    private String shippingAddress;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "reward_points_used")
    private Integer rewardPointsUsed = 0;

    @Column(name = "reward_points_earned")
    private Integer rewardPointsEarned = 0;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> items = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getOrderCode() { return orderCode; }
    public void setOrderCode(String orderCode) { this.orderCode = orderCode; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Double getRequiredDeposit() { return requiredDeposit; }
    public void setRequiredDeposit(Double requiredDeposit) { this.requiredDeposit = requiredDeposit; }

    public Double getDepositPaid() { return depositPaid; }
    public void setDepositPaid(Double depositPaid) { this.depositPaid = depositPaid; }

    public Double getRemainingPaid() { return remainingPaid; }
    public void setRemainingPaid(Double remainingPaid) { this.remainingPaid = remainingPaid; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getRewardPointsUsed() { return rewardPointsUsed; }
    public void setRewardPointsUsed(Integer rewardPointsUsed) { this.rewardPointsUsed = rewardPointsUsed; }

    public Integer getRewardPointsEarned() { return rewardPointsEarned; }
    public void setRewardPointsEarned(Integer rewardPointsEarned) { this.rewardPointsEarned = rewardPointsEarned; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
