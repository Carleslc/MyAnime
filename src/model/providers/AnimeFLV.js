import Provider from './Provider.js';

// Some urls do not have standard title encoding
const exceptionsMapping = {
  'One Piece': 'one-piece-tv',
};

class AnimeFLV extends Provider {
  constructor() {
    super('https://animeflv.net/', 3, ['es']);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'icons/animeflv.ico';
  }

  episodeUrl({ anime, title, episode }) {
    return `${this.url}ver/${exceptionsMapping[anime.title] || Provider.encode(title)}-${episode}`;
  }
}

/*
withSearch(({ title, episode }) => {
  return encodeURIComponent(`site:${this.url} inurl:"/ver" intitle:"${title}" intitle:"Episodio ${episode}");
});
*/

export default new AnimeFLV();
