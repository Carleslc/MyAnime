import axios from 'axios';
import qs from 'qs';
import { LocalStorage } from 'quasar';
import { DateTime } from 'luxon';
import { AuthenticationNeededException, notifyError } from '@/utils/errors';

const CORS_PROXY_URL = 'https://cors.carleslc.me/';

const AUTH_KEY = 'auth';

export function encodeParams(params) {
  return qs.stringify(params);
}

export function newAxios({ baseUrl, headers, cors = false, ...opts }) {
  const config = {
    baseURL: cors ? CORS_PROXY_URL + baseUrl : baseUrl,
    headers: {
      common: {
        Accept: 'application/json',
      },
      ...headers,
    },
    ...opts,
  };

  const client = axios.create(config);

  /* client.interceptors.request.use((request) => {
    console.log(request);
    return request;
  }); */

  return client;
}

export class API {
  constructor({ name, image, homeUrl, profileUrl, registerUrl, setPasswordUrl, baseUrl, headers, cors, version }) {
    this.name = name;
    this.image = image;
    this.homeUrl = homeUrl;
    this.profileUrl = profileUrl;
    this.registerUrl = registerUrl;
    this.setPasswordUrl = setPasswordUrl;
    this.version = version;

    this.resetOffsets();

    this.axios = newAxios({
      baseUrl,
      headers,
      cors,
    });

    this.loadAuthInfo();
  }

  url(endpoint, version) {
    if (version === undefined) {
      version = this.version;
    }
    return version ? `/${version}${endpoint}` : endpoint;
  }

  get hasError() {
    return !!this.error;
  }

  get isAuthenticated() {
    if (!this.accessToken || !this.expiration) {
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

    if (this.error instanceof AuthenticationNeededException) {
      this.error = null;
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
        this.error = new AuthenticationNeededException();
        reject(this.error);
      }
    });
  }

  wrapResponse(promise) {
    this.error = null;
    return promise
      .catch((e) => {
        this.error = e;
        this.onError(e);
      })
      .then((response) => {
        return {
          ...response,
          ok: !this.error,
        };
      });
  }

  get(endpoint, headers) {
    return this.wrapResponse(this.axios.get(endpoint, headers));
  }

  formEncoded(action, endpoint, data, headers) {
    return this.wrapResponse(
      action.call(this.axios, endpoint, encodeParams(data), {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    );
  }

  postFormEncoded(endpoint, data, headers) {
    return this.formEncoded(this.axios.post, endpoint, data, headers);
  }

  putFormEncoded(endpoint, data, headers) {
    return this.formEncoded(this.axios.put, endpoint, data, headers);
  }

  // eslint-disable-next-line class-methods-use-this
  onError(e) {
    if (e.response) {
      console.error(`${e.response.status} ${e.response.statusText}`);
      if (e.response.data) {
        console.error(e.response.data);
      }
    }
    notifyError(e);
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

  animeUrl(anime) {
    return this.homeUrl;
  }

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
