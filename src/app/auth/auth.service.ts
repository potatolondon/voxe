import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { AuthService } from './auth.service.interface';
import * as firebase from 'firebase/app';


@Injectable()
class AuthServiceWeb implements AuthService {
  public user;

  constructor(protected afAuth: AngularFireAuth) {
    this.afAuth.auth.onAuthStateChanged((user) => {
        this.user = user;
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

export { AuthServiceWeb as AuthService };
