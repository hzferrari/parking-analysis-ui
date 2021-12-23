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
      weatherMarkpoint: {
        itemStyle: {
          color: "#bbbbbb",
        },
        // 气泡里的文字样式
        label: {
          color: "rgba(0,0,0,0.8)",
        },
        data: [],
      },
      showWeather: true,
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
    showLoading() {
      if (this.myChart) {
        this.myChart.showLoading();
      }
    },
    hideLoading() {
      this.myChart.hideLoading();
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
      this.beforeSetOption();

      this.setOption();
    },
    /**
     * 在setOption()之前执行
     */
    beforeSetOption() {
      // 计算天气显示
      if (this.showWeather) {
        this.weatherMarkpoint.data = [];

        this.dataObj.dataList.forEach((v) => {
          if (v.diffInRushTimeValue && v.weatherToShow) {
            let symbol;
            // 对应两种主题用不同颜色的icon
            if (this.themeName === "vintage") {
              symbol =
                "image://" +
                util.getWeatherIcon(v.weatherToShow.weather, "color1");
            } else {
              symbol =
                "image://" +
                util.getWeatherIcon(v.weatherToShow.weather, "color2");
            }
            let o = {
              symbol: symbol,
              symbolSize: [20, 20],
              xAxis: v.date,
              // yAxis: v.p7first0Value + (this.showLabel ? 600 : 300),  // 显示在顶部
              yAxis: v.rushTimeStartValue - 250, // 显示在底部
              // value: v.weatherToShow.weather,
            };

            this.weatherMarkpoint.data.push(o);
          }
        });
      } else {
        this.weatherMarkpoint.data = [];
      }
    },
    setOption() {
      let option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            label: {
              show: true,
              color: this.themeName === "vintage" ? "#fff" : "rgba(0,0,0,0.8)",
            },
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
              title: "显示/隐藏天气",
              icon: "path://M493.6 133.6c-3.2 2.4-5.6 26.4-5.6 52 0 36 3.2 48 12.8 52 21.6 8 39.2-8.8 41.6-41.6 4-47.2-4-68-25.6-68-9.6 0-20.8 2.4-23.2 5.6zM240.8 243.2c-12.8 15.2-2.4 35.2 32 64 29.6 25.6 44 26.4 56 4 7.2-14.4 4.8-20.8-21.6-48-32-32.8-51.2-38.4-66.4-20zM720.8 259.2c-28 28.8-30.4 49.6-7.2 64 11.2 7.2 20 2.4 46.4-23.2 37.6-36 40-62.4 8-66.4-14.4-1.6-28 5.6-47.2 25.6zM428 323.2C352.8 358.4 312.8 424 312 508.8c0 147.2 152 246.4 284 184 80-37.6 119.2-97.6 120-184.8 0-64.8-15.2-102.4-58.4-146.4-60-59.2-152-75.2-229.6-38.4z m168 61.6c32.8 22.4 68 86.4 68 122.4-0.8 58.4-49.6 121.6-108.8 140.8C465.6 677.6 368 604.8 368 508c0-38.4 20-86.4 45.6-109.6 46.4-42.4 130.4-48.8 182.4-13.6zM136.8 495.2c-15.2 27.2 5.6 42.4 54.4 39.2 48.8-2.4 68-19.2 49.6-41.6-16-19.2-93.6-17.6-104 2.4zM789.6 485.6c-3.2 2.4-5.6 13.6-5.6 23.2 0 21.6 20.8 29.6 68 25.6 32.8-2.4 49.6-20 41.6-41.6-4-9.6-16-12.8-52-12.8-25.6 0-49.6 2.4-52 5.6zM260.8 720c-24 27.2-28 35.2-20.8 48 12.8 24 33.6 19.2 68-16 25.6-26.4 30.4-35.2 23.2-46.4-16-24.8-39.2-20-70.4 14.4zM706.4 693.6c-32.8 12.8 24.8 94.4 62.4 88.8 30.4-4 28-28.8-5.6-63.2-29.6-30.4-37.6-33.6-56.8-25.6zM493.6 781.6c-3.2 2.4-5.6 26.4-5.6 52 0 49.6 12.8 65.6 39.2 48.8 16-9.6 21.6-78.4 8-95.2-9.6-12-32.8-15.2-41.6-5.6z",
              //icon: "image://" + require("../../assets/weather-icon/color1/100-晴.png"), // base64形式，不能通过borderWidth调大小
              iconStyle: {
                borderWidth: 0.7,
              },
              onclick: () => {
                this.showWeather = !this.showWeather;

                this.beforeSetOption();
                this.setOption();
              },
            },
            myTool2: {
              show: true,
              title: "显示/隐藏标签",
              icon: "path://M498.4832 815.9232a60.2112 60.2112 0 0 1-18.8416-2.8672 61.44 61.44 0 0 1-40.96-48.3328l-23.3472-138.4448a20.0704 20.0704 0 0 0-16.7936-16.7936l-138.4448-23.3472a61.44 61.44 0 0 1-33.1776-104.0384l259.2768-259.2768A62.2592 62.2592 0 0 1 528.7936 204.8h228.9664A61.44 61.44 0 0 1 819.2 266.24v228.9664a62.2592 62.2592 0 0 1-18.0224 43.4176l-259.2768 259.2768a61.0304 61.0304 0 0 1-43.4176 18.0224zM528.7936 245.76a19.2512 19.2512 0 0 0-14.336 6.144l-259.2768 259.2768a20.48 20.48 0 0 0-5.3248 21.2992 21.2992 21.2992 0 0 0 16.384 13.9264l138.4448 22.9376a61.44 61.44 0 0 1 50.3808 50.3808l22.9376 138.4448a21.2992 21.2992 0 0 0 13.9264 16.384 20.48 20.48 0 0 0 20.8896-5.3248l259.2768-259.2768a19.2512 19.2512 0 0 0 6.144-14.336V266.24a20.48 20.48 0 0 0-20.48-20.48z M655.36 368.64m-40.96 0a40.96 40.96 0 1 0 81.92 0 40.96 40.96 0 1 0-81.92 0Z",
              iconStyle: {
                borderWidth: 0.7,
              },
              onclick: () => {
                this.showLabel = !this.showLabel;

                this.beforeSetOption();
                this.setOption();
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
                  "<li>早高峰定义：（二期天面）剩余300个车位至满位的时间段</li>" +
                  "<li>平均满位时刻：会随着显示范围的改变而实时变化</li>" +
                  "<li>每天早上9点更新当天早高峰数据；每天0点更新昨天完整数据</li>" +
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
          // data: ["早高峰时间段", "停车场满位", "出现空位 "],
          data: ["早高峰时间段", "停车场满位", "大事件"],
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
            "markLines", // 没有对应的数据，仅用于显示markLines的series
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
                show: this.showLabel,
                fontSize: 10,
                fontWeight: 700,
              },
              rich: {
                labelType1: {
                  color: "#61a0a8",
                },
              },
              formatter: (params) => {
                // 如果930没满，显示剩余车位数
                if (params.data.p7RemainAt930) {
                  // label富文本，对应rich里的key。（可用\n换行）
                  return `{labelType1|${params.data.p7RemainAt930}}`;
                } else {
                  return this.formatYAxisTime(params.data.p7first0Value);
                }
              },
            },
            lineStyle: this.lineChartStyle.lineStyle,
            itemStyle: this.lineChartStyle.itemStyle,
            markPoint: this.weatherMarkpoint,
            markLine: {
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
          {
            name: "大事件",
            type: "line",
            label: {
              show: false,
            },
            markLine: {
              label: {
                show: true,
                formatter: (params) => {
                  return params.name;
                },
              },
              lineStyle: {
                type: "dotted", //虚线
                opacity: 0.7,
                color: "#7289ab",
                width: 2,
                shadowColor: "rgba(0,0,0,0.3)",
                shadowBlur: 7,
                shadowOffsetY: 5,
              },
              symbol: ["none", "circle"],
              data: [
                {
                  xAxis: "2021-10-07", //
                  y: "83%",
                  name: "停车新政策颁布",
                },
                {
                  xAxis: "2021-10-24", //
                  y: "83%",
                  name: "总经办财务法务搬惠南",
                },
                {
                  xAxis: "2021-10-31", //
                  y: "83%",
                  name: "采购搬惠南",
                },
                {
                  xAxis: "2021-12-23", //
                  y: "83%",
                  name: "打疫苗",
                },
              ],
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
      let weatherName;
      let weatherIconSrc;
      let line0;

      if (params[0].data.weatherToShow) {
        // 有天气
        weatherName = params[0].data.weatherToShow.weather;
        weatherIconSrc = util.getWeatherIcon(
          params[0].data.weatherToShow.weather,
          "color1"
        );

        line0 = `<p style="font-weight:500;">${title}&nbsp;&nbsp; ${week}&nbsp;&nbsp; <span>${weatherName}</span><img src="${weatherIconSrc}" style="width:30px;height:30px;vertical-align:middle;"/></p>`;
      } else {
        line0 = `<p style="font-weight:500;">${title}&nbsp;&nbsp; ${week}&nbsp;&nbsp;</p>`;
      }

      let line1 = "";
      let line2 = "";

      if (params.length > 1 && params[0].data.p7first0Value) {
        let start = this.formatYAxisTime(params[0].data.rushTimeStartValue);
        let end = this.formatYAxisTime(params[0].data.p7first0Value);
        let circleStyle =
          "display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:8px;";

        if (params[1].seriesIndex === 1) {
          let label1 = params[1].seriesName;
          let color1 = params[1].color;

          line2 = `<p style="margin-top:3px;"><span style="${circleStyle};background:${color1}"></span>${label1} : <span style="font-weight:700;">${start} - ${end}</span></p>`;

          if (params[2] && params[2].seriesIndex === 2) {
            let label2 = params[2].seriesName;
            let color2 = params[2].color;

            setLine1(params, circleStyle, color2, label2, end);
          }
        } else if (params[1].seriesIndex === 2) {
          let label2 = params[1].seriesName;
          let color2 = params[1].color;

          setLine1(params, circleStyle, color2, label2, end);
        }
      }

      function setLine1(params, circleStyle, color2, label2, end) {
        // 区分有无p7RemainAt930的情况
        if (params[0].data.p7RemainAt930) {
          label2 = "9:30剩余车位数";
          end = params[0].data.p7RemainAt930;
        }
        line1 = `<p style="margin-top:3px;" ><span style="${circleStyle};background:${color2}"></span>${label2} : <span style="font-weight:700;">${end}</span></p>`;
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
