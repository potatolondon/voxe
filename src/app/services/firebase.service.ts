import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable()
export class FirebaseService {
  constructor(protected firestore: AngularFirestore) {
  }

  public valueChanges(collectionName: string): Observable<any> {
    return this.firestore.collection(collectionName).valueChanges();
  }
}
