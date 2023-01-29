import Provider from './Provider.js';

class Animeflix extends Provider {
  constructor() {
    super('https://animeflix.live/', 2, ['en']);
  }

  episodeUrl({ anime, title, episode }) {
    // https://animeflix.live/watch/one-piece-episode-1006/21/
    return `${this.url}watch/${Provider.encode(title)}-episode-${episode}/${anime.id}/`;
  }
}

export default new Animeflix();
