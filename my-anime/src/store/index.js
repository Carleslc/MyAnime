import Vue from 'vue';
import Vuex from 'vuex';

import store from './store';

Vue.use(Vuex);

export default function () {
  const Store = new Vuex.Store({
    modules: {
      store
    },

    // enable strict mode (adds overhead!) for dev mode only
    strict: process.env.DEV,
  });

  return Store;
}
