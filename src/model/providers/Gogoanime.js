import { openURL } from 'quasar';
import MALSync from '@/api/MALSync';
import Provider from './Provider.js';
import { withSearchResolve } from './FeelingLucky';

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

// https://gogoanime.news/
export const GogoanimeOfficial = new Gogoanime('https://gogoanime.bid/', {
  episodeUrl({ provider, title, episode }) {
    return `${provider.url}${Provider.encode(title)}-episode-${episode}`;
  },
});

function altEpisodeUrl(animeUrl, { anime, episode }) {
  const ep = anime.type === 'movie' ? 'full' : episode;
  return `${animeUrl}/ep-${ep}`;
}

// https://gogoanime.page/watch/one-piece.ov8/ep-931
// https://gogoanime.page/watch/one-piece-film-gold.71vy/ep-full
const GogoanimeAltLucky = withSearchResolve(({ provider, anime, title }) => {
  return encodeURIComponent(`site:${provider.url}anime/${anime.alternativeTitles.en || title}`);
}, altEpisodeUrl);

export const GogoanimeAlt = new Gogoanime('https://gogoanime.page/', {
  async open(args) {
    const { provider, anime, title } = args;
    const animeSite = await MALSync.getAnimeSite('9anime', anime.id, title);
    if (animeSite) {
      openURL(altEpisodeUrl(`${provider.url}watch/${Provider.encode(animeSite.title)}.${animeSite.id}`, args)); // animeSite.id is the same in gogoanime.page and 9anime
    } else {
      await GogoanimeAltLucky.open(args);
    }
  },
});
