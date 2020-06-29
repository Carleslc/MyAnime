import { DateTime } from 'luxon';
import { AuthenticationNeededException, notifyError } from '@/utils/errors';
import { Anime } from '@/model/Anime';
import { API, encodeParams } from './API';

function parseAnimes(animes) {
  return animes.map((data) => {
    const anime = data.node;

    const fields = {
      id: anime.id,
      title: anime.title,
      synonyms: anime.alternative_titles.synonyms,
      cover: anime.main_picture.medium,
      status: anime.my_list_status.status.replace(/_/g, '-'),
      type: anime.media_type.toLowerCase(),
      lastWatchedEpisode: anime.my_list_status.num_episodes_watched,
      startDate: anime.start_date,
      updatedAt: anime.my_list_status.updated_at,
    };

    if (anime.num_episodes > 0) {
      fields.totalEpisodes = anime.num_episodes;
    }

    if (anime.status) {
      fields.airingStatus = anime.status.replace(/_/g, ' ');
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
      'MyAnimeList',
      'https://apimyanimelist.net',
      {
        'X-MAL-Client-ID': client,
      },
      true // cors
    );
    this.image = 'statics/mal.jpg';
    this.version = 'v2';
    this.resetOffsets();
  }

  resetOffsets() {
    this.offsets = {};
  }

  url(endpoint) {
    return `/${this.version}${endpoint}`;
  }

  async auth(username, password) {
    const response = await this.postFormEncoded(this.url('/auth/token'), {
      client_id: client,
      grant_type: 'password',
      username,
      password,
    });
    if (response) {
      this.updateAuthInfo(response.data);
    }
  }

  async refreshAccessToken() {
    const response = await this.postFormEncoded('/v1/oauth2/token', {
      client_id: client,
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
    });
    if (response) {
      this.updateAuthInfo(response.data);
    }
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
    return this.axios.get(this.url(endpoint)).catch((e) => {
      this.error = e;
      notifyError(e);
    });
  }

  async getUserPicture() {
    await this.authenticated();

    const response = await this.get('/users/@me');

    if (response) {
      return response.data.picture;
    }
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  getUserProfileUrl(username) {
    const suffix = username ? `profile/${username}` : '';
    return `https://myanimelist.net/${suffix}`;
  }

  isFetched(username, status = null) {
    const currentOffsets = this.offsets[username];
    return !!currentOffsets && !!currentOffsets[status];
  }

  hasNext(username, status = null) {
    const currentOffsets = this.offsets[username];
    return !currentOffsets || !currentOffsets[status] || currentOffsets[status].hasNext;
  }

  async getAnimes(username, status = null, next = false) {
    if (next && !this.hasNext(username, status)) {
      return [];
    }

    await this.authenticated();

    let currentOffsets = this.offsets[username];

    if (!currentOffsets) {
      currentOffsets = {};
      this.offsets[username] = currentOffsets;
    }

    if (!next || !currentOffsets[status]) {
      currentOffsets[status] = {
        hasNext: true,
        offset: 0,
      };
    }

    const filters = {
      sort: 'list_updated_at',
      offset: currentOffsets[status].offset,
      limit: 50,
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
        'my_list_status{num_episodes_watched,status,updated_at}',
      ].join(','),
    };

    if (status) {
      filters.status = status.replace(/-/g, '_');
    }

    const response = await this.get(`/users/${username}/animelist?${encodeParams(filters)}`);

    if (!response) {
      return [];
    }

    if (response.data.paging.next) {
      currentOffsets[status].offset += filters.limit;
    } else {
      currentOffsets[status].hasNext = false;
    }

    return parseAnimes(response.data.data);
  }
}

export default new MyAnimeList();
