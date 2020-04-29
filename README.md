# DEMO RAILS WEBRTC

Demo show how to build a video conference app with ruby on rails.

<p align="center">
  <img width="460" height="300" src="https://user-images.githubusercontent.com/6628202/80599587-c0d50900-8a5d-11ea-8451-66a21e5e2fcc.gif">
</p>

## Tutorals

https://medium.com/@BranLiang/a-complete-guide-to-webrtc-with-ruby-on-rails-9ea68e67154e

## Development setup

Install dependencies

```sh
bundle install
yarn install
```

Add twillio credentials

```sh
rails credentials:edit
```

```yml
twilio_account_sid: xxxx
twilio_auth_token: xxxx
```

Start server

```sh
bundle exec rails server
```

## Usage example

1. Open two tabs on your browser
2. Click `Get Video` on both tabs
3. Wait several seconds until both connection are initialized
4. Click `Join room` on one tab only!
5. Enjoy the demo video meeting!

## Contributing

1. Fork it (<https://github.com/BranLiang/demo-rails-webrtc/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
