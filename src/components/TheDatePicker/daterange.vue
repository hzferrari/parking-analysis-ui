<template>
  <div class="the-date-picker">
    <el-date-picker
      v-model="value"
      align="right"
      type="daterange"
      range-separator="~"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="timestamp"
      :default-time="['00:00:00', '23:59:59']"
      :picker-options="pickerOptions"
      :disabled="disabled"
      @change="onChange"
    >
    </el-date-picker>
  </div>
</template>

<script>
import util from "@/utils/util";

export default {
  name: "the-date-picker",
  components: {},
  props: {
    /**
     * 默认显示日期
     */
    defaultDay: {
      default: "",
    },
    disabled: {
      type: Boolean,
    },
  },
  computed: {},
  watch: {},
  data() {
    // 设置可选的开始日期（实际可选日期会加一天，设置18号实际是19号）
    const disabledDateStart = "2021-06-18";

    return {
      pickerOptions: {
        // 禁止选择的时间段
        disabledDate(time) {
          return (
            time.getTime() < new Date(disabledDateStart).getTime()
            // ||  time.getTime() > Date.now() + 3600 * 1000 * 24 * 1 // 禁止日期到今天为止
          );
        },
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              let todayStr = util.formatDate(new Date(), "yyyy/MM/dd");

              let startDayStr = util.formatDate(
                new Date(Date.now() - 3600 * 1000 * 24 * 7),
                "yyyy/MM/dd"
              );

              const start = new Date(startDayStr + " 00:00:00");
              const end = new Date(todayStr + " 23:59:59");
              console.log(
                "🚀 ~ file: daterange.vue ~ line 60 ~ onClick ~ end",
                end
              );

              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              let todayStr = util.formatDate(new Date(), "yyyy/MM/dd");
              let startDayStr = util.formatDate(
                new Date(Date.now() - 3600 * 1000 * 24 * 29),
                "yyyy/MM/dd"
              ); // *29就刚好是显示30天

              const start = new Date(startDayStr + " 00:00:00");
              const end = new Date(todayStr + " 23:59:59");

              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              let todayStr = util.formatDate(new Date(), "yyyy/MM/dd");
              let startDayStr = util.formatDate(
                new Date(Date.now() - 3600 * 1000 * 24 * 89),
                "yyyy/MM/dd"
              );

              const start = new Date(startDayStr + " 00:00:00");
              const end = new Date(todayStr + " 23:59:59");

              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value: "",
    };
  },
  created() {
    // 设置默认显示日期
    // this.value = this.defaultDay;
  },
  mounted() {},
  methods: {
    /**
     * 选中日期时
     */
    onChange(timestampArr) {
      console.log("timestampArr: ", timestampArr);
      if (timestampArr) {
        // 注意要设置 :default-time="['00:00:00', '23:59:59']"
        this.$emit("change", timestampArr);
      }
    },
    /**
     * 主动设置时间
     */
    setDate(timestamp) {
      this.value = timestamp;
    },
  },
};
</script>

<style lang="scss" scoped>
.the-date-picker {
  display: inline-flex; // 设置成inline-block上面会出现间隔
  line-height: 40px;
  width: 230px;
  font-size: 16px;
  ::v-deep .el-date-editor {
    .el-input__inner {
      font-size: 16px;
    }
  }
}
</style>
