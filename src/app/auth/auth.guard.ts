import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { take, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { NavigationService } from '../navigation/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private navigation: NavigationService) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | Observable<boolean> {
      if (this.auth.user) {
        return true;
      }

      return this.auth.userObservable().pipe(
          take(1),
          map(user => !!user),
          tap(loggedIn => {
              if (!loggedIn) {
                console.log('User is not authenticated, redirecting to /login');
                this.navigation.navigate(['login']);
              } else {
                console.log('User is logged in');
              }
          }),
      );
  }
}
