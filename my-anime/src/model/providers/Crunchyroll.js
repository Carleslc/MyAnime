import Provider from './Provider.js';
// import { withSearch } from './FeelingLucky';

class Crunchyroll extends Provider {
  constructor() {
    super('https://www.crunchyroll.com/', 1);

    /* this.search = withSearch((anime, episode) => {
      return encodeURIComponent(`site:crunchyroll.com/es intitle:"${anime.title}" inurl:"episode-${episode}"`);
    }); */
  }

  get icon() {
    return `${this.url}favicons/favicon-32x32.png`;
  }

  episodeUrl(anime, episode) {
    return `${this.url}search?q=${encodeURI(`${anime.title} ${episode}`)}&o=m&r=f`;
    // return this.search.episodeUrl(anime, episode);
  }
}

export default new Crunchyroll();
