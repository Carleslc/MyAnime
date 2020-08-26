const axios = require('axios');
const { generateToken } = require('../utils/strings');

class Aniwatch {
  constructor() {
    this.url = 'https://aniwatch.me/';

    this.axios = axios.create({
      baseURL: `${this.url}api/ajax/APIHandle`,
      headers: {
        common: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
        },
      },
    });

    this.api = {
      post: (data, opts) => this.axios.post('', JSON.stringify(data), opts),
    };
  }

  buildUrl(id, episode) {
    return id ? `${this.url}anime/${id}/${episode || ''}` : null;
  }

  async search(title) {
    const xsrf = generateToken();
    const response = await this.api.post(
      {
        controller: 'Search',
        action: 'search',
        rOrder: false,
        order: 'title',
        typed: title,
      },
      {
        withCredentials: true,
        headers: {
          'x-path': '/search',
          'x-xsrf-token': xsrf,
          referer: this.url,
          Cookie: `XSRF-TOKEN=${xsrf};`,
        },
      }
    );
    let id = null;
    if (response.data.length > 0) {
      id = response.data[0].detail_id || null;
    }
    return id;
  }

  async getUrl(cache, title, episode) {
    let id = await cache.get(title);

    if (id === undefined) {
      id = await this.search(title);
      cache.save(title, id);
    }

    return this.buildUrl(id, episode);
  }
}

module.exports = new Aniwatch();
