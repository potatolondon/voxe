import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import FirebaseServiceBase from './firebase.service.base'


@Injectable()
export class FirebaseService extends FirebaseServiceBase {
  constructor(protected firestore: AngularFirestore) {
    super();
  }

  public valueChanges(collectionName: string): Observable<any> {
    return this.firestore.collection(collectionName).valueChanges();
  }
}
