import consumer from "./consumer"

const createDemoChannel = function(name, connection) {
  return consumer.subscriptions.create({channel: "DemoChannel", name}, {
    connected() {
      connection.channel = this
      console.log("Channel connected")
      console.log("<<< Sending TOKEN message to server")
      this.send({ type: "TOKEN" })
    },
  
    disconnected() {
      console.log("disconnected")
    },
  
    received(data) {
      switch (data.type) {
        case "TOKEN":
          if (!connection.peerConnection) {
            connection.createPeerConnection(data.servers)
          }
          break;
        case "OFFER":
          if (connection.identifier != data.name) {
            let offer = JSON.parse(data.sdp)
            connection.createAnswer(offer)
          }
          break;
        case "ANSWER":
          if (connection.identifier != data.name) {
            let answer = JSON.parse(data.sdp)
            connection.receiveAnswer(answer)
          }
          break;
        case "CANDIDATE":
          if (connection.identifier != data.name) {
            let candidate = JSON.parse(data.sdp)
            connection.addCandidate(candidate)
          }
          break;
        default:
          console.log(`Unknown data type: ${data.type}`)
          break;
      }
    }
  });
}

export default createDemoChannel;
