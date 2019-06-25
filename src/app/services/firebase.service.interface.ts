import { Observable, of } from 'rxjs';

export default interface FirebaseServiceInterface {
  valueChanges(collectionName: string): Observable<any>;
}
