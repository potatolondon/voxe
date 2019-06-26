import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import FirestoreServiceInterface from './firestore.service.interface';

const firebase = require('nativescript-plugin-firebase/app');


@Injectable()
export class FirestoreService implements FirestoreServiceInterface {
  constructor(protected zone: NgZone) {
  }

  public valueChanges(collectionName: string): Observable<any> {
    const collection = firebase.firestore().collection(collectionName);

    return Observable.create(observer => {
      const unsubscribe = collection.onSnapshot((snapshot: any) => {
        let results = [];
        if (snapshot && snapshot.forEach) {
          snapshot.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
        } else {
          results = snapshot.data();
        }
        this.zone.run(() => observer.next(results));
      });
      return () => unsubscribe();
    });
  }

  public createDoc(collectionName: string, document: any) {
    return firebase.firestore().collection(collectionName).add(document);
  }

  public setDoc(collectionName: string, documentId: any, document: any) {
    return firebase.firestore().collection(collectionName).doc(documentId).set(document);
  }

  public deleteDoc(collectionName: string, documentId: string) {
    return firebase.firestore().collection(collectionName).doc(documentId).delete();
  }
}
