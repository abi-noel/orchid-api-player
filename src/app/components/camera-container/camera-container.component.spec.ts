import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraContainerComponent } from './camera-container.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { OrchidService } from '../../services/orchid.service';

// Mock service class
class MockOrchidService {
  // Mock method for creating a user session
  createUserSession(username: string, password: string) {
    return of({ id: 'mock-session-id' }); // Return a mock session ID
  }

  // Mock method to retrieve session ID
  getSessionId() {
    return 'mock-session-id';
  }

  // Mock method to delete the current session
  deleteCurrentSession() {
    // Implementation can be empty for the mock
  }

  // Mock method for getting camera info
  getCameraInfo(sessionId: string) {
    return of({
      cameras: [
        { name: 'Camera 1', primaryStream: { id: 1 } },
        { name: 'Camera 2', primaryStream: { id: 2 } },
      ],
    });
  }

  // Add any other methods needed for your tests
}

describe('CameraContainerComponent', () => {
  let component: CameraContainerComponent;
  let fixture: ComponentFixture<CameraContainerComponent>;
  let orchidService: OrchidService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CameraContainerComponent],
      providers: [{ provide: OrchidService, useClass: MockOrchidService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CameraContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
function provideHttpClient(): any {
  throw new Error('Function not implemented.');
}
