import { Component } from '@angular/core';
import { RTCService } from 'projects/cms-rtc-module/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'WebRtcLiveStreaming';
  constructor(private rtcService: RTCService){
    rtcService.init({socketServerUrl: "http://localhost:3000",userId:"1"});
  }
}
