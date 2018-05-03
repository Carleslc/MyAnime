let API = 'https://53bdde27.ngrok.io'; // https://myanime-app.appspot.com

let watching = $("#watching");
let onHold = $("#on-hold");
let planToWatch = $("#plan-to-watch");

var tasks = 0;
var user, userId;
var provider;
var filter;
var useAlternativeTitles;
var airingAnimes = {};
var animes = [];

function loading(enabled) {
  tasks += enabled ? 1 : -1;
  //console.log(`${loading.caller.name}, tasks ${tasks}`);
  changeProfile(tasks > 0 ? undefined : userId || 0);
}

function finishLoading(name) {
  let f = function() {
    loading(false);
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
    searchUser();
    loading(false);
  })();
});

function fetchCalendar() {
  return new Promise(function(resolve, reject) {
    if (filter < 0 || !jQuery.isEmptyObject(airingAnimes)) {
      console.log('Calendar not needed');
      resolve();
    }
    get(API + '/calendar', (body, status, response) => {
      airingAnimes = response;
      resolve();
    }, (reason, status) => {
      reason = reason || 'The server does not respond.';
      reject({ message: `Cannot get calendar, reason: ${reason}`, status: status });
    });
  });
}

function cannotFetchCalendar() {
  return error => {
    let message = error.message || error;
    if (error.status == 0) {
      console.warn(message);
    } else {
      alert(message);
    }
    airingAnimes.notEmpty = {};
  };
}

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
  fetchCalendar().catch(cannotFetchCalendar()).then(() => {
    emptyAnime();
    console.log(`Filter ${filter}`);
    for (anime of animes) {
      let status = anime.my_status; // 1 - Watching, 2 - Completed, 3 - On Hold, 4 - Dropped, 6 - Plan to Watch
      if (status != 2 && status != 4) {
        let animeStatus = anime.series_status; // 1 - Currently Airing, 2 - Finished, 3 - Not yet aired
        let type = anime.series_type; // 1 - TV, 2 - OVA, 3 - Movie, 4 - Special, 5 - ONA, 6 - Music
        let episodes = parseInt(anime.series_episodes);
        let nextChapter = parseInt(anime.my_watched_episodes) + 1;
        if ((episodes == 0 || nextChapter <= episodes) && (filter == 0 || filter == 7 || filter == type)) {
          var section;
          if (status == 1) {
            section = watching;
          } else if (status == 3) {
            section = onHold;
          } else if (status == 6) {
            section = planToWatch;
          }
          if (section) {
            let title = anime.series_title;
            var available = filter < 0 || isAired(title, nextChapter, animeStatus);
            if (filter == 7) {
              available = !available;
            }
            console.log(`${title} available: ${available}`);
            if (available) {
              getAnimeFigure(title, anime.series_synonyms, nextChapter, episodes, anime.series_image,
                anime.series_animedb_id, type == 3, animeStatus, function(figure) {
                section.append(figure);
              });
            }
          }
        }
      }
    }
  });
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

function searchUser() {
  user = $("#search-user").val();
  if (user) {
    loading(true);
    // Official API: https://myanimelist.net/malappinfo.php?u=${user}&status=1,3,6&type=anime (fromXML(body))
    // Alternative API: https://kuristina.herokuapp.com/anime/${user}.json
    // Alternative API: https://bitbucket.org/animeneko/atarashii-api (Needs deployment)
    get(`https://kuristina.herokuapp.com/anime/${user}.json`, (body, status, response) => {
      let mal = response.myanimelist;
      if (mal) {
        animes = mal.anime || [];
        parseAnime();
        userId = mal.myinfo.user_id;
        changeProfile(userId);
      } else {
        alert(`User ${user} does not exists.`);
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
    storage.set('password', password);
    $("#set-password").modal('hide');
    checkpoint();
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

    let entry = {
      id: malId,
      episode: chapter
    };

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