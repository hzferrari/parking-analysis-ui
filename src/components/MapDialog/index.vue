<template>
  <big-dialog
    class="map-dialog"
    v-model="value"
    @maskClick="onMaskClick"
    @close="onCloseBtnClk"
  >
    <div slot="title">停车场地图</div>
    <div slot="content">
      <div
        style="display: flex; align-items: flex-start; justify-content: center"
      >
        <div>
          <p class="title-2">仲恺</p>
          <p class="_margin-top">
            <img
              class="imgs"
              :class="{ __mobile: isMobile }"
              src="./imgs/zhongkai.png"
            />
          </p>
        </div>
        <div>
          <p class="title-2">惠南</p>
          <p class="_margin-top">
            <img
              class="imgs"
              :class="{ __mobile: isMobile }"
              src="./imgs/huinan.png"
            />
          </p>
        </div>
      </div>
    </div>
  </big-dialog>
</template>

<script>
import BigDialog from "@/components/BigDialog";
import util from "@/utils/util";

export default {
  name: "map-dialog",
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
.map-dialog {
  p {
    margin: 10px 0;
  }

  ._margin-top {
    margin-top: 10px;
  }

  .title-2 {
    margin: 10px 0;
    font-size: 18px;
    text-align: center;
  }

  .imgs {
    display: block;
    margin: 0 auto;
    width: 88%;
    max-width: 800px;
    user-select: none;
    &.__mobile {
      width: 100%;
    }
  }
}
</style>
