import { nanoid } from 'nanoid'

class Connection {
  peerConnection
  localStream
  remoteStreamTarget
  channel

  constructor() {
    this.identifier = nanoid()
    this.localICECandidates = []
    this.connected = false
  }
  
  createPeerConnection(servers) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: servers
    });
    this.peerConnection.ontrack = ({track, streams}) => {
      this.remoteStreamTarget.srcObject = streams[0]
      console.log("<<< Received new track")
    }
    this.peerConnection.onicecandidate = ({candidate}) => {
      if (candidate) {
        console.log(`<<< Received local ICE candidate from STUN/TURN server (${candidate.address})`)
        if (this.connected) {
          console.log(`>>> Sending local ICE candidate (${candidate.address})`)
          this.channel.send({
            type: "CANDIDATE",
            name: this.identifier,
            sdp: JSON.stringify(candidate)
          })
        } else {
          console.log(`>>> Buffer local candidate (${candidate.address})`)
          this.localICECandidates.push(candidate)
        }
      }
    }
  }

  loadStream() {
    for (const track of this.localStream.getTracks()) {
      this.peerConnection.addTrack(track, this.localStream)
    }
  }

  createOffer() {
    let that = this;
    this.peerConnection.createOffer(
      function(offer) {
        console.log(">>> Sending offer to receivers")
        that.peerConnection.setLocalDescription(offer)
        that.channel.send({
          type: "OFFER",
          name: that.identifier,
          sdp: JSON.stringify(offer)
        })
      },
      function(err) {
        console.log(err)
      }
    )
  }

  createAnswer(offer) {
    console.log("<<< Answering to caller")
    this.connected = true
    let rtcOffer = new RTCSessionDescription(offer);
    let that = this
    this.peerConnection.setRemoteDescription(rtcOffer);
    this.loadStream()
    this.peerConnection.createAnswer(
      function(answer) {
        that.peerConnection.setLocalDescription(answer)
        that.channel.send({
          type: "ANSWER",
          name: that.identifier,
          sdp: JSON.stringify(answer)
        })
      },
      function(err) {
        console.log(err)
      }
    )
  }

  receiveAnswer(answer) {
    console.log(">>> Receive remote answer")
    let rtcAnswer = new RTCSessionDescription(answer);
    let that = this
    this.peerConnection.setRemoteDescription(rtcAnswer)
    this.connected = true
    this.localICECandidates.forEach(candidate => {
      console.log(`>>> Sending local ICE candidate (${candidate.address})`)
      this.channel.send({
        type: "CANDIDATE",
        name: this.identifier,
        sdp: JSON.stringify(candidate)
      })
    })
    this.localICECandidates = []
  }

  addCandidate(candidate) {
    let rtcCandidate = new RTCIceCandidate(candidate);
    console.log(`<<< Adding ICE candidate (${rtcCandidate.address} - ${rtcCandidate.relatedAddress})`)
    this.peerConnection.addIceCandidate(rtcCandidate)
  }
}

export default Connection;
