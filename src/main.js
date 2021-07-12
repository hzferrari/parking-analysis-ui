import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./icons"; // 注册svg-icon组件

import "@/styles/reset.css";
import "@/styles/media.css"; // 媒体查询样式
// 主题
import "@/styles/themes/vintage.css";
import "@/styles/themes/dark2.css";
// echarts主题
import "@/styles/echartsTheme/dark2";
import "@/styles/echartsTheme/vintage";

Vue.config.productionTip = false;

import mountMethods from "@/utils/mountMethods";
Vue.use(mountMethods);

// vant组件
import "vant/lib/index.css";
import { Dialog, Toast, Loading, Button } from "vant";
Vue.use(Dialog);
Vue.use(Toast);
Vue.use(Loading);
Vue.use(Button);

// element-ui组件
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
