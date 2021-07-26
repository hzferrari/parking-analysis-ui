<template>
  <div>
    <div
      style="width: 85vw; height: 75vh; margin: 0 auto"
      id="bar-chart-1"
    ></div>
  </div>
</template>
<script>
/**
 * 早高峰时段+车位变0趋势图
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

      lineChartStyle: {
        lineStyle: {
          type: "dashed", //虚线
          width: 3,
          shadowColor: "rgba(0,0,0,0.3)",
          shadowBlur: 7,
          shadowOffsetY: 5,
        },
        itemStyle: {},
      },
      barChartStyle: {
        itemStyle: {
          shadowColor: "rgba(0,0,0,0.3)",
          shadowBlur: 7,
          shadowOffsetX: 2,
          shadowOffsetY: 5,
        },
      },
      showLabel: true,
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
        this.lineChartStyle.lineStyle.color = "#61a0a8";
        this.lineChartStyle.itemStyle.color = "#d87c7c";
        this.lineChartStyle.itemStyle.opacity = 0.6;
        this.barChartStyle.itemStyle.color = "#efa18d";
      } else {
        this.lineChartStyle.lineStyle.color = "#73b9bc";
        this.lineChartStyle.itemStyle.color = "#eedd78";
        this.lineChartStyle.itemStyle.opacity = 0.7;
        this.barChartStyle.itemStyle.color = "#e69d87";
      }
    },
    /**
     * 初始化图表
     */
    initChart() {
      // let chartEL = document.getElementById("bar-chart-" + this.chartIndex);
      let chartEL = document.getElementById("bar-chart-1");

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

      this.setOption();
    },
    setOption() {
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) => {
            return this.formatTooltip(params);
          },
        },
        toolbox: {
          show: true,
          right: "9%",
          feature: {
            myTool1: {
              show: true,
              title: "显示/隐藏标签",
              icon: "path://M498.4832 815.9232a60.2112 60.2112 0 0 1-18.8416-2.8672 61.44 61.44 0 0 1-40.96-48.3328l-23.3472-138.4448a20.0704 20.0704 0 0 0-16.7936-16.7936l-138.4448-23.3472a61.44 61.44 0 0 1-33.1776-104.0384l259.2768-259.2768A62.2592 62.2592 0 0 1 528.7936 204.8h228.9664A61.44 61.44 0 0 1 819.2 266.24v228.9664a62.2592 62.2592 0 0 1-18.0224 43.4176l-259.2768 259.2768a61.0304 61.0304 0 0 1-43.4176 18.0224zM528.7936 245.76a19.2512 19.2512 0 0 0-14.336 6.144l-259.2768 259.2768a20.48 20.48 0 0 0-5.3248 21.2992 21.2992 21.2992 0 0 0 16.384 13.9264l138.4448 22.9376a61.44 61.44 0 0 1 50.3808 50.3808l22.9376 138.4448a21.2992 21.2992 0 0 0 13.9264 16.384 20.48 20.48 0 0 0 20.8896-5.3248l259.2768-259.2768a19.2512 19.2512 0 0 0 6.144-14.336V266.24a20.48 20.48 0 0 0-20.48-20.48z M655.36 368.64m-40.96 0a40.96 40.96 0 1 0 81.92 0 40.96 40.96 0 1 0-81.92 0Z",
              onclick: () => {
                this.showLabel = !this.showLabel;
                this.setOption();
              },
            },
            saveAsImage: {
              title: "保存为图片",
            },
          },
        },
        dataZoom: [
          {
            type: "inside",
            filterMode: "filter", // 使另一个轴自适应过滤后的数值范围
            brushSelect: false, // 关闭鼠标框选功能
            //  范围（百分比）
            start: 0,
            end: 100,
          },
          {
            start: 0,
            end: 0,
            brushSelect: false,
          },
        ],
        legend: {
          data: ["早高峰时间段", "停车场满位"],
          selected: {
            出现空位: false,
          },
          left: "10%",
          top: "1%",
        },
        grid: {
          left: "10%",
          right: "10%",
          top: "15%",
          bottom: "10%",
          containLabel: true,
        },
        dataset: {
          dimensions: [
            "date",
            "rushTimeStartValue",
            "diffInRushTimeValue",
            "p7first0Value",
            "p7firstNot0Value",
            "p6first0Value",
          ],
          source: this.dataObj.dataList,
        },
        xAxis: {
          name: "日期",
          type: "category",
          axisLabel: {
            // interval: 1, // x轴间隔1个显示
            rotate: 45,
            formatter: (value) => {
              return this.formatXAxisTime(value);
            },
          },
        },
        yAxis: {
          name: "时间",
          type: "value",
          // min: 26000,
          // max: 33000,
          scale: true,
          axisLabel: {
            formatter: (value) => {
              return this.formatYAxisTime(value);
            },
          },
        },
        series: [
          {
            name: "高峰期开始时间",
            type: "bar",
            stack: "时间", // 相同的stack会堆叠在一起
            itemStyle: {
              color: "rgba(0,0,0,0)",
            },
            emphasis: {
              itemStyle: {
                color: "rgba(0,0,0,0)",
              },
            },
          },
          {
            name: "早高峰时间段",
            type: "bar",
            stack: "时间", // 相同的stack会堆叠在一起
            itemStyle: this.barChartStyle.itemStyle,
            label: {
              show: false,
              position: "top",
            },
          },
          {
            name: "停车场满位",
            type: "line",
            connectNulls: true, // 连接空数据
            label: {
              opacity: 0.8,
              show: this.showLabel,
              position: "top",
              distance: 5, // 标签和折线间距
              fontSize: 10,
              emphasis: {
                fontSize: 12,
                fontWeight: 700,
              },
              formatter: (params) => {
                return this.formatYAxisTime(params.data.p7first0Value);
              },
            },
            lineStyle: this.lineChartStyle.lineStyle,
            itemStyle: this.lineChartStyle.itemStyle,
            markLine: {
              show: false,
              symbol: ["none", "circle"],
              data: [
                [
                  {
                    type: "average",
                    name: "平均值",
                    x: "12%",
                  },
                  {
                    type: "average",
                    name: "平均值",
                    x: "91%",
                    lineStyle: {
                      opacity: 0.5,
                    },
                    // 鼠标移上去时
                    emphasis: {
                      lineStyle: {
                        opacity: 1,
                      },
                    },
                    label: {
                      opacity: 0.7,
                      position: "end",
                      formatter: (params) => {
                        return "平均满位时刻\n" + this.formatAvgTime(params);
                      },
                    },
                  },
                ],
              ],
            },
          },
          {
            name: "出现空位",
            type: "line",
            connectNulls: true, // 连接空数据
            label: {
              show: true,
              position: "top",
              formatter: (params) => {
                return this.formatYAxisTime(params.data.p7firstNot0Value);
              },
            },
            lineStyle: {
              type: "dashed",
            },
          },
        ],
      };
      // 画图
      option && this.myChart.setOption(option);
    },
    /**
     * 格式化tooltip显示内容
     */
    formatTooltip(params) {
      // console.log("params: ", params);

      let title = params[0].axisValue;
      let week = params[0].data.week;

      let label1 = params[1].seriesName;
      let label2 = params[2].seriesName;

      let color1 = params[1].color;
      let color2 = params[2].color;

      let start = this.formatYAxisTime(params[0].data.rushTimeStartValue);
      let end = this.formatYAxisTime(params[0].data.p7first0Value);

      let line0 = `<p style="font-weight:500;">${title}&nbsp;&nbsp; ${week}</p>`;
      let line1 = "";
      let line2 = "";

      if (params[0].data.p7first0Value) {
        line1 = `<p style="margin-top:3px;" ><span style="color:${color2}">- </span>${label2}&nbsp;&nbsp;&nbsp; : <span style="font-weight:700;">${end}</span></p>`;

        line2 = `<p style="margin-top:3px;"><span style="color:${color1}">- </span>${label1} : <span style="font-weight:700;">${start} - ${end}</span></p>`;
      }

      return line0 + line1 + line2;
    },
    /**
     * x轴label处理
     */
    formatXAxisTime(value) {
      if (!value) return;

      let month = value.split("-")[1];
      let date = value.split("-")[2];

      if (month.substr(0, 1) == "0") {
        month = month.substr(1, 2);
      }
      if (date.substr(0, 1) == "0") {
        date = date.substr(1, 2);
      }

      return month + "月" + date + "日";
    },
    /**
     * y轴label处理
     * 把_normalizeDatetime()后的数值转换成时间字符串
     */
    formatYAxisTime(value) {
      // console.log("value: ", value);
      let hour = Math.floor(value / 3600);
      let minute = Math.floor((value % 3600) / 60);

      return hour + ":" + (minute < 10 ? "0" + minute : minute);
    },
    /**
     *
     */
    formatAvgTime(params) {
      let str = this.formatYAxisTime(params.data.value);
      str = " " + str.split(":")[0] + " : " + str.split(":")[1];
      // console.log("params: ", params);
      return str;
    },
  },
};
</script>
<style lang="scss" scoped>
// @import "~@/styles/config.scss";
</style>
