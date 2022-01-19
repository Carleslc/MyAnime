import Provider from './Provider.js';

class Animeflix extends Provider {
  constructor() {
    super('https://animeflix.sbs/', 2, ['en']);
  }

  episodeUrl({ title, episode }) {
    // https://animeflix.sbs/watch/one-piece-episode-1006
    return `${this.url}watch/${Provider.encode(title)}-episode-${episode}`;
  }
}

export default new Animeflix();
