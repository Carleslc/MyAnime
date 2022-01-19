import MALSync from '@/api/MALSync';
import { openURL } from 'quasar';
import { withSearchResolve } from './FeelingLucky';
import Provider from './Provider.js';

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

function toEpisodeUrl(animeUrl, { anime, episode }) {
  const ep = anime.type === 'movie' ? 'full' : episode;
  return `${animeUrl}/ep-${ep}`;
}

// https://9anime.to/watch/one-piece.ov8/ep-1006
// https://9anime.to/watch/one-piece-film-gold.71vy/ep-full
const NineAnimeLucky = withSearchResolve(({ provider, anime, title }) => {
  return encodeURIComponent(`site:${provider.url}watch/${Provider.encode(anime.alternativeTitles.en || title)}`);
}, toEpisodeUrl);

export const NineAnimeSync = new NineAnime({
  async open(args) {
    const { anime, title } = args;
    const animeSite = await MALSync.getAnimeSite('9anime', anime.id, title);
    if (animeSite) {
      openURL(toEpisodeUrl(animeSite.url, args));
    } else {
      await NineAnimeLucky.open(args);
    }
  },
});

// SEARCH NOT WORKING (403): vrf verification token required
/*
  export const NineAnimeSearch = new NineAnime({
    episodeUrl({ provider, anime, title }) {
      return `${provider.url}search?keyword=${encodeURIComponent(anime.alternativeTitles.en || title)}`;
    },
  });
*/
