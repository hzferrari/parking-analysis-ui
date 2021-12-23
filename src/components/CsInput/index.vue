<template>
  <div
    class="cs-input wrapper"
    :class="{ __border: border, __disabled: disabled }"
    :style="`background-color:${backgroundColor}`"
  >
    <image v-if="leftIcon" class="left-icon-img" :src="leftIcon" @click="onLeftIconClk"/>

    <input
      class="input"
      :class="{
        __disabled: disabled,
        '__show-del-icon': clearable && showDelIcon,
      }"
      :style="`color:${color};background-color:${backgroundColor}`"
      ref="input"
      v-model="inputValue"
      :type="type"
      :password="password"
      :placeholder="placeholder"
      :placeholder-style="placeholderStyle"
      placeholder-class="input-placeholder-style"
      :maxlength="maxlength"
      :cursor-spacing="cursorSpacing"
      :focus="focus"
      :confirm-type="confirmType"
      :confirm-hold="confirmHold"
      :cursor="cursor"
      :selection-start="selectionStart"
      :selection-end="selectionEnd"
      :adjust-position="adjustPosition"
      :hold-keyboard="holdKeyboard"
      :disabled="disabled"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keyup="onKeyup"
      @confirm="onConfirm"
      @keyboardheightchange="keyboardHeightchange"
    />
    <div
      class="del-icon"
      :style="`background-color:${backgroundColor}`"
      v-show="clearable && showDelIcon"
    >
      <img
        class="img"
        src="https://prod-tsp-1255645766.cos.ap-guangzhou.myqcloud.com/go/img/img1616137612936"
        @click="onDelIconClk"
      />
    </div>
  </div>
</template>

<script>
/**
 *  * last ver  20210901 ：左icon点击事件。左icon由<img>改为<image>。
 *            20210827 ：confirm事件
 *            20210816 ：调整icon定位问题
 * 二次封装uni-app input组件，继承所有props和listeners
 */

export default {
  name: "cs-input",
  props: [
    "value",
    "clearable",
    "border",
    "type",
    "password",
    "placeholder",
    "placeholder-style",
    "placeholder-class",
    "disabled",
    "maxlength",
    "cursor-spacing",
    "focus",
    "confirm-type",
    "confirm-hold",
    "cursor",
    "selection-start",
    "selection-end",
    "adjust-position",
    "hold-keyboard",
    "leftIcon",
    "color",
    "backgroundColor",
  ],
  watch: {
    value() {
      this.inputValue = this.value;
    },
  },
  data() {
    return {
      inputValue: undefined,
      showDelIcon: false,
    };
  },
  created() {
    this.inputValue = this.value;
  },
  methods: {
    onInput(e) {
      this.$emit("input", this.inputValue);
      if (this.inputValue) {
        this.showDelIcon = true;
      } else {
        this.showDelIcon = false;
      }
    },
    onFocus(e) {
      // if (this.disabled) {
      //   uni.hideKeyboard();
      //   return;
      // }

      this.$emit("focus", e);
      if (this.inputValue) {
        this.showDelIcon = true;
      } else {
        this.showDelIcon = false;
      }
    },
    onBlur(e) {
      this.$emit("blur", e);
      let vm = this;
      setTimeout(function () {
        vm.showDelIcon = false;
      }, 0);
    },
    onKeyup(e){
      this.$emit("keyup", e);
    },
    onConfirm(e) {
      this.$emit("confirm", e);
    },
    keyboardHeightchange() {
      this.$emit("keyboardheightchange");
    },
    /**
     * 清除按钮click
     */
    onDelIconClk() {
      this.inputValue = "";
      this.$emit("input", this.inputValue);
      // 在H5中可自动focus
      // #ifdef H5
      this.$refs.input.focus();
      // #endif
    },
    /**
     * 左侧按钮click
     */
    onLeftIconClk(){
      this.$emit("left-icon-click")
    }
  },
};
</script>

<style lang="scss" scoped>
.cs-input {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  // background-color: #fff;
  /** 1px边框 */
  &.__border:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 200%;
    height: 200%;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
    box-sizing: border-box;
    padding: 1px;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    pointer-events: none;
    border: 0 solid rgba(255, 255, 255, 0.2);
    border-top-width: 1px;
    border-right-width: 1px;
    border-bottom-width: 1px;
    border-left-width: 1px;
    border-radius: 5px;
  }

  .input {
    flex-grow: 0;
    flex-shrink: 1;
    padding: 6rpx;
    border: none;
    outline: none;
    font-size: 28rpx;
    line-height: 28rpx;
    // #ifdef APP-PLUS
    line-height: 30rpx;
    // #endif
    background: transparent;
    width: 100%;
    &.__show-del-icon {
      width: calc(100% - 50rpx);
    }
  }

  .left-icon-img {
    flex-grow: 0;
    flex-shrink: 0;
    position: relative;
    margin-right: 10rpx;
    width: 50rpx;
    height: 50rpx;
  }

  .del-icon {
    flex-grow: 0;
    flex-shrink: 0;
    // position: absolute;
    // right: 0;
    // background-color: #fff;
    transition: all 0.5s;
    padding: 0;
    width: 40rpx;
    height: 40rpx;
    vertical-align: sub;
    text-align: center;

    .img {
      width: 100%;
      height: 100%;
      z-index: 2;
    }
  }
}
</style>
