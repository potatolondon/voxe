import { Injectable, NgZone } from '@angular/core';

import { AuthService } from './auth.service.interface';
import * as firebase from 'nativescript-plugin-firebase';
import { from, ReplaySubject } from 'rxjs';
import { User } from 'nativescript-plugin-firebase';


@Injectable()
class AuthServiceNative implements AuthService {
  public user: User;
  private authState: ReplaySubject<User>;

  constructor(private zone: NgZone) {
    this.authState = new ReplaySubject<User>(1);
    const observable = from(firebase.getCurrentUser().catch(err => {
      console.error('Error getting current user:', err);
    }));
    observable.subscribe(this.authState);

    firebase.addAuthStateListener({
      onAuthStateChanged: ({ user }) => {
        this.zone.run(() => {
          this.user = user;
          this.authState.next(user);
        });
      }
    });
  }

  public userObservable() {
    return this.authState;
  }

  public login() {
    return firebase.login({
      type: firebase.LoginType.GOOGLE,
    }).catch((err) => {
      console.error('Error logging in', err);
    });
  }

  public logout() {
    return firebase.logout();
  }
}

export { AuthServiceNative as AuthService };
