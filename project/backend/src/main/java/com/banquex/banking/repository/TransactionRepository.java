package com.banquex.banking.repository;

import com.banquex.banking.model.Transaction;
import com.banquex.banking.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountOrderByDateDesc(Account account);
    
    @Query("SELECT t FROM Transaction t WHERE t.account.owner.id = :userId ORDER BY t.date DESC")
    List<Transaction> findByUserIdOrderByDateDesc(Long userId);
    
    @Query("SELECT t FROM Transaction t WHERE t.account.owner.id = :userId ORDER BY t.date DESC LIMIT :limit")
    List<Transaction> findRecentTransactionsByUserId(Long userId, int limit);
}