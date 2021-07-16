<template>
  <div class="Big-dialog">
    <div class="dialog-wrapper">
      <div class="title"><slot name="title"> </slot></div>
      <div class="content">
        <slot name="content"> </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Big-dialog",
  components: {},
  props: {},
  computed: {},
  watch: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
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
    height: 80vh;
    margin: 0 auto;
    margin-top: 10vh;
    padding: 20px;
    background: #fff;
    border-radius: 10px;
    .title {
      font-size: 26px;
    }
    .content {
      font-size: 16px;
    }
  }
}
</style>
