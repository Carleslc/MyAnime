/* eslint-disable max-classes-per-file */
import { openURL } from 'quasar';
import { newAxios } from '@/api/API.js';
import { notifyError } from '@/utils/errors.js';
import Provider from './Provider.js';

export class FeelingLucky extends Provider {
  constructor(url, prefix, search, languages) {
    super(url, 0, languages);

    this.prefix = prefix;
    this.search = search;
  }

  episodeUrl(args) {
    return this.url + this.prefix + this.search(args);
  }
}

export class FeelingLuckyResolve extends FeelingLucky {
  constructor(url, prefix, search, languages) {
    super(url, prefix, search, languages);

    this.client = newAxios({
      baseUrl: url + prefix,
    });
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable no-empty-function */
  /* eslint-disable class-methods-use-this */
  async resolve(searchResponse, args) {} // Template

  async open(args) {
    const searchResponse = await this.client.get(this.search(args));
    const episodeResolveUrl = await this.resolve(searchResponse, args);

    if (episodeResolveUrl) {
      openURL(episodeResolveUrl);
    } else {
      notifyError();
    }
  }
}

class FeelingDuckyResolve extends FeelingLuckyResolve {
  constructor(search, toUrl, languages) {
    super('https://api.duckduckgo.com/', '?format=json&no_redirect=1&t=MyAnime&q=!ducky+', search, languages);

    this.toUrl = toUrl || ((episodeRedirectUrl) => episodeRedirectUrl);
  }

  async resolve(searchResponse, args) {
    const episodeRedirectUrl = searchResponse.data && searchResponse.data.Redirect;
    const episodeResolveUrl = episodeRedirectUrl && (await this.toUrl(episodeRedirectUrl, args));
    return episodeResolveUrl || `https://duckduckgo.com/?q=!ducky+${this.search(args)}`;
  }
}

function luckySpanish({ anime, title, episode }) {
  const suffix = 'online español -english';
  return encodeURIComponent(
    `"${title}"${anime.hasManyEpisodes || episode > 1 ? ` "episodio ${episode}" inurl:${episode}` : ''} ${suffix}`
  );
}

function luckyEnglish({ anime, title, episode }) {
  const suffix = 'online english anime -español';
  return encodeURIComponent(
    `"${title}"${anime.hasManyEpisodes || episode > 1 ? ` "episode ${episode}" inurl:${episode}` : ''} ${suffix}`
  );
}

export function withSearch(search, languages) {
  return new FeelingLucky('https://duckduckgo.com/', '?q=!ducky+', search, languages);
}

export function withSearchResolve(search, toUrl, languages) {
  return new FeelingDuckyResolve(search, toUrl, languages);
}

export const FeelingDuckyES = withSearch(luckySpanish, ['es']);
export const FeelingDuckyEN = withSearch(luckyEnglish, ['en']);

export const FeelingLuckyES = new FeelingLucky('https://www.google.es/', 'search?btnI&q=', luckySpanish, ['es']);
export const FeelingLuckyEN = new FeelingLucky('https://www.google.com/', 'search?btnI&q=', luckyEnglish, ['en']);
