require('dotenv').config();
const express = require('express');
const app = express();
const opn = require('opn');
const axios = require('axios');

const callBackUrl = 'http://localhost:3001/callback';
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const slackToken = process.env.SLACK_TOKEN;

let userToken = '';
let spotifyAccessToken = '';
let timeRemaining = 1000;
let currentSong = '';

const getUserToken = (req) => (userToken = req.originalUrl.split('=')[1]);

process.on('SIGINT', async () => {
  await setSlackStatus({
    status_text: '',
    status_emoji: '',
  });
  process.exit(1);
});

const handleFatalError = (err) => {
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
};

const getSpotifyAuth = (userToken) => {
  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    params: {
      grant_type: 'authorization_code',
      code: userToken,
      redirect_uri: callBackUrl,
    },
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(clientID + ':' + clientSecret).toString('base64'),
    },
  })
    .then(function (response) {
      spotifyAccessToken = response.data.access_token;
      timerCheck();
    })
    .catch(handleFatalError);
};

const getCurrentlyPlaying = () => {
  axios
    .get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    })
    .then(function ({ data }) {
      if (!data.progress_ms) {
        return handleFatalError({ message: 'No song playing!', stack: '' });
      }
      timeRemaining = data.item.duration_ms - data.progress_ms + 1000;
      const minutes = Math.floor(timeRemaining / 60000);
      const seconds = ((timeRemaining % 60000) / 1000).toFixed(0);
      const newSong = data.item.artists[0].name + ' - ' + data.item.name;
      if (newSong !== currentSong) {
        currentSong = data.item.artists[0].name + ' - ' + data.item.name;
        setSlackStatus({
          status_text: `${currentSong}`,
          status_emoji: ':spotify:',
        });
        console.log(
          'Time remaining:',
          `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`,
          'Song is: ',
          currentSong
        );
      }
    })
    .catch(handleFatalError);
};

const timerCheck = () => {
  getCurrentlyPlaying();
  setTimeout(timerCheck, timeRemaining);
};

const setSlackStatus = (profile) =>
  axios
    .post(
      'https://slack.com/api/users.profile.set',
      {
        profile,
      },
      {
        headers: {
          Authorization: `Bearer ${slackToken}`,
        },
      }
    )
    .catch((error) => console.error(error));

opn(
  `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=code&redirect_uri=${callBackUrl}&scope=user-read-currently-playing%20user-read-playback-state`
);

app.get('/callback', function (req, res) {
  res.send('You can now close this window 👋!');
  getUserToken(req);
  getSpotifyAuth(userToken);
});

app.listen(3001, function () {
  console.log('server started on port 3001');
});
