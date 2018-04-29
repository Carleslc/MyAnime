let watching = $("#watching");
let onHold = $("#on-hold");
let planToWatch = $("#plan-to-watch");
var provider = $('#provider-selector').val();
var animes = [];

$('#provider-selector').on('change', function() { provider = $(this).val(); });
$('#filter-selector').on('change', parseAnime);

function asUrl(s, append) {
  if (append) {
    s = `${s}-${append}`;
  }
  s = s.toLowerCase().replace(/\s/g, '-').replace(/[^0-9a-z-]/gi, '-').replace(/--/g, '-')
  return encodeURIComponent(s);
}

function watchAnime(originalTitle, synonyms, chapter, malId) {
  function getUrl(title) {
    if (provider == "myanimelist") return `https://myanimelist.net/anime/${malId}`;
    else if (provider == "animeid") return `https://www.animeid.tv/v/${asUrl(title, chapter)}`;
    else if (provider == "animeflv") {
      //return `https://www.google.com/search?q=${encodeURI(`site:animeflv.net ${title} inurl:${chapter}`)}&btnI`;
      return "https://duckduckgo.com/?q=!ducky+" + encodeURI(`site:animeflv.net ${title} inurl:${chapter}`)
      //return `https://animeflv.net/browse?q=${encodeURI(`${title} ${chapter}`)}`;
    }
    else if (provider == "animemovil") return `https://animemovil.com/${asUrl(title, `${chapter}-sub-espanol`)}/`;
    else if (provider == "jkanime") return `http://jkanime.net/${asUrl(title)}/${chapter}/`;
    else if (provider == "gogoanime") return `https://www2.gogoanime.se/${asUrl(title, `episode-${chapter}`)}`;
    else if (provider == "crunchyroll") return `http://www.crunchyroll.com/search?q=${encodeURI(`${title} ${chapter}`)}`;
    else if (provider == "netflix") return `https://www.netflix.com/search?q=${encodeURI(title)}`;
  }
  synonyms = synonyms.split('; ').filter(s => s != null && s.trim() != "" && s.trim() != originalTitle);
  function openAnime(title) {
    let url = getUrl(title);
    console.log(url);
    $.get(url, function(response) {
      console.log("OK");
      //window.open(url, "_self");
    }).fail(function(jqXHR, textStatus) {
      console.log(jqXHR.status);
      console.log(jqXHR.responseText);
      else if (synonyms.length > 0) {
        openAnime(synonyms.pop());
      } else {
        console.log("Failed, redirect to original");
        //window.open(getUrl(originalTitle), "_self");
      }
    });
  }
  openAnime(originalTitle);
}

function getAnimeFigure(title, synonyms, chapter, image, malId) {
  function escape(s) {
    return s ? s.replace(/'/g, "\\'") : '';
  }
  return `<article>\
    <a href="#" onclick="watchAnime('${escape(title)}', '${escape(synonyms)}', ${chapter}, ${malId})">\
      <header>${title} #${chapter}</header>\
      <figure>\
        <img src="${image}" class="cover" alt="${title}" width="225" height="313">\
      </figure>\
    </a>\
  </article>`;
}

function emptyAnime() {
  watching.empty();
  onHold.empty();
  planToWatch.empty();
}

function parseAnime() {
  emptyAnime();
  let filter = parseInt($('#filter-selector').val());
  for (anime of animes) {
    let status = anime.my_status; // 1 - Watching, 2 - Completed, 3 - On Hold, 4 - Dropped, 6 - Plan to Watch
    if (status != 2 && status != 4) {
      let animeStatus = anime.series_status; // 1 - Currently Airing, 2 - Finished, 3 - Not yet aired
      let type = anime.series_type; // 1 - TV, 2 - OVA, 3 - Movie, 4 - Special
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
          section.append(getAnimeFigure(anime.series_title, anime.series_synonyms, nextChapter, anime.series_image, anime.series_animedb_id));
        }
      }
    }
  }
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
  }
  $("#profile-icon").attr("src", icon);
}

function searchUser() {
  let user = $("#search-user").val();
  if (user) {
    changeProfile();
    // Alternative API: https://bitbucket.org/animeneko/atarashii-api (Needs deployment)
    $.get(`https://kuristina.herokuapp.com/anime/${user}.json`, function(response) {
      let mal = response.myanimelist;
      if (mal) {
        animes = mal.anime;
        parseAnime();
        changeProfile(mal.myinfo.user_id, user);
      } else {
        alert(`User ${user} does not exists.`);
        changeProfile(0);
      }
    });
  }
}