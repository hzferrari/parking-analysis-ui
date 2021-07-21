const state = {
  themeSelected: "",
  orientation: "", //手机旋转角度
  originDataList: [], // chart1的数据
  onedayDataList: [],
};

const mutations = {
  setThemeSelected: (state, data) => {
    state.themeSelected = data;
  },
  setOrientation: (state, data) => {
    state.orientation = data;
  },
  setOriginDataList: (state, data) => {
    state.originDataList = data;
  },
  setOnedayDataList: (state, data) => {
    state.onedayDataList = data;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
