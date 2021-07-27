<template>
  <big-dialog
    class="manual-dialog"
    v-model="value"
    @maskClick="onMaskClick"
    @close="onCloseBtnClk"
  >
    <div slot="title">操作手册</div>
    <div slot="content">
      <p class="hint" v-if="isMobile">
        <strong>温馨提示：</strong>
        目前暂未针对手机适配，请使用电脑、iPad等大屏设备，或将手机横屏浏览，以获得更好的体验！
      </p>
      <p class="title-2">图表数据来源于yesv。由于服务器限制，目前的数据抓取策略为：</p>
      <p>
        <ul>
          <li>周一至周日全天：每1分钟抓取一次数据</li>
          <li>周一至周五早上的一段时间：每5秒钟抓取一次数据</li>
        </ul>
      </p>
      <p class="title-2 _margin-top">每个图表都可以通过鼠标/手势进行一些操作，如：</p>
      <p>
        <ul>
          <li>选择日期或日期范围</li>
          <li>缩放改变显示的时间范围</li>
          <li>改变时间分钟/秒钟显示精度（仅限支持数据）</li>
          <li>自由显示/隐藏图例</li>
          <li>显示/隐藏标签</li>
          <li>查看当前图表的说明</li>
          <li>……</li>
        </ul>
      </p>
      <p class="_margin-top">
        <img class="imgs" :class="{ __mobile: isMobile }" src="./imgs/1.png" />
      </p>

      
    </div>
  </big-dialog>
</template>

<script>
import BigDialog from "@/components/BigDialog";
import util from "@/utils/util";

export default {
  name: "manual-dialog",
  components: {
    BigDialog,
  },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: Boolean,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      isMobile: false,
    };
  },
  created() {
    if (util.isMobile()) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  },
  mounted() {},
  methods: {
    onMaskClick() {
      this.$emit("maskClick");
    },
    /**
     * 关闭按钮
     */
    onCloseBtnClk() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.manual-dialog {
  p {
    margin: 5px 0;
  }
  ul li {
    margin-left: 30px;
    margin-bottom: 5px;
    list-style: disc;
  }
  ._margin-top {
    margin-top: 20px;
  }

  .title-2 {
    margin-bottom: 10px;
    font-size: 18px;
  }
  .hint {
    color: #f05454;
  }
  .imgs {
    display: block;
    margin: 0 auto;
    width: 95%;
    &.__mobile {
      width: 100%;
    }
  }
}
</style>
