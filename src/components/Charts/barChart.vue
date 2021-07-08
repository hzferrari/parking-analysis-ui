<template>
  <div>
    <div
      style="width: 100vw; height: 75vh; margin: 0 auto"
      :id="'bar-chart-' + chartIndex"
    ></div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { mapGetters } from "vuex";
import util from "@/utils/util";

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
      handler(newValue) {
        // 变化时重新渲染图表
        this.initChart();
      },
      deep: true,
    },
    themeSelected: {
      handler(newValue) {
        this.themeName = newValue;
        this.themeChange = true;

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
    };
  },
  created() {},
  mounted() {
    this.setDefaultTheme();

    this.initChart();
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
      let chartEL = document.getElementById("bar-chart-" + this.chartIndex);

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
          right: "10%",
          feature: {
            // （重置视图时，日期也会回到一开始的默认日期）
            restore: {
              title: "重置视图",
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
          data: ["早高峰时间段", "天台停车场满位", "天台停车场出现空位"],
          selected: {
            天台停车场出现空位: false,
          },
        },
        grid: {
          left: "15%",
          right: "15%",
          top: "20%",
          bottom: "10%",
          containLabel: true,
        },
        dataset: {
          dimensions: [
            "dateTime",
            "rushTimeStartValue",
            "diffInRushTimeValue",
            "p7first0Value",
            "p7firstNot0Value",
          ],
          source: this.dataObj.dataList,
        },
        xAxis: {
          name: "日期",
          type: "category",
          axisLabel: {
            interval: 1, // x轴间隔1个显示
            rotate: 45,
            formatter: (value) => {
              return this.formatXAxisTime(value);
            },
          },
        },
        yAxis: {
          name: "时间",
          type: "value",
          min: 26000,
          max: 33000,
          // scale: true,
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
            label: {
              show: false,
              position: "top",
            },
          },
          {
            name: "天台停车场满位",
            type: "line",
            connectNulls: true, // 连接空数据
            label: {
              show: true,
              position: "top",
              formatter: (params) => {
                return this.formatYAxisTime(params.data.p7first0Value);
              },
            },
            lineStyle: {
              type: "dashed",
            },
          },
          {
            name: "天台停车场出现空位",
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
     * 在setOption()之前执行
     */
    beforeSetOption() {
      // let tData = this.dataObj;
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

      let start = this.formatYAxisTime(params[0].data.rushTimeStartValue);
      let end = this.formatYAxisTime(params[0].data.p7first0Value);

      let res1 = `<p style="font-weight:700;">${title}&nbsp;&nbsp; ${week}</p>`;
      let res2 = "";

      if (params[0].data.p7first0Value) {
        res2 = `<p>${label1}&nbsp;&nbsp;&nbsp; : ${start} - ${end}</p><p>${label2} : ${end}</p>`;
      }

      return res1 + res2;
    },
    /**
     * x轴label处理
     */
    formatXAxisTime(value) {
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
  },
};
</script>
<style lang="scss" scoped>
// @import "~@/styles/config.scss";
</style>
