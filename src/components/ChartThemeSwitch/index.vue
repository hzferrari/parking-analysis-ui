<template>
  <div class="chart-theme-switch">
    <el-switch
      v-model="switchValue"
      active-color="#e2982a"
      inactive-color="#C0CCDA"
      @change="change"
    >
    </el-switch>
  </div>
</template>

<script>
export default {
  name: "chart-theme-switch",
  components: {},
  props: {},
  computed: {},
  watch: {},
  data() {
    return {
      switchValue: false,
    };
  },
  created() {},
  mounted() {
    // 在created里面写，会被vue后面的加载覆盖
    // 从本地恢复记录
    let localValue = localStorage.getItem("themeName");

    switch (localValue) {
      case "dark2":
        this.switchValue = true;
        this.change(true);
        break;

      case "vintage":
        this.switchValue = false;
        this.change(false);
        break;

      default:
        break;
    }
  },
  methods: {
    change(e) {
      let themeName;

      if (e) {
        themeName = "dark2";
      } else {
        themeName = "vintage";
      }

      this.$store.commit("app/setThemeSelected", themeName);

      // 修改#app的class
      let appDom = document.getElementById("app");
      appDom.classList = "";
      appDom.classList.add("theme-" + themeName);

      // 记录在local
      localStorage.setItem("themeName", themeName);
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-theme-switch {
  display: inline-block;
}
</style>
