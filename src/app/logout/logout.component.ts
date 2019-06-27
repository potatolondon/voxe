import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NavigationService } from '../navigation/navigation.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private navigation: NavigationService,
  ) { }

  ngOnInit() {
  }

  logout() {
    this.auth.logout().then(() => {
      this.navigation.navigate(['login'], {
        clearHistory: true,
      });
    });
  }

}
