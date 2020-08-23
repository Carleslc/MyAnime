import Provider from './Provider.js';

class AnimeID extends Provider {
  constructor() {
    super('https://www.animeid.tv/', 3, ['es']);
  }

  episodeUrl({ title, episode }) {
    return `${this.url}v/${Provider.encode(title)}-${episode}`;
  }
}

export default new AnimeID();
