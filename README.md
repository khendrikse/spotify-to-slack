<h1 align="center">
  Currently Listening on Spotify to Slack
</h1>

This web application uses the Spotify and Slack API to check what you're listening to on Spotify and update your Slack status to the song currently playing

## Getting Started

1. Download the [ZIP file](https://github.com/khendrikse/whatgenre/archive/master.zip)
2. Unzip the ZIP file
3. Make sure you install all neccesary prerequisites (see below)

### Prerequisites

Make sure you have Ruby installed:
* [NodeJS]
* NPM or Yarn

And run:

      $ npm install

To install the gems that the app depends on:
* [express]()
* [dotenv]()
* [opn]()
* [axios]()

### Getting started

#### Spotify
This app uses a Client ID and Secret Key. These are used as environment variables. To get these and to be able to use the Web API, the first thing you will need is a Spotify user account (Premium or Free). To get one, simply sign up at [www.spotify.com](www.spotify.com).

When you have a user account, go to the [My Applications](https://developer.spotify.com/my-applications) page at the [Spotify Developer website](https://developer.spotify.com) and, if necessary, log in. Accept the latest Developer Terms of Use to complete the set-up of your account.

Follow [this Spotify tutorial](https://developer.spotify.com/web-api/tutorial/) to get your Client ID and Secret Key.

Add these to the .env file.

#### Slack


### How to run the app
Inside your terminal, change directories into the repository. There run: 

      $ node app.js

## Built With

* [Spotify API](https://developer.spotify.com/web-api/) - The first API used.
* [Slack API]() - The second API used.
* [Express]()
* [Axios]()
* [dotenv]()
* [opn]()
* [JavaScript]()
* [NodeJS]()
