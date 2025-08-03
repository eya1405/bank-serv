import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Account, Transaction, TransactionType, AccountType, TransferRequest } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class BankingService {
  private mockAccounts: Account[] = [
    {
      id: 1,
      accountNumber: '****1234',
      type: AccountType.CHECKING,
      balance: 9200,
      owner: 'Karim Benali'
    },
    {
      id: 2,
      accountNumber: '****5678',
      type: AccountType.SAVINGS,
      balance: 3200,
      owner: 'Karim Benali'
    }
  ];

  private mockTransactions: Transaction[] = [
    {
      id: 1,
      date: new Date('2025-07-08'),
      amount: -50,
      type: TransactionType.DEBIT,
      description: 'Retrait GAB',
      accountId: 1
    },
    {
      id: 2,
      date: new Date('2025-07-07'),
      amount: 500,
      type: TransactionType.CREDIT,
      description: 'Virement reçu',
      accountId: 1
    },
    {
      id: 3,
      date: new Date('2025-07-05'),
      amount: -100,
      type: TransactionType.DEBIT,
      description: 'Paiement carte',
      accountId: 1
    },
    {
      id: 4,
      date: new Date('2025-07-04'),
      amount: -100,
      type: TransactionType.DEBIT,
      description: 'Débit automatique',
      accountId: 2
    }
  ];

  getAccounts(): Observable<Account[]> {
    return of(this.mockAccounts).pipe(delay(500));
  }

  getAccount(id: number): Observable<Account | undefined> {
    const account = this.mockAccounts.find(acc => acc.id === id);
    return of(account).pipe(delay(300));
  }

  getTransactions(accountId?: number): Observable<Transaction[]> {
    let transactions = this.mockTransactions;
    if (accountId) {
      transactions = transactions.filter(t => t.accountId === accountId);
    }
    return of(transactions).pipe(delay(400));
  }

  getRecentTransactions(limit: number = 4): Observable<Transaction[]> {
    const recent = this.mockTransactions
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
    return of(recent).pipe(delay(300));
  }

  getTotalBalance(): Observable<number> {
    const total = this.mockAccounts.reduce((sum, account) => sum + account.balance, 0);
    return of(total).pipe(delay(200));
  }

  performTransfer(transfer: TransferRequest): Observable<boolean> {
    // Simulation d'un virement interne
    const fromAccount = this.mockAccounts.find(acc => acc.id === transfer.fromAccountId);
    const toAccount = this.mockAccounts.find(acc => acc.id === transfer.toAccountId);

    if (fromAccount && toAccount && fromAccount.balance >= transfer.amount) {
      // Mise à jour des soldes
      fromAccount.balance -= transfer.amount;
      toAccount.balance += transfer.amount;

      // Ajout des transactions
      const debitTransaction: Transaction = {
        id: this.mockTransactions.length + 1,
        date: new Date(),
        amount: -transfer.amount,
        type: TransactionType.DEBIT,
        description: transfer.description || 'Virement interne',
        accountId: fromAccount.id
      };

      const creditTransaction: Transaction = {
        id: this.mockTransactions.length + 2,
        date: new Date(),
        amount: transfer.amount,
        type: TransactionType.CREDIT,
        description: transfer.description || 'Virement reçu',
        accountId: toAccount.id
      };

      this.mockTransactions.unshift(debitTransaction, creditTransaction);
      
      return of(true).pipe(delay(800));
    }

    return of(false).pipe(delay(800));
  }
}