import { Injectable } from '@angular/core';
import { NavigationService } from './nagivation.service.interface';
import { RouterExtensions } from 'nativescript-angular/router';

@Injectable({
  providedIn: 'root'
})
class NavigationServiceNative implements NavigationService {
  constructor(private router: RouterExtensions) { }

  navigate(commands, extras?: any) {
    return this.router.navigate(commands, extras);
  }

}

export { NavigationServiceNative as NavigationService };
