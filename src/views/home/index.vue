<template>
  <div class="home-page">
    <chart-1 @loaded="onChart1Loaded"></chart-1>
    <chart-2 style="margin-top: 100px"></chart-2>

    <div style="height: 100px"></div>
  </div>
</template>

<script>
import chart1 from "./chart1.vue";
import chart2 from "./chart2.vue";

export default {
  name: "home-page",
  components: {
    chart1,
    chart2,
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
    onChart1Loaded() {
      console.log("chart1 loaded.");
    },
  },
};
</script>

<style lang="scss" scoped>
.home-page {
}
</style>
