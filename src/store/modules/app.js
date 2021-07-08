const state = {
  themeSelected: "",
};

const mutations = {
  setThemeSelected: (state, data) => {
    state.themeSelected = data;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
