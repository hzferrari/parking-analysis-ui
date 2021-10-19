<template>
  <div class="chart-1-comp" v-if="!isFirstLoading">
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
      <the-date-picker
        style="position: absolute; left: 10px"
        ref="theDatePicker"
        :defaultDay="defaultDay"
        @change="onDatePickerChange"
      ></the-date-picker>

      <svg-icon
        style="left: 130px"
        v-show="isLoading"
        class="icon loading-icon"
        :class="{ '__is-loading': isLoading }"
        icon-class="loading"
      />

      <div>
        <p style="font-size: 20px">剩余车位数</p>
        <p style="font-size: 15px; margin-top: 10px">{{ subTitle }}</p>
      </div>
    </div>

    <line-chart
      ref="lineChart1"
      style="width: 100vw; height: 75vh; margin: 0 auto"
      chartWidth="7.5rem"
      chartHeight="4rem"
      chartIndex="1"
      :dataObj="dataObj"
      @restore="onChartRestore"
      @showSecondAccuracy="onAccuracyChange('second')"
      @showMinuteAccuracy="onAccuracyChange('minute')"
    ></line-chart>
  </div>
</template>

<script>
import _ from "lodash";
import util from "@/utils/util";
import LineChart from "@/components/Charts/lineChart";
import TheDatePicker from "@/components/TheDatePicker";

import { getDataByTimestamp, getOnedayDataByTimestamp } from "@/api/index";

export default {
  name: "chart-1-comp",
  components: {
    LineChart,
    TheDatePicker,
  },
  props: {},
  computed: {},
  watch: {
    isLoading: {
      handler(val, old) {
        // console.log("val: ", val);
        // 从true变false
        if (old && !val) {
          this.$emit("loaded");
        }
      },
    },
  },
  data() {
    return {
      dataObj: {
        dataList: [], // 这里必须初始化dataList，否则子组件watch不到
        markPoints: {},
      },
      originDataList: [],
      defaultDay: "",
      curTimestamp: "", // initData() 正在使用的时间戳
      subTitle: "",
      isAccuracyToSecond: false, // 是否精确到秒
      isFirstLoading: false, //只在第一个表格中有这个字段，用于控制显示效果。只会变化一次
      isLoading: false,
    };
  },
  created() {
    // 默认timestamp是一周前的今天
    // this.defaultDay = Date.now() - 60 * 60 * 24 * 7 * 1000;
    // 默认timestamp是今天
    this.defaultDay = Date.now();

    this.isFirstLoading = true;

    this.initData();
    // this.initLocalData();
  },
  mounted() {},
  methods: {
    /**
     * 从接口获取数据
     */
    async initData() {
      this.isLoading = true;

      let timestamp = this.curTimestamp ? this.curTimestamp : this.defaultDay; // 默认timestamp是defaultDay

      let dataList = [];

      let dayStr = util.formatDate(new Date(timestamp), "yyyy/MM/dd");

      ////////////////////
      // dayStr = "2021-07-08";
      let startTime;
      let endTime;

      // 如果日期不是今天，则先用getOnedayDataByTimestamp接口获取一天的数据，如果查到了就不用getDataByTimestamp接口查两次了
      let res0;
      if (dayStr !== util.formatDate(new Date(), "yyyy/MM/dd")) {
        startTime = new Date(dayStr + " 00:00:00").getTime();
        endTime = new Date(dayStr + " 23:59:59").getTime();

        res0 = await getOnedayDataByTimestamp(startTime, endTime, true);
      }

      // console.log("res0: ", res0);
      if (res0 && res0.data && res0.data.length > 0) {
        dataList = res0.data[0].dataList;
      } else {
        // 一天的数据要分成上下两半获取，因为腾讯云数据库一次最多获取1000条
        startTime = new Date(dayStr + " 00:00:00").getTime();
        endTime = new Date(dayStr + " 8:59:59").getTime();

        let res1 = await getDataByTimestamp(startTime, endTime);

        startTime = new Date(dayStr + " 9:00:00").getTime();
        endTime = new Date(dayStr + " 23:59:59").getTime();
        let res2 = await getDataByTimestamp(startTime, endTime);

        // 两次数据组合成一天的数据保存
        dataList = res1.data.concat(res2.data);
      }

      if (dataList.length === 0) {
        this.$toast("抱歉，没有这天的数据！");
        // return;
      }

      // 保存未经处理的原始接口数据，用于切换秒/分钟显示时计算
      this.originDataList = _.cloneDeep(dataList);

      // 保存到store
      this.$store.commit("app/setOriginDataList", this.originDataList);

      this.dataObj.dataList = this.handleData(dataList);
      this.dataObj.timestamp = timestamp;

      this.isFirstLoading = false;
      this.isLoading = false;

      this.subTitle =
        util.formatDate(new Date(timestamp), "yyyy年MM月dd日") +
        " " +
        util.getWeekByTimestamp(timestamp);
    },
    /**
     * 从本地json文件获取数据
     */
    initLocalData() {
      let timestamp = this.curTimestamp ? this.curTimestamp : this.defaultDay; // 默认timestamp是defaultDay
      let dataList = [];

      try {
        let dayStr = util.formatDate(new Date(timestamp), "yyyy/MM/dd");

        dataList =
          require(`/src/parkingData/parking_data_bytime_${dayStr}.json`).data;
      } catch (e) {
        this.$toast("抱歉，没有这天的数据！");

        return;
      }

      // 保存未经处理的原始接口数据，用于切换秒/分钟显示时计算
      this.originDataList = _.cloneDeep(dataList);

      this.dataObj.dataList = this.handleData(dataList);
      this.dataObj.timestamp = timestamp;

      this.isLoading = false;

      this.subTitle =
        util.formatDate(new Date(timestamp), "yyyy年MM月dd日") +
        " " +
        util.getWeekByTimestamp(timestamp);
    },
    handleData(dataList) {
      // 使时间连续
      // dataList = this._serialize(dataList);

      // 合并
      if (!this.isAccuracyToSecond) {
        dataList = this._combineToMinute(dataList);
      }

      // 设置MarkPoints
      // ！！在这之后不能改变dataList长度，否则算出的index会错乱
      dataList.forEach((v, index) => {
        v.day = util.formatDate(new Date(v.timestamp), "MM-dd"); // 几月几号

        if (v.time.substr(v.time.length - 2, v.time.length) !== "00") {
          v.timeStr = util.formatDate(new Date(v.timestamp), "h:mm:ss"); // 几点几分几秒
        } else {
          v.timeStr = util.formatDate(new Date(v.timestamp), "h:mm"); // 几点几分
        }

        // 设置MarkPoints
        if (v.timeStr === "8:00") {
          this.dataObj.markPoints["time0800"] = index;
        }

        if (!this.dataObj.markPoints["p7first0"] && v.p7 === 0) {
          this.dataObj.markPoints["p7first0"] = index;
        } else if (
          !this.dataObj.markPoints["p7firstNot0"] &&
          this.dataObj.markPoints["p7first0"] &&
          v.p7 > 0
        ) {
          this.dataObj.markPoints["p7firstNot0"] = index;
        }

        // 计算早高峰起止（假设p7剩余车位300时是早高峰的开始）
        if (!this.dataObj.markPoints["rushTimeStart"] && v.p7 <= 300) {
          this.dataObj.markPoints["rushTimeStart"] = index;
        }
      });

      return dataList;
    },
    /**
     * 使时间连续。
     * 如果两个时间不连续（以1分钟为基准），用lastItem的数据填补上
     */
    _serialize(dataList) {
      let resList = [];

      let lastItem = {}; // 上一项或上一个整点项

      for (let i = 0, len = dataList.length; i < len; i++) {
        let item = dataList[i];

        ///////////////////// 看看哪些是非整点数据
        // if (item.time.substr(item.time.length - 2, item.time.length) !== "00") {
        //   console.log("item.time: ", item.time);
        // }
        ////////////////////////

        if (i === 0) {
          // 第一项
          resList.push(item);
        } else {
          // 不是第一项

          let lastItemMinute = parseInt(
            util.formatDate(new Date(lastItem.timestamp), "mm")
          );
          let itemMinute = parseInt(
            util.formatDate(new Date(item.timestamp), "mm")
          );

          if (
            item.time.substr(item.time.length - 2, item.time.length) === "00"
          ) {
            // 当前项的数据是只记录到分钟的

            if (
              lastItemMinute === itemMinute - 1 ||
              (lastItemMinute == 59 && itemMinute == 0)
            ) {
              // 类似从 6:59-7:00的情况，也是连续的
              resList.push(item);
            } else {
              // 前后两项不连续
              if (lastItemMinute === itemMinute) {
                // 只留一个，这个item就不推入数组
              } else {
                // 时间不同项
                let diff = itemMinute - lastItemMinute - 1; // 计算两项中间差了几个
                diff = diff < 0 ? diff + 60 : diff;

                // 中间差了几个，就补几个。停车数据跟lastItem相同，时间要修改
                for (let k = 0; k < diff; k++) {
                  let tmp = { ...lastItem };
                  tmp.timestamp += 1000 * 60 * (k + 1); // 每次加1分钟

                  tmp.time = util.formatDate(
                    new Date(tmp.timestamp),
                    "yyyy/MM/dd hh:mm:ss"
                  );

                  // console.log("tmp: ", tmp);
                  resList.push(tmp);
                }
                // console.log("item: ", item);
                // 补完后记得把当前项也推入
                resList.push(item);
              }
            }
          } else {
            // 当前项的数据是记录到秒钟的

            if (
              lastItemMinute === itemMinute - 1 ||
              (lastItemMinute == 59 && itemMinute == 0)
            ) {
              resList.push(item);

              // 类似这种情况：6月24号，01:45:00  01:46:01
              // 这时 lastItemMinute === itemMinute -1，在这里处理：两项之间多添加一个01:46:00

              // let tmp = { ...lastItem };
              // tmp.timestamp += 1000 * 60; // 加1分钟

              // tmp.time = util.formatDate(
              //   new Date(tmp.timestamp),
              //   "yyyy/MM/dd hh:mm:ss"
              // );
              // console.log("tmp: ", tmp);
              // console.log("item: ", item);

              // resList.push(tmp);
              // resList.push(item);

              // // 01:45:00  01:46:01变为01:45:00 01:46:00 01:46:01后，要把01:46:00作为lastItem。并用continue;来跳过，避免下面又重复对lastItem赋值
              // lastItem = tmp;
              // continue;
            } else {
              // 前后两项不连续
              if (lastItemMinute === itemMinute) {
                // 记录到秒，两项时间在秒上是不同值（99%都是不同），推入数组
                resList.push(item);
              } else {
                // 时间不同项
                //当前item是记录到秒的，时间又不连续，因此相差分钟数量多1
                // 如 7:30 7:33:01，中间差了7:31 7:32 7:33 共3个
                let diff = itemMinute - lastItemMinute; // 计算两项中间差了几个
                diff = diff < 0 ? diff + 60 : diff;

                // console.log("lastItem.time: ", lastItem.time);
                // console.log("item.time: ", item.time);
                // console.log(": ", diff);

                // 中间差了几个，就补几个。停车数据跟lastItem相同，时间要修改
                let tmp = {};
                for (let k = 0; k < diff; k++) {
                  tmp = { ...lastItem };
                  tmp.timestamp += 1000 * 60 * (k + 1); // 每次加1分钟

                  tmp.time = util.formatDate(
                    new Date(tmp.timestamp),
                    "yyyy/MM/dd hh:mm:ss"
                  );

                  resList.push(tmp);
                }

                // 补完后记得把当前项也推入
                resList.push(item);

                // 01:45:00  01:46:01变为01:45:00 01:46:00 01:46:01后，要把01:46:00作为lastItem。并用continue;来跳过，避免下面又重复对lastItem赋值
                lastItem = tmp;
                continue;
              }
            }
          }
        }

        //
        lastItem = { ...item };
      }

      return resList;
    },
    /**
     * 将精确到秒的时间点数据合并到分钟
     */
    _combineToMinute(dataList) {
      let resList = [];

      let lastItem = {}; // 上一项或上一个整点项

      for (let i = 0, len = dataList.length; i < len; i++) {
        let item = dataList[i];
        let minute = item.time.split(":")[1];
        let second = item.time.split(":")[2];

        if (i === 0) {
          // 第一项
          lastItem = { ...item };
        } else if (i < len - 1) {
          // 不是最后一项

          let lastItemMinute = lastItem.time.split(":")[1];

          if (second !== "00") {
            // 当前项的数据是记录到秒的，当前分钟的每个停车场剩余车位的最大数量，记录到lastItem

            if (lastItemMinute === minute) {
              // 如上一项是 8:30:00，当前项是8:30:05。是同一分钟
              let time00 = item.time.substr(0, item.time.length - 2) + "00";

              let tmp = { ...item };
              if (item.p5 < lastItem.p5) {
                tmp.p5 = lastItem.p5;
              }
              if (item.p6 < lastItem.p6) {
                tmp.p6 = lastItem.p6;
              }
              if (item.p7 < lastItem.p7) {
                tmp.p7 = lastItem.p7;
              }
              lastItem = { ...tmp }; // 不能直接写 = ，否则对lastItem的修改也会影响到dataList
              lastItem.time = time00; // 时间只显示到分钟，因此时间最后两位（秒）改为00
            } else {
              // 如上一项是 8:30:00，当前项是8:31:01。不是同一分钟

              // 将8:31:01改为8:31:00
              let time00 = item.time.substr(0, item.time.length - 2) + "00";
              item.time = time00;

              // 推入上一项到数组
              resList.push(lastItem);
              // lastItem替换成当前循环项（然后就进入下一个循环了）
              lastItem = { ...item };
            }
          } else {
            // 当前项的数据是只记录到分钟的
            // 推入上一项到数组
            resList.push(lastItem);
            // lastItem替换成当前循环项（然后就进入下一个循环了）
            lastItem = { ...item };
          }
        } else {
          // 最后一项
          resList.push(lastItem);
          resList.push(item);
        }
      }

      return resList;
    },
    /**
     * 时间填空，比如有的数据中刚好缺少07:30或08:20这一分钟的数据，而在LineChart中dataZoom或markArea会用到
     */
    _gapMinuteFix(dataList, index, minuteStr) {
      if (!index) {
        return dataList;
      }

      let isFoundStart = false;
      for (let i = index, len = index + 5; i < len; i++) {
        if (dataList[i].timeStr === minuteStr) {
          isFoundStart = true;
        }
      }
      // 数据里没有找到
      if (!isFoundStart) {
        // 插入与后一项相同的停车信息数据，仅改变时间
        let tmp = util.deepClone(dataList.slice(index + 1, index + 2)[0]);

        tmp.time = tmp.time.split(" ")[0] + " " + minuteStr + ":00";
        tmp.timestamp = new Date(tmp.time).getTime();
        tmp.timeStr = minuteStr;

        dataList.splice(index + 1, 0, tmp);
      }

      return dataList;
    },
    /**
     * 日期选择时
     */
    onDatePickerChange(timestamp) {
      this.resetData();
      this.curTimestamp = timestamp;

      this.initData();
    },
    /**
     * 重置数据
     */
    resetData() {
      this.dataObj = {
        dataList: [],
        markPoints: {},
      };
    },
    /**
     * 图表点击了restore按钮
     */
    onChartRestore() {
      //
      this.$refs.theDatePicker.setDate(this.defaultDay);

      this.subTitle =
        util.formatDate(new Date(this.defaultDay), "yyyy年MM月dd日") +
        " " +
        util.getWeekByTimestamp(this.defaultDay);
    },
    /**
     * 时间精度变化
     */
    onAccuracyChange(type) {
      if (type === "second" && !this.isAccuracyToSecond) {
        this.isAccuracyToSecond = true;
      } else if (type === "minute" && this.isAccuracyToSecond) {
        this.isAccuracyToSecond = false;
      }

      this.resetData();
      // 利用保存的接口数据再次初始化dataList
      this.dataObj.dataList = this.handleData(this.originDataList);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/config.scss";

.chart-1-comp {
  .loading-icon {
    @include loading-icon;
  }
}
</style>
