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
        @change="onDaterangePickerChange"
      ></the-daterange-picker>

      <div>
        <p style="font-size: 20px">{{ titleText }}</p>
        <p style="font-size: 15px; margin-top: 10px">{{ subTitle }}</p>
      </div>
    </div>

    <bar-chart chartIndex="1" :dataObj="dataObj"></bar-chart>
  </div>
</template>

<script>
import _ from "lodash";
import util from "@/utils/util";
import BarChart from "@/components/Charts/barChart";
import TheDaterangePicker from "@/components/TheDatePicker/daterange";

import { getOnedayDataByTimestamp } from "@/api/index";

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
     * 获取最近一个月（30天）的日期列表
     */
    getFileNames() {
      let newDate = new Date(this.today);
      let year = newDate.getFullYear();
      let month = newDate.getMonth() + 1; // 月份从0开始
      let date = newDate.getDate();

      let fileNames = [];

      // 30天
      for (let i = 30; i > 0; i--) {
        fileNames.push(
          year +
            "-" +
            (month < 10 ? "0" + month : month) +
            "-" +
            (date < 10 ? "0" + date : date)
        );
        // 计算当前日期减一天的日期
        if (date === 1) {
          // date是1号
          if (
            month === 1 ||
            month === 3 ||
            month === 5 ||
            month === 7 ||
            month === 10 ||
            month === 12
          ) {
            date = 30;
          } else {
            date = 31;
          }

          if (month === 1) {
            month = 12;
            year--;
          } else {
            month--;
          }
        } else {
          // date不是1号
          date--;
        }
      }

      // 倒序处理，让时间正序排列
      _.reverse(fileNames);
      // console.log("fileNames: ", fileNames);

      return fileNames;
    },
    /**
     * 从接口获取数据
     */
    async initData() {
      let res = await getOnedayDataByTimestamp(
        this.curDateRange[0],
        this.curDateRange[1]
      );

      this.dataObj.dataList = res.data;

      this.$store.commit("app/setOnedayDataList", res.data);

      // console.log(
      //   "chart2 initData this.dataObj.dataList: ",
      //   this.dataObj.dataList
      // );
    },
    /**
     * 从本地加载json数据
     */
    initLocalData() {
      let fileNames = this.getFileNames();
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
     * 处理
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
     * 日期选择
     */
    onDaterangePickerChange(timestampArr) {
      // console.log("timestampArr: ", timestampArr);
      this.curDateRange = timestampArr;

      this.initData();
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-2-comp {
}
</style>