import Provider from './Provider.js';

class AniMixPlay extends Provider {
  constructor() {
    super('https://animixplay.to/', 2, ['en']);
  }

  episodeUrl({ title, episode }) {
    // https://animixplay.to/v1/one-piece/ep1006
    return `${this.url}v1/${Provider.encode(title)}/ep${episode}`;
  }
}

export default new AniMixPlay();
