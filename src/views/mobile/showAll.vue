<template>
  <div class="show-all-page">
    <div class="list-wrap">
      <div
        class="item"
        v-for="(item, index) in percentageData"
        :key="'key_' + index"
      >
        <span class="que">
          <span class="numerator">{{ item.que.numerator }}</span>
          <span class="division"></span>
          <span class="denominator">{{ item.que.denominator }}</span>
        </span>
        <span class="equal">=</span>
        <span class="ans">
          {{ (item.ans * 1000000) / 10000 }} <span class="unit">%</span>
        </span>
      </div>
    </div>

    <div class="to-btn long-btn" @click="$router.push('/mobile/practise')">
      去练习
    </div>
  </div>
</template>
<script>
import { percentageData, squareData } from "./kgData/index";

export default {
  name: "show-all-page",
  components: {},
  props: {},
  computed: {},
  watch: {},
  data() {
    return {
      percentageData: percentageData,
      squareData: squareData,
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
.long-btn {
  margin: 0 auto;
  width: 6.5rem;
  height: 1rem;
  line-height: 1rem;
  font-size: 0.4rem;
  letter-spacing: 2px;
  background: #4873f5;
  border-radius: 0.2rem;
  border: none;
  color: #fff;
  text-align: center;
  &:active {
    background: rgb(119, 152, 252);
  }
}

.to-btn {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
}

.show-all-page {
  height: 88vh !important;
  padding: 1.2rem 0.2rem 0.4rem;
  // background: #fff;
  .list-wrap {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 0.2rem 0.1rem;
    box-shadow: 0 0 4px #d0d0d0;
    border-radius: 0.1rem;
    .item {
      flex: 1 0 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 0.3rem;
      font-size: 0.3rem;
      .que {
        display: flex;
        flex-direction: column;
        align-items: center;
        .division {
          margin: 0.02rem auto 0.05rem;
          width: 0.4rem;
          border-top: 1px solid rgba(0, 0, 0, 0.4);
        }
      }
      .equal {
        margin: 0 0.1rem;
      }
      .ans {
        .unit {
          font-size: 0.24rem;
        }
      }
    }
  }
}
</style>
