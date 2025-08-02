package com.banquex.banking.dto;

import com.banquex.banking.model.AccountType;
import java.math.BigDecimal;

public class AccountDto {
    private Long id;
    private String accountNumber;
    private AccountType type;
    private BigDecimal balance;
    private String owner;

    // Constructors
    public AccountDto() {}

    public AccountDto(Long id, String accountNumber, AccountType type, BigDecimal balance, String owner) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.type = type;
        this.balance = balance;
        this.owner = owner;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public AccountType getType() { return type; }
    public void setType(AccountType type) { this.type = type; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
}