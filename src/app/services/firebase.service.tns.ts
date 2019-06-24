import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import FirebaseServiceBase from './firebase.service.base';

const firebase = require('nativescript-plugin-firebase/app');


@Injectable()
export class FirebaseService extends FirebaseServiceBase {
  constructor(protected zone: NgZone) {
    super();
  }

  public valueChanges(collectionName: string): Observable<any> {
    const collection = firebase.firestore().collection(collectionName);

    return Observable.create(observer => {
      const unsubscribe = collection.onSnapshot((snapshot: any) => {
        let results = [];
        if (snapshot && snapshot.forEach) {
          snapshot.forEach(doc => results.push({
            id: doc.id,
            ...doc.data()
          }));
        } else {
          results = snapshot.data();
        }
        this.zone.run(() => observer.next(results));
      });
      return () => unsubscribe();
    });
  }
}
