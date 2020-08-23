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
   * @param {Array} anime.genres - action, adventure, cars, comedy, dementia, demons, drama, ecchi, fantasy, game, harem, hentai, historical, horror, josei, kids, magic, martial arts, mecha, military, music, mystery, parody, police, psychological, romance, samurai, school, sci-fi, seinen, shoujo, shoujo ai, shounen, shounen ai, slice of life, space, sports, super power, supernatural, thriller, vampire, yaoi, yuri
   * @param {Number?} anime.totalEpisodes - anime total episodes
   * @param {String?} anime.startDate - anime start date (yyyy-MM-dd) (JST)
   * @param {Object?} anime.broadcast - anime episodes broadcasting
   * @param {String} anime.broadcast.weekday - monday to sunday (JST)
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
    genres,
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
    this.genres = genres;
    this.totalEpisodes = totalEpisodes;
    this.broadcast = broadcast;
    this.airingStatus = airingStatus;
    this.updatedAt = DateTime.fromISO(updatedAt);
    this.lastWatchedEpisode = lastWatchedEpisode;
    this.setAiringDate(startDate);
  }

  get titles() {
    return [this.title, ...this.synonyms];
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
    function fromFormat(format) {
      return DateTime.fromFormat(startDate, format, { zone: 'Asia/Tokyo' });
    }

    if (startDate) {
      const parts = startDate.split('-').length;

      if (parts === 3) {
        this.airingDatePrecision = 'day';
        this.airingDate = fromFormat('yyyy-MM-dd').toLocal();
      } else if (parts === 2) {
        this.airingDatePrecision = 'month';
        this.airingDate = fromFormat('yyyy-MM').endOf('month').toLocal();
      } else if (parts === 1) {
        this.airingDatePrecision = 'year';
        this.airingDate = fromFormat('yyyy').endOf('year').toLocal();
      }
    }
  }
}
