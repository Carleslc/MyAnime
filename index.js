let watching = $("#watching");
let onHold = $("#on-hold");
let planToWatch = $("#plan-to-watch");
var provider = $('#provider-selector').val();
var useAlternativeTitles = $('#alternatives').is(':checked');
var animes = [];

$('#provider-selector').on('change', function() { provider = $(this).val(); });
$('#filter-selector').on('change', parseAnime);
$('#alternatives').on('change', alternativesChange);

function alternativesChange() {
  useAlternativeTitles = $('#alternatives').is(':checked');
  parseAnime();
}

function getTitle(originalTitle, synonymsRaw) {
  if (useAlternativeTitles && synonymsRaw) {
    console.log(originalTitle);
    let synonyms = synonymsRaw.split('; ').filter(s => s != null && s.trim() != "" && s.trim() != originalTitle);
    console.log("Synonyms: " + synonyms);
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

function watchAnime(title, chapter, malId) {
  function getUrl() {
    if (provider == "myanimelist") return `https://myanimelist.net/anime/${malId}`;
    else if (provider == "lucky-es") return "https://duckduckgo.com/?q=!ducky+" + encodeURIComponent(`${title} inurl:${chapter} online español`)
    else if (provider == "lucky-en") return "https://duckduckgo.com/?q=!ducky+" + encodeURIComponent(`${title} inurl:${chapter} online english`)
    else if (provider == "animeid") return `https://www.animeid.tv/v/${asUrl(title, chapter)}`;
    else if (provider == "animeflv") return "https://duckduckgo.com/?q=!ducky+" + encodeURIComponent(`site:animeflv.net ${title} inurl:${chapter}`)
    else if (provider == "animemovil") return `https://animemovil.com/${asUrl(title, `${chapter}-sub-espanol`)}/`;
    else if (provider == "jkanime") return `http://jkanime.net/${asUrl(title)}/${chapter}/`;
    else if (provider == "gogoanime") return `https://www2.gogoanime.se/${asUrl(title, `episode-${chapter}`)}`;
    else if (provider == "crunchyroll") return `http://www.crunchyroll.com/search?q=${encodeURI(`${title} ${chapter}`)}`;
    else if (provider == "netflix") return `https://www.netflix.com/search?q=${encodeURI(title)}`;
  }
  let url = getUrl();
  console.log(url);
  window.open(url);
}

function getAnimeFigure(title, synonyms, chapter, image, malId) {
  function escape(s) {
    return s ? s.replace(/'/g, "\\'") : '';
  }
  title = getTitle(title, synonyms);
  return `<article>\
    <a href="#" onclick="watchAnime('${escape(title)}', ${chapter}, ${malId})">\
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