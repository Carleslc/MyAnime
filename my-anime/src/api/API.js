import axios from 'axios';
import qs from 'qs';
import { LocalStorage } from 'quasar';
import { DateTime } from 'luxon';
import { AuthenticationNeededException, notifyError } from '@/utils/errors';

const CORS_PROXY_URL = 'https://cors-api-proxy.herokuapp.com/';

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

    this.resetOffsets();

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

  url(endpoint, version) {
    if (version === undefined) {
      version = this.version;
    }
    return version ? `/${version}${endpoint}` : endpoint;
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

  authenticated() {
    return new Promise((resolve, reject) => {
      if (this.isAuthenticated) {
        resolve();
      } else if (this.expiration && this.refreshToken && this.refreshAccessToken) {
        // Token expired
        this.refreshAccessToken().then(resolve).catch(reject);
      } else {
        reject(new AuthenticationNeededException());
      }
    });
  }

  get(endpoint, headers) {
    return this.axios.get(endpoint, headers).catch((e) => {
      this.error = e;
      notifyError(e);
    });
  }

  formEncoded(action, endpoint, data, headers) {
    return action.call(this.axios, endpoint, encodeParams(data), {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded',
    })
    .catch((e) => {
      this.error = e;
      notifyError(e);
    });
  }

  postFormEncoded(endpoint, data, headers) {
    return this.formEncoded(this.axios.post, endpoint, data, headers);
  }

  putFormEncoded(endpoint, data, headers) {
    return this.formEncoded(this.axios.put, endpoint, data, headers);
  }

  resetOffsets() {
    this.offsets = {};
  }

  getCurrentOffset(username, status, next) {
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

    return currentOffsets[status];
  }

  isFetched(username, status = null) {
    const currentOffsets = this.offsets[username];
    return !!currentOffsets && !!currentOffsets[status];
  }

  hasNext(username, status = null) {
    const currentOffsets = this.offsets[username];
    return !currentOffsets || !currentOffsets[status] || currentOffsets[status].hasNext;
  }

  // Template

  /* eslint-disable no-empty-function */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */

  async auth(username, password) {}

  async getUserPicture(username) {
    return null;
  }

  getUserProfileUrl(username) {
    return '#';
  }

  async getAnimes(username, status = null, next = false) {
    const currentOffset = this.getCurrentOffset(username, status, next);
    currentOffset.hasNext = false;
    return [];
  }

  async updateEpisode(anime) {}
}
