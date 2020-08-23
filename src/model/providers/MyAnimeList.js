import Provider from './Provider.js';

class MyAnimeList extends Provider {
  constructor() {
    super('https://myanimelist.net/');
  }

  episodeUrl({ anime: { id }, episode }) {
    return `${this.url}anime/${id}/-/episode/${episode}`;
  }
}

export default new MyAnimeList();
