import { openURL } from 'quasar';
import { newAxios } from '@/api/API.js';
import { withSearch } from './FeelingLucky';
import Provider from './Provider.js';

class Animeflix extends Provider {
  constructor() {
    super('https://animeflix.io/', 2, ['en']);

    this.axios = newAxios({
      baseUrl: `${this.url}api`,
    });

    this.lucky = withSearch(({ title, episode }) => {
      return encodeURIComponent(`site:${this.url}shows intitle:"${title} Episode ${episode}"`);
    });
  }

  episodeUrl({ title }) {
    // https://animeflix.io/shows/one-piece/episode-931-498191/sub
    return `${this.url}shows/${Provider.encode(title)}/`;
  }

  open({ title, episode }) {
    this.axios
      .get(`/anime-schema?slug=${Provider.encode(title)}`)
      .then(({ data }) => {
        if (data.potentialAction && data.potentialAction.target) {
          return Animeflix.episodeUrlFromTarget(data.potentialAction.target);
        }
        if (data.episodes && data.episodes.length >= episode) {
          const episodeObj = data.episodes[episode - 1];
          // eslint-disable-next-line eqeqeq
          if (episodeObj.episodeNumber == episode && episodeObj.potentialAction && episodeObj.potentialAction.target) {
            return Animeflix.episodeUrlFromTarget(episodeObj.potentialAction.target);
          }
        }
        return data.url || this.episodeUrl({ title });
      })
      .catch(() => this.lucky.episodeUrl({ title, episode }))
      .then(openURL);
  }

  static episodeUrlFromTarget(target) {
    let episodeUrl;
    if (!target.endsWith('sub') && !target.endsWith('dub')) {
      episodeUrl = `${target}/sub`;
    } else {
      episodeUrl = target.replace(/(.*)-(sub|dub)/, '$1/$2'); // bugfix: /episode-N-ID/sub instead /episode-N-ID-sub
    }
    return `${episodeUrl}?play=true`;
  }
}

export default new Animeflix();
