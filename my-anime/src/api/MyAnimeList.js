import { DateTime } from 'luxon';
import { AuthenticationNeededException } from '@/utils/errors';
import { config } from '@/mixins/configuration';
import { Anime } from '@/model/Anime';
import { API, encodeParams } from './API';

function parseAnimes(animes) {
  const animeTypesLowerCase = config.animeTypes.map((type) => type.toLowerCase());

  return animes.map((data) => {
    const anime = data.node;

    const fields = {
      id: anime.id,
      title: anime.title,
      synonyms: anime.alternative_titles.synonyms,
      cover: anime.main_picture.medium,
      status: anime.my_list_status.status.replace('_', '-'),
      lastWatchedEpisode: anime.my_list_status.num_episodes_watched,
    };

    const mediaType = anime.media_type.toLowerCase();
    const typeIndex = animeTypesLowerCase.findIndex((type) => type === mediaType);
    if (typeIndex >= 0) {
      fields.type = config.animeTypes[typeIndex];
    }

    if (anime.num_episodes > 0) {
      fields.totalEpisodes = anime.num_episodes;
    }

    if (anime.start_date) {
      fields.airingDate = DateTime.fromFormat(anime.start_date, 'yyyy-MM-dd');
    }

    if (anime.broadcast) {
      fields.broadcast = {
        weekday: anime.broadcast.day_of_the_week,
        time: anime.broadcast.start_time,
      };
    }

    return new Anime(fields);
  });
}

const client = '6114d00ca681b7701d1e15fe11a4987e';

class MyAnimeList extends API {
  constructor() {
    super(
      'https://api.myanimelist.net',
      {
        'X-MAL-Client-ID': client,
      },
      true // cors
    );
    this.version = 'v2';
    this.offsets = {};
  }

  url(endpoint) {
    return `/${this.version}${endpoint}`;
  }

  async auth(username, password) {
    const { data } = await this.postFormEncoded(this.url('/auth/token'), {
      client_id: client,
      grant_type: 'password',
      username,
      password,
    });
    this.updateAuthInfo(data);
  }

  async refreshAccessToken() {
    const { data } = await this.postFormEncoded('/v1/oauth2/token', {
      client_id: client,
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
    });
    this.updateAuthInfo(data);
  }

  updateAuthInfo(data) {
    this.setAuthInfo(data.access_token, data.refresh_token, DateTime.utc().plus({ seconds: data.expires_in }));
    this.saveAuthInfo();
  }

  authenticated() {
    return new Promise((resolve, reject) => {
      if (this.isAuthenticated) {
        resolve();
      } else if (this.expiration && this.refreshToken) {
        // Token expired
        this.refreshAccessToken().then(resolve).catch(reject);
      } else {
        reject(new AuthenticationNeededException());
      }
    });
  }

  get(endpoint) {
    return this.axios.get(this.url(endpoint));
  }

  async getAnimes(username, status = null, next = false) {
    await this.authenticated();

    let offset = 0;
    let currentOffsets = this.offsets[username];

    if (next && currentOffsets && currentOffsets[status]) {
      offset = currentOffsets[status];
    }

    const filters = {
      sort: 'list_updated_at',
      offset,
      limit: 500,
      fields: [
        'id',
        'title',
        'alternative_titles{en,synonyms}',
        'main_picture',
        'media_type',
        'status',
        'start_date',
        'end_date',
        'broadcast',
        'num_episodes',
        'my_list_status',
      ].join(','),
    };

    if (status) {
      filters.status = status.replace('-', '_');
    }

    const { data } = await this.get(`/users/${username}/animelist?${encodeParams(filters)}`);

    if (data.paging.next) {
      if (!currentOffsets) {
        currentOffsets = {};
        this.offsets[username] = currentOffsets;
      }
      currentOffsets[status] = (currentOffsets[status] || 0) + filters.limit;
    }

    return parseAnimes(data.data);
  }
}

export default new MyAnimeList();
