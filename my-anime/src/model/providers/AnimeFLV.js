import Provider from './Provider.js';
import { withSearch } from './FeelingLucky';

class AnimeFLV extends Provider {
  constructor() {
    super('https://animeflv.net/', 3);

    this.search = withSearch((anime, episode) => {
      return encodeURIComponent(
        `site:animeflv.net intitle:"${Provider.encode(anime.title)}" inurl:"/ver" inurl:"-${episode}"`
      );
    });
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'statics/icons/animeflv.ico';
  }

  episodeUrl(anime, episode) {
    return this.search.episodeUrl(anime, episode);
  }
}

export default new AnimeFLV();
