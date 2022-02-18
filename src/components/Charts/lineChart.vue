<template>
  <div>
    <!-- <div
      style="width: 85vw; height: 75vh; margin: 0 auto"
      :id="'line-chart-' + chartIndex"
    ></div> -->
    <div
      style="width: 85vw; height: 75vh; margin: 0 auto"
      id="line-chart-1"
    ></div>
  </div>
</template>

<script>
/**
 * 车位变化折线图
 */
import * as echarts from "echarts";
import chartColors from "@/styles/chartColors";
import { mapGetters } from "vuex";

export default {
  props: {
    dataObj: {
      type: Object,
      default: function () {
        return {
          timestamp: 0,
          dataList: [],
          titleText: "",
          showLegend: true, // 是否显示legend
          // legend_data: [],
          markPoint: {},
        };
      },
    },
    chartWidth: {
      type: String,
      default: "7.5rem",
    },
    chartHeight: {
      type: String,
      default: "4rem",
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

        this.initChart();
      },
    },
    // orientation: {
    //   handler: function (val) {
    //     console.log("🚀 ~ file: index.vue ~ line 105 ~ orientation", val);

    //     //手机旋转
    //     if (val == 90 || val == -90) {
    //       // 横屏
    //     } else {
    //       // 竖屏
    //     }
    //   },
    // },
  },
  computed: {
    ...mapGetters(["themeSelected", "orientation"]),
  },
  data() {
    return {
      myChart: undefined,
      themeName: "",
      lineStyle: {
        width: 2,
        shadowColor: "rgba(0,0,0,0.3)",
        shadowBlur: 7,
        shadowOffsetY: 5,
      },
      markPoint: {},
      markArea: {},
      dataZoom: {},
      hasSetEvent: false,
      themeChange: false,
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
    showLoading() {
      this.myChart.showLoading();
    },
    hideLoading() {
      this.myChart.hideLoading();
    },
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
      let chartEL = document.getElementById("line-chart-1");
      // let chartEL = document.getElementById("line-chart-" + this.chartIndex);
      // 必须设置dom的宽高，才能显示出图表
      // chartEL.style.width = this.chartWidth;
      // chartEL.style.height = this.chartHeight;

      // 切换时要dispose()，否则切换不了主题
      if (this.themeChange && this.myChart) {
        this.myChart.dispose();
        this.myChart = undefined;

        this.themeChange = false;
      }
      // 不重复init
      if (!this.myChart) {
        this.myChart = echarts.init(chartEL, this.themeName, {
          renderer: "canvas",
        });
      }

      this.beforeSetOption();

      this.setOption();

      this.setEvents();

      this.hideLoading();
    },
    setOption() {
      let option = {
        title: [
          // {
          //   left: "center",
          //   text: this.dataObj.titleText.split(" ")[0],
          //   subtext: this.dataObj.titleText.split(" ")[1],
          //   itemGap: 5, //主副标题之间的间距
          //   top: 0,
          // },
        ],
        grid: {
          left: "10%",
          right: "10%",
          top: "15%",
          bottom: "10%",
          containLabel: true,
        },
        legend: {
          data: ["二期天面", "宿舍区", "西门南侧"],
          left: "10%",
          top: "1%",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // type: "cross",
            // snap: true,
            label: {
              show: true,
              precision: 0, // 精确小数点位数
              color: this.themeName === "vintage" ? "#fff" : "rgba(0,0,0,0.8)",
            },
          },
        },
        toolbox: {
          show: true,
          right: "9%",
          // top: "-5px",
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
            // dataZoom: {
            //   yAxisIndex: "none",
            //   title: {
            //     zoom: "框选视图范围",
            //     back: "回退上一视图",
            //   },
            // },
            // （重置视图时，日期也会回到一开始的默认日期）
            // restore: {
            //   title: "重置视图",
            // },
          },
          tooltip: {
            // 和 option.tooltip 的配置项相同
            show: true,
            formatter: function (param) {
              if (param.name === "myManual") {
                let redDom =
                  "<div style='padding: 0 20px;font-size:14px;line-height:26px'>" +
                  "<ul style='list-style: disc'>" +
                  "<li>早高峰定义：（二期天面）空闲300个车位至满位的时间段</li>" +
                  "<li>红色气泡：停车场满位时刻" +
                  "<p>相邻的下一个黄色气泡：停车场出现空位</p></li>" +
                  "<li><p>默认横坐标间隔以分钟为单位。开启“精确到秒”时，</p><p>大概8:20-8:50的一段时间间隔变为5s</p></li>" +
                  "<li><p>由于算法问题，选择“精确到秒”或“精确到分钟”</p><p>显示的早高峰时间段可能会有误差</p></li>" +
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
        // 图表坐标缩放
        dataZoom: this.dataZoom,
        dataset: {
          dimensions: ["timeStr", "p7", "p6", "p5"],
          source: this.dataObj.dataList,
        },
        xAxis: {
          name: "时间",
          type: "category",
        },
        yAxis: {
          name: "空闲车位数",
          type: "value",
          axisPointer: {
            snap: true, //  坐标轴指示器是否自动吸附到点上。(不显示小数)
          },
        },
        series: [
          {
            type: "line",
            name: "二期天面",
            lineStyle: this.lineStyle,
            markPoint: this.markPoint,
            markArea: this.markArea,
          },
          { type: "line", name: "宿舍区", lineStyle: this.lineStyle },
          {
            type: "line",
            name: "西门南侧",
            lineStyle: this.lineStyle,
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
      let tData = this.dataObj;

      // 周末可能车位不会变成0，因此要判断如果markPoints["p7first0"]不为0时才设置早高峰标志区域
      if (tData.markPoints["p7first0"] !== undefined) {
        this.dataZoom = [
          {
            type: "inside",
            filterMode: "filter", // 使另一个轴自适应过滤后的数值范围
            brushSelect: false, // 关闭鼠标框选功能
            // 范围（值）
            // 覆盖早高峰范围
            startValue: tData.markPoints["rushTimeStart"] - 20,
            endValue: tData.markPoints["p7first0"] + 60,
            //  范围（百分比）
            // start: 30,
            // end: 39,
          },
          {
            start: 0,
            end: 0,
            brushSelect: false, // y轴也要设置才会生效
          },
        ];

        this.markPoint = {
          // 气泡样式
          symbol: "pin",
          itemStyle: {
            color: chartColors.grad.yellow,
          },
          // 气泡里的文字样式
          label: {
            color: "rgba(0,0,0,0.8)",
            fontSize: 11,
          },
          emphasis: {
            label: {
              fontWeight: 700,
            },
          },
          data: [
            {
              symbol: "pin",
              symbolSize: [50, 50],
              name: "早高峰开始",
              xAxis: tData.markPoints["rushTimeStart"],
              yAxis: tData.dataList[tData.markPoints["rushTimeStart"]].p7,
              value: tData.dataList[tData.markPoints["rushTimeStart"]].p7,
            },
            {
              name: "空闲车位0",
              xAxis: tData.markPoints["p7first0"],
              yAxis: tData.dataList[tData.markPoints["p7first0"]].p7,
              value: tData.dataList[tData.markPoints["p7first0"]].p7,
              itemStyle: {
                color: chartColors.grad.burningOrange,
              },
            },
          ],
        };

        // 这样写，没有那时刻的数据时才不会报错
        if (tData.markPoints["p7firstNot0"]) {
          this.markPoint.data.push({
            name: "出现空闲车位",
            xAxis: tData.markPoints["p7firstNot0"],
            yAxis: tData.dataList[tData.markPoints["p7firstNot0"]].p7,
            value: tData.dataList[tData.markPoints["p7firstNot0"]].p7,
          });
        }

        if (tData.markPoints["time0800"]) {
          this.markPoint.data.push({
            name: "8点空闲车位数",
            xAxis: tData.markPoints["time0800"],
            yAxis: tData.dataList[tData.markPoints["time0800"]].p7,
            value: tData.dataList[tData.markPoints["time0800"]].p7,
          });
        }

        let startTimeStr =
          tData.dataList[tData.markPoints["rushTimeStart"]].timeStr;
        let endTimeStr = tData.dataList[tData.markPoints["p7first0"]].timeStr;

        this.markArea = {
          itemStyle: {
            color: "rgba(255, 173, 177, 0.4)",
          },
          data: [
            [
              {
                xAxis: tData.markPoints["rushTimeStart"],

                // ***显示方案1：只显示到分，不显示秒
                // name:
                //   "早高峰\n" +
                //   (startTimeStr.length > 5
                //     ? startTimeStr.substr(0, startTimeStr.length - 3)
                //     : startTimeStr) +
                //   " - " +
                //   (endTimeStr.length > 5
                //     ? endTimeStr.substr(0, endTimeStr.length - 3)
                //     : endTimeStr),

                // ***显示方案2：根据精确到分或秒，显示不同
                name: "早高峰\n" + startTimeStr + " - " + endTimeStr,
                //
              },
              {
                xAxis: tData.markPoints["p7first0"], // 早高峰结束点
              },
            ],
          ],
        };
      } else {
        // 一般是周末、假期的情况
        this.dataZoom = [
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
        ];
        // 若要从显示到删除，则需设置成undefined，否则markPoints,markArea的显示会使用旧数据
        this.markPoint = {
          // 气泡样式
          itemStyle: {
            color: chartColors.grad.yellow,
          },
          // 气泡里的文字样式
          label: {
            color: "rgba(0,0,0,0.8)",
          },
          data: [
            {
              name: "车位空闲最小值",
              type: "min",
            },
          ],
        };
        // 这样写，没有那时刻的数据时才不会保存
        if (tData.markPoints["time0800"]) {
          this.markPoint.data.push({
            name: "8点空闲车位数",
            xAxis: tData.markPoints["time0800"],
            yAxis: tData.dataList[tData.markPoints["time0800"]].p7,
            value: tData.dataList[tData.markPoints["time0800"]].p7,
          });
        }

        this.markArea = undefined;
      }
    },
    /**
     * 事件
     */
    setEvents() {
      // 事件只能创建一次
      if (this.hasSetEvent) {
        return;
      }
      this.hasSetEvent = true;

      // 点击了restore按钮
      this.myChart.on("restore", (params) => {
        console.log("🚀 ~ file: index.vue ~ line 346 ~ params", params);
        this.$emit("restore");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// @import "~@/styles/config.scss";
</style>
