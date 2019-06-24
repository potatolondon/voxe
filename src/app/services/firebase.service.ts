import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import FirebaseServiceInterface from './firebase.service.interface';


@Injectable()
export class FirebaseService implements FirebaseServiceInterface {
  constructor(protected firestore: AngularFirestore) {
  }

  public valueChanges(collectionName: string): Observable<any> {
    return this.firestore.collection(collectionName).valueChanges();
  }
}
