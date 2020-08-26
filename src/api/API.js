import axios from 'axios';
import qs from 'qs';
import { LocalStorage } from 'quasar';
import { DateTime } from 'luxon';
import { SubscriptionQueue } from '@/utils/subscription';
import { AuthenticationNeededException, notifyError } from '@/utils/errors';

const CORS_PROXY_URL = 'https://cors.carleslc.me/';

export function encodeParams(params) {
  return qs.stringify(params);
}

function wrapCORS(baseUrl, cors) {
  return cors ? CORS_PROXY_URL + baseUrl : baseUrl;
}

function wrapOptsCORS(opts, cors) {
  if (opts && opts.baseURL) {
    opts.baseURL = wrapCORS(opts.baseURL, cors);
  }
  return opts;
}

export function newAxios({ baseUrl, headers, cors = false, ...opts }) {
  const config = {
    baseURL: wrapCORS(baseUrl, cors),
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
  constructor({
    name,
    image,
    homeUrl,
    profileUrl,
    registerUrl,
    setPasswordUrl,
    baseUrl,
    headers,
    cors,
    version,
    tokenLifespanDays = 31,
  }) {
    this.name = name;
    this.image = image;
    this.homeUrl = homeUrl;
    this.profileUrl = profileUrl;
    this.registerUrl = registerUrl;
    this.setPasswordUrl = setPasswordUrl;
    this.tokenLifespanDays = tokenLifespanDays;
    this.version = version;

    this.resetOffsets();

    this.cors = cors;
    this.axios = newAxios({
      baseUrl,
      headers,
      cors,
    });

    this.loadAuthInfo();
  }

  get authKey() {
    return `auth.${this.name}`;
  }

  get hasError() {
    return !!this.error;
  }

  /**
   * @param {String} accessToken
   * @param {String} refreshToken
   * @param {DateTime} expiration
   */
  setAuthInfo({ accessToken, refreshToken, expiration }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiration = expiration;
    this.updateAuthorization();
  }

  updateAuthorization() {
    if (this.accessToken) {
      this.axios.defaults.headers.common.Authorization = `Bearer ${this.accessToken}`;
    }
    if (this.error instanceof AuthenticationNeededException) {
      this.error = null;
    }
  }

  saveAuthInfo() {
    LocalStorage.set(this.authKey, {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiration: this.expiration.toISO(),
    });
  }

  loadAuthInfo() {
    const authInfo = LocalStorage.getItem(this.authKey);

    if (authInfo) {
      this.setAuthInfo({
        accessToken: authInfo.accessToken,
        refreshToken: authInfo.refreshToken,
        expiration: DateTime.fromISO(authInfo.expiration),
      });
    }
  }

  needsAuth(message) {
    this.error = new AuthenticationNeededException(message);
    return this.error;
  }

  onRefreshToken(callback) {
    if (!this.refreshing) {
      this.refreshing = new SubscriptionQueue();
      this.refreshAccessToken()
        .then(() => this.refreshing.consume())
        .catch((error) => this.refreshing.consume(error))
        .finally(() => {
          delete this.refreshing;
        });
    }
    this.refreshing.subscribe(callback); // avoid concurrent duplicated refresh requests
  }

  authenticated() {
    return new Promise((resolve, reject) => {
      if (!this.accessToken || !this.expiration) {
        reject(this.needsAuth());
      } else {
        const now = DateTime.utc();
        const expiresIn = this.expiration.diff(now, 'days').toObject().days;
        if (expiresIn <= 0) {
          delete this.axios.defaults.headers.common.Authorization;
          LocalStorage.remove(this.authKey);
          reject(this.needsAuth('Session expired'));
        } else if (this.refreshToken && this.refreshAccessToken && expiresIn < this.tokenLifespanDays - 7) {
          // Refresh weekly
          this.onRefreshToken((error) => (error ? reject(error) : resolve()));
        } else {
          resolve();
        }
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

  url(endpoint, opts) {
    if (opts && opts.baseURL) {
      return endpoint;
    }
    return this.version ? `/${this.version}${endpoint}` : endpoint;
  }

  get(endpoint, opts) {
    opts = wrapOptsCORS(opts, this.cors);
    return this.wrapResponse(this.axios.get(this.url(endpoint, opts), opts));
  }

  formEncoded(action, endpoint, data, opts) {
    opts = wrapOptsCORS(opts, this.cors);
    return this.wrapResponse(action.call(this.axios, this.url(endpoint, opts), encodeParams(data), opts));
  }

  postFormEncoded(endpoint, data, opts) {
    return this.formEncoded(this.axios.post, endpoint, data, opts);
  }

  putFormEncoded(endpoint, data, opts) {
    return this.formEncoded(this.axios.put, endpoint, data, opts);
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
