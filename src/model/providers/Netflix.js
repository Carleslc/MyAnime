import Provider from './Provider.js';

class Netflix extends Provider {
  constructor() {
    super('https://www.netflix.com/');
  }

  episodeUrl({ title }) {
    return `${this.url}search?q=${encodeURI(title)}`;
  }
}

export default new Netflix();
