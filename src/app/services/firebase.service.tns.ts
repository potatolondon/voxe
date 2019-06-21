import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

const firebase = require('nativescript-plugin-firebase/app');


@Injectable()
export class FirebaseService {
  constructor(protected zone: NgZone) {
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
