import Provider from './Provider.js';

export default class FeelingLucky extends Provider {
  constructor(url, prefix, search) {
    super(url);
    this.prefix = prefix;
    this.search = search;
  }

  episodeUrl(anime, episode) {
    return this.url + this.prefix + this.search(anime, episode);
  }
}

function luckySpanish(anime, episode) {
  const suffix = 'online español -english';
  return encodeURIComponent(`${anime.title}${anime.type !== 'movie' ? ` inurl:${episode}` : ''} ${suffix}`);
}

function luckyEnglish(anime, episode) {
  const suffix = 'online english anime -español';
  return encodeURIComponent(`${anime.title}${anime.type !== 'movie' ? ` episode inurl:${episode}` : ''} ${suffix}`);
}

export function withSearch(search) {
  return new FeelingLucky('https://duckduckgo.com/', '?q=!ducky+', search);;
}

export const FeelingDuckyES = withSearch(luckySpanish);
export const FeelingDuckyEN = withSearch(luckyEnglish);

export const FeelingLuckyES = new FeelingLucky('https://www.google.es/', 'search?btnI&q=', luckySpanish);
export const FeelingLuckyEN = new FeelingLucky('https://www.google.com/', 'search?btnI&q=', luckyEnglish);
