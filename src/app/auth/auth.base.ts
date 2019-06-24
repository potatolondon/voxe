import { Observable } from 'rxjs';

export interface AuthServiceI {
  user: any;
  login: () => Promise<any>;
  userObservable: () => Observable<any>;
  logout: () => Promise<any>;
}
