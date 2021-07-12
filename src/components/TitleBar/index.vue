<template>
  <div class="title-bar-comp">
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
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    gotoGithub() {
      window.open("https://github.com/hzferrari/parking-analysis-ui", "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/config.scss";

/**themes style */
.theme-dark2 .title-bar-comp {
  background: #32434c;
}
.theme-vintage .title-bar-comp {
  background: #fff;
}

.title-bar-comp {
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
  height: $titleBarHeight;
  background: #fff;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
