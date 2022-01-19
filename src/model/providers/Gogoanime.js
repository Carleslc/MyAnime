import { withSearchResolve } from './FeelingLucky';
import Provider from './Provider.js';

class Gogoanime extends Provider {
  constructor(url, search) {
    super(url, 2, ['en']);

    this.delegate(search);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    // Alternative: https://s2.fastcache.ru/assets/gogoanime/favicon.png
    return 'https://cdn.gogocdn.net/files/gogo/img/favicon.png';
  }
}

export const GogoanimeCm = new Gogoanime('https://gogoanime.cm/', {
  episodeUrl({ provider, title, episode }) {
    return `${provider.url}${Provider.encode(title)}-episode-${episode}`;
  },
});

// https://gogoanime.nl/anime/one-piece-ov8/ep-931
// https://gogoanime.nl/anime/one-piece-film-gold-71vy/ep-full
export const GogoanimeNl = new Gogoanime(
  'https://gogoanime.nl/',
  withSearchResolve(
    ({ provider, anime, title }) => {
      return encodeURIComponent(`site:${provider.url}anime/${anime.alternativeTitles.en || title}`);
    },
    (episodeUrl, { anime, episode }) => {
      const ep = anime.type === 'movie' ? 'full' : episode;
      return `${episodeUrl}/ep-${ep}`;
    }
  )
);
