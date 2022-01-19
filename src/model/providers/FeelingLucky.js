/* eslint-disable max-classes-per-file */
import { openURL } from 'quasar';
import { newAxios } from '@/api/API.js';
import { notifyError } from '@/utils/errors.js';
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

class FeelingLuckyResolve extends FeelingLucky {
  constructor(url, prefix, search, resolve, languages) {
    super(url, prefix, search, languages);

    this.resolve = resolve || ((redirect) => redirect);

    this.axios = newAxios({
      baseUrl: this.url,
    });
  }

  async open(args) {
    const searchResponse = await this.axios.get(this.prefix + this.search(args));
    const episodeRedirectUrl = searchResponse.data && searchResponse.data.Redirect;
    const episodeResolveUrl = episodeRedirectUrl && (await this.resolve(episodeRedirectUrl, args));

    if (episodeResolveUrl) {
      openURL(episodeResolveUrl);
    } else {
      notifyError();
    }
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

export function withSearchResolve(search, resolve, languages) {
  return new FeelingLuckyResolve(
    'https://api.duckduckgo.com/',
    '?format=json&no_redirect=1&t=MyAnime&q=!ducky+',
    search,
    resolve,
    languages
  );
}

export const FeelingDuckyES = withSearch(luckySpanish, ['es']);
export const FeelingDuckyEN = withSearch(luckyEnglish, ['en']);

export const FeelingLuckyES = new FeelingLucky('https://www.google.es/', 'search?btnI&q=', luckySpanish, ['es']);
export const FeelingLuckyEN = new FeelingLucky('https://www.google.com/', 'search?btnI&q=', luckyEnglish, ['en']);
