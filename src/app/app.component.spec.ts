import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CameraContainerComponent } from './components/camera-container/camera-container.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, CameraContainerComponent],
      providers: [provideHttpClient(), provideHttpClientTesting],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'orchid-api-player'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('orchid-api-player');
  });
});
