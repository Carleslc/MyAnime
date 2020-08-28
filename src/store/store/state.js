import Backend from '@/api/Backend';
import { MyAnimeList } from '@/api/MyAnimeList';
import { defaults } from '@/mixins/configuration';

export function newState() {
  const backend = new Backend();
  const defaultAPI = new MyAnimeList();
  return {
    backend,
    authNeeded: false,
    api: defaultAPI,
    picture: defaultAPI.image,
    language: defaults.language,
    username: defaults.username,
    status: defaults.status,
    providersByLanguage: defaults.providersByLanguage,
    providersByAnimeTitle: defaults.providersByAnimeTitle,
    titlesByAnimeId: defaults.titlesByAnimeId,
    airingStatusFilter: defaults.airingStatusFilter,
    typeFilter: defaults.typeFilter,
    genreFilter: defaults.genreFilter,
    loading: 0,
    fetched: false,
    userFetched: false,
    animes: {
      watching: [],
      'on-hold': [],
      'plan-to-watch': [],
    },
    calendar: {},
  };
}

export default newState;
