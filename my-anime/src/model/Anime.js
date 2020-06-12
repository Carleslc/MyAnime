import { DateTime } from 'luxon';

export class Anime {
  /**
   * @param {Object} anime - anime object
   * @param {String} anime.id - provider's anime id
   * @param {String} anime.title - main title
   * @param {Array} anime.synonyms - alternative titles
   * @param {String} anime.cover - image url
   * @param {String} anime.status - watching, on-hold, plan-to-watch
   * @param {String} anime.type - TV, OVA, Movie, Special, ONA, Music
   * @param {Number?} anime.totalEpisodes - anime total episodes
   * @param {DateTime?} anime.airingDate - anime start date
   * @param {Object?} anime.broadcast - anime episodes broadcasting
   * @param {String} anime.broadcast.weekday - monday to sunday
   * @param {String} anime.broadcast.time - HH:mm (JST)
   * @param {Number} anime.lastWatchedEpisode - user's last watched episode
   */
  constructor({
    id,
    title,
    synonyms,
    cover,
    status,
    type,
    totalEpisodes,
    airingDate,
    broadcast,
    lastWatchedEpisode = 0,
  }) {
    this.id = id;
    this.title = title;
    this.synonyms = synonyms;
    this.cover = cover;
    this.status = status;
    this.type = type;
    this.totalEpisodes = totalEpisodes;
    this.lastWatchedEpisode = lastWatchedEpisode;

    if (airingDate) {
      this.airingDate = airingDate.toLocal();
    }

    if (broadcast) {
      this.broadcast = DateTime.fromFormat(`${broadcast.weekday} ${broadcast.time}`, 'EEEE HH:mm', {
        zone: 'Asia/Tokyo',
      }).toLocal();
    }
  }

  get nextEpisode() {
    return this.lastWatchedEpisode + 1;
  }

  get isLastEpisode() {
    return this.totalEpisodes === this.nextEpisode;
  }

  get isCompleted() {
    return this.nextEpisode > this.totalEpisodes;
  }

  get progress() {
    return this.totalEpisodes ? this.nextEpisode / this.totalEpisodes : 0;
  }

  get isAired() {
    return this.airingDate && this.airingDate <= DateTime.local();
  }

  get nextEpisodeAiringDate() {
    // TODO: Improve this approximate date
    return this.broadcast
      ? DateTime.local()
          .startOf('week')
          .plus({ days: this.broadcast.weekday - 1, hours: this.broadcast.hour, minutes: this.broadcast.minute })
      : undefined;
  }

  get broadcastingToString() {
    return this.broadcast ? this.broadcast.toLocaleString(DateTime.DATETIME_FULL) : undefined;
  }
}
