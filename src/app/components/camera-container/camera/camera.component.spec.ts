/*
Unit tests in Angular (comments for beginners like me)
The auto-generated test code simply asserts successful component creation
*/

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CameraComponent } from './camera.component';

/*
Each describe block contains related tests
The first parameter is the name for the test suite, it is displayed upon
running the tests
The second param holds the entire test code
*/
describe('CameraComponent', () => {
  let component: CameraComponent;
  let fixture: ComponentFixture<CameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CameraComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CameraComponent);
    component = fixture.componentInstance;

    component.name = 'Test Camera';
    component.streamId = 123;
    component.url = 'http://test-url.com/stream';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct @Input values', () => {
    expect(component.name).toBe('Test Camera');
    expect(component.streamId).toBe(123);
    expect(component.url).toBe('http://test-url.com/stream');
  });

  it('should set fallback image on error', () => {
    component.onImageError(); // Simulate the image error event

    expect(component.url).toBe('./frowning-face-icon.png');
    expect(component.isFallbackImage).toBe(true);
  });
});
