import Provider from './Provider.js';

class MonosChinos extends Provider {
  constructor() {
    super('https://monoschinos2.com/', 2, ['es']);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'statics/icons/monoschinos.ico'; // `${this.url}public/favicon.ico`
  }

  episodeUrl({ title, episode }) {
    return `${this.url}ver/${Provider.encode(title)}-${episode}`;
  }
}

export default new MonosChinos();
