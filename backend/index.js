'use strict';

const express = require('express')
const app = express()
const port = 8080

const basicAuth = require('basic-auth')
const luxon = require('luxon')
const mal = require('popura')

const get = require('./http-utils')
const handler = require('./error-handler')
const calendar = require('./calendar')

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const cors = require('cors')
app.use(cors())

const nconf = require('nconf')
nconf.argv().env().file('keys.json')

const redis = require('redis')
const client = redis.createClient(
  nconf.get('redisPort') || '6379',
  nconf.get('redisHost') || '127.0.0.1',
  {
    'auth_pass': nconf.get('redisKey'),
    'return_buffers': true
  }
).on('error', (err) => console.error('ERR:REDIS:', err));

const cache = require('express-redis-cache')({ client: client, prefix: 'anime' })

function auth(req, res, next) {
  function unauthorized(msg) {
    return res.status(401).send(msg || 'Invalid credentials');
  }

  let user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
      return unauthorized();
  }

  get('https://myanimelist.net/api/account/verify_credentials.xml', user.name, user.pass)
    .then(body => {
      res.locals.mal = mal(user.name, user.pass)
      next()
    })
    .catch((err, status) => unauthorized(err))
}

app.get('/', (req, res) => {
  res.send('MyAnime API')
})

/*cache.on('message', function(message) {
  console.log(message);
});*/

app.post('/update', auth, (req, res) => {
  if (!req.body.id) {
    res.sendStatus(400)
  } else {
    console.log(`/update ${req.body.id} User ${res.locals.mal.getUser()}`)
    res.locals.mal.updateAnime(req.body.id, {
      episode: req.body.episode,
      status: req.body.status,
      date_start: req.body.date_start,
      date_finish: req.body.date_finish
    }).then(body => res.send(body))
      .catch(handler.http2(res))
  }
})

app.get('/calendar', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let locale = req.headers['accept-language'];
  let offsetHours = req.query.offset;
  calendar.fetch(cache, locale, offsetHours)
    .then(cal => res.send(cal))
    .catch(handler.http(res))
})

app.listen(port, (err) => {
  console.log(err || `Server is listening on ${port}`)
})

calendar.refreshTask(cache)