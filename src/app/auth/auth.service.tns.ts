import { Injectable, NgZone } from '@angular/core';

import { AuthServiceI } from './auth.base';
import * as firebase from 'nativescript-plugin-firebase';
import { BehaviorSubject, Observable, from, ReplaySubject, concat } from 'rxjs';
import { User } from 'nativescript-plugin-firebase';


@Injectable({
  providedIn: 'root',
})
export class AuthService implements AuthServiceI {
  public user;
  private authState: ReplaySubject<User>;

  constructor(private zone: NgZone) {
    this.authState = new ReplaySubject<User>(1);
    const observable = from(firebase.getCurrentUser().catch(err => {
      console.log('Error in retrieving user:', err);
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
    }).then((user) => {
      console.log('Logged in as', user.displayName);
    }).catch((err) => {
      console.error('Error while logging in', err);
    });
  }

  public logout() {
    return firebase.logout();
  }
}
