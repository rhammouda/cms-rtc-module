import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RTCModule } from 'projects/cms-rtc-module/src/public-api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RTCModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
