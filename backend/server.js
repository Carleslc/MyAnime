const express = require('express');

const app = express();

const cors = require('cors');

app.use(cors());

const nconf = require('nconf');

nconf.argv().env();

const port = nconf.get('PORT') || 3000;

// eslint-disable-next-line import/order
const handler = require('./error-handler');

const redis = require('redis');

const client = redis
  .createClient(nconf.get('REDIS_PORT') || '6379', nconf.get('REDIS_HOST') || '127.0.0.1', {
    auth_pass: nconf.get('REDIS_KEY'),
    return_buffers: true,
  })
  .on('error', handler.console());

const cache = require('express-redis-cache')({ client, prefix: 'anime' });

/* cache.on('message', function(message) {
  console.log(message);
}); */

app.get('/', (req, res) => {
  res.send('<h2>MyAnime API</h2><a href="https://my-anime.netlify.app/">Go to the app</a>');
});

const calendar = require('./calendar');

app.get('/calendar', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  calendar
    .fetch(cache)
    .then((cal) => res.send(cal))
    .catch(handler.http(res));
});

const providers = require('./providers/providers');

let whitelist = [];

const whitelistEnv = nconf.get('WHITELIST');
if (whitelistEnv) {
  whitelist = whitelistEnv.split(',');
}

app.get('/provider/:name', (req, res) => {
  const origin = req.headers.origin || req.headers.host;
  if (whitelist.length > 0 && !whitelist.includes(origin)) {
    res.status(403).send(`Forbidden (whitelist). Origin ${origin} not allowed.`);
    return;
  }

  const provider = req.params.name;
  const title = req.query.title;
  const episode = req.query.episode;

  if (!providers.has(provider)) {
    res.status(404).send(`Provider ${provider} not found`);
  } else if (!title) {
    res.status(400).send('Missing title parameter');
  } else {
    providers
      .getUrl(cache, provider, title, episode)
      .then((url) => {
        if (url) {
          res.send({ url });
        } else {
          res.status(404).send(`Anime ${title} not found for provider ${provider}`);
        }
      })
      .catch(handler.http(res));
  }
});

providers.expireAll(cache);

calendar.refreshTask(cache);

app.listen(port, (err) => {
  console.log(err || `Server is listening on ${port}`);
});
