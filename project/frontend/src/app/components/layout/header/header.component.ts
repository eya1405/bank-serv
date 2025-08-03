import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <header class="header">
      <div class="header-content">
        <button mat-icon-button class="menu-button">
          <mat-icon>menu</mat-icon>
        </button>
        
        <div class="header-info">
          <div class="user-greeting" *ngIf="currentUser">
            <span class="greeting-text">Bonjour, {{ currentUser.firstName }}</span>
            <span class="date-time">📅 {{ currentDate | date:'dd MMMM yyyy' }}</span>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: var(--card-bg);
      border-bottom: 1px solid var(--border-color);
      position: fixed;
      top: 0;
      left: 280px;
      right: 0;
      height: 64px;
      z-index: 999;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 0 24px;
    }

    .menu-button {
      display: none;
    }

    .header-info {
      margin-left: auto;
    }

    .user-greeting {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .greeting-text {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 16px;
    }

    .date-time {
      font-size: 14px;
      color: var(--text-secondary);
      margin-top: 2px;
    }

    @media (max-width: 768px) {
      .header {
        left: 0;
      }

      .menu-button {
        display: block;
      }

      .user-greeting {
        align-items: center;
        text-align: center;
      }

      .greeting-text {
        font-size: 14px;
      }

      .date-time {
        font-size: 12px;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  currentDate = new Date();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Mise à jour de la date toutes les minutes
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }
}