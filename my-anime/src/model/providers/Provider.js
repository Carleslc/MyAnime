export default class Provider {
  constructor(url, offset = 0) {
    this.url = url;
    this.offset = offset;
  }

  // eslint-disable-next-line
  episodeUrl(title, episode) {
    return this.url;
  }
}
