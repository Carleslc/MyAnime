import { DateTime } from 'luxon';
import { notifyError } from '@/utils/errors';
import API from './API.js';

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
  }

  auth(username, password) {
    this.postFormEncoded('/v2/auth/token', {
      client_id: client,
      grant_type: 'password',
      username,
      password,
    })
      .then(({ data }) => this.updateAuthInfo(data))
      .catch(notifyError);
  }

  refreshToken() {
    if (this.refreshToken) {
      this.postFormEncoded('/v1/oauth2/token', {
        client_id: client,
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
      })
        .then(({ data }) => this.updateAuthInfo(data))
        .catch(notifyError);
    }
  }

  updateAuthInfo(data) {
    this.setAuthInfo(data.access_token, data.refresh_token, DateTime.utc().plus({ seconds: data.expires_in }));
    this.saveAuthInfo();
  }
}

export default new MyAnimeList();
