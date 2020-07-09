import Provider from './Provider.js';

class MyAnimeList extends Provider {
  constructor() {
    super('https://myanimelist.net/');
  }

  episodeUrl(anime) {
    return `${this.url}anime/${anime.id}/`;
  }
}

export default new MyAnimeList();
