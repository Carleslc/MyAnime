import Provider from './Provider.js';

class AnimeMovil2 extends Provider {
  constructor() {
    super('https://animemovil2.com/', 3, ['es']);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return `${this.url}assets/webApp/ico.png`;
  }

  episodeUrl(anime, episode) {
    return `${this.url}ver/${Provider.encode(anime.title)}-${episode}`;
  }
}

export default new AnimeMovil2();
