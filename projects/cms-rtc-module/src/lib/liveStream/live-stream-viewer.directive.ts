import { Directive, Input, ElementRef } from '@angular/core';
import { LiveStreamingServiceService, LiveStream } from './live-streaming-service.service';

@Directive({
  selector: '[liveStreamViewer]'
})
export class LiveStreamViewerDirective {

  @Input("liveStreamViewer")  test;
  // @Input("liveStreamViewer") liveStream:LiveStream;
  liveStream:LiveStream;
  constructor(private liveStreamingService: LiveStreamingServiceService, private el: ElementRef) { 
    this.video = el.nativeElement;
    this.liveStream = {socketId: "xsx9zOgVpN3MBRXxAAAh", streamId:"2"}
    setTimeout(() => {
      console.log("connecting to stream ", this.liveStream);
      this.connect();
    }, 2000); 
  }


  video: HTMLVideoElement;

  connect(){
    this.liveStreamingService.Connect(this.liveStream).subscribe(strem =>{
      if(strem != null){
        this.video = document.createElement("video");
        this.video.autoplay =true;
        this.el.nativeElement.appendChild(this.video );
        this.video.srcObject = strem;
      }else{
        this.el.nativeElement.removeChild(this.video );
      }
    })
  }
}
