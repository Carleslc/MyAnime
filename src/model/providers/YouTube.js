import { FeelingLucky } from '@/model/providers/FeelingLucky';

class YouTube extends FeelingLucky {
  constructor(search, languages) {
    super('https://www.youtube.com/', 'results?search_query=', search, languages);
  }

  // eslint-disable-next-line class-methods-use-this
  get icon() {
    return 'statics/icons/youtube.png';
  }
}

function luckySpanish({ anime, title, episode }) {
  return encodeURIComponent(
    `${title}${anime.hasManyEpisodes || episode > 1 ? ` episodio intitle:${episode}` : ''} español`
  );
}

function luckyEnglish({ anime, title, episode }) {
  return encodeURIComponent(
    `${title}${anime.hasManyEpisodes || episode > 1 ? ` episode intitle:${episode}` : ''} english`
  );
}

export const YouTubeES = new YouTube(luckySpanish, ['es']);
export const YouTubeEN = new YouTube(luckyEnglish, ['en']);
