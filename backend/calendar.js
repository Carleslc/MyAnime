const { DateTime } = require('luxon');
const cheerio = require('cheerio');
const jsonframe = require('jsonframe-cheerio');
const get = require('./http-utils');
const handler = require('./error-handler');

const tag = 'calendar';
const refreshSeconds = 60 * 60 * 24;
const backupTTL = refreshSeconds;

function formatDateTime(dateTime) {
  // https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens
  return dateTime.toLocaleString('EEE dd/MM/yyyy, HH:mm ZZZZ');
}

function parse(html) {
  const _ = cheerio.load(html);
  jsonframe(_);

  const frame = {
    airingAnimes: {
      _s: '.calendar-entry',
      _d: [
        {
          title: '.calendar-entry-title',
          episode: '.calendar-entry-episode | number',
          date: '.calendar-entry-time @ data-date',
        },
      ],
    },
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

function set(cache, calendar) {
  cache.add(tag, calendar, { expire: backupTTL, type: 'json' }, (error, added) => {
    if (error) {
      console.error(`Calendar set cache error: ${error.message}`);
    } else {
      console.log('Calendar refreshed successfully');
    }
  });
}

function fetch(cache) {
  return new Promise((resolve, reject) => {
    function retrieve() {
      get('https://notify.moe/calendar')
        .then((html) => {
          const calendar = parse(html);
          console.log('Calendar retrieved');
          const calendarData = JSON.stringify(calendar);
          if (cache) {
            set(cache, calendarData);
          }
          resolve(calendarData);
        })
        .catch(reject);
    }
    if (cache) {
      cache.get(tag, (error, entries) => {
        if (error) {
          console.error(`Calendar get cache error: ${error.message}`);
          reject(error);
        } else if (entries.length > 0) {
          resolve(entries[0].body);
        } else {
          console.warn('Calendar not cached! Retrieving calendar...');
          retrieve();
        }
      });
    } else retrieve();
  });
}

function expire(cache) {
  cache.del(tag, (error, n) => {
    if (error) {
      console.error(`Calendar del cache error: ${error.message}`);
    } else if (n > 0) {
      console.log(`Expired calendar entries`);
    }
  });
}

function refreshTask(cache) {
  function refresh() {
    console.log(`[${formatDateTime(DateTime.local())}] Refreshing calendar...`);
    expire(cache);
    fetch()
      .then((calendar) => set(cache, calendar))
      .catch(handler.httpConsole());
  }
  setImmediate(refresh);
  const now = DateTime.local();
  const scheduleLoop = now.startOf('day').plus({ days: 1 });
  const scheduleLoopMillis = scheduleLoop.diff(now).toObject().milliseconds;
  console.log(
    `Refresh loop will start in ${(scheduleLoopMillis / 1000 / 3600).toFixed(2)} hours at ${formatDateTime(
      scheduleLoop
    )}`
  );
  setTimeout(function scheduleRefresh() {
    refresh();
    setInterval(refresh, refreshSeconds * 1000);
  }, scheduleLoopMillis);
}

module.exports = {
  fetch,
  expire,
  refreshTask,
};
