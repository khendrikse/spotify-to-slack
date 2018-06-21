require('dotenv').config()
const express = require('express');
const app = express();
const opn = require('opn');
const axios = require('axios');

const clientID = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

let token = ''
let response = {}
let auth_code = ''
let timeRemaining = 1000
let currentSong = ''


const getToken = (res) => {
  response = res.json()
  token = response.socket._httpMessage.req.url.split('=')[1]
}

const getAuth = (token) => {
  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    params: {
      grant_type: 'authorization_code',
      code: token,
      redirect_uri: 'http://localhost:3001/callback'
    },
    headers: {
      Authorization: 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64')),
    }
  })
    .then(function (response) {
      auth_code = response.data.access_token
      console.log('now in getAuth, Timer is: ', timeRemaining)
      timerCheck()
    })
    .catch(error => console.error('Error inside getAuth()', error))
}

const getCurrentlyPlaying = () => {
  console.log('now in getCurrentlyPlaying, Timer is: ', timeRemaining)
  axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${auth_code}`
    }
  })
    .then(function (response) {
      timeRemaining = (response.data.item.duration_ms - response.data.progress_ms) + 1000
      currentSong = response.data.item.artists[0].name + ' - ' + response.data.item.name
      console.log('Timeout is:', timeRemaining, 'Song is: ', currentSong)
      return console.log('DID IT!')
    })
    .catch(error => console.error('Error:', error))
}

const timerCheck = () => {
  console.log('now in timerCheck, Timer is: ', timeRemaining)
  getCurrentlyPlaying()
  console.log('sup')
  setTimeout(timerCheck, timeRemaining)
}

opn(`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=code&redirect_uri=http://localhost:3001/callback&scope=user-read-currently-playing%20user-read-playback-state`)

app.get('/callback', function (req, res) {
  res.send('You can now close this window 👋!')

  getToken(res)
  getAuth(token)
})

// what port to run server on
app.listen(3001, function () {
  console.log('server started on port 3001');
});
