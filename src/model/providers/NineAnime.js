import Provider from './Provider.js';
import { withSearch } from './FeelingLucky';

class NineAnime extends Provider {
  constructor(search) {
    super('https://9anime.ru/', 2, ['en']);

    if (search.url) {
      this.episodeUrl = (args) => search.episodeUrl(args);
    } else {
      this.episodeUrl = (args) => search.episodeUrl.call(this, args);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'https://staticf.akacdn.ru/assets/favicons/favicon-32x32.png';
  }
}

export const NineAnimeLucky = new NineAnime(
  withSearch(({ anime, title }) => {
    // https://9anime.ru/watch/one-piece.ov8/m22p017
    // https://9anime.ru/watch/one-piece-film-gold.71vy
    return encodeURIComponent(`site:${this.url}/watch/${Provider.encode(anime.alternativeTitles.en || title)}`);
  })
);

export const NineAnimeSearch = new NineAnime({
  episodeUrl({ anime, title }) {
    // TODO: On click, fetch url from the following search, then scrape episode urls from the selected url to provide a direct link
    return `${this.url}search?keyword=${encodeURIComponent(anime.alternativeTitles.en || title)}`;
  },
});
