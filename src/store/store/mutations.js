import Vue from 'vue';
import { updateField } from 'vuex-map-fields';
import { newState } from './state';

function sorted({ status, animes }) {
  if (status === 'plan-to-watch') {
    animes.sort((a, b) => {
      if (a.airingStatus === 'currently airing' && b.airingStatus !== 'currently airing') {
        return -1;
      }
      if (b.airingStatus === 'currently airing' && a.airingStatus !== 'currently airing') {
        return 1;
      }
      if (a.airingStatus === 'not yet aired' && b.airingStatus === 'not yet aired' && a.airingDate && b.airingDate) {
        return a.airingDate.diff(b.airingDate, 'minutes').toObject().minutes;
      }
      return b.updatedAt.diff(a.updatedAt, 'minutes').toObject().minutes;
    });
  }
  return animes;
}

export default {
  updateField,
  setAnimes(state, payload) {
    state.animes[payload.status] = sorted(payload);
  },
  addAnimes(state, payload) {
    state.animes[payload.status].push(...sorted(payload));
  },
  resetAnimes(state) {
    state.api.resetOffsets();
    state.fetched = false;
    state.animes = {
      watching: [],
      'on-hold': [],
      'plan-to-watch': [],
    };
  },
  updateFetched(state) {
    state.fetched = state.api.isFetched(state.username, state.status);
  },
  setAPI(state, api) {
    state.api = api;
  },
  setUsername(state, username) {
    state.username = username;
  },
  setPicture(state, picture) {
    state.picture = picture;
  },
  setUserFetched(state, userFetched) {
    state.userFetched = userFetched;
  },
  nextEpisode(_state, anime) {
    anime.lastWatchedEpisode = anime.nextEpisode;
  },
  setAnimeWatching(state, anime) {
    if (anime.status !== 'watching') {
      // Remove from old list
      const animeList = state.animes[anime.status];
      animeList.splice(animeList.indexOf(anime), 1);
      // Update status
      anime.status = 'watching';
      // Add to watching list (if not fetched it will be added later)
      if (state.api.isFetched(state.username, anime.status)) {
        state.animes.watching.unshift(anime);
      }
    }
  },
  setProvider(state, provider) {
    state.providersByLanguage[state.language] = provider;
  },
  setProviderByTitle(state, { title, provider }) {
    if (provider === state.providersByLanguage[state.language]) {
      Vue.delete(state.providersByAnimeTitle, title);
    } else {
      Vue.set(state.providersByAnimeTitle, title, provider);
    }
  },
  setAlternativeTitle(state, { anime, title }) {
    if (title === anime.title) {
      Vue.delete(state.titlesByAnimeId[state.api.name], anime.id);
    } else {
      Vue.set(state.titlesByAnimeId[state.api.name], anime.id, title);
    }
  },
  setCalendar(state, calendar) {
    state.calendar = calendar;
  },
  loading(state) {
    state.loading += 1;
  },
  loaded(state) {
    if (state.loading > 0) {
      state.loading -= 1;
    }
  },
  setAuthNeeded(state, needed) {
    state.authNeeded = needed;
  },
  clear(state) {
    Object.assign(state, newState());
  },
  setAuthInfo({ api }, { accessToken, refreshToken, expiration }) {
    // avoids mutation outside vuex store for token refresh
    api.accessToken = accessToken;
    api.refreshToken = refreshToken;
    api.expiration = expiration;
    api.updateAuthorization();
    api.saveAuthInfo();
  },
  logout({ api }) {
    api.logout();
  },
};
