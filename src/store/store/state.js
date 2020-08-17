import { MyAnimeList } from '@/api/MyAnimeList';
import { defaults } from '@/mixins/configuration';

export function newState() {
  const defaultAPI = new MyAnimeList();
  return {
    authNeeded: false,
    api: defaultAPI,
    picture: defaultAPI.image,
    username: defaults.username,
    status: defaults.status,
    provider: defaults.provider,
    providersByAnimeTitle: defaults.providersByAnimeTitle,
    airingStatusFilter: defaults.airingStatusFilter,
    typeFilter: defaults.typeFilter,
    loading: 0,
    animes: {
      watching: [],
      'on-hold': [],
      'plan-to-watch': [],
    },
    fetched: false,
  };
}

export default newState;
