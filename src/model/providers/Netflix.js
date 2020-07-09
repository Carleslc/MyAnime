import Provider from './Provider.js';

class Netflix extends Provider {
  constructor() {
    super('https://www.netflix.com/');
  }

  episodeUrl(anime) {
    return `${this.url}search?q=${encodeURI(anime.title)}`;
  }
}

export default new Netflix();
