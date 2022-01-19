import MALSync from '@/api/MALSync';
import { openURL } from 'quasar';
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

function nlEpisodeUrl(animeUrl, { anime, episode }) {
  const ep = anime.type === 'movie' ? 'full' : episode;
  return `${animeUrl}/ep-${ep}`;
}

// https://gogoanime.nl/anime/one-piece-ov8/ep-931
// https://gogoanime.nl/anime/one-piece-film-gold-71vy/ep-full
const GogoanimeNlLucky = withSearchResolve(({ provider, anime, title }) => {
  return encodeURIComponent(`site:${provider.url}anime/${anime.alternativeTitles.en || title}`);
}, nlEpisodeUrl);

export const GogoanimeNl = new Gogoanime('https://gogoanime.nl/', {
  async open(args) {
    const { provider, anime, title } = args;
    const animeSite = await MALSync.getAnimeSite('9anime', anime.id, title);
    if (animeSite) {
      openURL(nlEpisodeUrl(`${provider.url}anime/${Provider.encode(animeSite.title)}-${animeSite.id}`, args)); // animeSite.id is the same in gogoanime.nl and 9anime
    } else {
      await GogoanimeNlLucky.open(args);
    }
  },
});
