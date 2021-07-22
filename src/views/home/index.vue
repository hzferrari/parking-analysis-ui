<template>
  <div class="home-page">
    <div class="placeHolder"></div>
    <chart-1
      style="margin-top: 20px"
      v-show="showChart.chart1"
      @loaded="onChart1Loaded"
    ></chart-1>

    <chart-2 v-if="showChart.chart2" style="margin-top: 100px"></chart-2>

    <!-- <chart-3 v-if="showChart.chart3" style="margin-top: 100px"></chart-3> -->

    <chart-4 v-if="showChart.chart4" style="margin-top: 100px"></chart-4>

    <div style="height: 60px"></div>
  </div>
</template>

<script>
import chart1 from "./chart1";
import chart2 from "./chart2";
import chart3 from "./chart3";
import chart4 from "./chart4";

export default {
  name: "home-page",
  components: {
    chart1,
    chart2,
    chart3,
    chart4,
  },
  props: {},
  computed: {},
  watch: {},
  data() {
    return {
      showChart: {
        chart1: false,
        chart2: false,
        chart3: false,
        chart4: false,
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    /**
     *
     */
    onChart1Loaded() {
      console.log("chart1 loaded.");
      this.showChart.chart1 = true;
      this.showChart.chart2 = true;
      this.showChart.chart3 = true;
      this.showChart.chart4 = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/config.scss";

.home-page {
  min-height: 100vh;
  .placeHolder {
    height: $titleBarHeight;
  }
}
</style>
