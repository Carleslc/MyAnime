import Provider from './Provider.js';
import { withSearch } from './FeelingLucky';

class MasterAnime extends Provider {
  constructor() {
    super('https://masteranime.es/', 2, ['en']);

    this.search = withSearch(({ anime, title, episode }) => {
      const suffix = anime.type !== 'movie' ? ` Episode ${episode}` : '';
      return encodeURIComponent(`site:${this.url}/watch intitle:"${title}${suffix}"`);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'https://static.anmedm.com/static/img/masterani-icon.png';
  }

  episodeUrl(args) {
    return this.search.episodeUrl(args);
  }

  /* episodeUrl({ title }) {
    return `${this.url}detail/${Provider.encode(title)}-sub`;
  } */

  /* episodeUrl({ title }) {
    return `${this.url}search/${encodeURIComponent(title)}`;
  } */
}

export default new MasterAnime();
