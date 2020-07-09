import { DateTime } from 'luxon';

export class Anime {
  /**
   * @param {Object} anime - anime object
   * @param {String} anime.id - provider's anime id
   * @param {String} anime.title - main title
   * @param {Array} anime.synonyms - alternative titles
   * @param {String} anime.cover - image url
   * @param {String} anime.status - watching, on-hold, plan-to-watch
   * @param {String} anime.type - tv, ova, movie, special, ona, music
   * @param {Number?} anime.totalEpisodes - anime total episodes
   * @param {String?} anime.startDate - anime start date (yyyy-MM-dd)
   * @param {Object?} anime.broadcast - anime episodes broadcasting
   * @param {String} anime.broadcast.weekday - monday to sunday
   * @param {String?} anime.broadcast.time - HH:mm (JST)
   * @param {String?} anime.airingStatus - not yet aired, currently airing, finished airing
   * @param {String?} anime.updatedAt - last time this anime was updated in user's list
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
    startDate,
    broadcast,
    airingStatus,
    updatedAt,
    lastWatchedEpisode = 0,
  }) {
    this.id = id;
    this.title = title;
    this.synonyms = synonyms;
    this.cover = cover;
    this.status = status;
    this.type = type;
    this.totalEpisodes = totalEpisodes;
    this.broadcast = broadcast;
    this.airingStatus = airingStatus;
    this.updatedAt = DateTime.fromISO(updatedAt);
    this.lastWatchedEpisode = lastWatchedEpisode;
    this.setAiringDate(startDate);
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
    return (
      (this.airingStatus && this.airingStatus !== 'not yet aired') ||
      (this.airingDate && this.airingDate <= DateTime.local())
    );
  }

  setAiringDate(startDate) {
    if (startDate) {
      const parts = startDate.split('-').length;
      if (parts === 3) {
        this.airingDatePrecision = 'day';
        this.airingDate = DateTime.fromFormat(startDate, 'yyyy-MM-dd');
      } else if (parts === 2) {
        this.airingDatePrecision = 'month';
        this.airingDate = DateTime.fromFormat(startDate, 'yyyy-MM');
      } else if (parts === 1) {
        this.airingDatePrecision = 'year';
        this.airingDate = DateTime.fromFormat(startDate, 'yyyy');
      }

      if (this.airingDate && this.airingDatePrecision && this.airingDatePrecision !== 'day') {
        this.airingDate = this.airingDate.endOf(this.airingDatePrecision);
      }
    }
  }
}
