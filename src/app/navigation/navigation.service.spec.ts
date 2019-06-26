import { TestBed } from '@angular/core/testing';

import { NavigationService } from './navigation.service';

import { AppModule } from '../app.module';

describe('NavigationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [AppModule]
  }));

  it('should be created', () => {
    const service: NavigationService = TestBed.get(NavigationService);
    expect(service).toBeTruthy();
  });
});
