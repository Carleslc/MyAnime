import Provider from './Provider.js';

class AnimeID extends Provider {
  constructor() {
    super('https://www.animeid.tv/', 3);
  }

  episodeUrl(anime, episode) {
    return `${this.url}v/${Provider.encode(anime.title)}-${episode}`;
  }
}

export default new AnimeID();
