<template>
  <div class="title-bar-comp" :class="{ '__scroll-down': isScrollDown }">
    <div class="title">Parking Data Analysis</div>
    <div class="right-menu">
      <div
        style="
          display: flex;
          align-items: center;
          margin-right: 20px;
          font-size: 14px;
        "
      >
        <span style="margin-right: 5px">深色主题</span>
        <chart-theme-switch></chart-theme-switch>
      </div>

      <svg-icon
        style="margin-right: 20px; cursor: pointer; font-size: 22px"
        class="icons"
        icon-class="github"
        @click="gotoGithub"
      />
    </div>
  </div>
</template>

<script>
import ChartThemeSwitch from "@/components/ChartThemeSwitch";

export default {
  name: "title-bar-comp",
  components: {
    ChartThemeSwitch,
  },
  props: {},
  computed: {},
  watch: {},
  data() {
    return {
      isScrollDown: false,
    };
  },
  created() {},
  mounted() {
    window.addEventListener("scroll", this.windowScroll); //监听页面滚动
  },
  methods: {
    gotoGithub() {
      window.open("https://github.com/hzferrari/parking-analysis-ui", "_blank");
    },
    /**
     * 页面滚动事件
     */
    windowScroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      console.log(
        "🚀 ~ file: index.vue ~ line 44 ~ windowScroll ~ scrollTop",
        scrollTop
      );

      if (scrollTop > 0) {
        this.isScrollDown = true;
      } else {
        this.isScrollDown = false;
      }
    },
  },
  destroyed() {
    window.removeEventListener("scroll", this.windowScroll); //销毁滚动事件
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/config.scss";

/**themes style */
.theme-dark2 .title-bar-comp {
  background: #263238;
  &.__scroll-down {
    background: #32434c;
  }
}
.theme-vintage .title-bar-comp {
  background: rgba(254, 248, 239, 1);
  &.__scroll-down {
    background: #fcfcfc;
  }
}

.title-bar-comp {
  transition: all 0.5s;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: $titleBarHeight;
  background: #fff;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    font-family: "STHupo";
    margin: 0 15px;
    font-size: 17px;
  }

  .right-menu {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
