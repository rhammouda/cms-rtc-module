import { NgModule } from '@angular/core';
import { RTCComponent } from './rtc.component';
import{SocketioService} from './socketio/socketio.service';
import { LiveStreamViewerDirective } from './liveStream/live-stream-viewer.directive';
import { RTCService } from './rtc.service';
import { LiveStreamingServiceService } from './liveStream/live-streaming-service.service';


@NgModule({
  declarations: [RTCComponent, LiveStreamViewerDirective],
  imports: [
  ],
  providers:[SocketioService, RTCService, LiveStreamingServiceService],
  exports: [RTCComponent, LiveStreamViewerDirective]
})
export class RTCModule { }
