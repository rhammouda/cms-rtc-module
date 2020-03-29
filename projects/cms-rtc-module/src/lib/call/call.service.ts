import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SocketioService } from '../socketio/socketio.service';
import { RTCService } from '../rtc.service';

@Injectable({
  providedIn: 'root'
})
export class CallService {

  constructor(private socket: SocketioService, private rtcService: RTCService) { }

  SartCall(user: User){
    var streamigSource = new Subject<StreamAvalable>();
    navigator.getUserMedia({video:true, audio:true},function(stream){
      streamigSource.next({mediaStream: stream,source:StreamSource.local});
      this.connect(user, stream, streamigSource);
    }, function(error){
      
      streamigSource.error({message: "Cannot access to local stream", innerError: error});
    });

    return streamigSource.asObservable();
  }

  //view Live Streaming
  private connect(user: User, stream: MediaStream, streamigSource: Subject<StreamAvalable>) {
    var pc = this.rtcService.client.peerInit(user.socketId);
   //add local sream to call
    for (const track of stream.getTracks()) {
      pc.addTrack(track);
    }
    // use ontrack instead of onAdd stream
    var ontrackExecuted = false;
    
    pc.ontrack = function (event) {
      if (!ontrackExecuted) {
        console.log("ontrack", event);
        var remoteStream = event.streams[0];
        streamigSource.next({mediaStream: remoteStream, source: StreamSource.remote});
        remoteStream.onremovetrack = () => {
          //send null when the streaming ends 
          streamigSource.next(null);
          // document.getElementById("received_video").srcObject = null 
        }
        ontrackExecuted = true;
      }
    }

    pc.oniceconnectionstatechange = function (event) { }

  }
}

export interface User {
  id: string, socketId: string
}

export interface StreamAvalable{
  mediaStream: MediaStream;
  source:StreamSource;
}

export enum StreamSource{
  local = 1,
  remote = 2
}