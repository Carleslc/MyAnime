import { pad } from '@/utils/strings';
import Provider from './Provider.js';

class FourAnime extends Provider {
  constructor() {
    super('https://4anime.to/', 2, ['en']);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return `${this.url}static/favicon.png`;
  }

  episodeUrl({ title, episode }) {
    return `${this.url}${Provider.encode(title)}-episode-${pad(episode)}`;
  }
}

export default new FourAnime();
