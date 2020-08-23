import Provider from './Provider.js';

class Twist extends Provider {
  constructor() {
    super('https://twist.moe/', 3, ['en']);
  }

  episodeUrl({ title, episode }) {
    return `${this.url}a/${Provider.encode(title)}/${episode}`;
  }
}

export default new Twist();
