import { Injectable } from '@angular/core';
import { NavigationServiceI } from './nagivation.base';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService implements NavigationServiceI {

  constructor(private router: Router) { }

  navigate(commands, extras?: any) {
    return this.router.navigate(commands, extras);
  }

}
