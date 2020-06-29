import MyAnimeList from '@/api/MyAnimeList.js';
import { defaults } from '@/mixins/configuration';

const DEFAULT_API = MyAnimeList;

export default function () {
  return {
    api: DEFAULT_API,
    picture: DEFAULT_API.image,
    username: defaults.username,
    status: defaults.status,
    provider: defaults.provider,
    airingStatusFilter: defaults.airingStatusFilter,
    typeFilter: defaults.typeFilter,
    loading: 0,
    animes: {
      watching: [],
      'on-hold': [],
      'plan-to-watch': [],
    },
  };
}
