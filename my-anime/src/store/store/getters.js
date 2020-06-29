import { getField } from 'vuex-map-fields';

export default {
  getField,
  animesFilterByStatus({ animes, status }) {
    return animes[status];
  },
  isFetched({ api, username, status }) {
    return api.isFetched(username, status);
  },
  isLoading({ loading }) {
    return loading > 0;
  },
  hasError({ api }) {
    return !!api.error;
  },
};
