import axios from 'axios';
import { LocalStorage } from 'quasar';
import { DateTime } from 'luxon';

const CORS_PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

const AUTH_KEY = 'auth';

export default class API {
  constructor(baseUrl, headers, cors = false) {
    if (cors) {
      baseUrl = CORS_PROXY_URL + baseUrl;
    }
    this.axios = axios.create({
      baseURL: baseUrl,
      headers: {
        common: {
          Accept: 'application/json',
        },
        ...headers,
      },
    });
    /* this.axios.interceptors.request.use((request) => {
      console.log(request);
      return request;
    }); */
  }

  /**
   * @param {String} accessToken
   * @param {String} refreshToken
   * @param {DateTime} expiration luxon DateTime
   */
  setAuthInfo(accessToken, refreshToken, expiration) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiration = expiration;

    if (accessToken) {
      this.axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
  }

  saveAuthInfo() {
    LocalStorage.set(AUTH_KEY, {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiration: this.expiration.toISO(),
    });
  }

  loadAuthInfo() {
    const authInfo = LocalStorage.getItem(AUTH_KEY);

    if (authInfo) {
      this.setAuthInfo(authInfo.accessToken, authInfo.refreshToken, DateTime.fromISO(authInfo.expiration));
    }
  }

  isAuthenticated() {
    if (!this.expiration) {
      return false;
    }
    const now = DateTime.utc();
    return this.expiration > now;
  }
}
