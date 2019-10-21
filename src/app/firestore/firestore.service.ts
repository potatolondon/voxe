import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FirestoreService } from './firestore.service.interface';


@Injectable()
class FirestoreServiceWeb implements FirestoreService {
  constructor(protected afStore: AngularFirestore) {
  }

  public valueChanges(collectionName: string, path?: string, queryParams?: any): Observable<any> {
    const query = this.afStore.collection(collectionName, ref => {
      let q: any = ref;
      if (queryParams) {
        for (const param of queryParams.where) {
          q = q.where(param.field, param.comparator, param.value);
        }
        if (queryParams.orderBy) {
          for (const param of queryParams.orderBy) {
            q = q.orderBy(param.field, param.direction);
          }
        }
        if (queryParams.limit) {
          q = q.limit(queryParams.limit);
        }
      }
      return q;
    });

    if (path) {
      return query.doc(path).snapshotChanges().pipe(
        map(actions => {
          return (<any>actions).payload.data();
        })
      );
    } else {
      return query.snapshotChanges().pipe(
        map(actions => {
          if (Array.isArray(actions)) {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          }
        })
      );
    }
  }

  public createDoc(collectionName: string, document: any) {
    return this.afStore.collection(collectionName).add(document);
  }

  public setDoc(collectionName: string, documentId: any, document: any) {
    return this.afStore.doc(`/${collectionName}/${documentId}`).set(document);
  }

  public deleteDoc(collectionName: string, documentId: string) {
    return this.afStore.doc(`/${collectionName}/${documentId}`).delete();
  }
}

export { FirestoreServiceWeb as FirestoreService };
