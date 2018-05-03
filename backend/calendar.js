const luxon = require('luxon');
const cheerio = require('cheerio');
const jsonframe = require('jsonframe-cheerio');
const get = require('./http-utils');
const handler = require('./error-handler');
const idify = require('./utils');

const tag = 'calendar';
const refreshSeconds = 60 * 60 * 24;
const backupTTL = refreshSeconds * 2;

function now() {
  return luxon.DateTime.fromJSDate(new Date()).toLocaleString(luxon.DateTime.DATETIME_SHORT_WITH_SECONDS);
}

function parse(html) {
  let _ = cheerio.load(html);
  jsonframe(_);

  var frame = {
    airingAnimes: {
      _s: ".calendar-entry",
      _d: [{
        title: ".calendar-entry-title",
        episode: ".calendar-entry-episode | number",
        date: ".calendar-entry-time @ data-date"
      }]
    }
  };

  /*
    airingAnimes: [
      {
        title: "One Piece",
        episode: "835",
        date: "2018-05-06T00:30:00Z"
      },
      ...
    ]
  */

  return _('.week').scrape(frame);
}

/*
  {
    "one-piece": {
      episode: "835",
      airingDate: "2018-05-06T02:30:00.000+02:00",
      weekday: "Sunday",
      date: "May 6, 2018"
      time: "02:30"
    },
    ...
  }
*/
function localize(calendar, offset) {
  var airingAnimes = {}
  for (anime of calendar.airingAnimes) {
    let date = luxon.DateTime.fromJSDate(new Date(anime.date /* utc */)).plus({ hours: offset })
    airingAnimes[idify(anime.title)] = {
      episode: anime.episode,
      airingDate: date.toISO(),
      weekday: date.weekdayLong,
      date: date.toLocaleString(luxon.DateTime.DATE_FULL),
      time: date.toLocaleString(luxon.DateTime.TIME_24_SIMPLE)
    }
  }
  return JSON.stringify(airingAnimes)
}

function fetch(cache, offset) {
  return new Promise(function(resolve, reject) {
    let withLocale = offset >= 0;
    function retrieve() {
      get('https://notify.moe/calendar').then(html => {
        let calendar = parse(html)
        if (cache) {
          set(cache, JSON.stringify(calendar))
        }
        console.log('Calendar retrieved')
        resolve(withLocale ? localize(calendar, offset) : JSON.stringify(calendar))
      }).catch(reject)
    }
    if (cache) {
      cache.get(tag, function(error, entries) {
        if (error) {
          reject('Calendar get cache error: ' + error.message)
        } else if (entries.length > 0) {
          let calendar = entries[0].body;
          resolve(withLocale ? localize(JSON.parse(calendar), offset) : calendar);
        } else {
          console.warn('Calendar not cached! Retrieving calendar...')
          retrieve()
        }
      })
    } else retrieve()
  })
}

function set(cache, calendar) {
  cache.add(tag, calendar,
    { expire: backupTTL, type: 'json' },
    function(error, added) {
      if (error) {
        console.error('Calendar set cache error: ' + error.message)
      } else {
        console.log(`Calendar refreshed successfully [${now()}]`)
      }
    })
}

function expire(cache) {
  cache.del(tag, function(err, n) {
    if (err) {
      console.error('Calendar del cache error: ' + error.message)
    } else {
      console.log(`Expired ${n} calendar entries`)
    }
  })
}

function refreshTask(cache) {
  function refresh() {
    console.log('Refreshing calendar...')
    fetch()
      .then(calendar => set(cache, calendar))
      .catch(handler.httpConsole())
  }
  setImmediate(function() {
    expire(cache)
    refresh()
  })
  setInterval(refresh, refreshSeconds * 1000)
}

module.exports = {
  now: now,
  fetch: fetch,
  expire: expire,
  refreshTask: refreshTask,
  expiration: backupTTL
}