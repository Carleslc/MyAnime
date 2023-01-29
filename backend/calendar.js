const { DateTime } = require('luxon');
const cheerio = require('cheerio');
const jsonframe = require('jsonframe-cheerio');
const isEqual = require('lodash.isequal');
const get = require('./http-utils');
const handler = require('./error-handler');

const tag = 'calendar';
const refreshSeconds = 60 * 60 * 24;
const backupTTL = refreshSeconds;

// Alternative: https://www.livechart.me/timetable
const CALENDAR_URL = 'https://notify.moe/calendar';

function formatDateTime(dateTime) {
  // https://moment.github.io/luxon/docs/manual/formatting.html#table-of-tokens
  return dateTime.toFormat('EEE dd/MM/yyyy, HH:mm ZZZZ');
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
          date: '.calendar-entry-time @ datetime',
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
  // eslint-disable-next-line no-unused-vars
  cache.add(tag, calendar, { expire: backupTTL, type: 'json' }, (error, _added) => {
    if (error) {
      console.error(`Calendar set cache error: ${error.message}`);
    } else {
      console.log('Calendar refreshed successfully');
    }
  });
}

function removeCalendarDuplicates(calendar) {
  const titleEpisodes = {}; // title: [int(episode)]
  const filteredEntries = [];

  calendar.airingAnimes.forEach((entry) => {
    const sameTitleEpisodes = titleEpisodes[entry.title];
    const entryEpisode = parseInt(entry.episode, 10);

    if (sameTitleEpisodes) {
      // Discard duplicated episodes (keep older date, i.e. first episode added) [previousEpisode === entryEpisode]
      // Discard older episodes published later (e.g. dubbed versions) [previousEpisode > entryEpisode]
      if (!sameTitleEpisodes.some((previousEpisode) => previousEpisode >= entryEpisode)) {
        filteredEntries.push(entry);
        sameTitleEpisodes.push(entryEpisode);
      }
    } else {
      filteredEntries.push(entry);
      titleEpisodes[entry.title] = [entryEpisode];
    }
  });

  return {
    airingAnimes: filteredEntries
  };
}

function clean(calendar) {
  try {
    return removeCalendarDuplicates(calendar);
  } catch (e) {
    console.error('Cannot clean calendar', e);
    return calendar;
  }
}

function getCurrentCalendar(cache) {
  return new Promise((resolve, reject) => {
    cache.get(tag, (error, entries) => {
      if (error) {
        console.error(`Calendar get cache error: ${error.message}`);
        reject(error);
      } else if (entries.length > 0) {
        resolve(entries[0].body);
      } else {
        console.warn('Calendar not cached!');
        resolve(null);
      }
    });
  });
}

function fetch(cache) {
  return new Promise((resolve, reject) => {
    function retrieve() {
      get(CALENDAR_URL)
        .then((html) => {
          const calendar = clean(parse(html));
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
      getCurrentCalendar(cache)
        .then((calendarData) => {
          if (calendarData !== null) {
            resolve(calendarData);
          } else {
            retrieve();
          }
        })
        .catch(reject);
    } else retrieve();
  });
}

function expire(cache) {
  return new Promise((resolve, reject) => {
    cache.del(tag, (error, n) => {
      if (error) {
        console.error(`Calendar del cache error: ${error.message}`);
        reject(error);
      } else if (n > 0) {
        console.log('Expired calendar entries');
      }
      resolve();
    });
  });
}

function refreshTask(cache) {
  function refresh() {
    console.log(`[${formatDateTime(DateTime.utc())}] Refreshing calendar...`);
    fetch()
      .then((newCalendar) => {
        getCurrentCalendar(cache).then((oldCalendar) => {
          if (oldCalendar === null || !isEqual(oldCalendar, newCalendar)) {
            expire(cache).then(() => {
              set(cache, newCalendar);
            });
          } else {
            console.log('Calendar is already up to date');
          }
        });
      })
      .catch(handler.httpConsole());
  }
  setImmediate(refresh);
  const now = DateTime.utc();
  const scheduleLoop = now.startOf('day').plus({ days: 1, hours: 1, minutes: 1 }); // some delay to wait for an update at notify.moe/calendar
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
