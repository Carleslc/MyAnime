import Provider from './Provider.js';
import { withSearch } from './FeelingLucky';

class AnimeFLV extends Provider {
  constructor() {
    super('https://animeflv.net/', 3, ['es']);

    this.search = withSearch(({ title, episode }) => {
      return encodeURIComponent(
        `site:animeflv.net intitle:"${Provider.encode(title)}" inurl:"/ver" inurl:"-${episode}"`
      );
    });
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'statics/icons/animeflv.ico';
  }

  episodeUrl(args) {
    return this.search.episodeUrl(args);
  }
}

export default new AnimeFLV();
