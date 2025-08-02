package com.banquex.banking.controller;

import com.banquex.banking.dto.AccountDto;
import com.banquex.banking.dto.TransactionDto;
import com.banquex.banking.dto.TransferRequest;
import com.banquex.banking.service.BankingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/banking")
@CrossOrigin(origins = "*")
public class BankingController {
    
    @Autowired
    private BankingService bankingService;
    
    @GetMapping("/accounts")
    public ResponseEntity<List<AccountDto>> getAccounts(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<AccountDto> accounts = bankingService.getUserAccounts(email);
            return ResponseEntity.ok(accounts);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/accounts/{accountId}")
    public ResponseEntity<AccountDto> getAccount(@PathVariable Long accountId, Authentication authentication) {
        try {
            String email = authentication.getName();
            AccountDto account = bankingService.getAccount(accountId, email);
            return ResponseEntity.ok(account);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/transactions")
    public ResponseEntity<List<TransactionDto>> getTransactions(Authentication authentication) {
        try {
            String email = authentication.getName();
            List<TransactionDto> transactions = bankingService.getUserTransactions(email);
            return ResponseEntity.ok(transactions);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/accounts/{accountId}/transactions")
    public ResponseEntity<List<TransactionDto>> getAccountTransactions(@PathVariable Long accountId, Authentication authentication) {
        try {
            String email = authentication.getName();
            List<TransactionDto> transactions = bankingService.getAccountTransactions(accountId, email);
            return ResponseEntity.ok(transactions);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/balance/total")
    public ResponseEntity<Map<String, BigDecimal>> getTotalBalance(Authentication authentication) {
        try {
            String email = authentication.getName();
            BigDecimal totalBalance = bankingService.getTotalBalance(email);
            return ResponseEntity.ok(Map.of("totalBalance", totalBalance));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/transfer")
    public ResponseEntity<Map<String, Boolean>> performTransfer(@Valid @RequestBody TransferRequest transferRequest, Authentication authentication) {
        try {
            String email = authentication.getName();
            boolean success = bankingService.performTransfer(transferRequest, email);
            return ResponseEntity.ok(Map.of("success", success));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false));
        }
    }
}