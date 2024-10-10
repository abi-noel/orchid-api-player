import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CameraContainerComponent } from './components/camera-container/camera-container.component';
import { provideHttpClient } from '@angular/common/http';
import { CameraComponent } from './components/camera-container/camera/camera.component';

@NgModule({
  declarations: [
    AppComponent,
    CameraContainerComponent,
    CameraComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
