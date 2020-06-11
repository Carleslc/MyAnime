import Provider from './Provider.js';

export class MyAnimeList extends Provider {
  constructor() {
    super('https://myanimelist.net/', 0);
  }
}
