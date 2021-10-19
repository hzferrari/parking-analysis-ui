<template>
  <div class="chart-2-comp">
    <div
      class="title"
      style="
        position: relative;
        margin: 0 auto;
        margin-bottom: 20px;
        width: 70vw;
        text-align: center;
      "
    >
      <the-daterange-picker
        style="position: absolute; left: 10px"
        ref="theDatePicker"
        :disabled="isLoading"
        @change="onDaterangePickerChange"
      ></the-daterange-picker>

      <svg-icon
        v-show="isLoading"
        class="icon loading-icon"
        :class="{ '__is-loading': isLoading }"
        icon-class="loading"
      />

      <div>
        <p style="font-size: 20px">{{ titleText }}</p>
        <p style="font-size: 15px; margin-top: 10px">{{ subTitle }}</p>
      </div>
    </div>

    <bar-chart ref="myChart" chartIndex="1" :dataObj="dataObj"></bar-chart>
  </div>
</template>

<script>
import _ from "lodash";
import util from "@/utils/util";
import BarChart from "@/components/Charts/barChart";
import TheDaterangePicker from "@/components/TheDatePicker/daterange";

import { getOnedayDataByTimestamp, getWeatherByTimestamp } from "@/api/index";

export default {
  name: "chart-2-comp",
  components: {
    BarChart,
    TheDaterangePicker,
  },
  props: {},
  computed: {},
  watch: {},
  data() {
    return {
      dataObj: {
        dataList: [], // 这里必须初始化dataList，否则子组件watch不到
        markPoints: {},
      },
      today: "",
      curDateRange: [], // initData() 正在使用的时间戳
      titleText: "上班早高峰时间段",
      subTitle: "(二期天面)",
      isLoading: false,
    };
  },
  created() {
    // 默认timestamp是今天
    this.today = Date.now();

    // 默认是最近一个月
    let fileNames = util.getFileNames(this.today);

    this.curDateRange = [
      new Date(fileNames[0] + " 00:00:00").getTime(),
      new Date(fileNames[fileNames.length - 1] + " 23:59:59").getTime(),
    ];

    // this.initLocalData();
    this.initData();
  },
  mounted() {},
  methods: {
    /**
     * 日期选择
     */
    onDaterangePickerChange(timestampArr) {
      // console.log("timestampArr: ", timestampArr);
      this.curDateRange = timestampArr;

      this.initData();
    },
    /**
     * 从接口获取数据
     */
    async initData() {
      this.isLoading = true;

      let res = await getOnedayDataByTimestamp(
        this.curDateRange[0],
        this.curDateRange[1]
      );

      let resWeather = await getWeatherByTimestamp(
        this.curDateRange[0],
        this.curDateRange[1]
      );

      this.dataObj.dataList = res.data;

      this.dataObj.dataList.forEach((v) => {
        // 异常数据处理，让异常数据不破坏y轴显示范围

        if (!v.diffInRushTimeValue) {
          // 如果没有高峰期时段，rushTimeStartValue和diffInRushTimeValue都设为undefined，坐标轴显示才正常
          v.rushTimeStartValue = undefined;
          v.diffInRushTimeValue = undefined;
        }
      });

      // 在有了this.dataObj.dataList之后处理天气数据
      this.handleWeatherData(resWeather);

      console.log("this.dataObj.dataList: ", this.dataObj.dataList);

      this.$store.commit("app/setOnedayDataList", res.data);

      this.isLoading = false;
    },
    /**
     * 处理天气数据
     */
    handleWeatherData(resWeather) {
      let dataList = this.dataObj.dataList;
      let weathers = resWeather.data;

      // 将resWeather里每天的天气数据对应到dataObj.dataList中，按照日期一一对应
      for (let i = 0, len = dataList.length; i < len; i++) {
        let dataNow = dataList[i];

        for (let j = 0; j < weathers.length; j++) {
          if (dataNow.date === weathers[j].date) {
            dataList[i].weatherObj = weathers[j];

            dataList[i].weatherToShow = getTodayWeather(
              weathers[j].weatherList
            );
            break;
          }
        }
      }

      // 计算要用来显示的当天的天气
      function getTodayWeather(list) {
        // 后面会计算最靠近这个小时点的时间。
        // 例：设置为7，优先找7点开始最接近7点的数据；没有7点x的数据时，找6点、5点...的数据；如果前面都没有，则找8点后的数据
        let hourTime = 7;

        let resObj = {};
        for (let i = 0, len = list.length; i < len; i++) {
          let uptime = list[i].uptime;
          let hh = parseInt(uptime.match(/\d{2}:/)[0]); //获取小时部分

          if (hh === hourTime) {
            // 如果有第一个hourTime点多的数据，则用这个
            resObj = list[i];
            break;
          } else if (hh < hourTime) {
            if (list[i + 1]) {
              // 如果有下一个时间点的数据，查看下一个小时数是否大于hourTime。
              // 如果hhNext大于hourTime，则选用当前的天气数据，否则继续到下一个循环
              let hhNext = parseInt(list[i + 1].uptime.match(/\d{2}:/)[0]);
              if (hhNext > hourTime) {
                resObj = list[i];
                break;
              } else {
                continue;
              }
            } else {
              // 没有下一个了，只能用这个最接近hourTime点的
              resObj = list[i];
              break;
            }
          } else if (hh > hourTime) {
            // 进入这个分支说明是list[0]的hh就大于hourTime了，则直接用这个数据
            resObj = list[i];
            break;
          }
        }

        return resObj;
      }
    },
    /**
     * 从本地加载json数据
     */
    initLocalData() {
      let fileNames = util.getFileNames();
      let dataListGroup = [];

      fileNames.forEach((dateTime) => {
        try {
          dataListGroup.push({
            date: dateTime,
            dataList:
              require(`/src/parkingData/parking_data_bytime_${dateTime}.json`)
                .data,
          });
        } catch (e) {
          console.log("读取数据失败: ", dateTime);
        }
      });

      // console.log("dataListGroup: ", dataListGroup);
      this.dataObj.dataList = this.handleData(dataListGroup);
    },
    /**
     * 处理（从本地加载json数据时）
     */
    handleData(dataListGroup) {
      dataListGroup.forEach((oneDay) => {
        // 当天0点的timestamp
        oneDay.timestamp = oneDay.dataList[0].timestamp;
        // 设置当天是星期几
        oneDay.week = util.getWeekByTimestamp(oneDay.dataList[0].timestamp);

        let rushTimeStartIndex, p7first0Index, p7firstNot0Index;

        for (let i = 0, len = oneDay.dataList.length; i < len; i++) {
          // 计算早高峰终点
          if (!p7first0Index && oneDay.dataList[i].p7 === 0) {
            p7first0Index = i;
          } else if (
            !p7firstNot0Index &&
            p7first0Index &&
            oneDay.dataList[i].p7 > 0
          ) {
            p7firstNot0Index = i;
            // 到这里就可以结束了
            break;
          }

          // 计算早高峰起点（假设p7剩余车位300时是早高峰的开始）
          if (!rushTimeStartIndex && oneDay.dataList[i].p7 <= 300) {
            rushTimeStartIndex = i;
          }
        }

        // 记录index
        oneDay.rushTimeStartIndex = rushTimeStartIndex;
        oneDay.p7first0Index = p7first0Index;
        oneDay.p7firstNot0Index = p7firstNot0Index;

        // 时间转换成数值
        if (rushTimeStartIndex !== undefined) {
          oneDay.rushTimeStartTimestamp =
            oneDay.dataList[rushTimeStartIndex].timestamp;

          oneDay.rushTimeStartValue = util.normalizeDatetime(
            oneDay.rushTimeStartTimestamp
          );
        }
        if (p7first0Index !== undefined) {
          oneDay.p7first0Timestamp = oneDay.dataList[p7first0Index].timestamp;

          oneDay.p7first0Value = util.normalizeDatetime(
            oneDay.p7first0Timestamp
          );
        }
        if (p7firstNot0Index !== undefined) {
          oneDay.p7firstNot0Timestamp =
            oneDay.dataList[p7firstNot0Index].timestamp;

          oneDay.p7firstNot0Value = util.normalizeDatetime(
            oneDay.p7firstNot0Timestamp
          );
        }
        // 计算高峰期时间起止插值，用于图表stack
        if (oneDay.p7first0Value && oneDay.rushTimeStartValue) {
          let shift = 100; // 人为造一个偏移量，让柱子离折线之间产生一点距离，比较好看

          oneDay.diffInRushTimeValue =
            oneDay.p7first0Value - oneDay.rushTimeStartValue - shift;
        }
      });

      // console.log("dataListGroup: ", dataListGroup);

      return dataListGroup;
    },
    /**
     * 获取最近一个月（30天）的日期列表
     */
    // getFileNames() {
    //   let newDate = new Date(this.today);
    //   let year = newDate.getFullYear();
    //   let month = newDate.getMonth() + 1; // 月份从0开始
    //   let date = newDate.getDate();

    //   let fileNames = [];

    //   // 30天
    //   for (let i = 7; i > 0; i--) {
    //     fileNames.push(
    //       year +
    //         "-" +
    //         (month < 10 ? "0" + month : month) +
    //         "-" +
    //         (date < 10 ? "0" + date : date)
    //     );
    //     // 计算当前日期减一天的日期
    //     if (date === 1) {
    //       // date是1号
    //       if (
    //         month === 1 ||
    //         month === 3 ||
    //         month === 5 ||
    //         month === 7 ||
    //         month === 10 ||
    //         month === 12
    //       ) {
    //         date = 30;
    //       } else {
    //         date = 31;
    //       }

    //       if (month === 1) {
    //         month = 12;
    //         year--;
    //       } else {
    //         month--;
    //       }
    //     } else {
    //       // date不是1号
    //       date--;
    //     }
    //   }

    //   // 倒序处理，让时间正序排列
    //   _.reverse(fileNames);
    //   // console.log("fileNames: ", fileNames);

    //   return fileNames;
    // },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/config.scss";

.chart-2-comp {
  .loading-icon {
    @include loading-icon;
  }
}
</style>
