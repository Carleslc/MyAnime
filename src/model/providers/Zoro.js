/* eslint-disable max-classes-per-file */
import MALSync from '@/api/MALSync';
import { newAxios } from '@/api/API.js';
import { openURL } from 'quasar';
import { withSearchResolve } from './FeelingLucky';
import Provider from './Provider.js';

class Zoro extends Provider {
  constructor(search) {
    super('https://zoro.to/', 2, ['en']);

    this.delegate(search);
  }
}

const ENCODED_TITLE_HREF_REGEX = /\/?([- a-z0-9]*-([0-9]+))\?ref=search/;

// https://zoro.to/watch/one-piece-100?ep=86062

class ZoroAPI extends Zoro {
  constructor() {
    super();

    this.axios = newAxios({
      baseUrl: this.url,
      cors: true,
    });

    this.api = newAxios({
      baseUrl: `${this.url}ajax/v2/`,
      cors: true,
    });
  }

  async open({ anime, title, episode }) {
    const animeSite = await MALSync.getAnimeSite('Zoro', anime.id, title);

    let animeEntry;

    if (animeSite) {
      animeEntry = animeSite;
      animeEntry.url = `${Provider.encode(animeEntry.title)}-${animeEntry.id}`;
    } else {
      const search = await this.axios.get(`search?keyword=${anime.alternativeTitles.en || title}`);
      animeEntry = search.data && ZoroAPI.findAnimeEntry(search.data, anime.title);
    }

    let episodeResolveUrl = animeEntry && animeEntry.url && (await this.parseEpisodeUrl(animeEntry, episode));

    if (!episodeResolveUrl) {
      episodeResolveUrl = `${this.url}search?keyword=${encodeURIComponent(title)}+${episode}`;
    }

    openURL(episodeResolveUrl);
  }

  static findAnimeEntry(data, title) {
    const parser = new DOMParser().parseFromString(data, 'text/html');

    const animes = parser
      .querySelectorAll('#main-content .tab-content .flw-item > .film-detail > .film-name > a.dynamic-name')
      .values();

    let { done, value } = animes.next();

    if (done) {
      return null;
    }

    let matchEntry;

    do {
      const entryTitle = value.getAttribute('data-jname');

      if (entryTitle === title) {
        const hrefMatch = value.getAttribute('href').match(ENCODED_TITLE_HREF_REGEX);

        if (hrefMatch.length > 2) {
          matchEntry = {
            id: hrefMatch[2],
            url: hrefMatch[1],
            title: entryTitle,
          };
          done = true;
        }
      } else {
        ({ done, value } = animes.next());
      }
    } while (!done);

    return matchEntry;
  }

  async parseEpisodeUrl(animeEntry, episode) {
    const animeUrl = `${this.url}watch/${animeEntry.url}`;

    const episodeList = await this.api.get(`episode/list/${animeEntry.id}`);

    if (!episodeList.data || !episodeList.data.status || episode > episodeList.data.totalItems) {
      return animeUrl;
    }

    const html = episodeList.data && episodeList.data.html;

    const parser = new DOMParser().parseFromString(html, 'text/html');

    const episodes = parser.querySelectorAll('a.ssl-item.ep-item');

    const episodeEntry = episodes.item(episode - 1);
    const episodeId = episodeEntry !== null && episodeEntry.getAttribute('data-id');

    if (episodeId === false) {
      return animeUrl;
    }

    return `${animeUrl}?ep=${episodeId}`;
  }
}

export const ZoroSearch = new Zoro({
  episodeUrl({ provider, title, episode }) {
    return `${provider.url}search?keyword=${encodeURIComponent(title)}+${episode}`;
  },
});

export const ZoroLucky = new Zoro(
  withSearchResolve(({ provider, anime, title }) => {
    return encodeURIComponent(`site:${provider.url}watch ${Provider.encode(anime.alternativeTitles.en || title)}`);
  })
);

export const ZoroWithAPI = new ZoroAPI();
