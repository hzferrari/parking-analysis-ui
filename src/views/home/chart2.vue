<template>
  <div class="chart-2">
    <div
      class="title"
      style="
        position: relative;
        margin-bottom: 20px;
        font-size: 20px;
        text-align: center;
      "
    >
      <span>{{ titleText }}</span>
    </div>

    <bar-chart chartIndex="1" :dataObj="dataObj"></bar-chart>
  </div>
</template>

<script>
import _ from "lodash";
import util from "@/utils/util";
import BarChart from "@/components/Charts/barChart";
import TheDatePicker from "@/components/TheDatePicker";

export default {
  name: "chart-2",
  components: {
    BarChart,
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
      defaultDay: "",
      curTimestamp: "", // initData() 正在使用的时间戳
      titleText: "上班早峰期时间段示意",
    };
  },
  created() {
    // 默认timestamp是今天
    this.defaultDay = new Date().getTime();

    this.initData();
  },
  mounted() {},
  methods: {
    initData() {
      let fileNames = this.getFileNames();
      let dataListGroup = [];

      fileNames.forEach((dateTime) => {
        try {
          dataListGroup.push({
            dateTime: dateTime,
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
     * 获取最近一个月（30天）的日期列表
     */
    getFileNames() {
      let newDate = new Date(this.defaultDay);
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

          oneDay.rushTimeStartValue = this._normalizeDatetime(
            oneDay.rushTimeStartTimestamp
          );
        }
        if (p7first0Index !== undefined) {
          oneDay.p7first0Timestamp = oneDay.dataList[p7first0Index].timestamp;

          oneDay.p7first0Value = this._normalizeDatetime(
            oneDay.p7first0Timestamp
          );
        }
        if (p7firstNot0Index !== undefined) {
          oneDay.p7firstNot0Timestamp =
            oneDay.dataList[p7firstNot0Index].timestamp;

          oneDay.p7firstNot0Value = this._normalizeDatetime(
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
     * 将时间戳转换为归一化的值，即全部转换为秒（忽略年月日，只看小时分钟秒）
     */
    _normalizeDatetime(timestamp) {
      let newDate = new Date(timestamp);
      let hour = newDate.getHours();
      let minute = newDate.getMinutes();
      let second = newDate.getSeconds();

      let totalSecond = hour * 3600 + minute * 60 + second;

      return totalSecond;
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-2 {
}
</style>
