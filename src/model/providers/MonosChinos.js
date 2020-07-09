import Provider from './Provider.js';

class MonosChinos extends Provider {
  constructor() {
    super('https://monoschinos.com/', 2);
  }

  get icon() {
    return `${this.url}assets/img/favicon.ico`;
  }

  episodeUrl(anime, episode) {
    return `${this.url}ver/${Provider.encode(anime.title)}-${episode}`;
  }
}

export default new MonosChinos();
