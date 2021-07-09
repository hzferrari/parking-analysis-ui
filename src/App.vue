<template>
  <div id="app" class="theme-vintage">
    <div
      style="
        position: fixed;
        right: 20px;
        top: 10px;
        align-item: center;
        font-size: 14px;
      "
    >
      <span style="margin-right: 5px">深色主题</span>
      <chart-theme-switch></chart-theme-switch>
    </div>

    <router-view />
  </div>
</template>

<script>
import util from "@/utils/util";
import ChartThemeSwitch from "@/components/ChartThemeSwitch";

export default {
  name: "app",
  components: {
    ChartThemeSwitch,
  },
  data() {
    return {};
  },
  created() {
    // if (!util.isMobile()) {
    //   document.querySelector("html").style.fontSize = "18px";
    // }
  },
  methods: {},
};
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
