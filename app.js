require('dotenv').config()
const express = require('express')
const app = express()
const opn = require('opn')
const axios = require('axios')

// We're not gonna mutate these
const callBackUrl = 'http://localhost:3001/callback'
const clientID = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const slackToken = process.env.SLACK_TOKEN

// We're totally gonna mutate these
let userToken = ''
let spotifyAccessToken = ''
let timeRemaining = 1000
let currentSong = ''

const getUserToken = (res) => userToken = res.json().socket._httpMessage.req.url.split('=')[1]

const getSpotifyAuth = (userToken) => {
  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    params: {
      grant_type: 'authorization_code',
      code: userToken,
      redirect_uri: callBackUrl
    },
    headers: {
      Authorization: 'Basic ' + (new Buffer(clientID + ':' + clientSecret).toString('base64')),
    }
  })
    .then(function (response) {
      spotifyAccessToken = response.data.access_token
      timerCheck()
    })
    .catch(error => console.error(error))
}

const getCurrentlyPlaying = () => {
  axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${spotifyAccessToken}`
    }
  })
    .then(function (response) {
      timeRemaining = (response.data.item.duration_ms - response.data.progress_ms) + 1000
      currentSong = response.data.item.artists[0].name + ' - ' + response.data.item.name
      console.log('Timeout is:', timeRemaining, 'Song is: ', currentSong)
      setSlackStatus(currentSong)
    })
    .catch(error => console.error(error))
}

const timerCheck = () => {
  getCurrentlyPlaying()
  setTimeout(timerCheck, timeRemaining)
}

const setSlackStatus = (currentSong) => {
  axios.post('https://slack.com/api/users.profile.set', {
    profile: {
      'status_text': `${currentSong}`,
      'status_emoji': ':spotify:'
    }
  }, {
      headers: {
        Authorization: `Bearer ${slackToken}`,
      }
    }
  ).catch(error => console.error(error))
}

opn(`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=code&redirect_uri=${callBackUrl}&scope=user-read-currently-playing%20user-read-playback-state`)

app.get('/callback', function (req, res) {
  res.send('You can now close this window 👋!')
  getUserToken(res)
  getSpotifyAuth(userToken)
})

// What port to run server on
app.listen(3001, function () {
  console.log('server started on port 3001')
})
