import { Observable } from 'rxjs';

export interface AuthService {
  user: any;
  login(): Promise<any>;
  userObservable(): Observable<any>;
  logout(): Promise<any>;
}
