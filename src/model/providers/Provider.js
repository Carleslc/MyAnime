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
    async open({ anime, title, episode }) {
      // Optional. If defined, this will override episodeUrl
    }
  */

  delegate(auxProvider, methods = ['episodeUrl', 'open']) {
    if (!auxProvider) {
      return;
    }

    const withProvider = (args) => {
      args.provider = this;
      return args;
    };

    methods.forEach((method) => {
      if (typeof auxProvider[method] === 'function') {
        this[method] = (args) => auxProvider[method](withProvider(args));
      }
    });
  }

  static encode(s, sep = '-') {
    let encoded = encodeURIComponent(
      s
        .toLowerCase()
        .replace(/[^- a-z0-9]+/g, '')
        .replace(/\s+/g, sep)
        .replace(new RegExp(`(${sep}){2,}`, 'g'), sep)
    );
    if (encoded[encoded.length - 1] === sep) {
      encoded = encoded.substring(0, encoded.length - 1);
    }
    return encoded;
  }

  static trimSpecials(s) {
    return s.replace(/[^- a-zA-Z0-9]+$/, '');
  }
}
