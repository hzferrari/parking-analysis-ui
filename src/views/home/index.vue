<template>
  <div class="home-page">
    <title-bar-comp></title-bar-comp>
    <!-- <div style="height: 40px"></div> -->
    <chart-1
      style="margin-top: 50px"
      v-show="showChart.chart1"
      @loaded="onChart1Loaded"
    ></chart-1>
    <chart-2 v-show="showChart.chart2" style="margin-top: 100px"></chart-2>

    <div style="height: 40px"></div>
  </div>
</template>

<script>
import TitleBarComp from "@/components/TitleBar";
import chart1 from "./chart1.vue";
import chart2 from "./chart2.vue";

export default {
  name: "home-page",
  components: {
    TitleBarComp,
    chart1,
    chart2,
  },
  props: {},
  computed: {},
  watch: {},
  data() {
    return {
      showChart: {
        chart1: false,
        chart2: false,
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    onChart1Loaded() {
      console.log("chart1 loaded.");
      this.showChart.chart1 = true;
      this.showChart.chart2 = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.home-page {
}
</style>
