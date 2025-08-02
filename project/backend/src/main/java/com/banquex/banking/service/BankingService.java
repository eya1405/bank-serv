package com.banquex.banking.service;

import com.banquex.banking.dto.AccountDto;
import com.banquex.banking.dto.TransactionDto;
import com.banquex.banking.dto.TransferRequest;
import com.banquex.banking.model.*;
import com.banquex.banking.repository.AccountRepository;
import com.banquex.banking.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BankingService {
    
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private UserService userService;
    
    public List<AccountDto> getUserAccounts(String email) {
        User user = userService.findByEmail(email);
        List<Account> accounts = accountRepository.findByOwner(user);
        
        return accounts.stream()
                .map(account -> new AccountDto(
                    account.getId(),
                    account.getAccountNumber(),
                    account.getType(),
                    account.getBalance(),
                    user.getFirstName() + " " + user.getLastName()
                ))
                .collect(Collectors.toList());
    }
    
    public AccountDto getAccount(Long accountId, String email) {
        User user = userService.findByEmail(email);
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        return new AccountDto(
            account.getId(),
            account.getAccountNumber(),
            account.getType(),
            account.getBalance(),
            user.getFirstName() + " " + user.getLastName()
        );
    }
    
    public List<TransactionDto> getUserTransactions(String email) {
        User user = userService.findByEmail(email);
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByDateDesc(user.getId());
        
        return transactions.stream()
                .map(transaction -> new TransactionDto(
                    transaction.getId(),
                    transaction.getDate(),
                    transaction.getAmount(),
                    transaction.getType(),
                    transaction.getDescription(),
                    transaction.getAccount().getId()
                ))
                .collect(Collectors.toList());
    }
    
    public List<TransactionDto> getAccountTransactions(Long accountId, String email) {
        User user = userService.findByEmail(email);
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));
        
        if (!account.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        List<Transaction> transactions = transactionRepository.findByAccountOrderByDateDesc(account);
        
        return transactions.stream()
                .map(transaction -> new TransactionDto(
                    transaction.getId(),
                    transaction.getDate(),
                    transaction.getAmount(),
                    transaction.getType(),
                    transaction.getDescription(),
                    transaction.getAccount().getId()
                ))
                .collect(Collectors.toList());
    }
    
    public BigDecimal getTotalBalance(String email) {
        User user = userService.findByEmail(email);
        BigDecimal total = accountRepository.getTotalBalanceByOwner(user);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    @Transactional
    public boolean performTransfer(TransferRequest transferRequest, String email) {
        User user = userService.findByEmail(email);
        
        Account fromAccount = accountRepository.findById(transferRequest.getFromAccountId())
                .orElseThrow(() -> new RuntimeException("Source account not found"));
        
        Account toAccount = accountRepository.findById(transferRequest.getToAccountId())
                .orElseThrow(() -> new RuntimeException("Destination account not found"));
        
        // Verify ownership
        if (!fromAccount.getOwner().getId().equals(user.getId()) || 
            !toAccount.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        // Check sufficient balance
        if (fromAccount.getBalance().compareTo(transferRequest.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance");
        }
        
        // Perform transfer
        fromAccount.setBalance(fromAccount.getBalance().subtract(transferRequest.getAmount()));
        toAccount.setBalance(toAccount.getBalance().add(transferRequest.getAmount()));
        
        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
        
        // Create transactions
        Transaction debitTransaction = new Transaction(
            LocalDateTime.now(),
            transferRequest.getAmount().negate(),
            TransactionType.DEBIT,
            transferRequest.getDescription() != null ? transferRequest.getDescription() : "Virement interne",
            fromAccount
        );
        
        Transaction creditTransaction = new Transaction(
            LocalDateTime.now(),
            transferRequest.getAmount(),
            TransactionType.CREDIT,
            transferRequest.getDescription() != null ? transferRequest.getDescription() : "Virement reçu",
            toAccount
        );
        
        transactionRepository.save(debitTransaction);
        transactionRepository.save(creditTransaction);
        
        return true;
    }
}