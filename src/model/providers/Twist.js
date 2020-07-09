import Provider from './Provider.js';

class Twist extends Provider {
  constructor() {
    super('https://twist.moe/', 3);
  }

  episodeUrl(anime, episode) {
    return `${this.url}a/${Provider.encode(anime.title)}/${episode}`;
  }
}

export default new Twist();
