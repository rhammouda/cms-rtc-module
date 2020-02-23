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
    this.liveStream = {socketId: "qlWrIXIZWOYgixYKAAAB", streamId:"2"}
    this.connect();
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
