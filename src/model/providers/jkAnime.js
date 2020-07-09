import Provider from './Provider.js';

class jkAnime extends Provider {
  constructor() {
    super('https://jkanime.net/', 5);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'https://cdn.jkanime.net/assets/images/favicon.ico';
  }

  episodeUrl(anime, episode) {
    return `${this.url}${Provider.encode(anime.title)}/${episode}/`;
  }
}

// eslint-disable-next-line new-cap
export default new jkAnime();
