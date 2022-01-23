import { createStore } from 'vuex';

import store from './store';

export default function newStore() {
  const Store = createStore({
    modules: {
      store
    },

    // enable strict mode (adds overhead!) for dev mode only
    strict: process.env.DEV,
  });

  return Store;
}
