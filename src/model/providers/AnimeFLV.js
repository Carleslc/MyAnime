import Provider from './Provider.js';

class AnimeFLV extends Provider {
  constructor() {
    super('https://animeflv.net/', 3, ['es']);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'statics/icons/animeflv.ico';
  }

  episodeUrl({ title, episode }) {
    return `${this.url}ver/${Provider.encode(title)}-${episode}`;
  }
}

/*
withSearch(({ title, episode }) => {
  return encodeURIComponent(`site:${this.url} inurl:"/ver" intitle:"${title}" intitle:"Episodio ${episode}");
});
*/

export default new AnimeFLV();
