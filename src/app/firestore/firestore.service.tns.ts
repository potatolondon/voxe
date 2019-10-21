import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import { FirestoreService } from './firestore.service.interface';

const firebase = require('nativescript-plugin-firebase/app');


@Injectable()
class FirestoreServiceNative implements FirestoreService {
  constructor(protected zone: NgZone) {
  }

  public valueChanges(collectionName: string, path?: string, queryParams?: any): Observable<any> {
    let query = firebase.firestore().collection(collectionName);

    if (queryParams) {
      for (const param of queryParams.where) {
        query = query.where(param.field, param.comparator, param.value);
      }
      if (queryParams.orderBy) {
        for (const param of queryParams.orderBy) {
          query = query.orderBy(param.field, param.direction);
        }
      }
      if (queryParams.limit) {
        query = query.limit(queryParams.limit);
      }
    }
    if (path) {
      query = query.doc(path);
    }

    return new Observable(observer => {
      const unsubscribe = query.onSnapshot((snapshot: any) => {
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

export { FirestoreServiceNative as FirestoreService };
