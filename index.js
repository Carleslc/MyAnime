// Utils

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
  serializer = serializer || new X2JS();
  return serializer.json2xml_str(o);
}

// Settings

let csrf_token = $('meta[name=csrf_token]').attr('content');
let watching = $("#watching");
let onHold = $("#on-hold");
let planToWatch = $("#plan-to-watch");
var user;
var provider;
var filter;
var useAlternativeTitles;
var animes = [];

$(document).ready(function() {
  $.support.cors = true;

  (function loadSettings() {
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
      searchUser();
    });
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

function asUrl(s, append) {
  if (append) {
    s = `${s}-${append}`;
  }
  s = s.toLowerCase().replace(/\s/g, '-').replace(/[^0-9a-z-]/gi, '-').replace(/--/g, '-')
  return encodeURIComponent(s);
}

function watchAnime(title, chapter, malId, movie) {
  function chapterIfNotMovie() {
    return movie ? '' : `${chapter}-`;
  }
  function getUrl() {
    if (provider == "myanimelist") return `https://myanimelist.net/anime/${malId}/-/video`;
    else if (provider == "lucky-es") return "https://duckduckgo.com/?q=!ducky+" + encodeURIComponent(`${title} ${chapter} online español -english`);
    else if (provider == "lucky-en") return "https://duckduckgo.com/?q=!ducky+" + encodeURIComponent(`${title} episode ${chapter} online english anime -español`);
    else if (provider == "animeid") return `https://www.animeid.tv/v/${asUrl(title, chapter)}`;
    else if (provider == "animeflv") return "https://duckduckgo.com/?q=!ducky+" + encodeURIComponent(`site:animeflv.net ${title} inurl:${chapter} -/${chapter}/`);
    else if (provider == "animemovil") return `https://animemovil.com/${asUrl(title, chapterIfNotMovie() + "sub-espanol")}/`;
    else if (provider == "jkanime") return `http://jkanime.net/${asUrl(title)}/${chapter}/`;
    else if (provider == "gogoanime") return `https://www2.gogoanime.se/${asUrl(title, `episode-${chapter}`)}`;
    else if (provider == "crunchyroll") return `https://www.crunchyroll.com/search?q=${encodeURI(`${title} ${chapter}`)}`;
    else if (provider == "netflix") return `https://www.netflix.com/search?q=${encodeURI(title)}`;
  }
  let url = getUrl();
  console.log(url);
  window.open(url);
}

function getAnimeFigure(title, synonyms, chapter, maxChapter, score, image, malId, movie) {
  function escape(s) {
    return s ? s.replace(/'/g, "\\'") : '';
  }
  title = getTitle(title, synonyms);
  escapedTitle = escape(title);
  return `<article>
    <div id="anime-${malId}" onclick="watchAnime('${escapedTitle}', ${chapter}, ${malId}, ${movie})">
      <header>${title} #${chapter}</header>
      <figure>
        <img src="${image}" class="cover" alt='${escapedTitle}' width="225" height="313">
      </figure>
      <aside>
        <span class="p" onclick="updateChapter(event, '${escapedTitle}', ${chapter}, ${maxChapter}, ${score}, ${malId})">Next</span>
      </aside>
    </div>
  </article>`;
}

function emptyAnime() {
  watching.empty();
  onHold.empty();
  planToWatch.empty();
}

function parseAnime() {
  emptyAnime();
  for (anime of animes) {
    let status = anime.my_status; // 1 - Watching, 2 - Completed, 3 - On Hold, 4 - Dropped, 6 - Plan to Watch
    let animeStatus = anime.series_status; // 1 - Currently Airing, 2 - Finished, 3 - Not yet aired
    let type = anime.series_type; // 1 - TV, 2 - OVA, 3 - Movie, 4 - Special, 5 - ONA, 6 - Music
    let episodes = parseInt(anime.series_episodes);
    let nextChapter = parseInt(anime.my_watched_episodes) + 1;
    if (animeStatus != 3 && (episodes == 0 || nextChapter <= episodes) && (filter == 0 || filter == type)) {
      var section;
      if (status == 1) {
        section = watching;
      } else if (status == 3) {
        section = onHold;
      } else if (status == 6) {
        section = planToWatch;
      }
      if (section) {
        section.append(getAnimeFigure(anime.series_title, anime.series_synonyms, nextChapter, episodes, anime.my_score, anime.series_image, anime.series_animedb_id, type == 3));
      }
    }
  }
}

function addBasicHeaders(xhr) {
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.setRequestHeader("User-Agent", "('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) '\
            'AppleWebKit/537.36 (KHTML, like Gecko) '\
            'Chrome/34.0.1847.116 Safari/537.36')");
}

function changeProfile(id, user) {
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
    changeProfile();
    // Alternative API: https://kuristina.herokuapp.com/anime/${user}.json
    // Alternative API: https://bitbucket.org/animeneko/atarashii-api (Needs deployment)
    $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://myanimelist.net/malappinfo.php?u=${user}&status=1,3,6&type=anime`,
      type: 'GET',
      cache: false,
      crossDomain: true,
      beforeSend: addBasicHeaders,
      success: function(data, textStatus, xhr) {
        response = fromXML(xhr.responseText);
        let mal = response.myanimelist;
        if (mal) {
          animes = mal.anime || [];
          parseAnime();
          changeProfile(mal.myinfo.user_id, user);
        } else {
          alert(`User ${user} does not exists.`);
          changeProfile(0);
        }
      },
      error: function(xhr) {
        changeProfile(0);
      }
    });
  }
  return false;
}

var checkpoint;

function updatePassword() {
  let password = $("#password").val().trim();
  if (password != '') {
    // TODO: Verify credentials
    storage.set('password', password);
    $("#set-password").modal('hide');
    checkpoint();
  }
}

function updateChapter(event, title, chapter, maxChapter, score, malId) {
  console.log(malId);
  let password = storage.get('password');
  if (password == null) {
    checkpoint = function() {
      updateChapter(event, title, chapter, maxChapter, malId);
    };
    $("#set-password").modal('show');
  } else {
    /*$.ajax({
      url: 'https://myanimelist.net/ownlist/anime/edit.json',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        'anime_id': malId,
        'num_watched_episodes': chapter
      }),
      dataType: 'json',
      contentType:"application/x-www-form-urlencoded; charset=UTF-8"
    });*/

    let entry = {
      episode: chapter,
      score: score
    };

    if (chapter == 1) {
      entry.status = 1;
      entry.date_start = formatToday();
    }

    if (chapter == maxChapter) {
      entry.status = 2;
      entry.date_finished = formatToday();
    }

    $.ajax({
      url: `https://cors-anywhere.herokuapp.com/https://myanimelist.net/api/animelist/update/${malId}.xml`,
      cache: false,
      type: 'POST',
      data: `<?xml version="1.0" encoding="UTF-8"?><entry>${toXML(entry)}</entry>`,
      contentType: "application/xml",
      crossDomain: true,
      //password: password,
      //xhrFields: { withCredentials: true },
      beforeSend: function(xhr) {
        addBasicHeaders(xhr);
        xhr.setRequestHeader("Authorization", "Basic " + btoa(user + ":" + password));
      },
      success: function(response, textStatus, xhr) {
        if (!response.toLowerCase().includes('error')) {
          alert(`Updated ${title} to episode ${chapter}.`);
        } else {
          alert(response);
        }
      },
      error: function(xhr, textStatus, errorThrown) {
        alert(`Cannot update episode, reason: ${xhr.responseText} [${textStatus}]`);
        storage.remove('password');
      }
    });
  }
  event.stopPropagation(); // Inner trigger
}

$("#search-user-form").submit(function(e) {
    e.preventDefault(); // Don't reload
});