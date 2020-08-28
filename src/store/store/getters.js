import { getField } from 'vuex-map-fields';
import { isBlank } from '@/utils/strings';
import { providers } from '@/mixins/configuration';

export default {
  getField,
  animesFilterByStatus({ animes, status }) {
    return animes[status];
  },
  isFetched({ fetched }) {
    return fetched;
  },
  isLoading({ loading }) {
    return loading > 0;
  },
  hasUsername({ username }) {
    return !isBlank(username);
  },
  providerByAnimeTitle({ providersByAnimeTitle }, getters) {
    return (title) => providersByAnimeTitle[title] || getters.provider;
  },
  providers({ language }) {
    return Object.freeze(
      providers.filter((provider) => !provider.value.languages || provider.value.languages.includes(language))
    );
  },
  provider({ providersByLanguage, language }) {
    return providersByLanguage[language];
  },
  titleByAnimeId({ api, titlesByAnimeId }) {
    return (id) => titlesByAnimeId[api.name][id];
  },
};
