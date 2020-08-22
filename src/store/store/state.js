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
    provider: defaults.provider,
    providersByAnimeTitle: defaults.providersByAnimeTitle,
    airingStatusFilter: defaults.airingStatusFilter,
    typeFilter: defaults.typeFilter,
    loading: 0,
    fetched: false,
    animes: {
      watching: [],
      'on-hold': [],
      'plan-to-watch': [],
    },
    calendar: {},
  };
}

export default newState;
