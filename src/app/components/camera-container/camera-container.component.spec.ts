import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { CameraContainerComponent } from './camera-container.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { OrchidService } from '../../services/orchid.service';

/*
Mock OrchidService class
*/
class MockOrchidService {
  // Mock method for creating a user session
  createUserSession(username: string, password: string) {
    return of({ id: 'mock-session-id' }); // Return a mock session ID
  }

  // Mock method to retrieve session ID
  getSessionId(): string | null {
    return 'mock-session-id';
  }

  // Mock method to delete the current session
  deleteCurrentSession() {}

  // Mock method for getting camera info
  getCameraInfo(sessionId: string) {
    return of({
      cameras: [
        { name: 'Camera 1', primaryStream: { id: 1 } },
        { name: 'Camera 2', primaryStream: { id: 2 } },
      ],
    });
  }
}

describe('CameraContainerComponent', () => {
  let component: CameraContainerComponent;
  let fixture: ComponentFixture<CameraContainerComponent>;
  let orchidService: MockOrchidService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CameraContainerComponent],

      // Whenever an instance of OrchidService is requested, it should resolve to MockOrchidService instead
      providers: [{ provide: OrchidService, useClass: MockOrchidService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CameraContainerComponent);
    component = fixture.componentInstance;
    orchidService = TestBed.inject(OrchidService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should authenticate user on initialization', () => {
    component.ngOnInit();

    expect(orchidService.createUserSession).toHaveBeenCalledWith(
      'liveviewer',
      'tpain'
    );
    expect(orchidService.getSessionId()).toBe('mock-session-id'); // Verify session ID retrieval
  });

  it('should retrieve cameras after user authentication', fakeAsync(() => {
    component.ngOnInit();
    tick(); // Simulate the passage of time for async operations

    expect(component.cameras.length).toBe(2); // Check if two cameras are retrieved
    expect(component.cameras[0].name).toBe('Camera 1');
    expect(component.cameras[1].name).toBe('Camera 2');
  }));

  it('should update camera URLs every 5 seconds', fakeAsync(() => {
    component.ngOnInit(); // Call ngOnInit to set up the component
    tick(); // Simulate the initial asynchronous operations

    tick(5000); // Fast forward time by 5 seconds
    component.addUrls(); // Manually call addUrls to update camera URLs

    expect(component.cameras[0].url).toContain(
      'https://orchid.ipconfigure.com/service/streams/1/frame?sid=mock-session-id&t='
    );
    expect(component.cameras[1].url).toContain(
      'https://orchid.ipconfigure.com/service/streams/2/frame?sid=mock-session-id&t='
    );
  }));
});
