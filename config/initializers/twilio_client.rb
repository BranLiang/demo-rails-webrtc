module TwilioClient
  extend self

  def instance
    Twilio::REST::Client.new(
      Rails.application.credentials.twilio_account_sid,
      Rails.application.credentials.twilio_auth_token
    )
  end
end