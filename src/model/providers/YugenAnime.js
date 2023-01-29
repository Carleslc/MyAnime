import { openURL } from 'quasar';
import MALSync from '@/api/MALSync';
import Provider from './Provider.js';
import { withSearchResolve } from './FeelingLucky';

class YugenAnime extends Provider {
  constructor(search) {
    super('https://yugen.to/', 2, ['en']);

    this.delegate(search);
  }

  get icon() {
    return `${this.url}static/img/favicon-32x32.png`;
  }
}

// https://yugen.to/watch/798/one-piece/1049/
const YugenAnimeLucky = withSearchResolve(({ provider, title, episode }) => {
  return encodeURIComponent(`site:${provider.url} "${title}" Episode "${episode}"`);
});

export default new YugenAnime({
  async open(args) {
    const { anime, episode, title } = args;
    const animeSite = await MALSync.getAnimeSite('YugenAnime', anime.id, title);

    if (animeSite && animeSite.url) {
      openURL(`${animeSite.url.replace('anime', 'watch')}${episode}`);
    } else {
      await YugenAnimeLucky.open(args);
    }
  },
});
