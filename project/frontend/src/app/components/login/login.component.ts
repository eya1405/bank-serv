import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>BANQUE X</h1>
          <p>Connexion à votre espace client</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Adresse e-mail ou identifiant</mat-label>
            <input matInput type="email" formControlName="email" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Mot de passe</mat-label>
            <input matInput type="password" formControlName="password" required>
          </mat-form-field>

          <mat-checkbox formControlName="rememberMe" class="remember-checkbox">
            Se souvenir de moi
          </mat-checkbox>

          <button 
            mat-raised-button 
            type="submit" 
            class="btn-primary full-width login-button"
            [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="!isLoading">Connexion</span>
            <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
          </button>
        </form>

        <div class="demo-credentials" *ngIf="!isLoading">
          <p><small>Identifiants de démonstration :</small></p>
          <p><small>Email: demo@banquex.com | Mot de passe: demo123</small></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: var(--bg-light);
      padding: 20px;
    }

    .login-card {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .login-header h1 {
      color: var(--primary-blue);
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .login-header p {
      color: var(--text-secondary);
      font-size: 16px;
      margin-bottom: 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .remember-checkbox {
      margin-bottom: 24px;
    }

    .login-button {
      height: 48px;
      font-size: 16px;
      font-weight: 500;
    }

    .demo-credentials {
      margin-top: 20px;
      padding: 16px;
      background-color: #f8f9fa;
      border-radius: 8px;
      text-align: center;
    }

    .demo-credentials p {
      margin-bottom: 4px;
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 24px;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['demo@banquex.com', [Validators.required, Validators.email]],
      password: ['demo123', [Validators.required, Validators.minLength(4)]],
      rememberMe: [false]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      
      const credentials = this.loginForm.value;
      
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur de connexion:', error);
        }
      });
    }
  }
}