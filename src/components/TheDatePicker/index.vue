<template>
  <div class="the-date-picker">
    <el-date-picker
      v-model="value"
      align="center"
      type="date"
      placeholder="选择日期"
      value-format="timestamp"
      :picker-options="pickerOptions"
      @change="onChange"
    >
    </el-date-picker>
  </div>
</template>

<script>
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
            time.getTime() < new Date(disabledDateStart).getTime() ||
            // time.getTime() > Date.now() - 60 * 60 * 24 * 1000 // 禁止日期到昨天为止
            time.getTime() > Date.now() // 禁止日期到今天为止
          );
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
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
    onChange(timestamp) {
      if (timestamp) {
        this.$emit("change", timestamp);
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
  width: 150px;
  font-size: 16px;
  ::v-deep .el-date-editor {
    .el-input__inner {
      font-size: 16px;
    }
  }
}
</style>
