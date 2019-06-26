import { Injectable } from '@angular/core';
import { NavigationService } from './nagivation.service.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationServiceWeb implements NavigationService {

  constructor(private router: Router) { }

  navigate(commands, extras?: any) {
    return this.router.navigate(commands, extras);
  }

}

export { NavigationServiceWeb as NavigationService };
