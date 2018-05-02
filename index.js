// Utils

//let got = require('got');
//global.setImmediate = require('timers').setImmediate; // got dependency

let storage = typeof(Storage) !== "undefined" ? {
  get: function(tag) {
    return localStorage.getItem(tag);
  },
  with: function(tag, callback) {
    let value = this.get(tag);
    if (value !== null) {
      callback(value);
    }
  },
  set: function(tag, value) {
    localStorage.setItem(tag, value);
  },
  remove: function(tag) {
    localStorage.removeItem(tag);
  }
} : {
  get: function(tag) { return null; },
  with: function(tag, callback) {},
  set: function(tag, value) {},
  remove: function(tag) {}
};

function pad(n, size) {
  let s = String(n);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
}

function formatToday() {
  let now = new Date();
  return `${pad(now.getMonth() + 1)}${pad(now.getDate())}${now.getFullYear()}`;
}

var serializer;
function toXML(o) {
  serializer = serializer || new X2JS();
  return serializer.json2xml_str(o);
}

function finishLoading(name) {
  let f = function() {
    loading(false);
  };
  f.name = name;
  return f;
}

function FETCH(method, url, success, error, opts) {
  let sendOpts = {
    url: url,
    type: method,
    cache: false,
    success: function(response, textStatus, xhr) {
      success(xhr.responseText, xhr.status);
    },
    error: function(xhr, textStatus, errorThrown) {
      if (error) {
        error(xhr.responseText, xhr.status);
      }
    }
  };
  if (opts) {
    opts(sendOpts);
  }
  return $.ajax(sendOpts);
}

function GET(url, success, error, opts) {
  return FETCH('GET', url, success, error, opts);
}

function _POST(base, url, data, success, error, opts) {
  return base('POST', url, success, error, withOpts(opts, function(ajaxOpts) {
    ajaxOpts.data = data;
  }));
}

function POST(url, data, success, error, opts) {
  return _POST(FETCH, url, data, success, error, opts);
}

function CORS(method, url, success, error, opts) {
  return FETCH(method, `https://cors-anywhere.herokuapp.com/${url}`, success, error, withOpts(opts, function(ajaxOpts) {
    ajaxOpts.addRequestHeader("Access-Control-Allow-Origin", "*");
    ajaxOpts.crossDomain = true;
  }));
}

function GET_CORS(url, success, error, opts) {
  return CORS('GET', url, success, error, opts);
}

function POST_CORS(url, data, success, error, opts) {
  return _POST(CORS, url, data, success, error, opts);
}

function withOpts(opts, fOpts) {
  return function(ajaxOpts) {
    if (opts) {
      opts(ajaxOpts);
    }
    fOpts(ajaxOpts);
  };
}

Object.prototype.addRequestHeader = function(name, value) {
  let customBeforeSend = this.beforeSend;
  this.beforeSend = function(xhr) {
    if (customBeforeSend) {
      customBeforeSend(xhr);
    }
    xhr.setRequestHeader(name, value);
  };
}

Function.prototype.and = function(fOpts) {
  let self = this;
  return function(opts) {
    self(opts);
    fOpts(opts);
  };
}

function contentType(type) {
  return function(opts) {
    opts.addRequestHeader("Content-Type", type);
  };
}

// Authorization

var authToken;

function buildAuthToken(user, password) {
  authToken = authToken || btoa(user + ":" + password);
}

function auth() {
  return function(opts) {
    opts.addRequestHeader("Authorization", "Basic " + authToken);
  };
}

// Settings

let watching = $("#watching");
let onHold = $("#on-hold");
let planToWatch = $("#plan-to-watch");

var user, userId;
var provider;
var filter;
var useAlternativeTitles;
var airingAnimes = {};
var animes = [];

$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();

  $.support.cors = true;

  (function loadSettings() {
    loading(true);

    // Information
    let recurrentUser = storage.get("recurrentUser");
    if (!recurrentUser) {
      $('#info').modal('show');
      storage.set("recurrentUser", true);
    }

    // Provider
    storage.with("provider", function(provider) {
      $('#provider-selector').val(provider).change();
    });
    provider = $('#provider-selector').val();

    $('#provider-selector').on('change', function() {
      provider = $(this).val();
      storage.set("provider", provider);
    });

    // Filter
    storage.with("filter", function(filter) {
      $('#filter-selector').val(filter).change();
    });
    filter = parseInt($('#filter-selector').val());

    $('#filter-selector').on('change', function() {
      filter = parseInt($('#filter-selector').val());
      storage.set("filter", filter);
      parseAnime();
    });

    // Alternative Titles
    storage.with("alternatives", function(alternatives) {
      $('#alternatives').prop('checked', alternatives == 'true');
    });
    useAlternativeTitles = $('#alternatives').is(':checked');

    $('#alternatives').on('change', function() {
      useAlternativeTitles = $('#alternatives').is(':checked');
      storage.set("alternatives", useAlternativeTitles);
      parseAnime();
    });

    // User
    storage.with("user", function(user) {
      $('#search-user').val(user).change();
    });

    // Load contents
    fetchCalendar().then(searchUser).catch((error) => alert(error)).then(finishLoading('settingsFinish'));
  })();
});

// API

function getTitle(originalTitle, synonymsRaw) {
  if (useAlternativeTitles && synonymsRaw) {
    let synonyms = synonymsRaw.split('; ').filter(s => s != null && s.trim() != "" && s.trim() != originalTitle);
    if (synonyms.length > 0) {
      let alt = synonyms[synonyms.length - 1];
      if (alt.length > 3) return alt;
    }
  }
  return originalTitle;
}

function asUrl(s, append, prov) {
  if (append) {
    s = `${s}-${append}`;
  }
  s = s.toLowerCase();
  if ((prov || provider) in ["animemovil", "gogoanime"]) {
    s = s.replace(/[;]/g, '');
  }
  s = s.replace(/[^-a-z0-9]+/g, '-').replace(/-{2,}/, '-');
  return encodeURIComponent(s);
}

function idify(s) {
  return asUrl(s, null, '');
}

function watchAnime(title, chapter, malId, movie) {
  function chapterIfNotMovie() {
    return movie ? '' : `${chapter}-`;
  }
  function getUrl() {
    if (provider == "myanimelist") return `https://myanimelist.net/anime/${malId}/-/video`;
    else if (provider == "lucky-es") return "https://duckduckgo.com/?q=!ducky+" + encodeURIComponent(`${title} ${chapter} online español -english`);
    else if (provider == "google-es") return 'https://www.google.com/search?btnI&q=' + encodeURIComponent(`${title} ${chapter} online español -english`);
    else if (provider == "lucky-en") return "https://duckduckgo.com/?q=!ducky+" + encodeURIComponent(`${title} episode ${chapter} online english anime -español`);
    else if (provider == "google-en") return 'https://www.google.com/search?btnI&q=' + encodeURIComponent(`${title} ${chapter} online english`);
    else if (provider == "animeid") return `https://www.animeid.tv/v/${asUrl(title, chapter)}`;
    else if (provider == "animeflv") return "https://duckduckgo.com/?q=!ducky+" + encodeURIComponent(`site:animeflv.net ${title} inurl:${chapter} -/${chapter}/`);
    else if (provider == "animemovil") return `https://animemovil.com/${asUrl(title, chapterIfNotMovie() + "sub-espanol")}/`;
    else if (provider == "jkanime") return `http://jkanime.net/${asUrl(title)}/${chapter}/`;
    else if (provider == "tvanime") return `http://tvanime.org/ver/${asUrl(title, chapter)}`;
    else if (provider == "twist") return `https://twist.moe/a/${asUrl(title)}/${chapter}`;
    else if (provider == "gogoanime") return `https://www2.gogoanime.se/${asUrl(title, `episode-${chapter}`)}`;
    else if (provider == "crunchyroll") return `https://www.crunchyroll.com/search?q=${encodeURI(`${title} ${chapter}`)}`;
    else if (provider == "netflix") return `https://www.netflix.com/search?q=${encodeURI(title)}`;
  }
  let url = getUrl();
  console.log(url);
  window.open(url);
}

function getAnimeFigure(title, synonyms, chapter, maxChapter, image, malId, movie, animeStatus, callback) {
  title = getTitle(title, synonyms);
  callback(`<article id="anime-${malId}">
    <div>
      <header>${title} #${chapter}</header>
      <figure>
        <img src="${image}" class="cover" width="225" height="313">
      </figure>
      <aside>
        <span id="next-${malId}" class="p" data-toggle="tooltip" data-placement="top" title="Mark this episode as watched in your MyAnimeList profile.">Next</span>
      </aside>
    </div>
  </article>`);
  $(`#anime-${malId} div`).click(function() { watchAnime(title, chapter, malId, movie) });
  $(`#next-${malId}`).click(function() { updateChapter(event, title, synonyms, chapter, maxChapter, image, malId, movie, animeStatus) });
}

function emptyAnime() {
  watching.empty();
  onHold.empty();
  planToWatch.empty();
}

var airingAnime;

function isAired(title, chapter, animeStatus) {
  airingAnime = undefined;
  function isAiringAired(anime) {
    return anime.episode > chapter || (anime.episode == chapter && anime.airingDate < new Date());
  }
  var aired;
  title = idify(title);
  if (animeStatus == 1) {
    if (title in airingAnimes) {
      airingAnime = airingAnimes[title];
      aired = isAiringAired(airingAnime);
    } else {
      aired = true;
    }
  } else {
    aired = animeStatus == 2;
  }
  return aired;
}

function parseAnime() {
  emptyAnime();

  for (anime of animes) {
    let status = anime.my_status; // 1 - Watching, 2 - Completed, 3 - On Hold, 4 - Dropped, 6 - Plan to Watch
    let animeStatus = anime.series_status; // 1 - Currently Airing, 2 - Finished, 3 - Not yet aired
    let type = anime.series_type; // 1 - TV, 2 - OVA, 3 - Movie, 4 - Special, 5 - ONA, 6 - Music
    let episodes = parseInt(anime.series_episodes);
    let nextChapter = parseInt(anime.my_watched_episodes) + 1;
    if ((episodes == 0 || nextChapter <= episodes) && (filter == 0 || filter == type)) {
      var section;
      if (status == 1) {
        section = watching;
      } else if (status == 3) {
        section = onHold;
      } else if (status == 6) {
        section = planToWatch;
      }
      let title = anime.series_title;
      if (section && isAired(title, nextChapter, animeStatus)) {
        getAnimeFigure(title, anime.series_synonyms, nextChapter, episodes, anime.series_image, anime.series_animedb_id, type == 3, animeStatus, function(figure) {
          section.append(figure);
        });
      }
    }
  }
}

function changeProfile(id) {
  var icon;
  if (id == undefined) {
    icon = "load-fig.gif";
  } else if (id == 0) {
    icon = "mal.jpg";
  } else {
    icon = `https://myanimelist.cdn-dena.com/images/userimages/${id}.jpg`;
    $("#profile-link").attr("href", `https://myanimelist.net/profile/${user}`);
    storage.set("user", user);
  }
  $("#profile-icon").attr("src", icon);
}

function loading(enabled) {
  console.log(`${loading.caller.name}: Loading ${enabled}`);
  changeProfile(enabled ? undefined : userId || 0);
}

function searchUser() {
  user = $("#search-user").val();
  if (user) {
    loading(true);
    // Alternative API: https://kuristina.herokuapp.com/anime/${user}.json
    // Alternative API: https://bitbucket.org/animeneko/atarashii-api (Needs deployment)
    GET_CORS(`https://myanimelist.net/malappinfo.php?u=${user}&status=1,3,6&type=anime`, (body, status) => {
      let mal = fromXML(body).myanimelist;
      if (mal) {
        animes = mal.anime || [];
        parseAnime();
        userId = mal.myinfo.user_id;
        changeProfile(userId);
      } else {
        alert(`User ${user} does not exists.`);
      }
    }).always(finishLoading('searchUserFinish'));
  }
  return false;
}

$("#search-user-form").submit(function(e) {
  searchUser();
  e.preventDefault(); // Don't reload
});

$("#submitBtn").click(searchUser);

var checkpoint;

function updatePassword() {
  let password = $("#password").val().trim();
  if (password != '') {
    loading(true);
    
    buildAuthToken(user, password);

    GET_CORS('https://myanimelist.net/api/account/verify_credentials.xml', (body, status) => {
      if (status === 200) {
        storage.set('password', password);
        $("#set-password").modal('hide');
        checkpoint();
      } else {
        alert(body);
      }
    }, (body, status) => alert(body),
    auth()).always(finishLoading('updatePasswordFinish'));
  }
}

$("#update-password-btn").click(updatePassword);

function updateChapter(event, title, synonyms, chapter, maxChapter, image, malId, movie, animeStatus) {
  let password = storage.get('password');
  if (password == null) {
    checkpoint = function() {
      updateChapter(event, title, synonyms, chapter, maxChapter, image, malId, movie, animeStatus);
    };
    $("#set-password").modal('show');
  } else {
    loading(true);

    buildAuthToken(user, password);

    let entry = { episode: chapter };

    if (chapter == 1) {
      entry.status = 1;
      entry.date_start = formatToday();
    }

    let completed = chapter == maxChapter;
    if (completed) {
      entry.status = 2;
      entry.date_finished = formatToday();
    }

    function updateAnime() {
      let index = animes.findIndex(anime => anime.series_animedb_id == malId);
      function removeFigure() {
        $(`#anime-${malId}`).remove();
        animes.splice(index, 1);
      }
      if (completed) {
        removeFigure();
        alert(`Hooray! You've completed ${title}!`);
      } else if (!isAired(title, chapter + 1, animeStatus)) {
        removeFigure();
        alert(`Updated ${title} to episode ${chapter}. Next episode will be available next ${airingAnime.weekday} (${airingAnime.date}) about ${airingAnime.time}h.`);
      } else {
        getAnimeFigure(title, synonyms, chapter + 1, maxChapter, image, malId, movie, animeStatus, function(figure) {
          $(`#anime-${malId}`).replaceWith(figure);
        });
        let anime = animes[index];
        anime.my_status = entry.status || anime.my_status;
        anime.my_watched_episodes = chapter;
        alert(`Updated ${title} to episode ${chapter}.`);
      }
    }

    function cannotUpdate(reason) {
      storage.remove('password');
      alert(`Cannot update episode, reason: ${reason}`);
    }

    // data=%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Centry%3E%3Cepisode%3E9%3C%2Fepisode%3E%3C%2Fentry%3E
    let data = encodeURI(`data=<?xml version="1.0" encoding="UTF-8"?><entry>${toXML(entry)}</entry>`);

    /*got(`https://cors-anywhere.herokuapp.com/https://myanimelist.net/api/animelist/update/${malId}.xml`, {
      method: 'POST',
      headers: { Authorization: "Basic " + authToken },
      body: { data: data }
    }).then(res => res.body).then(body => {
      if (body === 'Updated') {
        updateAnime();
      } else {
        cannotUpdate(body);
      }
    }).catch(err => {
      cannotUpdate(err);
    }).then(finishLoading());*/

    POST_CORS(`https://myanimelist.net/api/animelist/update/${malId}.xml`, data, (body, status) => {
      if (body === 'Updated') {
        updateAnime();
      } else {
        cannotUpdate(body);
      }
    }, (body, status) => {
      storage.remove('password');
      cannotUpdate(body);
    }, auth().and(contentType("application/x-www-form-urlencoded"))).always(finishLoading('updateChapterFinish'));
  }

  event.stopPropagation(); // Inner trigger
}

function fetchCalendar() {
  return new Promise(function(resolve, reject) {
    let luxon = require('luxon');
    let cheerio = require('cheerio');
    let jsonframe = require('jsonframe-cheerio');

    GET_CORS("https://notify.moe/calendar", parseCalendar, (body, status) => reject(Error(`Cannot get calendar, reason: ${body} (Status ${status})`)));

    function parseCalendar(html) {
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

      for (anime of animeCalendar.airingAnimes) {
        let date = new Date(anime.date);
        let luxonDate = luxon.DateTime.fromJSDate(date);
        airingAnimes[idify(anime.title)] = {
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

      resolve();
    }
  });
}