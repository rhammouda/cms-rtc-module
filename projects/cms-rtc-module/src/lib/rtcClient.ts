export var PeerManager = function (socket) {

    var localId,
        config = {
          peerConnectionConfig: {
            iceServers: [
              {"urls": "stun:23.21.150.121", "url": "stun:23.21.150.121"},
              {"urls": "stun:stun.l.google.com:19302", "url":"stun:stun.l.google.com:19302"}
            ]
          },
          peerConnectionConstraints: {
            optional: [
              {"DtlsSrtpKeyAgreement": true}
            ]
          }
        },
        peerDatabase = {},
        localStream;        
    socket.on('message', handleMessage);
    socket.on('id', function(id) {
      localId = id;
    });
        
    function addPeer(remoteId) {
      var pc = new RTCPeerConnection(config.peerConnectionConfig);
      pc.onicecandidate = function(event) {
        if (event.candidate) {
          send('candidate', remoteId, {
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
          });
        }
      };
    
      peerDatabase[remoteId] = pc;
          
      return pc;
    }
    function answer(remoteId) {
      var pc = peerDatabase[remoteId];
      pc.createAnswer(
        function(sessionDescription) {
          pc.setLocalDescription(sessionDescription);
          send('answer', remoteId, sessionDescription);
        }, 
        error
      );
    }
    function offer(remoteId) {
      var pc = peerDatabase[remoteId];
      pc.createOffer(
        function(sessionDescription) {
          pc.setLocalDescription(sessionDescription);
          send('offer', remoteId, sessionDescription);
        }, 
        error
      );
    }
    function handleMessage(message) {
      var type = message.type,
          from = message.from,
          pc = (peerDatabase[from] || addPeer(from));
  
      // console.log('received ' + type + ' from ' + from);
    
      switch (type) {
        case 'init':
          toggleLocalStream(pc);
          offer(from);
          break;
        case 'offer':
          pc.setRemoteDescription(new RTCSessionDescription(message.payload), function(){}, error);
          answer(from);
          break;
        case 'answer':
          pc.setRemoteDescription(new RTCSessionDescription(message.payload), function(){}, error);
          break;
        case 'candidate':
          if(pc.remoteDescription) {
            pc.addIceCandidate(new RTCIceCandidate({
              sdpMLineIndex: message.payload.label,
              sdpMid: message.payload.id,
              candidate: message.payload.candidate
            }), function(){}, error);
          }
          break;
      }
    }
    function send(type, to, payload) {
      console.log('sending ' + type + ' to ' + to);
  
      socket.emit('message', {
        to: to,
        type: type,
        payload: payload
      });
    }
    function toggleLocalStream(pc) {
      if(localStream) {
        (!!pc.getLocalStreams().length) ? pc.removeStream(localStream) : pc.addStream(localStream);
      }
    }
    function error(err){
      console.log(err);
    }
  
    return {
      getId: function() {
        return localId;
      },
      
      setLocalStream: function(stream) {
  
        // if local cam has been stopped, remove it from all outgoing streams.
        if(!stream) {
          for(let id in peerDatabase) {
            var pc = peerDatabase[id].pc;
            if(!!pc.getLocalStreams().length) {
              pc.removeStream(localStream);
              offer(id);
            }
          }
        }
  
        localStream = stream;
      }, 
  
      toggleLocalStream: function(remoteId) {
        var peer = peerDatabase[remoteId] || addPeer(remoteId);
        toggleLocalStream(peer.pc);
      },
      
      peerInit: function(remoteId) {
       var pc =  addPeer(remoteId);
        send('init', remoteId, null);
        return pc;
      },
  
      stop(id: string){
        var  pc: RTCPeerConnection = peerDatabase[id];
        pc.close();
        delete peerDatabase[id];
      },

      peerRenegociate: function(remoteId) {
        offer(remoteId);
      },
  
      send: function(type, payload) {
        socket.emit(type, payload);
      }
    };
    
  };

  function requestUserMedia(constraints) {
    return new Promise(function(resolve, reject) {
      var onSuccess = function(stream) {
        resolve(stream);
      };
      var onError = function(error) {
        reject(error);
      };
  
      try {
        navigator.getUserMedia(constraints, onSuccess, onError);
      } catch (e) {
        reject(e);
      }
    });
  }
  

// Attach a media stream to an element.
function attachMediaStream(element, stream) {
    if (typeof element.srcObject !== 'undefined') {
        element.srcObject = stream;
    } else if (typeof element.mozSrcObject !== 'undefined') {
        element.mozSrcObject = stream;
    } else if (typeof element.src !== 'undefined') {
        element.src = URL.createObjectURL(stream);
    } else {
        console.log('Error attaching stream to element.');
    }
};

export interface RtcClient{
    getId: () => any;
    setLocalStream: (stream: any) => void;
    toggleLocalStream: (remoteId: any) => void;
    peerInit: (remoteId: any) => RTCPeerConnection;
    peerRenegociate: (remoteId: any) => void;
    send: (type: any, payload: any) => void;
    stop:(id: string) => void;
}