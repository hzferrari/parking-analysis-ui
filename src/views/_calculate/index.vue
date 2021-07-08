<template>
  <div class="_cal"></div>
</template>

<script>
import util from "@/utils/util";

export default {
  name: "",
  components: {},
  props: {},
  computed: {},
  watch: {},
  data() {
    return {};
  },
  created() {
    // 默认timestamp是一周前的今天
    this.defaultDay = new Date().getTime() - 60 * 60 * 24 * 7 * 1000;

    this.initData();
  },
  mounted() {},
  methods: {
    initData() {
      // let timestamp = this.curTimestamp ? this.curTimestamp : this.defaultDay; // 默认timestamp是defaultDay
      let month = "2021-06";
      let dataListGroup = [];

      // 寻找即包含parking_data_bytime_2021-06，且以.json结尾的文件
      let allFiles = require
        .context(
          "/src/parkingData",
          false,
          /(?=parking_data_bytime_)(?=.*.json$)/
        )
        .keys();

      let files = [];

      allFiles.forEach((v) => {
        if (v.indexOf(month) > -1) {
          files.push(v.split("./parking_data_bytime_")[1].split(".json")[0]);
        }
      });

      files.forEach((date) => {
        try {
          dataListGroup.push({
            date: date,
            dataList:
              require(`/src/parkingData/parking_data_bytime_${date}.json`).data,
          });
        } catch (e) {
          console.log("读取数据失败: ", e);
        }
      });

      console.log("dataListGroup: ", dataListGroup);
    },
  },
};
</script>

<style lang="scss" scoped>
._cal {
}
</style>
