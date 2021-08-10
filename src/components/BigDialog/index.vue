<template>
  <transition name="fade">
    <div class="Big-dialog" v-if="showDialog" @click.stop.prevent="onMaskClick">
      <div
        class="dialog-wrapper"
        style="position: relative"
        @click.stop.prevent
      >
        <svg-icon
          class="icon"
          icon-class="cross"
          style="
            position: absolute;
            right: 15px;
            top: 15px;
            width: 25px;
            height: 25px;
            cursor: pointer;
          "
          @click="onCloseBtnClk"
        />
        <div class="title">
          <slot name="title"></slot>
        </div>
        <div class="content">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Big-dialog",
  components: {},
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
  watch: {
    value(val) {
      this.showDialog = val;

      this.setOverflow(val);
    },
  },
  data() {
    return {
      showDialog: false,
      scrollTopCache: 0,
    };
  },
  created() {
    this.showDialog = this.value;
  },
  mounted() {},
  methods: {
    /**
     * 点击背景遮罩事件。
     * 在.dialog-wrapper里加上@click.stop.prevent，这样点击内容弹窗时就不会触发onBackgroundClk()
     */
    onMaskClick() {
      this.$emit("maskClick");
    },
    /**
     * 关闭按钮
     */
    onCloseBtnClk() {
      this.$emit("close");
    },
    /**
     * 开启弹窗时，body禁止滚动；关闭后恢复
     */
    setOverflow(dialogShow) {
      let dom = document.getElementById("app");

      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;

      if (dialogShow) {
        // dom.style.overflow = "hidden";
        // dom.style.height = "100vh";

        // 记录页面滚动位置
        this.scrollTopCache = scrollTop;
      } else {
        // dom.style.overflow = "auto";
        // dom.style.height = "100%";

        // 自动回滚之前的位置
        if (document.documentElement.scrollTop !== undefined) {
          document.documentElement.scrollTop = this.scrollTopCache;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.Big-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  text-align: center;

  .dialog-wrapper {
    width: 80%;
    margin: 0 auto;
    margin-top: 5vh;
    padding: 20px 0;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;

    .title {
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      margin-top: 20px;
      padding: 0 30px;
      height: 75vh;
      overflow-y: auto;
      font-size: 16px;
      line-height: 20px;
      text-align: initial;
    }
  }
}
</style>
