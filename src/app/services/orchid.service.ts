/*
Angular services
A service is typically a class with a narrow, well-defined purpose, distinguished
from an component, typically fetching data from a server.
This service handles all HTTP requests to the OrchidVMS server.
  However, the service must be injected into a component that will use the
  functionality we have defined here. 
*/

/*
HttpClient
  - Allows you to make HTTP requests
  - Uses RxJS Observables
  - Automatically parses the JSON responses into JS objects
  - Must have HttpClientModule imported in app module
HttpHeaders
  - Allows additional information to be passed to the server in the requests
*/
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Marks this class as a service that can be injected into other classes
import { Injectable } from '@angular/core';

/*
An Observable is like a stream of data you can listen to. Similar to a newspaper
subscription, you receive new data as they are published.
*/
import { Observable, take } from 'rxjs';

/*
The @Injectable decorator takes a configuration object, which specifies how
Angular should provide the service.
  providedIn: 'root': means that the service is available app-wide, as it is 
  provided in the root directory
*/
@Injectable({
  providedIn: 'root',
})
export class OrchidService {
  /*
  A slightly more verbose constructor than if parameter property syntax was 
  used, but the traditional way is more readable for me.
  */
  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
    // This service can now make HTTP requests via `this.http`.
  }

  // Store base server URL
  private base_url = 'https://orchid.ipconfigure.com/service/';

  /*
  Store the sessionId upon successful authentication
    - Can hold either a string or null value, and is initialized to null
  */
  private sessionId: string | null = null;

  /*
  Method to handle user authentication
    Params: username, password of type string
    Returns an Observable of any type
  */
  createUserSession(username: string, password: string): Observable<any> {
    // Pieces of the request
    const oneDay = 24 * 60 * 60;
    const url = `${this.base_url}sessions/user`;
    const body = {
      username: username,
      password: password,
      expiresIn: oneDay,
      cookie: 'session',
    };

    /*
    Returns an Observable that represents the result of the POST request
      - Constructs the necessary URL
      - Specifies the http headers according to the equivalent demo request
        on Orchid API docs
    */
    return this.http
      .post(url, body, {
        headers: new HttpHeaders({
          accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      })
      .pipe(take(1));
  }

  /*
  Clean up the created session each time the page is reloaded
  */
  deleteCurrentSession() {
    const url = `${this.base_url}sessions/me`;
    this.http.delete(url, {
      headers: new HttpHeaders({
        accept: 'application/json',
      }),
    });
  }

  /*
  Method to set the session ID upon receiving the response from the 
  auth response
    Param: id of type string
  */
  setSessionId(id: string): void {
    this.sessionId = id;
  }

  /*
  Method to return the session ID
  Returns a string or null value
  */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /*
  Method to request the data for all cameras
  */
  getCameraInfo(seshId: string | null): Observable<any> {
    const url = `${this.base_url}cameras?sid=${seshId}`;
    const headers = new HttpHeaders({
      accept: 'application/json', // Set the accept header
    });

    return this.http.get(url, { headers }).pipe(take(1));
  }
}
