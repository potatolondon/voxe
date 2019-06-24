import { Injectable, NgZone } from '@angular/core';

import { AuthServiceI } from './auth.base';
import * as firebase from 'nativescript-plugin-firebase';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class AuthService implements AuthServiceI {
  public user;
  private authState: BehaviorSubject<any>;

  constructor(private zone: NgZone) {
    this.authState = new BehaviorSubject(undefined);
    firebase.addAuthStateListener({
      onAuthStateChanged: (data) => {
        this.zone.run(() => {
          this.user = data.user;
          console.log('User is', data.user);
          this.authState.next(data.user);
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
      }).then((user) => {
        console.log('Logged in as', user);
      }).catch((err) => {
        console.error('Error while logging in', err);
      });
  }

  public logout() {
    return firebase.logout();
  }
}
