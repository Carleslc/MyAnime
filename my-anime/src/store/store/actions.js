export default {
  async login({ state }, { username, password }) {
    await state.api.auth(username, password);
  },
  fetchAnimes({ commit, state: { api, username, status } }, next = false) {
    commit('loading');
    return api
      .getAnimes(username, status, next)
      .then((animes) => {
        commit(next ? 'addAnimes' : 'setAnimes', {
          status,
          animes,
        });
        return animes;
      })
      .finally(() => {
        commit('loaded');
      });
  },
  async fetchMoreAnimes({ dispatch, state: { api, username, status } }) {
    if (api.hasNext(username, status)) {
      await dispatch('fetchAnimes', true);
    }
    return api.hasNext(username, status);
  },
  searchUser({ commit, dispatch }, username) {
    commit('setUsername', username);
    commit('resetAnimes');
    dispatch('updatePicture');
    dispatch('fetchAnimes');
  },
  updatePicture({ commit, state: { api, username } }) {
    commit('loading');
    api.getUserPicture(username).then((picture) => {
      commit('setPicture', picture || api.image);
      commit('loaded');
    });
  },
};
