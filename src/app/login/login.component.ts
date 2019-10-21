import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NavigationService } from '../navigation/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private auth: AuthService,
    private navigation: NavigationService,
    private zone: NgZone,
  ) {}

  login() {
    this.auth.login().then(() => {
      this.zone.run(() => {
        this.navigation.navigate(['home'], {
          clearHistory: true,
        });
      });
    });
  }

}
