import axios from 'axios';
import qs from 'qs';
import { LocalStorage } from 'quasar';
import { DateTime } from 'luxon';
import { notifyError } from '@/utils/errors';

const CORS_PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

const AUTH_KEY = 'auth';

export function encodeParams(params) {
  return qs.stringify(params);
}

export class API {
  constructor(name, baseUrl, headers, cors = false) {
    this.name = name;

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

    this.loadAuthInfo();
  }

  get isAuthenticated() {
    if (!this.expiration) {
      return false;
    }
    const now = DateTime.utc();
    return this.expiration > now;
  }

  /**
   * @param {String} accessToken
   * @param {String} refreshToken
   * @param {DateTime} expiration
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

  postFormEncoded(endpoint, data, headers) {
    return this.axios
      .post(endpoint, encodeParams(data), {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
      .catch((e) => {
        this.error = e;
        notifyError(e);
      });
  }
}
