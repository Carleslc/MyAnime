import Provider from './Provider.js';

class Crunchyroll extends Provider {
  constructor() {
    super('https://www.crunchyroll.com/', 0);
  }
}

export default { instance: new Crunchyroll() };
