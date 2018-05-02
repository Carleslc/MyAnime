const express = require('express')
const fetch = require('request')
const cors = require('cors')
const app = express()
const port = 8080

const basicAuth = require('basic-auth')

const mal = require('popura')

const calendar = require('./calendar');

const bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())

function get(url, username, password) {
  return new Promise(function(resolve, reject) {
    var options = { url: url }
    if (username && password) {
      options.auth = {
        user: username,
        password: password
      }
    }
    fetch(options, function(error, res, body) {
      if (!error && res.statusCode === 200) {
        resolve(body)
      } else {
        reject(body || error, (res && res.statusCode) || 500)
      }
    })
  })
}

function auth(next) {
  return (req, res) => {
    function unauthorized(msg) {
      return res.status(401).send(msg || 'Invalid credentials');
    }
 
    user = basicAuth(req);
 
    if (!user || !user.name || !user.pass) {
        return unauthorized();
    }

    get('https://myanimelist.net/api/account/verify_credentials.xml', user.name, user.pass)
      .then(body => next(req, res, mal(user.name, user.pass)))
      .catch((err, status) => unauthorized(err))
  }
}

function handler(res) {
  return (err, status) => {
    console.error(JSON.stringify(err))
    res.status(status || 500).send(err.message)
  }
}

app.get('/', (req, res) => {
  res.send('MyAnime API')
})

app.get('/calendar', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  get('https://notify.moe/calendar')
    .then(body => res.send(JSON.stringify(calendar(body))))
    .catch(handler(res))
})

app.post('/update', auth((req, res, mal) => {
  if (!req.body.id) {
    res.sendStatus(400)
  } else {
    console.log(`/update ${req.body.id} User ${mal.getUser()}`);
    mal.updateAnime(req.body.id, {
      episode: req.body.episode,
      status: req.body.status,
      date_start: req.body.date_start,
      date_finish: req.body.date_finish
    }).then(body => res.send(body))
      .catch(err => res.status(err.statusCode).send(err.statusMessage))
  }
}))

app.listen(port, (err) => {
  console.log(err || `Server is listening on ${port}`)
})