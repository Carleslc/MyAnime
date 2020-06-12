import { DateTime } from 'luxon';
import { notifyError } from '@/utils/errors';
import qs from 'qs';
import API from './API.js';

const client = '6114d00ca681b7701d1e15fe11a4987e';

class MyAnimeList extends API {
  constructor() {
    super(
      'https://api.myanimelist.net/v2',
      {
        'X-MAL-Client-ID': client,
      },
      true // cors
    );
  }

  auth(username, password) {
    this.axios
      .post(
        '/auth/token',
        qs.stringify({
          client_id: client,
          grant_type: 'password',
          username,
          password,
        }),
        {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      )
      .then(({ data }) => {
        this.setAuthInfo(data.access_token, data.refresh_token, DateTime.utc().plus({ seconds: data.expires_in }));
        this.saveAuthInfo();
      })
      .catch(notifyError);
  }
}

export default new MyAnimeList();
