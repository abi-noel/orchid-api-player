import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CameraContainerComponent } from './components/camera-container/camera-container.component';
import { provideHttpClient } from '@angular/common/http';
import { CameraComponent } from './components/camera-container/camera/camera.component';
import { TitleBarComponent } from './components/title-bar/title-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    CameraContainerComponent,
    CameraComponent,
    TitleBarComponent
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
