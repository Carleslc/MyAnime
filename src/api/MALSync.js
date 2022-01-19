import { newAxios } from './API';

const API_URL = 'https://api.malsync.moe/';

class MALSync {
  constructor() {
    this.axios = newAxios({
      baseUrl: API_URL,
    });
  }

  async getAnimeSite(site, animeId, title, type = 'mal') {
    let response;
    try {
      response = await this.axios.get(`${type}/anime/${animeId}`);
    } catch (e) {
      console.error('MALSync', e);
      return null;
    }
    const data = response && response.data;

    if (data && data.Sites) {
      const siteSync = data.Sites[site];

      if (siteSync) {
        const entries = Object.entries(siteSync);

        let match;

        if (entries.length > 1) {
          let i = 0;

          while (!match && i < entries.length) {
            const entry = entries[i];
            const value = entry[1];

            if (value.title === title) {
              match = entry;
            }

            i += 1;
          }
        }

        if (!match && entries.length > 0) {
          match = entries[0];
        }

        if (match) {
          const key = match[0];
          const value = match[1];

          return {
            id: value.identifier || key,
            url: value.url,
            title: value.title,
          };
        }
      }
    }

    return undefined;
  }
}

export default new MALSync();
