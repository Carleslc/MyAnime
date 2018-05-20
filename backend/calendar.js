const { DateTime } = require('luxon');
const cheerio = require('cheerio');
const jsonframe = require('jsonframe-cheerio');
const get = require('./http-utils');
const handler = require('./error-handler');

const tag = 'calendar';
const refreshSeconds = 60 * 60 * 24;
const backupTTL = refreshSeconds * 2;

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

function fetch(cache, offset) {
  return new Promise(function(resolve, reject) {
    let withLocale = offset >= 0;
    function retrieve() {
      get('https://notify.moe/calendar').then(html => {
        let calendar = parse(html);
        console.log('Calendar retrieved')
        if (cache) {
          set(cache, JSON.stringify(calendar))
        }
        resolve(JSON.stringify(calendar))
      }).catch(reject)
    }
    if (cache) {
      cache.get(tag, function(error, entries) {
        if (error) {
          reject('Calendar get cache error: ' + error.message)
        } else if (entries.length > 0) {
          resolve(entries[0].body);
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
        console.log('Calendar refreshed successfully')
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
  setImmediate(function refreshNow() {
    expire(cache)
    refresh()
  })
  now = DateTime.fromJSDate(new Date())
  schedule_loop = now.startOf('day').plus({ days: 1, minutes: 1 })
  schedule_loop_millis = schedule_loop.diff(now).toObject().milliseconds
  console.log('Refresh loop will start in ' + (schedule_loop_millis/1000/3600).toFixed(2) + ' hours at ' + schedule_loop.toLocaleString(DateTime.DATETIME_FULL))
  setTimeout(function scheduleRefresh() {
    refresh()
    setInterval(refresh, refreshSeconds * 1000)
  }, schedule_loop_millis)
}

module.exports = {
  fetch: fetch,
  expire: expire,
  refreshTask: refreshTask,
  expiration: backupTTL
}