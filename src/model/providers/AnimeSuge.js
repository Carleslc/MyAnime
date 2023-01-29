import MALSync from '@/api/MALSync';
import { openURL } from 'quasar';
import { withSearchResolve } from './FeelingLucky';
import Provider from './Provider.js';

class AnimeSuge extends Provider {
  constructor(search) {
    super('https://animesuge.to/', 2, ['en']);

    this.delegate(search, ['open']);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'https://animesuge.to/assets/sites/animesuge/icons/favicon.png';
  }
}

function altEpisodeUrl(animeUrl, { anime, episode }) {
  const ep = anime.type === 'movie' ? 'full' : episode;
  return `${animeUrl}/ep-${ep}`;
}

// https://animesuge.to/anime/one-piece-ov8/ep-1049
// https://animesuge.to/anime/one-piece-film-gold-71vy/ep-full
const AnimeSugeLucky = withSearchResolve(({ provider, anime, title }) => {
  return encodeURIComponent(`site:${provider.url}anime/${anime.alternativeTitles.en || title}`);
}, altEpisodeUrl);

export default new AnimeSuge({
  async open(args) {
    const { provider, anime, title } = args;
    const animeSite = await MALSync.getAnimeSite('9anime', anime.id, title);
    if (animeSite) {
      openURL(altEpisodeUrl(`${provider.url}anime/${Provider.encode(animeSite.title)}-${animeSite.id}`, args)); // animeSite.id is the same in gogoanime.page and 9anime
    } else {
      await AnimeSugeLucky.open(args);
    }
  }
});
