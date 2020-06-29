import Provider from './Provider.js';

class Crunchyroll extends Provider {
  constructor() {
    super('https://www.crunchyroll.com/');
  }
}

export default new Crunchyroll();
