<h1 align="center">
  Currently Listening on Spotify to Slack
</h1>

![Screenshot](/docs/spotifytoslack.png)

This web application uses the Spotify and Slack API to check what you're listening to on Spotify and update your Slack status to the song currently playing

## Getting Started

Clone the repository into your projects folder or:
1. Download the [ZIP file](https://github.com/khendrikse/whatgenre/archive/master.zip)
2. Unzip the ZIP file
3. Make sure you install all neccesary prerequisites (see below)

### Prerequisites

Make sure you have installed:
* [Node.js](https://nodejs.org/en/)
* [npm](https://github.com/npm/npm) (or Yarn) 

And run:

      $ npm install

To install the dependencies:
* [express](http://expressjs.com/)
* [dotenv](https://github.com/motdotla/dotenv)
* [opn](https://github.com/sindresorhus/opn)
* [axios](https://github.com/axios/axios)

### Getting started

#### Spotify

This app uses a Client ID and Secret Key. These are used as environment variables. To get these and to be able to use the Web API, the first thing you will need is a Spotify user account (Premium or Free). To get one, simply sign up at [www.spotify.com](www.spotify.com).

When you have a user account, go to the [My Applications](https://developer.spotify.com/my-applications) page at the [Spotify Developer website](https://developer.spotify.com) and, if necessary, log in. Accept the latest Developer Terms of Use to complete the set-up of your account.

Follow [this Spotify tutorial](https://developer.spotify.com/web-api/tutorial/) to get your Client ID and Secret Key.

Add these to the .env file.

#### Slack

This app also uses an OAuth Access Token for Slack. To get this, login at [https://api.slack.com/apps](https://api.slack.com/apps) and create an app. Then add the users.profile:write permission to your app and install it to your workspace. 

Grab the OAuth Access Token and add it to your .env file.

### How to run the app

Inside your terminal, change directories into the repository. There run: 

      $ node app.js

The user needs to give access to Spotify and afterwards the terminal can run in the background. 

## Built With

* [Spotify API](https://developer.spotify.com/web-api/) - The first API used.
* [Slack API]() - The second API used.
* [Express](http://expressjs.com/) - Web framework for Node.js used.
* [Axios](https://github.com/axios/axios) - HTTP client used.
* [dotenv](https://github.com/motdotla/dotenv) - Library used for .env file integration.
* [opn](https://github.com/sindresorhus/opn) - Library used to open browser window for Authentication.
* [JavaScript](https://developer.mozilla.org/en/docs/Web/JavaScript) - Language used.
* [Node.js](https://nodejs.org/en/) - The asynchronous event driven JavaScript runtime used.
