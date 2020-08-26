import Provider from './Provider.js';

class Aniwatch extends Provider {
  constructor() {
    super('https://aniwatch.me/', 2, ['en']);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'https://anilivery.aniwatch.me/img/site_icon/icon_196.png';
  }

  episodeUrl({ title }) {
    // https://aniwatch.me/anime/30/931
    return `${this.url}search?q=${encodeURIComponent(title)}`;
  }
}

export default new Aniwatch();
