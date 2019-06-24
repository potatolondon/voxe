export interface NavigationServiceI {
  navigate: (command: any[], extras?: any) => Promise<any>;
}
