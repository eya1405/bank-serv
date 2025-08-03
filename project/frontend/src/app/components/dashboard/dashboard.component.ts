import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BankingService } from '../../services/banking.service';
import { Account, Transaction } from '../../models/account.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Tableau de bord</h1>
      </div>

      <div class="dashboard-content">
        <!-- Solde total -->
        <div class="card balance-card">
          <h2 class="section-title">Solde total : {{ totalBalance | number:'1.2-2' }} TND</h2>
          
          <div class="accounts-summary" *ngIf="accounts.length > 0">
            <div class="account-item" *ngFor="let account of accounts">
              <div class="account-info">
                <span class="account-type">{{ getAccountTypeLabel(account.type) }} ({{ account.accountNumber }})</span>
                <span class="account-balance">{{ account.balance | number:'1.2-2' }} TND</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Dernières transactions -->
        <div class="card transactions-card">
          <h3 class="section-title">Dernières transactions :</h3>
          
          <div class="transactions-list" *ngIf="recentTransactions.length > 0">
            <div class="transaction-item" *ngFor="let transaction of recentTransactions">
              <div class="transaction-info">
                <div class="transaction-date">
                  {{ transaction.date | date:'dd/MM' }}
                </div>
                <div class="transaction-details">
                  <span class="transaction-description">{{ transaction.description }}</span>
                  <span class="transaction-amount" [ngClass]="{
                    'amount-positive': transaction.amount > 0,
                    'amount-negative': transaction.amount < 0
                  }">
                    {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount | number:'1.2-2' }} TND
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="view-all-link">
            <a routerLink="/history">Voir tout l'historique →</a>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="quick-actions">
          <a routerLink="/accounts" class="action-card">
          
            <span>Mes comptes</span>
          </a>
          
          <a routerLink="/transfers" class="action-card">
         
            <span>Virement</span>
          </a>
          
          <a routerLink="/history" class="action-card">
            
            <span>Historique</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 24px;
    }

    .dashboard-header h1 {
      color: var(--text-primary);
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 24px;
    }

    .dashboard-content {
      display: grid;
      gap: 24px;
    }

    .balance-card {
      background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
      color: white;
    }

    .balance-card .section-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 20px;
      color: white;
    }

    .accounts-summary {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .account-item {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 16px;
    }

    .account-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .account-type {
      font-size: 16px;
      font-weight: 500;
    }

    .account-balance {
      font-size: 18px;
      font-weight: 600;
    }

    .transactions-card .section-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      color: var(--text-primary);
    }

    .transactions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .transaction-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--border-color);
    }

    .transaction-item:last-child {
      border-bottom: none;
    }

    .transaction-info {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 16px;
    }

    .transaction-date {
      font-weight: 600;
      color: var(--text-secondary);
      min-width: 40px;
    }

    .transaction-details {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .transaction-description {
      color: var(--text-primary);
    }

    .transaction-amount {
      font-weight: 600;
    }

    .view-all-link {
      text-align: center;
      margin-top: 16px;
    }

    .view-all-link a {
      color: var(--primary-blue);
      text-decoration: none;
      font-weight: 500;
    }

    .view-all-link a:hover {
      color: var(--primary-blue-dark);
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-top: 8px;
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px;
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-decoration: none;
      color: var(--text-primary);
      transition: all 0.3s ease;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      color: var(--primary-blue);
    }

    .action-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      margin-bottom: 8px;
      color: var(--primary-blue);
    }

    .action-card span {
      font-weight: 500;
      text-align: center;
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 16px;
      }

      .accounts-summary {
        gap: 8px;
      }

      .account-item {
        padding: 12px;
      }

      .quick-actions {
        grid-template-columns: repeat(2, 1fr);
      }

      .action-card {
        padding: 16px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalBalance = 0;
  accounts: Account[] = [];
  recentTransactions: Transaction[] = [];

  constructor(private bankingService: BankingService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Charger le solde total
    this.bankingService.getTotalBalance().subscribe(balance => {
      this.totalBalance = balance;
    });

    // Charger les comptes
    this.bankingService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });

    // Charger les transactions récentes
    this.bankingService.getRecentTransactions(4).subscribe(transactions => {
      this.recentTransactions = transactions;
    });
  }

  getAccountTypeLabel(type: string): string {
    return type === 'COURANT' ? 'Compte courant' : 'Compte épargne';
  }
}