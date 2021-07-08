import Vue from "vue";
import Vuex from "vuex";
import VuexModules from "./modules";

import getters from "./getters";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: VuexModules,
  getters
});
