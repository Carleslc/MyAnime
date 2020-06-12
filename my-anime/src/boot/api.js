import Vue from 'vue';

import MyAnimeList from '@/api/MyAnimeList.js';

export function setAPI(api) {
  Vue.prototype.$api = api;
}

setAPI(MyAnimeList);
