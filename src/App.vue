<template>
  <div id="app" class="theme-vintage">
    <title-bar-comp></title-bar-comp>

    <router-view id="router-view-comp" />
  </div>
</template>

<script>
import eruda from "eruda";
import util from "@/utils/util";
import TitleBarComp from "@/components/TitleBar";

export default {
  name: "app",
  components: {
    TitleBarComp,
  },
  data() {
    return {};
  },
  created() {
    // if (!util.isMobile()) {
    //   document.querySelector("html").style.fontSize = "18px";
    // }
  },
  mounted() {
    if (util.isMobile()) {
      this.initOrientation();

      // eruda.init();
      // eruda.position({
      //   x: "90%",
      //   y: "80%",
      // });
    }
  },
  methods: {
    /**
     * 设置监听手机旋转
     */
    initOrientation() {
      let vm = this;
      window.onorientationchange = function (event) {
        // console.log("window.orientation: ", window.orientation);

        vm.$store.commit("app/setOrientation", window.orientation);
      };
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/config.scss";

body,
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  width: 100%;
  height: 100%;
  // height: 100vh;
  // overflow: hidden;
}

#router-view-comp {
  height: 100%;
  // height: calc(100vh - #{$titleBarHeight});
  // overflow-y: auto;
  // overflow-x: hidden;
}

html {
  margin: 0;
  padding: 0;
}

::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  /* border-radius: 10px; */
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ccc;
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  /* border-radius: 10px; */
  background: #ededed;
}
</style>
