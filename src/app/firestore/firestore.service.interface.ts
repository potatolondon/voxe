import { Observable } from 'rxjs';

export interface FirestoreService {
  valueChanges(collectionName: string, path?: string, queryParams?: any): Observable<any>;
  createDoc(collectionName: string, document: any);
  setDoc(collectionName: string, documentId: any, document: any);
  deleteDoc(collectionName: string, documentId: string);
}
