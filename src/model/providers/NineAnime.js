import Provider from './Provider.js';
import { withSearchResolve } from './FeelingLucky';

class NineAnime extends Provider {
  constructor(search) {
    super('https://9anime.to/', 2, ['en']);

    this.delegate(search);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'https://s2.fastcache.ru/assets/9anime/favicons/favicon.png';
  }
}

// https://9anime.to/watch/one-piece.ov8/ep-1006
// https://9anime.to/watch/one-piece-film-gold.71vy/ep-full
export const NineAnimeLucky = new NineAnime(
  withSearchResolve(
    function search({ provider, anime, title }) {
      return encodeURIComponent(`site:${provider.url}watch/${Provider.encode(anime.alternativeTitles.en || title)}`);
    },
    function episodeUrl(animeUrl, { provider, anime, episode }) {
      if (!animeUrl.startsWith(provider.url)) {
        return animeUrl;
      }
      const ep = anime.type === 'movie' ? 'full' : episode;
      return `${animeUrl}/ep-${ep}`;
    }
  )
);

// NOT WORKING (403): vrf verification token required
/*
  export const NineAnimeSearch = new NineAnime({
    episodeUrl({ provider, anime, title }) {
      return `${provider.url}search?keyword=${encodeURIComponent(anime.alternativeTitles.en || title)}`;
    },
  });
*/
