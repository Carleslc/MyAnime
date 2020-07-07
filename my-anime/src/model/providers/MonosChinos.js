import Provider from './Provider.js';

class MonosChinos extends Provider {
  constructor() {
    super('https://monoschinos.com/');
  }

  episodeUrl(anime, episode) {
    const param = `${anime.title}-${episode}`;
    return `${this.url}ver/${Provider.encode(param)}`;
  }
}

export default new MonosChinos();
