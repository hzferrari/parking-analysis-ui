<template>
  <div class="chart-3-comp">
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

    <the-chart-3 :dataObj="dataObj"></the-chart-3>
  </div>
</template>

<script>
import _ from "lodash";
import util from "@/utils/util";
import theChart3 from "@/components/Charts/theChart3";

import { getOnedayDataByTimestamp } from "@/api/index";

export default {
  name: "chart-3-comp",
  components: {
    theChart3,
  },
  props: {},
  computed: {},
  watch: {},
  data() {
    return {
      dataObj: {
        dataList: [], // 这里必须初始化dataList，否则子组件watch不到
      },
      defaultDay: "",
      curTimestamp: "", // initData() 正在使用的时间戳
      titleText: "停车场满位时刻",
    };
  },
  created() {
    // 默认timestamp是今天
    this.defaultDay = new Date().getTime();

    // 上班早高峰时间段图表已经获取过getOnedayDataByTimestamp()数据
    if (this.$store.state.app.onedayDataList.length > 0) {
      let dataList = this.$store.state.app.onedayDataList;

      this.dataObj.dataList = this.handleData(dataList);
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
      let fileNames = util.getFileNames(this.defaultDay);

      let res = await getOnedayDataByTimestamp(
        new Date(fileNames[0] + " 00:00:00").getTime(),
        new Date(fileNames[fileNames.length - 1] + " 11:59:59").getTime()
      );

      this.dataObj.dataList = this.handleData(res.data);
    },
    handleData(dataList) {
      dataList.forEach((v) => {
        if (!v.diffInRushTimeValue) {
          v.p7firstNot0Value = undefined;
          v.p6first0Value = undefined;
          v.p5first0Value = undefined;
        }
      });

      return dataList;
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-3-comp {
}
</style>
