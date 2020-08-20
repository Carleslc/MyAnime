const express = require('express')

const app = express()

const cors = require('cors')

app.use(cors())

const nconf = require('nconf')

nconf.argv().env()

const port = nconf.get('PORT') || 3000

// eslint-disable-next-line import/order
const handler = require('./error-handler')

const redis = require('redis')

const client = redis.createClient(
  nconf.get('REDIS_PORT') || '6379',
  nconf.get('REDIS_HOST') || '127.0.0.1',
  {
    'auth_pass': nconf.get('REDIS_KEY'),
    'return_buffers': true
  }
).on('error', handler.console());

const cache = require('express-redis-cache')({ client, prefix: 'anime' })

const calendar = require('./calendar')

app.get('/', (req, res) => {
  res.send('<h2>MyAnime API</h2><a href="https://carleslc.me/MyAnime/">Go to the app</a>')
})

/* cache.on('message', function(message) {
  console.log(message);
}); */

app.get('/calendar', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  calendar.fetch(cache)
    .then(cal => res.send(cal))
    .catch(handler.http(res))
})

app.listen(port, (err) => {
  console.log(err || `Server is listening on ${port}`)
})

calendar.refreshTask(cache)
