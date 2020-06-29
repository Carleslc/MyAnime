import { updateField } from 'vuex-map-fields';

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
    state.animes = {
      watching: [],
      'on-hold': [],
      'plan-to-watch': [],
    };
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
  nextEpisode(_state, anime) {
    anime.lastWatchedEpisode = anime.nextEpisode;
  },
  loading(state) {
    state.loading += 1;
    console.log(state.loading);
  },
  loaded(state) {
    if (state.loading > 0) {
      state.loading -= 1;
      console.log(state.loading);
    }
  },
};
