import { Injectable } from '@angular/core';
import { SocketioService } from './socketio/socketio.service';
import { Subject, Observable, observable, from } from 'rxjs';
import {PeerManager, RtcClient} from './rtcClient';
@Injectable({
  providedIn: 'root'
})
export class RTCService {

  config: RTCConfig;
  client: RtcClient;
  private connectedUserSource = new Subject<RtcUser>();
  connectedUser$ = this.connectedUserSource.asObservable();


  private disConnectedUserSource = new Subject<RtcUser>();
  disConnectedUser$ = this.disConnectedUserSource.asObservable();

  
  constructor(private io:SocketioService) { }

  init(config: RTCConfig): Observable<any>{
    
    this.io.setupSocketConnection(config.socketServerUrl);
    this.client =  PeerManager(this.io);
    this.config = config;
    this.setupEvents();

    this.io.emit("userId", config.userId);
    var self = this;
    var observable = new Observable(subscriber  => {
      self.io.on("ConnectionData", data => {
        subscriber.next(data);
        subscriber.complete();
      })
    });
    
    return observable;
  }

 private setupEvents() {
   this.io.on("ConnectedUser",user => {
    this.connectedUserSource.next(user);
   });
   this.io.on("DisConnectedUser",user => {
    this.disConnectedUserSource.next(user);
   });
 }
}

export interface RTCConfig{
  socketServerUrl: string;
  userId: string;
}

export class RtcUser{
  id: string;
  socketId: string;
}