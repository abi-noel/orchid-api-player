import {
  afterNextRender,
  AfterRenderPhase,
  Component,
  NgZone,
  OnInit,
} from '@angular/core';
import { OrchidService } from '../../services/orchid.service';
import { write } from 'fs';

/*
Camera interface
Defines custom type to map JSON camera objects to
*/
export interface CameraInterface {
  name: string;
  streamId: number;
  url: string;
}

@Component({
  selector: 'app-camera-container',
  templateUrl: './camera-container.component.html',
  styleUrl: './camera-container.component.css',
})
export class CameraContainerComponent implements OnInit {
  five_second_interval: any = 0;

  /*
  Inject OrchidService and NgZone into class
  OrchidService constructor is called here, so when the component is
  instantiated, so is the service
  */
  constructor(private orchid_service: OrchidService, private ngZone: NgZone) {
    /* 
    Initially, I tried an RxJS interval was created in ngOnInit. This caused 
    severe performance issues, and the page would time out if I attempted to
    get more than five frames.
    Code and explanation taken from this stackoverflow post

    https://stackoverflow.com/questions/78076462/interval-function-causes-infinite-ui-load-unless-i-type-in-index-html-in-the
    "With the introduction of SSR in Angular 17, the rendering of pages 
    happens on the server, resulting in initial HTML content which contains 
    initial page state." The app remains in an unstable state because of 
    the pending interval. "This results in rendering not being completed 
    while a timer or interval is running."

    I don't understand this code, but it works.
    */
    afterNextRender(
      () => {
        this.five_second_interval = setInterval(() => {
          this.ngZone.run(() => {
            this.addUrls();
          });
        }, 5000);
      },
      { phase: AfterRenderPhase.Write }
    );
  }

  // Array to hold camera data
  public cameras: CameraInterface[] = [];

  // Runs the method to authenticate on component initialization
  ngOnInit(): void {
    this.authenticateUser();
  }

  // Clean up the interval and delete session
  ngOnDestroy(): void {
    clearInterval(this.five_second_interval);
    this.orchid_service.deleteCurrentSession();
  }

  /*
  Method to POST credentials and receive the response
  */
  authenticateUser(): void {
    /*
    Initiates an HTTP POST request using the OrchidService and subscribes to receive
    responses. This syntax is a lot so a breakdown is below.
      'next:' observer: represents the  actual data being delivered upon success
      and stores the session ID that is returned
      'error:' observer: handles any errors that occur during the request
    */
    this.orchid_service.createUserSession('liveviewer', 'tpain').subscribe({
      next: (response) => {
        this.orchid_service.setSessionId(response.id); // Extract session ID from response
        this.getCameras(); // Retrieve camera data
      },
      error: (error) => console.error('Error creating session:', error),
    });
  }

  /*
  Method to retrieve the relevant data for each camera (name and stream ID)
  */
  getCameras(): void {
    const id = this.orchid_service.getSessionId();

    /*
    Utilize method in OrchidServer to make the GET request
    Upon successful request, an array of cameras are returned in JSON format,
    parsed to only contain the name and streamId, and assigned to the 
    cameras member variable of this camera-container component. Then, the
    appropriate URLs are added to each camera in the array.
    */
    this.orchid_service.getCameraInfo(id).subscribe({
      next: (response) => {
        this.cameras = response.cameras.map((camera: any) => ({
          name: camera.name,
          streamId: camera.primaryStream.id,
        }));
        /*
        Ensures that one batch of frames are always taken upon reload
        so that the page initially has frames. Otherwise, the method
        won't be called until after the first five second interval.
        */
        this.addUrls();
      },
      error: (error) => console.error('Error displaying cameras:', error),
    });
  }

  /*
  Method that will be called each interval to refresh the images
    - Works by looping through the array of cameras and reassigning the
      API URL to each CameraInterface element
    - The URL must change each time to circumvent change detection optimization, 
      so I just appended a t value that will evaluate to the current epoch time at 
      the time of request, thereby updating each URL.
  */
  addUrls(): void {
    this.cameras.forEach((camera: CameraInterface) => {
      camera.url = `https://orchid.ipconfigure.com/service/streams/${
        camera.streamId
      }/frame?sid=${this.orchid_service.getSessionId()}&t=${Date.now()}`;
    });
  }
}
