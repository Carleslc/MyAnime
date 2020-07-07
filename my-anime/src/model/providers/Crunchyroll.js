import Provider from './Provider.js';

class Crunchyroll extends Provider {
  constructor() {
    super('https://www.crunchyroll.com/');
  }

  episodeUrl(anime, episode) {
    return `${this.url}search?q=${encodeURI(`${anime.title} ${episode}`)}`;
  }
}

export default new Crunchyroll();
