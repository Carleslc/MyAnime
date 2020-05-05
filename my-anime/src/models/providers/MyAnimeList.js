import Provider from './Provider.js';

class MyAnimeList extends Provider {
  constructor() {
    super('https://myanimelist.net/', 0);
  }
}

export default { MyAnimeList: new MyAnimeList() };
