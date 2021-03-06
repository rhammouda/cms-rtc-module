import { Injectable } from '@angular/core';
import { Observable, observable, Subject } from 'rxjs';
import { SocketioService } from '../socketio/socketio.service';
import { RTCService } from '../rtc.service';

@Injectable({
  providedIn: 'root'
})
export class LiveStreamingServiceService {

  constructor(private socket: SocketioService, private rtcService: RTCService) { }


  //view Live Streaming
  Connect(stream: LiveStream): Observable<MediaStream> {
    var streamigSource = new Subject<MediaStream>();
    var pc = this.rtcService.client.peerInit(stream.socketId);
    // use ontrack instead of onAdd stream
    var ontrackExecuted = false;
    pc.ontrack = function (event) {
      if (!ontrackExecuted) {
        console.log("ontrack", event);
        var remoteStream = event.streams[0];
        streamigSource.next(remoteStream);
        remoteStream.onremovetrack = () => {
          //send null when the streaming ends 
          streamigSource.next(null);
          // document.getElementById("received_video").srcObject = null 
        }
        ontrackExecuted = true;
      }
    }

    pc.oniceconnectionstatechange = function (event) { }

    return streamigSource.asObservable();
  }

  //streamId: id de la formation pour formation en ligne
  SatartStreaming(streamId: string): Observable<MediaStream> {
    navigator.getUserMedia({audio:true, video:true}, function(stream){
      this.rtcService.client.send('readyToStream', { name: "" });

    }, error => {
      
    })

    return new Observable();
  }


  getLiveStreams(): Observable<LiveStream[]> {
    return new Observable();
  }
}


export interface LiveStream {
  streamId: string;
  socketId: string;
}