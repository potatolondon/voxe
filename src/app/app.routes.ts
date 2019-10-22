import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
      path: 'home',
      canActivate: [AuthGuard],
      component: HomeComponent,
  },
];
