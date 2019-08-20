const API = 'https://myanime-app.appspot.com';

const LOADING_PROFILE = 'load-fig.gif';
const DEFAULT_PROFILE = 'mal.jpg';

let watching = $("#watching");
let onHold = $("#on-hold");
let planToWatch = $("#plan-to-watch");

var tasks = 0;
var user, userIcon;
var provider;
var filter, filterType;
//var useAlternativeTitles;
var animes = [];

/*
  {
    "one-piece": {
      episode: "835",
      airingDate: "2018-05-06T02:30:00.000+02:00" (local)
    },
    ...
  }
*/
var airingAnimes = {};
var calendarFetched = false;

let providerOffsets = {
  "myanimelist": 0,
  "lucky-es": 0,
  "google-es": 0,
  "lucky-en": 0,
  "google-en": 0,
  "animeid": 3,
  "animeflv": 2,
  "animemovil": 2,
  "jkanime": 5,
  "tvanime": 3,
  "twist": 3,
  "gogoanime": 2,
  "crunchyroll": 1,
  "netflix": 0
};

let providers = {
  "myanimelist": "https://myanimelist.net/",
  "lucky-es": "https://duckduckgo.com/",
  "google-es": "https://www.google.es/",
  "lucky-en": "https://duckduckgo.com/",
  "google-en": "https://www.google.com/",
  "animeid": "https://www.animeid.tv/",
  "animeflv": "https://duckduckgo.com/",
  "animemovil": "https://animemovil.com/",
  "jkanime": "http://jkanime.net/",
  "tvanime": "http://tvanime.org/",
  "twist": "https://twist.moe/",
  "gogoanime": "https://www2.gogoanime.se/",
  "crunchyroll": "https://www.crunchyroll.com/",
  "netflix": "https://www.netflix.com/"
};

function loading(enabled) {
  tasks += enabled ? 1 : -1;
  //console.log(`${loading.caller.name}, tasks ${tasks}`);
  changeProfile(tasks > 0 ? LOADING_PROFILE : userIcon || DEFAULT_PROFILE);
}

function finishLoading(name) {
  let f = function() {
    loading(false);
    console.log(name);
  };
  Object.defineProperty(f, "name", { value: name });
  return f;
}

$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();

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
    $("#provider-link").attr("href", providers[provider]);

    $('#provider-selector').on('change', function() {
      provider = $(this).val();
      $("#provider-link").attr("href", providers[provider]);
      storage.set("provider", provider);
      if (filter == 7) { // Not yet aired: Date provider offset
        parseAnime();
      }
    });

    // Filter
    let filterSelector = $('#filter-selector');
    storage.with("filter", function(filter) {
      filterSelector.val(filter).change();
    });
    filter = parseInt(filterSelector.val());
    filterType = $('#filter-selector option:selected').text();

    filterSelector.on('change', function () {
      filter = parseInt(filterSelector.val());
      filterType = $('#filter-selector option:selected').text();
      storage.set("filter", filter);
      parseAnime();
    });

    // Alternative Titles
    // NOTE: Not provided with /animelist endpoint (Jikan API). Retrieving synonyms with /anime endpoint for each one is unfeasible.
    /*storage.with("alternatives", function(alternatives) {
      $('#alternatives').prop('checked', alternatives == 'true');
    });
    useAlternativeTitles = $('#alternatives').is(':checked');

    $('#alternatives').on('change', function() {
      useAlternativeTitles = $('#alternatives').is(':checked');
      storage.set("alternatives", useAlternativeTitles);
      parseAnime();
    });*/

    // User
    storage.with("user", function(user) {
      $('#search-user').val(user).change();
    });

    // Load contents
    searchUser();

    // Server disabled until MAL API works
    calendarFetched = true;
    /*fetchCalendar()
      .then(() => calendarFetched = true)
      .then(parseAnime)
      .catch(cannotFetchCalendar());*/
    loading(false);
  })();
});

function fetchCalendar() {
  return new Promise(function(resolve, reject) {
    if (!calendarFetched) {
      get(API + '/calendar', (body, status, calendar) => {
        for (anime of calendar.airingAnimes) {
          airingAnimes[idify(anime.title)] = {
            episode: anime.episode,
            airingDate: luxon.DateTime.fromISO(anime.date)
          }
        }
        resolve();
      }, (reason, status) => {
        reason = reason || 'The server does not respond.';
        reject({ message: `Cannot get calendar, reason: ${reason}`, status: status });
      });
    } else resolve();
  });
}

function cannotFetchCalendar() {
  return error => {
    calendarFetched = true;
    var message = error.message || error;
    if (error.status > 0 || filter >= 0) {
      alert(message + "\n\nFilter is showing episodes regardless of whether or not it has been aired.");
    }
    console.warn(message);
  };
}

/*unction getTitle(originalTitle, synonymsRaw) {
  if (useAlternativeTitles && synonymsRaw) {
    let synonyms = synonymsRaw.split('; ').filter(s => s != null && s.trim() != "" && s.trim() != originalTitle);
    if (synonyms.length > 0) {
      let alt = synonyms[synonyms.length - 1];
      if (alt.length > 3) return alt;
    }
  }
  return originalTitle;
}*/

function watchAnime(title, chapter, malId, movie, aired) {
  function getUrl() {
    function ifNotMovie(s) {
      return movie ? ' ' : s;
    }
    function inUrl(chapter) {
      return ifNotMovie(` inurl:${chapter} `);
    }
    function luckySpanish() {
      return encodeURIComponent(`${title}${inUrl(chapter)}online español -english`);
    }
    function luckyEnglish() {
      return encodeURIComponent(`${title}${ifNotMovie(` episode${inUrl(chapter)}`)}online english anime -español`);
    }
    let baseUrl = providers[provider];
    if (provider == "myanimelist") return `${baseUrl}anime/${malId}/${aired && !movie ? '-/video' : ''}`;
    else if (provider == "lucky-es") return `${baseUrl}?q=!ducky+` + luckySpanish();
    else if (provider == "google-es") return `${baseUrl}search?btnI&q=` + luckySpanish();
    else if (provider == "lucky-en") return `${baseUrl}?q=!ducky+` + luckyEnglish();
    else if (provider == "google-en") return `${baseUrl}search?btnI&q=` + luckyEnglish();
    else if (provider == "animeid") return `${baseUrl}v/${asUrl(title, chapter)}`;
    else if (provider == "animeflv") return `${baseUrl}?q=!ducky+` + encodeURIComponent(`site:animeflv.net ${title} inurl:${chapter} -/${chapter}/`);
    else if (provider == "animemovil") return `${baseUrl}${asUrl(title, (movie ? '' : `${chapter}-`) + "sub-espanol")}/`;
    else if (provider == "jkanime") return `${baseUrl}${asUrl(title)}/${chapter}/`;
    else if (provider == "tvanime") return `${baseUrl}ver/${asUrl(title, chapter)}`;
    else if (provider == "twist") return `${baseUrl}a/${asUrl(title)}/${chapter}`;
    else if (provider == "gogoanime") return `${baseUrl}${asUrl(title, `episode-${chapter}`)}`;
    else if (provider == "crunchyroll") return `${baseUrl}search?q=${encodeURI(`${title} ${chapter}`)}`;
    else if (provider == "netflix") return `${baseUrl}search?q=${encodeURI(title)}`;
  }
  let url = getUrl();
  console.log(url);
  window.open(url);
}

function getAnimeFigure(originalTitle, synonyms, chapter, maxChapter, image, malId, movie, animeStatus, start, callback) {
  let title = originalTitle;
  let aired = isAired(originalTitle, chapter, animeStatus, start);
  var release;
  if (!aired) {
    if (airingAnime) {
      release = formatDateTime(airingDate(airingAnime));
    } else if (start) {
      release = formatDate(start);
    }
  }
  callback(`<article id="anime-${malId}">
    <div>
      <header>${title} #${chapter}${release ? `<br><br>${release}` : ''}</header>
      <figure>
        <img src="${image}" class="cover" width="225" height="313">
      </figure>
      <aside>
        <span id="next-${malId}" class="p" data-toggle="tooltip" data-placement="top" title="Mark this episode as watched in your MyAnimeList profile.">Next</span>
      </aside>
    </div>
  </article>`);
  $(`#anime-${malId} div`).click(function() { watchAnime(title, chapter, malId, movie, aired) });
  $(`#next-${malId}`).click(function() { updateChapter(event, title, synonyms, chapter, maxChapter, image, malId, movie, animeStatus, start) });
}

function emptyAnime() {
  watching.empty();
  onHold.empty();
  planToWatch.empty();
}

var airingAnime;

function airingDate(anime) {
  return anime.airingDate.plus({ hours: providerOffsets[provider] });
}

function isAired(title, chapter, animeStatus, start) {
  airingAnime = undefined;
  function isAiringAired(anime) {
    return anime.episode > chapter || (anime.episode == chapter && airingDate(anime) < now());
  }
  function estimatedAiringDate() {
    return start.plus({ weeks: chapter })
  }
  var aired;
  if (animeStatus == 1) {
    title = idify(title);
    if (title in airingAnimes) { // in calendar
      airingAnime = airingAnimes[title];
      aired = isAiringAired(airingAnime);
    } else if (start) {
      aired = estimatedAiringDate() <= now();
      if (aired) { // estimation
        // TODO: ID (`https://notify.moe/_/anime-search/${title}`) exists?
        // Yes -> aired = Episode chapter has link (https://notify.moe/api/animeepisodes/ID)
      }
    } else {
      aired = false;
    }
  } else {
    aired = animeStatus == 2;
  }
  return aired;
}

function parseAnime(list, keep) {
  if (calendarFetched) {
    loading(true);
    if (!keep) {
      emptyAnime();
    }
    let animeList = list || animes;
    for (anime of animeList) {
      let status = anime.watching_status; // 1 - Watching, 2 - Completed, 3 - On Hold, 4 - Dropped, 6 - Plan to Watch
      if (status != 2 && status != 4) {
        let animeStatus = anime.airing_status; // 1 - Currently Airing, 2 - Finished, 3 - Not yet aired
        let type = anime.type; // TV, OVA, Movie, Special, ONA, Music
        let episodes = anime.total_episodes;
        let nextChapter = anime.watched_episodes + 1;
        if ((episodes == 0 || nextChapter <= episodes) && (filter <= 0 || filter == 7 || filterType == type)) {
          var section;
          if (status == 1) {
            section = watching;
          } else if (status == 3) {
            section = onHold;
          } else if (status == 6) {
            section = planToWatch;
          }
          if (section) {
            let title = anime.title;
            var start = '';
            if (anime.start_date) {
              start = luxon.DateTime.fromISO(anime.start_date);
            }
            var available = filter < 0 || isAired(title, nextChapter, animeStatus, start);
            if (filter == 7) {
              available = !available;
            }
            if (available) {
              getAnimeFigure(title, [] /* synonyms */, nextChapter, episodes, anime.image_url,
                anime.mal_id, type == 'Movie', animeStatus, start, function(figure) {
                section.append(figure);
              });
            }
          }
        }
      }
    }
    loading(false);
  }
}

function fetchAnimes() {
  function fetchAnimeList(list) {
    loading(true);
    get(`https://api.jikan.moe/v3/user/${user}/animelist/${list}`, (body, status, response) => {
      if (status == 200) {
        let animeList = response.anime || [];
        animes.push(...animeList);
        parseAnime(animeList, true);
      } else {
        console.log(`Animes ${list} not fetched. STATUS: ${status}`);
      }
    }).always(finishLoading(`Fetch Animes ${list} Finish`));
  }
  animes = [];
  fetchAnimeList('watching');
  fetchAnimeList('onhold');
  fetchAnimeList('ptw');
}

function changeProfile(icon) {
  $("#profile-link").attr("href", `https://myanimelist.net/profile/${user}`);
  $("#profile-icon").attr("src", icon);
}

function searchUser() {
  user = $("#search-user").val();
  if (user) {
    loading(true);
    get(`https://api.jikan.moe/v3/user/${user}`, (body, status, response) => {
      if (status == 200) {
        fetchAnimes();
        userIcon = response.image_url;
        changeProfile(userIcon);
        storage.set("user", user);
      } else {
        alert(`User ${user} does not exists.`);
        storage.remove('user');
      }
    }).always(finishLoading('Search User Finish'));
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
    $("#set-password").modal('hide');
    storage.set('password', password);
    checkpoint();
  }
}

$("#update-password-btn").click(updatePassword);

function updateAnime(title, synonyms, chapter, maxChapter, image, malId, movie, animeStatus, start) {
  let index = animes.findIndex(anime => anime.mal_id == malId);
  let anime = animes[index];

  function removeFigure() {
    $(`#anime-${malId}`).remove();
    animes.splice(index, 1);
  }

  let entry = {
    id: malId,
    episode: chapter
  };

  if (chapter == 1) {
    entry.status = 1;
    entry.date_start = formatTodayRaw();
  }

  let completed = chapter == maxChapter;
  if (completed) {
    entry.status = 2;
    entry.date_finished = formatTodayRaw();
  }

  // Open MAL URL (Manual updating until MAL Official API is restored to update episodes via code)
  window.open(anime.url, '_blank');

  if (completed) {
    removeFigure();
    alert(`Hooray! You've completed ${title}!`);
  } else if (!isAired(title, chapter + 1, animeStatus, start)) {
    removeFigure();
    alert(`Updated ${title} to episode ${chapter}. Next episode will be available: ${formatDateTime(airingDate(airingAnime))}.`);
  } else {
    getAnimeFigure(title, synonyms, chapter + 1, maxChapter, image, malId, movie, animeStatus, start, function (figure) {
      $(`#anime-${malId}`).replaceWith(figure);
    });
    anime.watching_status = entry.status || anime.watching_status;
    anime.watched_episodes = chapter;
    alert(`Updated ${title} to episode ${chapter}.`);
  }
}

function updateChapter(event, title, synonyms, chapter, maxChapter, image, malId, movie, animeStatus, start) {
  loading(true);
  updateAnime(title, synonyms, chapter, maxChapter, image, malId, movie, animeStatus, start);
  loading(false);
  event.stopPropagation(); // Inner trigger
}

function updateChapterAPI(event, title, synonyms, chapter, maxChapter, image, malId, movie, animeStatus, start) {
  let password = storage.get('password');
  if (password == null) {
    checkpoint = function() {
      updateChapterAPI(event, title, synonyms, chapter, maxChapter, image, malId, movie, animeStatus, start);
    };
    $("#set-password").modal('show');
  } else {
    loading(true);

    let entry = updateAnime(title, synonyms, chapter, maxChapter, image, malId, movie, animeStatus, start);

    function cannotUpdate(reason) {
      storage.remove('password');
      reason = reason || 'The server does not respond.';
      alert(`Cannot update episode, reason: ${reason}`);
    }

    post(API + '/update', JSON.stringify(entry), (body, status) => {
      if (body === 'Updated') {
        updateAnime();
      } else {
        cannotUpdate(body);
      }
    }, cannotUpdate, auth(user, password).and(contentType("application/json")))
    .always(finishLoading('Update Chapter Finish'));
  }

  event.stopPropagation(); // Inner trigger
}