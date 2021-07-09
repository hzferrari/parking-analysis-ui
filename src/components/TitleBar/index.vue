<template>
  <div class="title-bar-comp">
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
  methods: {},
};
</script>

<style lang="scss" scoped>
.title-bar-comp {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 40px;
  background: #fff;
  z-index: 100;
}
</style>
