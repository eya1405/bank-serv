import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <h2>BANQUE X</h2>
      </div>
      
      <nav class="sidebar-nav">
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
          
            <span>Tableau de bord</span>
          </a>
          
          <a mat-list-item routerLink="/accounts" routerLinkActive="active">
            <span>Mes comptes </span>
            
          </a>
          
          <a mat-list-item routerLink="/transfers" routerLinkActive="active">
           
            <span>Virements</span>
          </a>
          
          <a mat-list-item routerLink="/history" routerLinkActive="active">
          
            <span>Historique</span>
          </a>
          
          <a mat-list-item routerLink="/profile" routerLinkActive="active">
          
            <span>Mon profil</span>
          </a>
          
          <a mat-list-item (click)="logout()" class="logout-item">
            <span>Déconnexion</span>
          </a>
        </mat-nav-list>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      background-color: var(--primary-blue);
      color: white;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      display: flex;
      flex-direction: column;
    }

    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar-header h2 {
      color: white;
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }

    .sidebar-nav {
      flex: 1;
      padding-top: 16px;
    }

    .sidebar-nav ::ng-deep .mat-mdc-list-item {
      color: rgba(255, 255, 255, 0.8) !important;
      margin-bottom: 4px;
      border-radius: 8px;
      margin-left: 12px;
      margin-right: 12px;
      transition: all 0.3s ease;
    }

    .sidebar-nav ::ng-deep .mat-mdc-list-item:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
      color: white !important;
    }

    .sidebar-nav ::ng-deep .mat-mdc-list-item.active {
      background-color: var(--primary-blue-dark) !important;
      color: white !important;
    }

    .sidebar-nav ::ng-deep .mat-icon {
      color: inherit;
      margin-right: 12px;
    }

    .logout-item {
      cursor: pointer;
    }

    .logout-item:hover {
      background-color: rgba(235, 87, 87, 0.1) !important;
    }

    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }

      .sidebar.mobile-open {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}