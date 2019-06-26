import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FirestoreService } from './firestore.service.interface';


@Injectable()
class FirestoreServiceWeb implements FirestoreService {
  constructor(protected firestore: AngularFirestore) {
  }

  public valueChanges(collectionName: string): Observable<any> {
    return this.firestore.collection(collectionName).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  public createDoc(collectionName: string, document: any) {
    return this.firestore.collection(collectionName).add(document);
  }

  public setDoc(collectionName: string, documentId: any, document: any) {
    return this.firestore.doc(`/${collectionName}/${documentId}`).set(document);
  }

  public deleteDoc(collectionName: string, documentId: string) {
    return this.firestore.doc(`/${collectionName}/${documentId}`).delete();
  }
}

export { FirestoreServiceWeb as FirestoreService };
