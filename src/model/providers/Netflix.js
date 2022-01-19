import { openURL } from 'quasar';
import MALSync from '@/api/MALSync';
import Provider from './Provider.js';

class Netflix extends Provider {
  constructor(search) {
    super('https://www.netflix.com/');

    this.delegate(search);
  }

  episodeUrl({ title }) {
    return `${this.url}search?q=${encodeURI(title)}`;
  }
}

export default new Netflix({
  async open(args) {
    const { provider, anime, title } = args;
    const animeSite = await MALSync.getAnimeSite('Netflix', anime.id, title);

    openURL(animeSite && animeSite.url ? animeSite.url : provider.episodeUrl(args));
  },
});
