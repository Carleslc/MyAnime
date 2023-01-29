import { openURL } from 'quasar';
import MALSync from '@/api/MALSync';
import Provider from './Provider.js';
import { withSearchResolve } from './FeelingLucky';

// TODO: API https://animepahe.ru/api?m=search&q=one%20piece

class Animepahe extends Provider {
  constructor(search) {
    super('https://animepahe.ru/', 2, ['en']);

    this.delegate(search);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'icons/animepahe.png';
  }
}

const AnimepaheLucky = withSearchResolve(({ provider, title, episode }) => {
  return encodeURIComponent(`site:${provider.url} "${title}" Ep. "${episode}"`);
});

export default new Animepahe({
  async open(args) {
    const { anime, title } = args;
    const animeSite = await MALSync.getAnimeSite('animepahe', anime.id, title);

    if (animeSite && animeSite.url) {
      openURL(animeSite.url);
    } else {
      await AnimepaheLucky.open(args);
    }
  },
});
