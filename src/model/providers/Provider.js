export default class Provider {
  constructor(url, offset = 0, languages) {
    this.url = url;
    this.offset = offset;
    this.languages = languages;
  }

  get icon() {
    return `${this.url}favicon.ico`;
  }

  /* eslint-disable no-unused-vars */

  episodeUrl({ anime, title, episode }) {
    return this.url;
  }

  /*
    open({ anime, title, episode }) {
      // Optional. If defined, this will override episodeUrl
    }
  */

  static trimSpecials(s) {
    return s.replace(/[^ -a-zA-Z0-9]+$/, '');
  }

  static encode(s, sep = '-') {
    let encoded = encodeURIComponent(
      Provider.trimSpecials(s)
        .toLowerCase()
        .replace(/\s+/g, sep)
        .replace(new RegExp(`(${sep}){2,}`), sep)
    );
    if (encoded[encoded.length - 1] === sep) {
      encoded = encoded.substring(0, encoded.length - 1);
    }
    return encoded;
  }
}
