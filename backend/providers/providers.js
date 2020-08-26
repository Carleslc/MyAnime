const expiration = 60 * 60 * 24; // 1 day in seconds

const providers = {
  Aniwatch: require('./Aniwatch'),
};

function expire(cache, provider) {
  return new Promise((resolve, reject) => {
    cache.del(`${provider}.*`, (error, n) => {
      if (error) {
        console.error(`${provider} expire cache error: ${error.message}`);
        reject(error);
      } else if (n > 0) {
        console.log(`Expired ${n} ${provider} entries`);
      }
      resolve();
    });
  });
}

function tag(provider, key) {
  return `${provider}.${key}`;
}

function providerCache(cache, provider) {
  return {
    get: (key) =>
      new Promise((resolve) => {
        cache.get(tag(provider, key), (error, entries) => {
          if (error) {
            console.error(`${provider} cache error: ${error.message}`);
          } else if (entries.length > 0) {
            resolve(JSON.parse(entries[0].body));
          } else {
            resolve();
          }
        });
      }),
    save: (key, value) => {
      cache.add(tag(provider, key), JSON.stringify(value), { expire: expiration }, (error) => {
        if (error) {
          console.error(`Provider set cache error: ${error.message}`);
        }
      });
    },
  };
}

module.exports = {
  has(provider) {
    return !!provider && !!providers[provider];
  },
  getUrl(cache, provider, title, episode) {
    return providers[provider].getUrl(providerCache(cache, provider), title, episode);
  },
  expireAll(cache) {
    Object.keys(providers).forEach((provider) => expire(cache, provider));
  },
};
