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
        itemStyle: {
          shadowColor: "rgba(0,0,0,0.3)",
          shadowBlur: 7,
          shadowOffsetX: 1,
          shadowOffsetY: 2,
        },
        itemStyle2: {
          shadowColor: "rgba(0,0,0,0.2)",
          shadowBlur: 7,
          shadowOffsetX: 2,
          shadowOffsetY: -2,
        },
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
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow",
            label: {
              show: true,
              color: this.themeName === "vintage" ? "#fff" : "rgba(0,0,0,0.8)",
            },
          },
          formatter: (params) => {
            return this.formatTooltip(params);
          },
          position: function (pos, params, el, elRect, size) {
            var obj = { top: 50 };
            obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 140;
            return obj;
          },
        },
        toolbox: {
          show: true,
          right: "9%",
          feature: {
            myTool1: {
              show: true,
              title: "精确到秒",
              icon: "path://M862 161.7c-96.7-96.7-223.3-145-350-145S258.6 65 162 161.7c-193.3 193.3-193.3 506.7 0 700 96.7 96.7 223.3 145 350 145s253.4-48.3 350-145c193.3-193.2 193.3-506.7 0-700z m-28.3 671.8c-43.4 43.5-94.1 77.1-150.5 100-54.5 22.1-112.1 33.3-171.2 33.3-59.1 0-116.7-11.2-171.2-33.3-56.4-22.9-107-56.5-150.5-100-43.5-43.4-77.1-94.1-100-150.5C68.2 628.5 57 570.9 57 511.8S68.2 395 90.3 340.5c22.9-56.4 56.5-107.1 100-150.5 43.4-43.4 94.1-77.1 150.5-100C395.3 68 452.9 56.8 512 56.8c59.1 0 116.7 11.2 171.2 33.3 56.4 22.9 107.1 56.5 150.5 100 43.4 43.4 77.1 94.1 100 150.5 22.1 54.4 33.3 112 33.3 171.2S955.8 628.5 933.7 683c-22.9 56.4-56.5 107-100 150.5z M800.2 532c0 11-9 20-20 20H485.5c-11 0-20-9-20-20V237.3c0-11 9-20 20-20s20 9 20 20V512h274.7c11 0 20 9 20 20z",
              onclick: () => {
                this.$emit("showSecondAccuracy");
              },
            },
            myTool2: {
              show: true,
              title: "精确到分钟",
              icon: "path://M510.6257 82.909292c-241.509473 0-437.293531 195.784058-437.293531 437.293531 0 241.511519 195.784058 437.293531 437.293531 437.293531 241.511519 0 437.293531-195.782012 437.293531-437.293531C947.919231 278.69335 752.137219 82.909292 510.6257 82.909292zM510.6257 919.471318c-220.508159 0-399.268496-178.75829-399.268496-399.268496s178.760336-399.268496 399.268496-399.268496c220.510206 0 399.268496 178.75829 399.268496 399.268496S731.135906 919.471318 510.6257 919.471318zM715.169259 618.972337 529.638729 513.813299 529.638729 244.517993c0-5.249561-4.254907-9.506515-9.506515-9.506515l-19.013029 0c-5.249561 0-9.504468 4.256954-9.504468 9.506515l0 285.191344c0 1.950422 0.589424 3.76372 1.597381 5.273097 0.813528 1.656733 2.116197 3.095501 3.843538 4.073782l199.38098 113.009843c4.571109 2.583848 10.369162 0.977257 12.957103-3.591805l9.365298-16.544815C721.345935 627.359354 719.739345 621.558232 715.169259 618.972337z",
              onclick: () => {
                this.$emit("showMinuteAccuracy");
              },
            },
            saveAsImage: {
              title: "保存为图片",
            },
            myManual: {
              show: true,
              icon: "path://M559.261538 748.307692h-98.461538c-15.753846 0-27.569231-11.815385-27.569231-27.56923v-29.538462c0-82.707692 53.169231-157.538462 131.938462-185.107692 23.630769-7.876923 45.292308-21.661538 63.015384-41.353846 98.461538-118.153846 7.876923-259.938462-110.276923-263.876924-43.323077-1.969231-84.676923 13.784615-116.184615 43.323077-25.6 23.630769-41.353846 53.169231-45.292308 86.646154-1.969231 11.815385-13.784615 21.661538-29.538461 21.661539h-98.461539c-17.723077 0-31.507692-13.784615-29.538461-31.507693 7.876923-74.830769 41.353846-141.784615 94.523077-194.953846 63.015385-59.076923 143.753846-90.584615 230.4-88.615384C687.261538 43.323077 821.169231 177.230769 827.076923 340.676923c5.907692 137.846154-78.769231 261.907692-206.769231 309.169231-17.723077 7.876923-29.538462 21.661538-29.538461 39.384615v29.538462c0 17.723077-15.753846 29.538462-31.507693 29.538461zM590.769231 955.076923c0 15.753846-13.784615 29.538462-29.538462 29.538462h-98.461538c-15.753846 0-29.538462-13.784615-29.538462-29.538462v-98.461538c0-15.753846 13.784615-29.538462 29.538462-29.538462h98.461538c15.753846 0 29.538462 13.784615 29.538462 29.538462v98.461538z",
              onclick: () => {},
            },
          },
          tooltip: {
            // 和 option.tooltip 的配置项相同
            show: true,
            formatter: function (param) {
              if (param.name === "myManual") {
                let redDom =
                  "<div style='padding: 0 20px;font-size:14px;line-height:26px'>" +
                  "<ul style='list-style: disc'>" +
                  "<li><p>同一坐标轴上，朝上的柱子（y>0）表示车辆驶出数量。</p><p>朝下的柱子（y<0）表示车辆驶入数量</p></li>" +
                  "<li><p>默认横坐标间隔以分钟为单位。开启“精确到秒”时，</p><p>大概8:20-8:50的一段时间间隔变为5s</p></li>" +
                  "</ul>" +
                  "</div>";

                return redDom; // 自定义的 DOM 结构
              } else {
                return "";
              }
            },
            extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);", // 自定义的 CSS 样式
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
            stack: "二期天面",
            itemStyle: this.barChartStyle.itemStyle,
          },
          {
            xAxisIndex: 0,
            yAxisIndex: 0,
            type: "bar",
            name: "二期天面出",
            stack: "二期天面",
            itemStyle: this.barChartStyle.itemStyle2,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            type: "bar",
            name: "宿舍区入",
            stack: "宿舍区",
            itemStyle: this.barChartStyle.itemStyle,
          },
          {
            xAxisIndex: 1,
            yAxisIndex: 1,
            type: "bar",
            name: "宿舍区出",
            stack: "宿舍区",
            itemStyle: this.barChartStyle.itemStyle2,
          },
          {
            xAxisIndex: 2,
            yAxisIndex: 2,
            type: "bar",
            name: "西门南侧入",
            stack: "西门南侧",
            itemStyle: this.barChartStyle.itemStyle,
          },
          {
            xAxisIndex: 2,
            yAxisIndex: 2,
            type: "bar",
            name: "西门南侧出",
            stack: "西门南侧",
            itemStyle: this.barChartStyle.itemStyle2,
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
          type: "inside",
          filterMode: "weakFilter", // 使另一个轴自适应过滤后的数值范围
          brushSelect: false, // 关闭鼠标框选功能
          //  范围（index）
          startValue: 430, //
          endValue: 510,
          // startValue: 0,
          // endValue: 50,
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
      // console.log("params: ", params);

      let title = params[0].axisValue;
      let res = `<p style="font-weight:700">${title}</p>`;
      let circleStyle =
        "display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px";

      params.forEach((param, index) => {
        let label = param.seriesName;
        let data = param.value[param.dimensionNames[param.encode.y[0]]];
        if (data < 0) {
          data = -data;
        }
        let color = param.color;

        res += `<p><span style="${circleStyle};background:${color}"></span>${label} : <span style="font-weight:700;">${data}</span></p>`;
      });

      return res;
    },
  },
};
</script>
<style lang="scss" scoped>
// @import "~@/styles/config.scss";
</style>
