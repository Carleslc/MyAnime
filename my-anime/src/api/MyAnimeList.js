import { DateTime } from 'luxon';
import { Anime } from '@/model/Anime';
import { notifyError } from '@/utils/errors';
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
    super({
      name: 'MyAnimeList',
      image: 'statics/mal.png',
      homeUrl: 'https://myanimelist.net/',
      registerUrl: 'https://myanimelist.net/',
      setPasswordUrl: 'https://myanimelist.net/editprofile.php?go=myoptions',
      baseUrl: 'https://api.myanimelist.net',
      version: 'v2',
      headers: {
        'X-MAL-Client-ID': client,
      },
      cors: true,
    });
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

  onError(e) {
    if (e.response && e.response.data && e.response.data.error) {
      // e.response.status e.response.data.error (e.response.data.message)
      // 400 invalid_grant (Incorrect username or password.)
      // 403 too_many_failed_login_attempts (Too many failed login attempts. Please try to login again after several hours.)
      notifyError(e.response.data.message);
    } else {
      super.onError(e);
    }
  }

  async refreshAccessToken() {
    const response = await this.postFormEncoded(this.url('/oauth2/token', 'v1'), {
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

  async getUserPicture() {
    await this.authenticated();

    const response = await this.get(this.url('/users/@me'));

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

  async getAnimes(username, status = null, next = false) {
    if (next && !this.hasNext(username, status)) {
      return [];
    }

    await this.authenticated();

    const currentOffset = this.getCurrentOffset(username, status, next);

    const filters = {
      sort: 'list_updated_at',
      offset: currentOffset.offset,
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

    const response = await this.get(this.url(`/users/${username}/animelist?${encodeParams(filters)}`));

    if (!response) {
      return [];
    }

    if (response.data.paging.next) {
      currentOffset.offset += filters.limit;
    } else {
      currentOffset.hasNext = false;
    }

    return parseAnimes(response.data.data);
  }

  updateEpisode(anime) {
    return this.putFormEncoded(this.url(`/anime/${anime.id}/my_list_status`), {
      num_watched_episodes: anime.nextEpisode,
      status: anime.isLastEpisode ? 'completed' : 'watching',
    });
  }
}

export default new MyAnimeList();
