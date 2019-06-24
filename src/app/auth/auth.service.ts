import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthServiceI } from './auth.base';
import * as firebase from 'firebase/app';


@Injectable()
export class AuthService implements AuthServiceI {
  public user;

  constructor(protected afAuth: AngularFireAuth) {
    this.afAuth.auth.onAuthStateChanged((user) => {
        this.user = user;
        if (user) {
            console.log('Logged in as user', user.displayName);
            console.log('User id', user.uid);
        } else {
            console.log('Not currently logged in');
        }
    });
  }

  public userObservable() {
    return this.afAuth.authState;
  }

  public login() {
      const provider = new firebase.auth.GoogleAuthProvider();
      return this.afAuth.auth.signInWithPopup(provider);
  }

  public logout() {
    return this.afAuth.auth.signOut();
  }
}
