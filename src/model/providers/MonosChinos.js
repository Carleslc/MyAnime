import Provider from './Provider.js';

class MonosChinos extends Provider {
  constructor() {
    super('https://monoschinos.com/', 2, ['es']);
  }

  get icon() {
    return `${this.url}assets/img/favicon.ico`;
  }

  episodeUrl({ title, episode }) {
    return `${this.url}ver/${Provider.encode(title)}-${episode}`;
  }
}

export default new MonosChinos();
