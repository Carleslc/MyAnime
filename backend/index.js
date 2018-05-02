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

function auth(request, response, next) {
    function unauthorized(msg) {
      return response.status(401).send(msg || 'Invalid credentials');
    }
 
    user = basicAuth(request);
 
    if (!user || !user.name || !user.pass) {
        return unauthorized();
    }

    get('https://myanimelist.net/api/account/verify_credentials.xml', user.name, user.pass)
      .then(body => next(request, response, mal(user.name, user.pass)))
      .catch((err, status) => unauthorized(err))
}

app.get('/', (req, res) => {
  res.send('MyAnime API')
})

app.get('/calendar', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  get('https://notify.moe/calendar')
    .then(body => res.send(JSON.stringify(calendar(body))))
    .catch((err, status) => res.status(status).send(err))
})

app.post('/update', auth, (req, res, mal) => {
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
})

app.listen(port, (err) => {
  if (err) {
    return console.log('Error', err)
  }
  console.log(`Server is listening on ${port}`)
})