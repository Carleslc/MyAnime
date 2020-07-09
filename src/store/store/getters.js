import { isBlank } from '@/utils/strings';
import { getField } from 'vuex-map-fields';

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
};
