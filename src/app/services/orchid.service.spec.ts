import { TestBed } from '@angular/core/testing';
import { OrchidService } from './orchid.service';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

/*
Main describe block for OrchidService
*/
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

    /*
    Inject the necessary instances
    */
    service = TestBed.inject(OrchidService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  /*
  Ensures all mocked requests are resolved
  A resolved request has:
    - been triggered by subscribing to the Observable that is emitted
      from calling its container function
    - simulated the server response using methods like req.flush({})
  Otherwise, verify() will throw an error
  */
  afterEach(() => {
    httpMock.verify();
  });

  /*
  Generic auto-generated test
  */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /*
  Tests the method to create a user session
  */
  describe('createUserSession', () => {
    /*
    Test case 1
    I'm going to hyper-document this case because I don't understand
    HTTP request mocking, but I want to.
    */
    it('should return an Observable<any>', () => {
      const dummyResponse = { id: '123', sessionId: 'abc' };
      const username = 'testUser';
      const password = 'testPassword';

      /*
      The call to createUserSession() doesn't send an actual network request
      Also, subscribing to an Observable doesn't mean there is actually
      a response yet. The nature of a subscription is that you are waiting 
      for the response to come.
      */
      service.createUserSession(username, password).subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

      /*
      Using httpMock.expectOne(), the test intercepts the HTTP request, 
      verifies the URL and request method, and manually provides the response 
      via req.flush(dummyResponse).
      The flush() method delivers the dummyResponse to the .subscribe() 
      block above, where it then checks if the response matches what you 
      expect with expect(response).toEqual(dummyResponse).
      */
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

    /*
    Test case 2: handling errors
    */
    it('should handle error response', () => {
      const username = 'testUser';
      const password = 'testPassword';

      /*
      We are not testing for a response, so if we get one, the test fails
      */
      service.createUserSession(username, password).subscribe({
        next: () => fail('expected an error, not data'),
        error: (error) => expect(error.status).toBe(400),
      });

      /*
      Verify the URL
      Return back an error code
      */
      const req = httpMock.expectOne(`${service['base_url']}sessions/user`);
      req.flush('Invalid credentials', {
        status: 400,
        statusText: 'Bad Request',
      });
    });
  });

  /*
  Block to test deletion of each session
  */
  describe('deleteCurrentSession', () => {
    it('should call delete on the correct URL', () => {
      service.deleteCurrentSession().subscribe();

      const req = httpMock.expectOne(`${service['base_url']}sessions/me`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  /*
  Block to test getter and setter
  */
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
    /*
    Test case 1
    */
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

    /*
    Test case 2
    */
    it('should handle error response', () => {
      const seshId = 'abc123';

      service.getCameraInfo(seshId).subscribe({
        next: () => fail('expected an error, not data'),
        error: (error) => expect(error.status).toBe(404),
      });

      const req = httpMock.expectOne(
        `${service['base_url']}cameras?sid=${seshId}`
      );
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });
});
