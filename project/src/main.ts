import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Router, Routes } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './app/services/auth.service';

// Import des composants
import { LoginComponent } from './app/components/login/login.component';
import { MainLayoutComponent } from './app/components/layout/main-layout/main-layout.component';
import { DashboardComponent } from './app/components/dashboard/dashboard.component';
import { AccountsComponent } from './app/components/accounts/accounts.component';
import { TransfersComponent } from './app/components/transfers/transfers.component';
import { HistoryComponent } from './app/components/history/history.component';
import { authGuard } from './app/guards/auth.guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="app">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app {
      width: 100%;
      height: 100vh;
    }
  `]
})
export class App {
  constructor(private authService: AuthService, private router: Router) {
    // Redirection automatique si déjà connecté
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }
}

// Configuration des routes
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'accounts',
        component: AccountsComponent
      },
      {
        path: 'transfers',
        component: TransfersComponent
      },
      {
        path: 'history',
        component: HistoryComponent
      },
      {
        path: 'profile',
        component: DashboardComponent // Temporaire - à remplacer par un vrai composant profil
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideAnimations()
  ]
}).catch(err => console.error(err));