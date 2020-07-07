function withLoading(commit, promise) {
  commit('loading');
  return promise.finally(() => {
    commit('loaded');
  });
}

export default {
  async login({ state }, { username, password }) {
    await state.api.auth(username, password);
  },
  fetchAnimes({ commit, state: { api, username, status } }, next = false) {
    return withLoading(commit,
      api.getAnimes(username, status, next).then((animes) => {
        commit(next ? 'addAnimes' : 'setAnimes', {
          status,
          animes,
        });
        return animes;
      })
    );
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
    return withLoading(commit,
      api.getUserPicture(username).then((picture) => {
        commit('setPicture', picture || api.image);
      })
    );
  },
  updateEpisode({ commit, state: { api } }, anime) {
    return withLoading(commit,
      api.updateEpisode(anime).then(() => {
        commit('nextEpisode', anime);
      })
    );
  }
};
