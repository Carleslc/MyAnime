let luxon = require('luxon');
let cheerio = require('cheerio');
let jsonframe = require('jsonframe-cheerio');
let idify = require('../utils');

let defaultProvider = 'any';

module.exports = function parseCalendar(html) {
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

  var animeCalendar = _('.week').scrape(frame);

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

  var airingAnimes = {};

  for (anime of animeCalendar.airingAnimes) {
    var date = new Date(anime.date);
    var luxonDate = luxon.DateTime.fromJSDate(date);
    airingAnimes[idify(anime.title, defaultProvider)] = {
      episode: anime.episode,
      airingDate: date,
      weekday: luxonDate.weekdayLong,
      date: luxonDate.toLocaleString(luxon.DateTime.DATE_FULL),
      time: luxonDate.toLocaleString(luxon.DateTime.TIME_24_SIMPLE)
    };
  }

  /*
    {
      "one-piece": {
        episode: "835",
        airingDate: 2018-05-06T00:30:00Z (Date),
        weekday: "Sunday",
        date: "May 6, 2018"
        time: "02:30"
      },
      ...
    }
  */

  return airingAnimes;
}