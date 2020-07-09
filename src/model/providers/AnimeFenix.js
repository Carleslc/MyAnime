import Provider from './Provider.js';

class AnimeFenix extends Provider {
  constructor() {
    super('https://animefenix.com/', 2);
  }

  episodeUrl(anime, episode) {
    return `${this.url}ver/${Provider.encode(anime.title)}-${episode}`;
  }
}

export default new AnimeFenix();
