import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BankingService } from '../../services/banking.service';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="accounts">
      <div class="accounts-header">
        <h1>Mes Comptes Bancaires</h1>
      </div>

      <div class="accounts-content">
        <div class="card">
          <div class="accounts-table-container">
            <table class="accounts-table">
              <thead>
                <tr>
                  <th>Compte</th>
                  <th>Solde</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let account of accounts" class="account-row">
                  <td class="account-number">{{ account.accountNumber }}</td>
                  <td class="account-balance">
                    <span class="balance-amount">{{ account.balance | number:'1.2-2' }} TND</span>
                  </td>
                  <td class="account-type">
                    <span class="type-badge" [ngClass]="{
                      'type-checking': account.type === 'COURANT',
                      'type-savings': account.type === 'EPARGNE'
                    }">
                      {{ getAccountTypeLabel(account.type) }}
                    </span>
                  </td>
                  <td class="account-actions">
                    <button 
                      mat-stroked-button 
                      color="primary"
                      (click)="viewAccountDetails(account.id)">
                      Voir détails
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Version mobile responsive -->
          <div class="mobile-accounts" *ngIf="accounts.length > 0">
            <div class="mobile-account-card" *ngFor="let account of accounts">
              <div class="mobile-account-header">
                <span class="mobile-account-number">{{ account.accountNumber }}</span>
                <span class="mobile-account-balance">{{ account.balance | number:'1.2-2' }} TND</span>
              </div>
              <div class="mobile-account-footer">
                <span class="type-badge" [ngClass]="{
                  'type-checking': account.type === 'COURANT',
                  'type-savings': account.type === 'EPARGNE'
                }">
                  {{ getAccountTypeLabel(account.type) }}
                </span>
                <button 
                  mat-stroked-button 
                  color="primary" 
                  size="small"
                  (click)="viewAccountDetails(account.id)">
                  Voir détails
                </button>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="accounts.length === 0">
            <mat-icon>account_balance</mat-icon>
            <p>Aucun compte trouvé</p>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="quick-actions-grid">
          <div class="action-card" routerLink="/transfers">
           
            <div class="action-content">
              <h3>Effectuer un virement</h3>
              <p>Transférer de l'argent entre vos comptes</p>
            </div>
          </div>

          <div class="action-card" routerLink="/history">
          
            <div class="action-content">
              <h3>Historique complet</h3>
              <p>Consulter toutes vos transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .accounts {
      padding: 24px;
    }

    .accounts-header h1 {
      color: var(--text-primary);
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 24px;
    }

    .accounts-table-container {
      display: none;
    }

    .accounts-table {
      width: 100%;
      border-collapse: collapse;
    }

    .accounts-table th {
      background-color: #f8f9fa;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: var(--text-primary);
      border-bottom: 2px solid var(--border-color);
    }

    .accounts-table td {
      padding: 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .account-row:hover {
      background-color: rgba(47, 128, 237, 0.05);
    }

    .account-number {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      font-size: 16px;
    }

    .balance-amount {
      font-weight: 600;
      font-size: 18px;
      color: var(--success-color);
    }

    .type-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .type-checking {
      background-color: rgba(47, 128, 237, 0.1);
      color: var(--primary-blue);
    }

    .type-savings {
      background-color: rgba(33, 150, 83, 0.1);
      color: var(--success-color);
    }

    /* Version mobile */
    .mobile-accounts {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .mobile-account-card {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      background: white;
    }

    .mobile-account-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .mobile-account-number {
      font-family: 'Courier New', monospace;
      font-weight: 600;
      font-size: 16px;
    }

    .mobile-account-balance {
      font-weight: 600;
      font-size: 18px;
      color: var(--success-color);
    }

    .mobile-account-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-top: 24px;
    }

    .action-card {
      display: flex;
      align-items: center;
      padding: 20px;
      background: var(--card-bg);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      color: inherit;
    }

    .action-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .action-card mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      margin-right: 16px;
      color: var(--primary-blue);
    }

    .action-content h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .action-content p {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .empty-state {
      text-align: center;
      padding: 48px 20px;
      color: var(--text-secondary);
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    /* Responsive design */
    @media (min-width: 769px) {
      .accounts-table-container {
        display: block;
      }

      .mobile-accounts {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .accounts {
        padding: 16px;
      }

      .quick-actions-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .action-card {
        padding: 16px;
      }
    }
  `]
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];

  constructor(private bankingService: BankingService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  private loadAccounts(): void {
    this.bankingService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  getAccountTypeLabel(type: string): string {
    return type === 'COURANT' ? 'Courant' : 'Épargne';
  }

  viewAccountDetails(accountId: number): void {
    // Navigation vers les détails du compte - à implémenter
    console.log('Voir détails du compte:', accountId);
  }
}