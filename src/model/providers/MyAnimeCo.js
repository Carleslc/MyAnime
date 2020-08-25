import Provider from './Provider.js';
import { withSearch } from './FeelingLucky';

class MyAnimeCo extends Provider {
  constructor() {
    super('https://myanime.co/', 3, ['en']);

    this.search = withSearch(({ title, episode }) => {
      title = Provider.encode(title, '_');
      return encodeURIComponent(
        `site:${this.url}anime intitle:"${title}" intitle:"Episode ${episode}" inurl:"/episode/${episode}"`
      );
    });
  }

  episodeUrl(args) {
    return this.search.episodeUrl(args);
  }
}

export default new MyAnimeCo();
