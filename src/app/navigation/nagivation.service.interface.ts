export interface NavigationService {
  navigate(command: any[], extras?: any): Promise<any>;
}
