import Provider from './Provider.js';

class AnimeUltima extends Provider {
  constructor() {
    super('https://animeultima.to/', 2, ['en']);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'statics/icons/animeultima.png';
  }

  episodeUrl({ title, episode }) {
    return `${this.url}a/${Provider.encode(title)}/episode-${episode}`;
  }
}

export default new AnimeUltima();
