package com.banquex.banking.dto;

import com.banquex.banking.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionDto {
    private Long id;
    private LocalDateTime date;
    private BigDecimal amount;
    private TransactionType type;
    private String description;
    private Long accountId;

    // Constructors
    public TransactionDto() {}

    public TransactionDto(Long id, LocalDateTime date, BigDecimal amount, TransactionType type, String description, Long accountId) {
        this.id = id;
        this.date = date;
        this.amount = amount;
        this.type = type;
        this.description = description;
        this.accountId = accountId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }
}