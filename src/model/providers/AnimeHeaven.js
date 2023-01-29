import Provider from './Provider.js';
import { withSearch } from './FeelingLucky';

class AnimeHeaven extends Provider {
  constructor() {
    super('https://animeheaven.ru/', 2, ['en']);

    this.search = withSearch(({ title, episode }) => {
      // https://animeheaven.ru/watch/one-piece-sub.79238?ep=163672
      // https://animeheaven.ru/watch/one-piece-film-gold
      return encodeURIComponent(`site:${this.url}watch intitle:"${title} Episode ${episode}"`);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    // Alternative: https://static.anmedm.com/static/favicon.ico
    return 'https://static.anmedm.com/static/css/animeheaven-logo.png';
  }

  episodeUrl({ anime, title }) {
    if (anime.type === 'movie') {
      return `${this.url}watch/${encodeURIComponent(Provider.trimSpecials(title))}`;
    }
    // return this.search.episodeUrl({ anime, title, episode });
    return `${this.url}search?q=${encodeURIComponent(Provider.trimSpecials(title))}`;
  }
}

export default new AnimeHeaven();
