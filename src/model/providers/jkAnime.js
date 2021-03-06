import Provider from './Provider.js';

class jkAnime extends Provider {
  constructor() {
    super('https://jkanime.net/', 5, ['es']);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'https://cdn.jkanime.net/assets/images/favicon.ico';
  }

  episodeUrl({ title, episode }) {
    return `${this.url}${Provider.encode(title)}/${episode}/`;
  }
}

// eslint-disable-next-line new-cap
export default new jkAnime();
