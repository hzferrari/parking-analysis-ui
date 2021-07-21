<template>
  <div>
    <div
      style="width: 85vw; height: 75vh; margin: 0 auto"
      id="the-chart-4"
    ></div>
  </div>
</template>
<script>
/**
 * 3个停车场车位增减
 */
import * as echarts from "echarts";
import { mapGetters } from "vuex";

export default {
  props: {
    dataObj: {
      type: Object,
      default: function () {
        return {
          dataList: [],
          markPoints: {},
        };
      },
    },
    chartIndex: {
      type: Number | String,
      default: 1,
    },
  },
  watch: {
    // 必须在父组件的dataObj初始化dataList，否则这里watch不到dataList变化
    dataObj: {
      handler(val) {
        console.log("val: ", val);
        // 判断一下有数据时才执行，避免父组件resetData()的时候也initChart()一次
        if (val.dataList.length > 0) {
          // 变化时重新渲染图表
          this.initChart();
        }
      },
      deep: true,
    },
    themeSelected: {
      handler(val) {
        this.themeName = val;
        this.themeChange = true;
        this.setThemeStyle();

        this.initChart();
      },
    },
  },
  computed: {
    ...mapGetters(["themeSelected"]),
  },
  data() {
    return {
      myChart: undefined,
      themeName: "",
      markPoint: {},
      themeChange: false,
      lineChartStyle: {},
      barChartStyle: {
        itemStyle: {},
      },
      dataZoom: [],
      showLabel: false,
    };
  },
  created() {},
  mounted() {
    this.setDefaultTheme();

    this.initChart();

    window.addEventListener("resize", () => {
      this.myChart.resize();
    });
  },
  methods: {
    /**
     * 默认主题
     */
    setDefaultTheme() {
      this.themeName = this.$store.state.app.themeSelected
        ? this.$store.state.app.themeSelected
        : "vintage";
    },

    /**
     * 初始化图表
     */
    initChart() {
      let chartEL = document.getElementById("the-chart-4");

      // 切换时要dispose()，否则切换不了主题
      if (this.themeChange && this.myChart) {
        this.myChart.dispose();
        this.myChart = undefined;

        this.themeChange = false;
      }
      // 不重复init
      if (!this.myChart) {
        this.myChart = echarts.init(chartEL, this.themeName);
      }

      this.beforeSetOption();

      this.setOption();
    },
    setOption() {
      let option = {
        // title: [
        //   {
        //     left: "center",
        //     text: "二期天面",
        //   },
        //   {
        //     top: "30%",
        //     left: "center",
        //     text: "宿舍区",
        //   },
        //   {
        //     top: "60%",
        //     left: "center",
        //     text: "西门南侧",
        //   },
        // ],
        grid: [
          {
            left: "10%",
            right: "10%",
            top: "10%", // 10%-30%
            bottom: "70%",
            containLabel: true,
          },
          {
            left: "10%",
            right: "10%",
            top: "40%", // 40%-60%
            bottom: "40%",
            containLabel: true,
          },
          {
            left: "10%",
            right: "10%",
            top: "70%", // 70%-90%
            bottom: "10%",
            containLabel: true,
          },
        ],
        tooltip: {
          trigger: "axis",
        },
        dataZoom: this.dataZoom,
        dataset: {
          dimensions: ["timeStr", "deltaP7", "deltaP6", "deltaP5"],
          source: this.dataObj.dataList,
        },
        xAxis: [
          {
            gridIndex: 0,
            name: "时间",
            type: "category",
          },
          {
            gridIndex: 1,
            name: "时间",
            type: "category",
          },
          {
            gridIndex: 2,
            name: "时间",
            type: "category",
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            name: "车位减少量\n\n二期天面",
            type: "value",
            axisPointer: {
              snap: true, //  坐标轴指示器是否自动吸附到点上。(不显示小数)
            },
          },
          {
            gridIndex: 1,
            name: "宿舍区",
            type: "value",
            axisPointer: {
              snap: true, //  坐标轴指示器是否自动吸附到点上。(不显示小数)
            },
          },
          {
            gridIndex: 2,
            name: "西门南侧",
            type: "value",
            axisPointer: {
              snap: true, //  坐标轴指示器是否自动吸附到点上。(不显示小数)
            },
          },
        ],

        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0,
            type: "bar",
            name: "二期天面",
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            type: "bar",
            name: "宿舍区",
          },
          {
            xAxisIndex: 2,
            yAxisIndex: 2,
            type: "bar",
            name: "西门南侧",
          },
        ],
      };
      // 画图
      option && this.myChart.setOption(option);
    },
    /**
     * 在setOption()之前执行
     */
    beforeSetOption() {
      this.dataZoom = [
        {
          type: "inside",
          // filterMode: "filter", // 使另一个轴自适应过滤后的数值范围
          brushSelect: false, // 关闭鼠标框选功能
          //  范围（百分比）
          startValue: 100,
          endValue: 200,
        },
        {
          start: 0,
          end: 0,
          brushSelect: false,
        },
      ];
    },
  },
};
</script>
<style lang="scss" scoped>
// @import "~@/styles/config.scss";
</style>
