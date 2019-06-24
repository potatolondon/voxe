import { Injectable } from '@angular/core';
import { NavigationServiceI } from './nagivation.base';
import { RouterExtensions } from 'nativescript-angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService implements NavigationServiceI {

  constructor(private router: RouterExtensions) { }

  navigate(commands, extras?: any) {
    return this.router.navigate(commands, extras);
  }

}
