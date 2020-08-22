import Provider from './Provider.js';

class MyAnimeList extends Provider {
  constructor() {
    super('https://myanimelist.net/');
  }

  episodeUrl(anime, episode) {
    return `${this.url}anime/${anime.id}/-/episode/${episode}`;
  }
}

export default new MyAnimeList();
