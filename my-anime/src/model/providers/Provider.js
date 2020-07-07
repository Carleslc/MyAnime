export default class Provider {
  constructor(url, offset = 0) {
    this.url = url;
    this.offset = offset;
  }

  episodeUrl(title, episode) {
    return this.url;
  }

  encode(s) {
    return encodeURIComponent(s.toLowerCase().replace(/[^-a-z0-9]+/g, '-').replace(/-{2,}/, '-'));
  }
}
