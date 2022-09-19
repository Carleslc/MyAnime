import Provider from './Provider.js';

class AnimeMovil2 extends Provider {
  constructor() {
    super('https://animemovil2.com/', 3, ['es']);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return `${this.url}media/icons/ico.ico`;
  }

  episodeUrl({ title, episode }) {
    return `${this.url}ver/${Provider.encode(title)}-${episode}`;
  }
}

export default new AnimeMovil2();
