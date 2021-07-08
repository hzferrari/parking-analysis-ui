<template>
  <div class="Icons">
    <div></div>
    <div class="icon-item" v-for="item in svgIconList" :key="item">
      <el-tooltip placement="top" :open-delay="500">
        <div slot="content">{{ generateIconCode(item) }}</div>
        <div>
          <svg-icon
            class-name="svg-icon"
            :icon-class="item"
          ></svg-icon>
          <p>{{item}}</p>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import svgIconList from "./svg-icons";

export default {
  name: "id_icon",
  data() {
    return {
      svgIconList
    };
  },
  created() {},
  mounted() {},
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`;
    },

  }
};
</script>

<style scoped lang='stylus'>

.icon-item {
  width: 100px;
  display: inline-block;
  margin: 20px 20px;
  color: #606266;
  text-align: center;
  .svg-icon {
    font-size: 40px;
    cursor: pointer;
  }
  p {
    white-space: nowrap;
  }
}
</style>


