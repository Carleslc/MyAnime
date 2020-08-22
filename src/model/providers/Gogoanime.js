import Provider from './Provider.js';
// import { withSearch } from './FeelingLucky';

class Gogoanime extends Provider {
  constructor() {
    super('https://www.gogoanime.pro/', 2, ['en']);

    /* TODO: On click, fetch first url from the following search and append ep-episode or ep-full (movie)
    this.search = withSearch((anime, episode) => {
      return encodeURIComponent(`site:gogoanime.pro/anime ${Provider.encode(anime.title)}"`);
    }); */
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'https://staticf.akacdn.ru/assets/gogo/favicon.png';
  }

  // https://gogoanime.pro/anime/one-piece-ov8/ep-931
  // https://gogoanime.pro/anime/one-piece-film-gold-71vy/ep-full
  episodeUrl(anime, episode) {
    return `${this.url}search?keyword=${encodeURIComponent(anime.title)} ${episode}`;
    // return this.search.episodeUrl(anime, episode);
  }
}

export default new Gogoanime();
