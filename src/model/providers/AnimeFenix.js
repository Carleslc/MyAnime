import Provider from './Provider.js';

class AnimeFenix extends Provider {
  constructor() {
    super('https://animefenix.com/', 2, ['es']);
  }

  episodeUrl({ title, episode }) {
    return `${this.url}ver/${Provider.encode(title)}-${episode}`;
  }
}

export default new AnimeFenix();
