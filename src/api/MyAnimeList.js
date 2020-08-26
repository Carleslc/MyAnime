import { DateTime } from 'luxon';
import { i18n } from '@/boot/i18n';
import { Anime } from '@/model/Anime';
import { notifyError } from '@/utils/errors';
import { API, encodeParams } from './API';

function parseAnimes(animes) {
  return animes.map((data) => {
    const anime = data.node;

    const fields = {
      id: anime.id,
      title: anime.title,
      alternativeTitles: anime.alternative_titles,
      cover: anime.main_picture.medium,
      status: anime.my_list_status.status.replace(/_/g, '-'),
      type: anime.media_type.toLowerCase(),
      genres: anime.genres.map((genre) => genre.name.toLowerCase()),
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

export class MyAnimeList extends API {
  constructor() {
    super({
      name: 'MyAnimeList',
      image: 'statics/mal.png',
      homeUrl: 'https://myanimelist.net/',
      profileUrl: 'https://myanimelist.net/profile/',
      registerUrl: 'https://myanimelist.net/register.php',
      setPasswordUrl: 'https://myanimelist.net/editprofile.php?go=myoptions',
      baseUrl: 'https://api.myanimelist.net',
      version: 'v2',
      headers: {
        'X-MAL-Client-ID': client,
      },
      cors: true,
    });
  }

  animeUrl(anime) {
    return `${this.homeUrl}anime/${anime.id}/`;
  }

  async auth(username, password) {
    const response = await this.postFormEncoded('/auth/token', {
      client_id: client,
      grant_type: 'password',
      username,
      password,
    });
    if (response.ok && response.data) {
      this.updateAuthInfo(response.data);
    }
  }

  onError(e) {
    if (e.response && e.response.data && e.response.data.error) {
      // e.response.status e.response.data.error (e.response.data.message)
      // 400 invalid_grant (Incorrect username or password.)
      // 403 too_many_failed_login_attempts (Too many failed login attempts. Please try to login again after several hours.)
      const errorCode = e.response.data.error;
      let message = e.response.data.message;
      if (errorCode === 'invalid_grant') {
        message = i18n.t('invalidGrant');
      } else if (errorCode === 'too_many_failed_login_attempts') {
        message = i18n.t('tooManyFailedLoginAttempts');
      }
      notifyError(message);
    } else {
      super.onError(e);
    }
  }

  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw this.needsAuth('Missing refresh token');
    }
    const response = await this.postFormEncoded(
      '/oauth2/token',
      {
        client_id: client,
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
      },
      {
        baseURL: 'https://myanimelist.net/v1',
      }
    );
    if (response.ok && response.data) {
      this.updateAuthInfo(response.data);
    } else {
      throw this.needsAuth(this.error);
    }
  }

  updateAuthInfo(data) {
    this.commit('setAuthInfo', {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiration: DateTime.utc().plus({ seconds: data.expires_in }),
    });
  }

  async getUserPicture() {
    await this.authenticated();

    const response = await this.get('/users/@me');

    if (response.ok && response.data) {
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
        'genres',
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

    if (!response.ok) {
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
