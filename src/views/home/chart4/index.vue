<template>
  <div class="chart-4-comp">
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

      <div>
        <p style="font-size: 20px">单日剩余车位数变化量</p>
        <p style="font-size: 15px; margin-top: 10px">{{ subTitle }}</p>
      </div>
    </div>

    <the-chart-4
      :dataObj="dataObj"
      @showSecondAccuracy="onAccuracyChange('second')"
      @showMinuteAccuracy="onAccuracyChange('minute')"
    ></the-chart-4>
  </div>
</template>

<script>
import _ from "lodash";
import util from "@/utils/util";
import theChart4 from "@/components/Charts/theChart4";
import TheDatePicker from "@/components/TheDatePicker";

import { getDataByTimestamp, getOnedayDataByTimestamp } from "@/api/index";

export default {
  name: "chart-4-comp",
  components: {
    theChart4,
    TheDatePicker,
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
      originDataList: [],
      defaultDay: "",
      curTimestamp: "", // initData() 正在使用的时间戳
      titleText: "车位变化量",
      subTitle: "",
      isAccuracyToSecond: false, // 是否精确到秒
    };
  },
  created() {
    // 默认timestamp是今天
    this.defaultDay = new Date().getTime();

    if (this.$store.state.app.originDataList.length > 0) {
      let dataList = this.$store.state.app.originDataList;
      // 保存未经处理的原始接口数据，用于切换秒/分钟显示时计算
      this.originDataList = _.cloneDeep(dataList);

      this.dataObj.dataList = this.handleData(dataList);
      this.dataObj.timestamp = this.defaultDay;

      this.setSubtitle(this.defaultDay);
    } else {
      this.initData();
    }
  },
  mounted() {},
  methods: {
    /**
     * 从接口获取数据
     */
    async initData() {
      let timestamp = this.curTimestamp ? this.curTimestamp : this.defaultDay; // 默认timestamp是defaultDay
      let dataList = [];

      let dayStr = util.formatDate(new Date(timestamp), "yyyy/MM/dd");

      // 如果日期不是今天，则先用getOnedayDataByTimestamp接口获取一天的数据，如果查到了就不用getDataByTimestamp接口查两次了
      let res0;
      if (dayStr !== util.formatDate(new Date(), "yyyy/MM/dd")) {
        res0 = await getOnedayDataByTimestamp(
          new Date(dayStr + " 00:00:00").getTime(),
          new Date(dayStr + " 23:59:59").getTime(),
          true
        );
      }

      // console.log("res0: ", res0);
      if (res0 && res0.data && res0.data.length > 0) {
        dataList = res0.data[0].dataList;
      } else {
        // 一天的数据要分成上下两半获取，因为腾讯云数据库一次最多获取1000条
        let res1 = await getDataByTimestamp(
          new Date(dayStr + " 00:00:00").getTime(),
          new Date(dayStr + " 8:59:59").getTime()
        );
        let res2 = await getDataByTimestamp(
          new Date(dayStr + " 9:00:00").getTime(),
          new Date(dayStr + " 23:59:59").getTime()
        );

        // 两次数据组合成一天的数据保存
        dataList = res1.data.concat(res2.data);
      }

      if (dataList.length === 0) {
        this.$toast("抱歉，没有这天的数据！");
        return;
      }

      // 保存未经处理的原始接口数据，用于切换秒/分钟显示时计算
      this.originDataList = _.cloneDeep(dataList);

      this.dataObj.dataList = this.handleData(dataList);

      this.dataObj.timestamp = timestamp;

      this.isLoading = false;

      this.setSubtitle(timestamp);
    },
    /**
     * 处理数据
     */
    handleData(dataList) {
      // dataList.splice(0, 485);

      let newList = [];

      if (!this.isAccuracyToSecond) {
        // 合并到分钟
        newList = this._combineToMinute(dataList);
      } else {
        // 精确到秒（原始数据）

        for (let i = 0, len = dataList.length; i < len; i++) {
          let tmp = {};
          let v = dataList[i];

          tmp.time = v.time;
          tmp.timestamp = v.timestamp;

          if (v.time.substr(v.time.length - 2, v.time.length) !== "00") {
            tmp.timeStr = util.formatDate(new Date(v.timestamp), "h:mm:ss"); // 几点几分几秒
          } else {
            tmp.timeStr = util.formatDate(new Date(v.timestamp), "h:mm"); // 几点几分
          }

          // 初始化
          tmp.p5Up = 0;
          tmp.p5Down = 0;
          tmp.p6Up = 0;
          tmp.p6Down = 0;
          tmp.p7Up = 0;
          tmp.p7Down = 0;

          if (i !== 0) {
            if (v.p5 - dataList[i - 1].p5 >= 0) {
              tmp.p5Up = v.p5 - dataList[i - 1].p5;
            } else {
              tmp.p5Down = v.p5 - dataList[i - 1].p5;
            }

            if (v.p6 - dataList[i - 1].p6 >= 0) {
              tmp.p6Up = v.p6 - dataList[i - 1].p6;
            } else {
              tmp.p6Down = v.p6 - dataList[i - 1].p6;
            }

            if (v.p7 - dataList[i - 1].p7 >= 0) {
              tmp.p7Up = v.p7 - dataList[i - 1].p7;
            } else {
              tmp.p7Down = v.p7 - dataList[i - 1].p7;
            }
          }
          newList.push(tmp);
        }
      }

      // console.log(
      //   "🚀 ~ file: chart4.vue ~ line 131 ~ handleData ~ newList",
      //   newList
      // );

      return newList;
    },
    /**
     * 将精确到秒的时间点数据合并到分钟
     */
    _combineToMinute(dataList) {
      let resList = [];

      let lastItem = {}; // 上一项或上一个整分钟点项

      for (let i = 0, len = dataList.length; i < len; i++) {
        let item = dataList[i];
        // debugger;
        if (i === 0) {
          // 第一项

          item = _cal(item);
          item.timeStr = util.formatDate(new Date(item.timestamp), "h:mm"); // 几点几分

          lastItem = { ...item };
        } else if (i < len - 1) {
          // 不是最后一项
          if (
            item.time.substr(item.time.length - 2, item.time.length) !== "00"
          ) {
            // 当前项的数据是记录到秒的（非整分钟点项）
            let time00 = item.time.substr(0, item.time.length - 2) + "00";

            let tmp = { ...item };

            tmp = _cal(tmp, lastItem, true);

            lastItem = { ...tmp }; // 不能直接写 = ，否则对lastItem的修改也会影响到dataList
            lastItem.time = time00; // 时间只显示到分钟，因此时间最后两位（秒）改为00
          } else {
            // 当前项的数据是只记录到分钟的（整分钟点项）

            // 先记录timeStr，然后推入上一项到数组
            lastItem.timeStr = util.formatDate(
              new Date(lastItem.timestamp),
              "h:mm"
            ); // 几点几分

            resList.push(lastItem);

            item = _cal(item, lastItem);

            // lastItem替换成当前循环项（然后就进入下一个循环了）
            lastItem = { ...item };
          }
        } else {
          // 最后一项

          item = _cal(item, lastItem);

          item.timeStr = util.formatDate(new Date(item.timestamp), "h:mm"); // 几点几分

          resList.push(lastItem);
          resList.push(item);
        }
      }

      function _cal(item, lastItem, accumulation) {
        // 没有这些字段就初始化
        item.p5Up = item.p5Up ? item.p5Up : 0;
        item.p5Down = item.p5Down ? item.p5Down : 0;
        item.p6Up = item.p6Up ? item.p6Up : 0;
        item.p6Down = item.p6Down ? item.p6Down : 0;
        item.p7Up = item.p7Up ? item.p7Up : 0;
        item.p7Down = item.p7Down ? item.p7Down : 0;

        if (lastItem) {
          // 如果需要累加上次的数据
          if (accumulation) {
            item.p5Up += lastItem.p5Up;
            item.p5Down += lastItem.p5Down;
            item.p6Up += lastItem.p6Up;
            item.p6Down += lastItem.p6Down;
            item.p7Up += lastItem.p7Up;
            item.p7Down += lastItem.p7Down;
          }

          if (item.p5 - lastItem.p5 >= 0) {
            item.p5Up += item.p5 - lastItem.p5;
          } else {
            item.p5Down += item.p5 - lastItem.p5;
          }
          if (item.p6 - lastItem.p6 >= 0) {
            item.p6Up += item.p6 - lastItem.p6;
          } else {
            item.p6Down += item.p6 - lastItem.p6;
          }
          if (item.p7 - lastItem.p7 >= 0) {
            item.p7Up += item.p7 - lastItem.p7;
          } else {
            item.p7Down += item.p7 - lastItem.p7;
          }
        }

        return item;
      }

      // console.log("combine: ", resList);
      return resList;
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
     * 副标题
     */
    setSubtitle(timestamp) {
      this.subTitle =
        util.formatDate(new Date(timestamp), "yyyy年MM月dd日") +
        " " +
        util.getWeekByTimestamp(timestamp);
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
.chart-4-comp {
}
</style>
