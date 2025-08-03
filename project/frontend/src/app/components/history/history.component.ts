import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BankingService } from '../../services/banking.service';
import { Transaction, TransactionType, Account } from '../../models/account.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="history">
      <div class="history-header">
        <h1>Historique des transactions</h1>
        <p>Consultez toutes vos transactions et filtrez selon vos besoins</p>
      </div>

      <div class="history-content">
        <!-- Filtres -->
        <div class="card filters-card">
          <h3>🔍 Filtres</h3>
          
          <form [formGroup]="filtersForm" class="filters-form">
            <div class="filters-row">
              <mat-form-field appearance="outline">
                <mat-label>Date de début</mat-label>
                <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Date de fin</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Montant minimum</mat-label>
                <input matInput type="number" formControlName="minAmount" placeholder="0.00">
                <span matTextSuffix>TND</span>
              </mat-form-field>
            </div>

            <div class="filters-row">
              <mat-form-field appearance="outline">
                <mat-label>Type</mat-label>
                <mat-select formControlName="transactionType">
                  <mat-option value="">Tous</mat-option>
                  <mat-option value="CREDIT">Crédit</mat-option>
                  <mat-option value="DEBIT">Débit</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Compte</mat-label>
                <mat-select formControlName="accountId">
                  <mat-option value="">Tous les comptes</mat-option>
                  <mat-option *ngFor="let account of accounts" [value]="account.id">
                    {{ getAccountLabel(account) }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <div class="filter-actions">
                <button mat-button (click)="clearFilters()">Effacer</button>
                <button mat-raised-button color="primary" (click)="applyFilters()">Filtrer</button>
              </div>
            </div>
          </form>
        </div>

        <!-- Liste des transactions -->
        <div class="card transactions-card">
          <div class="transactions-header">
            <h3>Transactions ({{ filteredTransactions.length }})</h3>
            <div class="transactions-summary" *ngIf="filteredTransactions.length > 0">
              <span class="summary-item credit">
                Crédits: +{{ getTotalCredits() | number:'1.2-2' }} TND
              </span>
              <span class="summary-item debit">
                Débits: {{ getTotalDebits() | number:'1.2-2' }} TND
              </span>
            </div>
          </div>

          <!-- Version bureau -->
          <div class="desktop-transactions">
            <table class="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Libellé</th>
                  <th>Compte</th>
                  <th>Montant</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let transaction of filteredTransactions" class="transaction-row">
                  <td class="transaction-date">
                    {{ transaction.date | date:'dd/MM/yyyy' }}
                  </td>
                  <td class="transaction-description">
                    {{ transaction.description }}
                  </td>
                  <td class="transaction-account">
                    {{ getAccountNumber(transaction.accountId) }}
                  </td>
                  <td class="transaction-amount" [ngClass]="{
                    'amount-positive': transaction.amount > 0,
                    'amount-negative': transaction.amount < 0
                  }">
                    {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount | number:'1.2-2' }} TND
                  </td>
                  <td class="transaction-type">
                    <span class="type-badge" [ngClass]="{
                      'type-credit': transaction.type === 'CREDIT',
                      'type-debit': transaction.type === 'DEBIT'
                    }">
                      {{ transaction.type === 'CREDIT' ? 'Crédit' : 'Débit' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Version mobile -->
          <div class="mobile-transactions">
            <div class="mobile-transaction-card" *ngFor="let transaction of filteredTransactions">
              <div class="mobile-transaction-header">
                <span class="mobile-date">{{ transaction.date | date:'dd/MM/yyyy' }}</span>
                <span class="mobile-amount" [ngClass]="{
                  'amount-positive': transaction.amount > 0,
                  'amount-negative': transaction.amount < 0
                }">
                  {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount | number:'1.2-2' }} TND
                </span>
              </div>
              <div class="mobile-transaction-details">
                <div class="mobile-description">{{ transaction.description }}</div>
                <div class="mobile-meta">
                  <span>{{ getAccountNumber(transaction.accountId) }}</span>
                  <span class="type-badge" [ngClass]="{
                    'type-credit': transaction.type === 'CREDIT',
                    'type-debit': transaction.type === 'DEBIT'
                  }">
                    {{ transaction.type === 'CREDIT' ? 'Crédit' : 'Débit' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="filteredTransactions.length === 0">
            <mat-icon>receipt_long</mat-icon>
            <p>Aucune transaction trouvée</p>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .history {
      padding: 24px;
    }

    .history-header {
      margin-bottom: 32px;
    }

    .history-header h1 {
      color: var(--text-primary);
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .history-header p {
      color: var(--text-secondary);
      font-size: 16px;
      margin: 0;
    }

    .history-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .filters-card h3 {
      color: var(--text-primary);
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .filters-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .filters-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      align-items: end;
    }

    .filter-actions {
      display: flex;
      gap: 12px;
    }

    .transactions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .transactions-header h3 {
      color: var(--text-primary);
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }

    .transactions-summary {
      display: flex;
      gap: 20px;
      font-size: 14px;
      font-weight: 500;
    }

    .summary-item.credit {
      color: var(--success-color);
    }

    .summary-item.debit {
      color: var(--error-color);
    }

    /* Table desktop */
    .desktop-transactions {
      display: none;
    }

    .transactions-table {
      width: 100%;
      border-collapse: collapse;
    }

    .transactions-table th {
      background-color: #f8f9fa;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: var(--text-primary);
      border-bottom: 2px solid var(--border-color);
    }

    .transactions-table td {
      padding: 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .transaction-row:hover {
      background-color: rgba(47, 128, 237, 0.05);
    }

    .transaction-date {
      font-family: 'Courier New', monospace;
      font-weight: 500;
    }

    .transaction-account {
      font-family: 'Courier New', monospace;
      color: var(--text-secondary);
    }

    .type-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .type-credit {
      background-color: rgba(33, 150, 83, 0.1);
      color: var(--success-color);
    }

    .type-debit {
      background-color: rgba(235, 87, 87, 0.1);
      color: var(--error-color);
    }

    /* Mobile transactions */
    .mobile-transactions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .mobile-transaction-card {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 16px;
      background: white;
    }

    .mobile-transaction-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .mobile-date {
      font-family: 'Courier New', monospace;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .mobile-amount {
      font-weight: 600;
      font-size: 16px;
    }

    .mobile-transaction-details {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .mobile-description {
      color: var(--text-primary);
      font-weight: 500;
    }

    .mobile-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }

    .mobile-meta span:first-child {
      font-family: 'Courier New', monospace;
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

    .empty-state p {
      margin: 8px 0;
    }

    /* Responsive */
    @media (min-width: 769px) {
      .desktop-transactions {
        display: block;
      }

      .mobile-transactions {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .history {
        padding: 16px;
      }

      .filters-row {
        grid-template-columns: 1fr;
      }

      .filter-actions {
        justify-content: stretch;
      }

      .filter-actions button {
        flex: 1;
      }

      .transactions-summary {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class HistoryComponent implements OnInit {
  filtersForm: FormGroup;
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  accounts: Account[] = [];

  constructor(
    private fb: FormBuilder,
    private bankingService: BankingService
  ) {
    this.filtersForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      minAmount: [''],
      transactionType: [''],
      accountId: ['']
    });
  }

  ngOnInit(): void {
    this.loadData();
    this.setupFilters();
  }

  private loadData(): void {
    // Charger les comptes
    this.bankingService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });

    // Charger les transactions
    this.bankingService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
      this.filteredTransactions = [...transactions];
      this.sortTransactions();
    });
  }

  private setupFilters(): void {
    // Appliquer les filtres automatiquement quand ils changent
    this.filtersForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    // Définir des dates par défaut (derniers 30 jours)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    this.filtersForm.patchValue({
      startDate: startDate,
      endDate: endDate
    });
  }

  applyFilters(): void {
    const filters = this.filtersForm.value;
    
    this.filteredTransactions = this.transactions.filter(transaction => {
      // Filtre par date de début
      if (filters.startDate && transaction.date < filters.startDate) {
        return false;
      }

      // Filtre par date de fin
      if (filters.endDate && transaction.date > filters.endDate) {
        return false;
      }

      // Filtre par montant minimum
      if (filters.minAmount && Math.abs(transaction.amount) < filters.minAmount) {
        return false;
      }

      // Filtre par type de transaction
      if (filters.transactionType && transaction.type !== filters.transactionType) {
        return false;
      }

      // Filtre par compte
      if (filters.accountId && transaction.accountId !== filters.accountId) {
        return false;
      }

      return true;
    });

    this.sortTransactions();
  }

  clearFilters(): void {
    this.filtersForm.reset();
    this.filteredTransactions = [...this.transactions];
    this.sortTransactions();
  }

  private sortTransactions(): void {
    this.filteredTransactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getAccountLabel(account: Account): string {
    const type = account.type === 'COURANT' ? 'Compte courant' : 'Compte épargne';
    return `${type} ${account.accountNumber}`;
  }

  getAccountNumber(accountId: number): string {
    const account = this.accounts.find(acc => acc.id === accountId);
    return account ? account.accountNumber : '';
  }

  getTotalCredits(): number {
    return this.filteredTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalDebits(): number {
    return this.filteredTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0);
  }
}