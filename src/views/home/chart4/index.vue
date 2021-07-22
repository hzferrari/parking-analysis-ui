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

    <the-chart-4 :dataObj="dataObj"></the-chart-4>
  </div>
</template>

<script>
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
      defaultDay: "",
      curTimestamp: "", // initData() 正在使用的时间戳
      titleText: "车位变化量",
      subTitle: "",
    };
  },
  created() {
    // 默认timestamp是今天
    this.defaultDay = new Date().getTime();

    if (this.$store.state.app.originDataList.length > 0) {
      this.dataObj.dataList = this.handleData(
        this.$store.state.app.originDataList
      );
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
        return;
      }

      this.dataObj.dataList = this.handleData(dataList);
      this.dataObj.timestamp = timestamp;

      this.isLoading = false;

      this.setSubtitle(timestamp);
    },
    /**
     *
     */
    handleData(dataList) {
      // console.log("chart4 dataList: ", dataList);
      let newList = [];

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

        if (i === 0) {
          tmp.deltaP5 = 0;
          tmp.deltaP6 = 0;
          tmp.deltaP7 = 0;
        } else {
          tmp.deltaP5 = v.p5 - dataList[i - 1].p5;
          tmp.deltaP6 = v.p6 - dataList[i - 1].p6;
          tmp.deltaP7 = v.p7 - dataList[i - 1].p7;
        }
        newList.push(tmp);
      }

      console.log(
        "🚀 ~ file: chart4.vue ~ line 131 ~ handleData ~ newList",
        newList
      );

      return newList;
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
  },
};
</script>

<style lang="scss" scoped>
.chart-4-comp {
}
</style>
