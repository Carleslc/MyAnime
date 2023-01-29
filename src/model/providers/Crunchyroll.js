import { openURL } from 'quasar';
import MALSync from '@/api/MALSync';
import Provider from './Provider.js';

class Crunchyroll extends Provider {
  constructor(search) {
    super('https://www.crunchyroll.com/', 1);

    this.delegate(search);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    // `${this.url}favicons/favicon-32x32.png`;
    return 'icons/crunchyroll.png';
  }

  episodeUrl({ title, episode }) {
    return `${this.url}search?q=${encodeURI(`${title} ${episode}`)}&o=m&r=f`;
  }
}

export default new Crunchyroll({
  async open(args) {
    const { provider, anime, title } = args;
    const animeSite = await MALSync.getAnimeSite('Crunchyroll', anime.id, title);

    openURL(animeSite && animeSite.url ? animeSite.url : provider.episodeUrl(args));

    // TODO: Scrap animeSite.url for episode url
  },
});
