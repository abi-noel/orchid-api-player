import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css',
})
/*
Child class for each Camera
Angular Inputs:
  - Marks class properties as bindable
  - Allows child component to receive data from parent (camera-container)
  - Required option to enforces that each input must always have a value
*/
export class CameraComponent {
  @Input({ required: true }) name: string = '';
  @Input({ required: true }) streamId: number = 0;
  @Input({ required: true }) url: string = '';

  fallbackImage: string = './frowning-face-icon.png';
  isFallbackImage: boolean = false;

  onImageError(): void {
    // Fallback image in case the camera stream fails
    this.url = this.fallbackImage;
    this.isFallbackImage = true;
  }
}
