import Provider from './Provider.js';
// import { withSearch } from './FeelingLucky';

class Gogoanime extends Provider {
  constructor(url, search) {
    super(url, 2, ['en']);

    this.episodeUrl = (args) => search.episodeUrl.call(this, args);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    // Alternative: https://cdn.gogocdn.net/files/gogo/img/favicon.png
    return 'https://staticf.akacdn.ru/assets/gogo/favicon.png';
  }
}

export const GogoanimeLife = new Gogoanime('https://gogoanime.life/', {
  episodeUrl({ title }) {
    // TODO: On click, fetch url from the following search and append ep-${episode} or ep-full (movie)
    // https://gogoanime.life/anime/one-piece-ov8/ep-931
    // https://gogoanime.life/anime/one-piece-film-gold-71vy/ep-full
    return `${this.url}search?keyword=${encodeURIComponent(title)}`;
  },
});

export const GogoanimeMovie = new Gogoanime('https://gogoanime.movie/', {
  episodeUrl({ title, episode }) {
    return `${this.url}${Provider.encode(title)}-episode-${episode}`;
  },
});
