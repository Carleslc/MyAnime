import Provider from './Provider.js';

class Animeflix extends Provider {
  constructor() {
    super('https://animeflix.live/', 2, ['en']);
  }

  episodeUrl({ title, episode }) {
    // https://animeflix.live/watch/one-piece-episode-1006
    return `${this.url}watch/${Provider.encode(title)}-episode-${episode}`;
  }
}

export default new Animeflix();
