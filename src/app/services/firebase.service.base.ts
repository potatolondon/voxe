import { Observable, of } from 'rxjs';

export default abstract class FirebaseServiceBase {
  constructor() {
  }

  public valueChanges(collectionName: string): Observable<any> {
    return of();
  }
}
