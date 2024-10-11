import { TestBed } from '@angular/core/testing';

import { OrchidService } from './orchid.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('OrchidService', () => {
  let service: OrchidService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // ... other test providers
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(OrchidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
