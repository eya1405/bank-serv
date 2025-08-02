package com.banquex.banking.repository;

import com.banquex.banking.model.Account;
import com.banquex.banking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByOwner(User owner);
    
    @Query("SELECT SUM(a.balance) FROM Account a WHERE a.owner = :owner")
    BigDecimal getTotalBalanceByOwner(User owner);
}