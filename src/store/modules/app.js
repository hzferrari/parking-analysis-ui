const state = {
  themeSelected: "",
  orientation: "", //手机旋转角度
};

const mutations = {
  setThemeSelected: (state, data) => {
    state.themeSelected = data;
  },
  setOrientation: (state, data) => {
    state.orientation = data;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
