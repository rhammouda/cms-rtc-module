import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';



@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  private socket: any;
  constructor() { }
  setupSocketConnection(socketServerUrl: string) {
    this.socket = io(socketServerUrl);
  }

  on(type: string, callback: (any) => void){
    this.socket.on(type, callback);
  }

  emit(type: string, payload:any){
    this.socket.emit(type, payload);
  }
}
