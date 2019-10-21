import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NavigationService } from '../navigation/navigation.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  constructor(
    private auth: AuthService,
    private navigation: NavigationService,
  ) { }

  logout() {
    this.auth.logout().then(() => {
      this.navigation.navigate(['login'], {
        clearHistory: true,
      });
    });
  }

}
