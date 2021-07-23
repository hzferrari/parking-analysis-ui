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
        // console.log("val: ", val);
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
      nameTextStyle: {},
      dataZoom: [],
      showLabel: false,
    };
  },
  created() {},
  mounted() {
    this.setDefaultTheme();
    this.setThemeStyle();

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
     * 主题变化时改变style
     */
    setThemeStyle() {
      if (this.themeName === "vintage") {
        this.nameTextStyle = {
          color: "rgba(0, 0, 0, 0.5)",
        };
      } else {
        this.nameTextStyle = {
          color: "rgba(255, 255, 255, 0.5)",
        };
      }
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
        grid: [
          {
            left: "10%",
            right: "10%",
            top: "10%", // 10%-32%
            bottom: "68%",
            containLabel: true,
          },
          {
            left: "10%",
            right: "10%",
            top: "40%", // 40%-62%
            bottom: "38%",
            containLabel: true,
          },
          {
            left: "10%",
            right: "10%",
            top: "70%", // 70%-92%
            bottom: "8%",
            containLabel: true,
          },
        ],
        tooltip: {
          trigger: "axis",
          formatter: (params) => {
            return this.formatTooltip(params);
          },
        },
        axisPointer: {
          link: {
            xAxisIndex: "all", // 联动几个图表的坐标轴指示器
          },
        },
        dataZoom: this.dataZoom,
        legend: {
          left: "10%",
          data: [
            "二期天面入",
            "二期天面出",
            "宿舍区入",
            "宿舍区出",
            "西门南侧入",
            "西门南侧出",
          ],
        },
        dataset: {
          dimensions: [
            "timeStr",
            "p7Down",
            "p7Up",
            "p6Down",
            "p6Up",
            "p5Down",
            "p5Up",
          ],
          source: this.dataObj.dataList,
        },
        xAxis: [
          {
            gridIndex: 0,
            name: "时间",
            nameTextStyle: this.nameTextStyle,
            type: "category",
            axisLabel: {
              show: false,
            },
          },
          {
            gridIndex: 1,
            name: "时间",
            nameTextStyle: this.nameTextStyle,
            type: "category",
            axisLabel: {
              show: false,
            },
          },
          {
            gridIndex: 2,
            name: "时间",
            nameTextStyle: this.nameTextStyle,
            type: "category",
            axisLabel: {
              show: true,
            },
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            name: "二期天面",
            nameTextStyle: this.nameTextStyle,
            type: "value",
            minInterval: 1,
            scale: true,
          },
          {
            gridIndex: 1,
            name: "宿舍区",
            nameTextStyle: this.nameTextStyle,
            type: "value",
            minInterval: 1,
            scale: true,
          },
          {
            gridIndex: 2,
            name: "西门南侧",
            nameTextStyle: this.nameTextStyle,
            type: "value",
            minInterval: 1,
            scale: true,
          },
        ],
        series: [
          {
            xAxisIndex: 0,
            yAxisIndex: 0,
            type: "bar",
            name: "二期天面入",
          },
          {
            xAxisIndex: 0,
            yAxisIndex: 0,
            type: "bar",
            name: "二期天面出",
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            type: "bar",
            name: "宿舍区入",
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            type: "bar",
            name: "宿舍区出",
          },
          {
            xAxisIndex: 2,
            yAxisIndex: 2,
            type: "bar",
            name: "西门南侧入",
          },
          {
            xAxisIndex: 2,
            yAxisIndex: 2,
            type: "bar",
            name: "西门南侧出",
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
          xAxisIndex: [0, 1, 2],
          type: "slider",
          filterMode: "weakFilter", // 使另一个轴自适应过滤后的数值范围
          brushSelect: false, // 关闭鼠标框选功能
          //  范围（index）
          // startValue: 400, // 7:10分左右开始
          // endValue: 500,
          startValue: 0, // 7:10分左右开始
          endValue: 50,
        },
        {
          xAxisIndex: [0, 1, 2],
          start: 0,
          end: 0,
          brushSelect: false,
        },
      ];
    },
    /**
     * 格式化tooltip显示内容
     */
    formatTooltip(params) {
      console.log("params: ", params);

      let title = params[0].axisValue;

      // 鼠标在不同图表时，params里数组顺序会变，因此这里只能固定写死顺序显示
      let label0 = "二期天面入";
      let label1 = "二期天面出";
      let label2 = "宿舍区入";
      let label3 = "宿舍区出";
      let label4 = "西门南侧入";
      let label5 = "西门南侧出";

      let data0 = params[0].data.p7Down;
      let data1 = params[0].data.p7Up;
      let data2 = params[0].data.p6Down;
      let data3 = params[0].data.p6Up;
      let data4 = params[0].data.p5Down;
      let data5 = params[0].data.p5Up;

      let color0 = params[0].color;
      let color1 = params[1].color;
      let color2 = params[2].color;

      let titleLine = `<p >${title}</p>`;
      let line0 = `<p>${label0} : <span style="font-weight:700;">${data0}</span></p>`;
      let line1 = `<p>${label1} : <span style="font-weight:700;">${data1}</span></p>`;
      let line2 = `<p>${label2} : <span style="font-weight:700;">${data2}</span></p>`;
      let line3 = `<p>${label3} : <span style="font-weight:700;">${data3}</span></p>`;
      let line4 = `<p>${label4} : <span style="font-weight:700;">${data4}</span></p>`;
      let line5 = `<p>${label5} : <span style="font-weight:700;">${data5}</span></p>`;

      return titleLine + line0 + line1 + line2 + line3 + line4 + line5;
    },
  },
};
</script>
<style lang="scss" scoped>
// @import "~@/styles/config.scss";
</style>
