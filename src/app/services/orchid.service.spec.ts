import { TestBed } from '@angular/core/testing';

import { OrchidService } from './orchid.service';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

describe('OrchidService', () => {
  let service: OrchidService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        // ... other test providers
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(OrchidService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUserSession', () => {
    it('should return an Observable<any>', () => {
      const dummyResponse = { id: '123', sessionId: 'abc' };
      const username = 'testUser';
      const password = 'testPassword';

      service.createUserSession(username, password).subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne(`${service['base_url']}sessions/user`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        username: username,
        password: password,
        expiresIn: 86400,
        cookie: 'session',
      });
      req.flush(dummyResponse);
    });

    it('should handle error response', () => {
      const username = 'testUser';
      const password = 'testPassword';

      service.createUserSession(username, password).subscribe(
        () => fail('expected an error, not data'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
        }
      );

      const req = httpMock.expectOne(`${service['base_url']}sessions/user`);
      req.flush('Invalid credentials', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteCurrentSession', () => {
    it('should call delete on the correct URL', () => {
      service.deleteCurrentSession();

      const req = httpMock.expectOne(`${service['base_url']}sessions/me`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('setSessionId and getSessionId', () => {
    it('should set and get the session ID', () => {
      service.setSessionId('abc123');
      expect(service.getSessionId()).toBe('abc123');
    });

    it('should return null if session ID is not set', () => {
      expect(service.getSessionId()).toBeNull();
    });
  });

  /*
  Tests the request to get camera info
  */
  describe('getCameraInfo', () => {
    it('should return an Observable<any>', () => {
      const dummyCameras = [
        { id: '1', name: 'Camera 1' },
        { id: '2', name: 'Camera 2' },
      ];
      const seshId = 'abc123';

      service.getCameraInfo(seshId).subscribe((cameras) => {
        expect(cameras).toEqual(dummyCameras);
      });

      const req = httpMock.expectOne(
        `${service['base_url']}cameras?sid=${seshId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(dummyCameras);
    });

    it('should handle error response', () => {
      const seshId = 'abc123';

      service.getCameraInfo(seshId).subscribe( {
        next: () => fail('expected an error, not data'),
        error: (error) => expect(error.status).toBe(404);
      }

      );

      const req = httpMock.expectOne(
        `${service['base_url']}cameras?sid=${seshId}`
      );
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
