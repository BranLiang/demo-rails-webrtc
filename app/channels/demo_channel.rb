class DemoChannel < ApplicationCable::Channel
  def subscribed
    stream_from room_name
  end

  def receive(data)
    case data["type"]
    when "OFFER", "ANSWER", "CANDIDATE"
      ActionCable.server.broadcast(room_name, data)
    when "TOKEN"
      servers = TwilioClient.instance.tokens.create.ice_servers
      ActionCable.server.broadcast(room_name, { type: "TOKEN", servers: servers })
    else
      puts "Unknown signal type: #{data['type']}"
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private

  def room_name
    "demo_#{params[:name]}"
  end
end
