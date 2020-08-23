import Provider from './Provider.js';

export default class FeelingLucky extends Provider {
  constructor(url, prefix, search, languages) {
    super(url, 0, languages);
    this.prefix = prefix;
    this.search = search;
  }

  episodeUrl(args) {
    return this.url + this.prefix + this.search(args);
  }
}

function luckySpanish({ anime, title, episode }) {
  const suffix = 'online español -english';
  return encodeURIComponent(`${title}${anime.type !== 'movie' ? ` inurl:${episode}` : ''} ${suffix}`);
}

function luckyEnglish({ anime, title, episode }) {
  const suffix = 'online english anime -español';
  return encodeURIComponent(`${title}${anime.type !== 'movie' ? ` episode inurl:${episode}` : ''} ${suffix}`);
}

export function withSearch(search, languages) {
  return new FeelingLucky('https://duckduckgo.com/', '?q=!ducky+', search, languages);
}

export const FeelingDuckyES = withSearch(luckySpanish, ['es']);
export const FeelingDuckyEN = withSearch(luckyEnglish, ['en']);

export const FeelingLuckyES = new FeelingLucky('https://www.google.es/', 'search?btnI&q=', luckySpanish, ['es']);
export const FeelingLuckyEN = new FeelingLucky('https://www.google.com/', 'search?btnI&q=', luckyEnglish, ['en']);
