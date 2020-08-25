export default class Provider {
  constructor(url, offset = 0, languages) {
    this.url = url;
    this.offset = offset;
    this.languages = languages;
  }

  get icon() {
    return `${this.url}favicon.ico`;
  }

  // eslint-disable-next-line no-unused-vars
  episodeUrl({ anime, title, episode }) {
    return this.url;
  }

  static encode(s, sep = '-') {
    let encoded = encodeURIComponent(
      s
        .toLowerCase()
        .replace(/[^-a-z0-9]+/g, sep)
        .replace(new RegExp(`(${sep}){2,}`), sep)
    );
    if (encoded[encoded.length - 1] === sep) {
      encoded = encoded.substring(0, encoded.length - 1);
    }
    return encoded;
  }

  static trimSpecials(s) {
    return s.replace(/[^-a-zA-Z0-9]+$/, '');
  }
}
