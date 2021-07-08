import Vue from "vue";
// import SvgIcon from "@/components/SvgIcon"; // svg component
import SvgIcon from "./index.vue"; // svg component

// register globally
Vue.component("svg-icon", SvgIcon);

const req = require.context("./svg", false, /\.svg$/); // 通过正则匹配引入相应的文件模块
const requireAll = requireContext => requireContext.keys().map(requireContext);
requireAll(req);
