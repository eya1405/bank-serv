import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BankingService } from '../../services/banking.service';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="transfers">
      <div class="transfers-header">
        <h1>Effectuer un virement interne</h1>
        <p>Transférez de l'argent entre vos comptes rapidement et en toute sécurité</p>
      </div>

      <div class="transfers-content">
        <div class="card transfer-form-card">
          <form [formGroup]="transferForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>De :</mat-label>
                <mat-select formControlName="fromAccount" required>
                  <mat-option *ngFor="let account of accounts" [value]="account.id">
                    {{ getAccountLabel(account) }} - {{ account.balance | number:'1.2-2' }} TND
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>À :</mat-label>
                <mat-select formControlName="toAccount" required>
                  <mat-option *ngFor="let account of getAvailableToAccounts()" [value]="account.id">
                    {{ getAccountLabel(account) }}
                  </mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Montant</mat-label>
                <input matInput type="number" formControlName="amount" placeholder="0.00" min="0.01" step="0.01">
                <span matTextSuffix>TND</span>
                <mat-error *ngIf="transferForm.get('amount')?.hasError('required')">
                  Le montant est requis
                </mat-error>
                <mat-error *ngIf="transferForm.get('amount')?.hasError('min')">
                  Le montant doit être positif
                </mat-error>
                <mat-error *ngIf="transferForm.get('amount')?.hasError('insufficientFunds')">
                  Solde insuffisant
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Motif (facultatif)</mat-label>
                <input matInput formControlName="description" placeholder="Ex: Mensualité juillet">
              </mat-form-field>
            </div>

            <div class="transfer-summary" *ngIf="showSummary">
              <h3>Résumé du virement</h3>
              <div class="summary-item">
                <span>De :</span>
                <span>{{ getSelectedFromAccountLabel() }}</span>
              </div>
              <div class="summary-item">
                <span>À :</span>
                <span>{{ getSelectedToAccountLabel() }}</span>
              </div>
              <div class="summary-item">
                <span>Montant :</span>
                <span class="amount-highlight">{{ transferForm.value.amount | number:'1.2-2' }} TND</span>
              </div>
              <div class="summary-item" *ngIf="transferForm.value.description">
                <span>Motif :</span>
                <span>{{ transferForm.value.description }}</span>
              </div>
            </div>

            <div class="form-actions">
              <button 
                mat-button 
                type="button" 
                (click)="resetForm()"
                [disabled]="isLoading">
                Annuler
              </button>
              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                [disabled]="transferForm.invalid || isLoading">
                <span *ngIf="!isLoading">Valider le virement</span>
                <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
              </button>
            </div>
          </form>
        </div>

        <!-- Information sur les frais -->
        <div class="card info-card">
          <h3>Informations importantes</h3>
          <ul>
            <li>Les virements internes sont <strong>gratuits</strong> et <strong>instantanés</strong></li>
            <li>Le montant minimum est de 0,01 TND</li>
            <li>Vous pouvez effectuer des virements 24h/24, 7j/7</li>
            <li>Un historique de tous vos virements est disponible dans l'onglet "Historique"</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transfers {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    .transfers-header {
      margin-bottom: 32px;
    }

    .transfers-header h1 {
      color: var(--text-primary);
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .transfers-header p {
      color: var(--text-secondary);
      font-size: 16px;
      margin: 0;
    }

    .transfers-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .transfer-form-card {
      padding: 32px;
    }

    .form-row {
      margin-bottom: 24px;
    }

    .full-width {
      width: 100%;
    }

    .transfer-summary {
      background-color: rgba(47, 128, 237, 0.05);
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
      border-left: 4px solid var(--primary-blue);
    }

    .transfer-summary h3 {
      color: var(--text-primary);
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding: 4px 0;
    }

    .summary-item:last-child {
      margin-bottom: 0;
    }

    .summary-item span:first-child {
      color: var(--text-secondary);
      font-weight: 500;
    }

    .summary-item span:last-child {
      color: var(--text-primary);
      font-weight: 600;
    }

    .amount-highlight {
      color: var(--primary-blue) !important;
      font-size: 18px !important;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
    }

    .form-actions button {
      min-width: 140px;
      height: 44px;
    }

    .info-card {
      background: linear-gradient(135deg, rgba(47, 128, 237, 0.05) 0%, rgba(47, 128, 237, 0.02) 100%);
      border-left: 4px solid var(--primary-blue);
    }

    .info-card h3 {
      color: var(--text-primary);
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .info-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .info-card li {
      color: var(--text-secondary);
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }

    .info-card li:before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--success-color);
      font-weight: bold;
    }

    .info-card li:last-child {
      margin-bottom: 0;
    }

    @media (max-width: 768px) {
      .transfers {
        padding: 16px;
      }

      .transfer-form-card {
        padding: 20px;
      }

      .form-actions {
        flex-direction: column-reverse;
      }

      .form-actions button {
        width: 100%;
      }
    }
  `]
})
export class TransfersComponent implements OnInit {
  transferForm: FormGroup;
  accounts: Account[] = [];
  isLoading = false;
  showSummary = false;

  constructor(
    private fb: FormBuilder,
    private bankingService: BankingService,
    private snackBar: MatSnackBar
  ) {
    this.transferForm = this.fb.group({
      fromAccount: ['', Validators.required],
      toAccount: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['']
    });

    // Écouter les changements du formulaire pour afficher le résumé
    this.transferForm.valueChanges.subscribe(() => {
      this.showSummary = this.transferForm.valid;
      this.validateAmount();
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  private loadAccounts(): void {
    this.bankingService.getAccounts().subscribe(accounts => {
      this.accounts = accounts;
    });
  }

  getAccountLabel(account: Account): string {
    const type = account.type === 'COURANT' ? 'Compte courant' : 'Compte épargne';
    return `${type} ${account.accountNumber}`;
  }

  getAvailableToAccounts(): Account[] {
    const fromAccountId = this.transferForm.get('fromAccount')?.value;
    return this.accounts.filter(account => account.id !== fromAccountId);
  }

  getSelectedFromAccountLabel(): string {
    const fromAccountId = this.transferForm.get('fromAccount')?.value;
    const account = this.accounts.find(acc => acc.id === fromAccountId);
    return account ? this.getAccountLabel(account) : '';
  }

  getSelectedToAccountLabel(): string {
    const toAccountId = this.transferForm.get('toAccount')?.value;
    const account = this.accounts.find(acc => acc.id === toAccountId);
    return account ? this.getAccountLabel(account) : '';
  }

  private validateAmount(): void {
    const fromAccountId = this.transferForm.get('fromAccount')?.value;
    const amount = this.transferForm.get('amount')?.value;
    
    if (fromAccountId && amount) {
      const fromAccount = this.accounts.find(acc => acc.id === fromAccountId);
      if (fromAccount && amount > fromAccount.balance) {
        this.transferForm.get('amount')?.setErrors({ insufficientFunds: true });
      }
    }
  }

  onSubmit(): void {
    if (this.transferForm.valid) {
      this.isLoading = true;

      const transferData = {
        fromAccountId: this.transferForm.value.fromAccount,
        toAccountId: this.transferForm.value.toAccount,
        amount: Number(this.transferForm.value.amount),
        description: this.transferForm.value.description || 'Virement interne'
      };

      this.bankingService.performTransfer(transferData).subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            this.snackBar.open('Virement effectué avec succès !', 'Fermer', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
            this.resetForm();
            this.loadAccounts(); // Recharger les comptes pour mettre à jour les soldes
          } else {
            this.snackBar.open('Erreur lors du virement. Veuillez réessayer.', 'Fermer', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Erreur système. Veuillez réessayer.', 'Fermer', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  resetForm(): void {
    this.transferForm.reset();
    this.showSummary = false;
  }
}