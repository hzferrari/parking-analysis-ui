<template>
  <div class="practise-page">
    <div class="absolute-wrap">
      <div class="que-box">
        <div class="item __left" v-if="isLeft">
          <span class="que">
            <span class="numerator">{{ curQuestion.que.numerator }}</span>
            <span class="division"></span>
            <span class="denominator">{{ curQuestion.que.denominator }}</span>
          </span>
          <span class="equal">=</span>
          <span class="ans">
            <cs-input
              ref="inputAnsRef"
              class="input-ans"
              v-model="inputAns"
              type="number"
              @keyup.enter="onInputEnter"
            ></cs-input>
            <span class="unit">%</span>
          </span>
        </div>

        <div class="item __right" v-else>
          <span class="ans">
            {{ (curQuestion.ans * 1000000) / 10000 }}
            <span class="unit">%</span>
          </span>
          <span class="equal">=</span>
          <span class="que">
            <span class="numerator">{{ curQuestion.que.numerator }}</span>
            <span class="division"></span>
            <span class="denominator">
              (
              <cs-input
                ref="inputAnsRef"
                class="input-ans"
                v-model="inputAns"
                type="number"
                @keyup.enter="onInputEnter"
              ></cs-input>
              )
            </span>
          </span>
        </div>
      </div>

      <div class="result-wrap" v-show="showNextBtn">
        <span v-show="correct">正确！</span>
        <span v-show="!correct">错误！</span>
        <span v-show="!correct">
          答案：
          <span v-if="isLeft">{{ (curAnswer * 1000000) / 10000 }} %</span>
          <span v-else>{{ curAnswer }}</span>
        </span>
      </div>
      <div class="result-wrap-placeholder" v-show="!showNextBtn"></div>

      <div v-show="!showNextBtn" class="submit-btn long-btn" @click="submit">
        提交
      </div>

      <div v-show="showNextBtn" class="next-btn long-btn" @click="nextBtn">
        下一题
      </div>

      <div class="to-btn long-btn" @click="$router.push('/mobile/showAll')">
        去看全部
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import CsInput from "@/components/CsInput";
import { percentageData, squareData } from "./kgData/index";

export default {
  name: "practise-page",
  components: {
    CsInput,
  },
  props: {},
  computed: {},
  watch: {},
  data() {
    return {
      percentageData: percentageData,
      squareData: squareData,
      isLeft: true,
      curQuestion: {}, // 当前问题
      curAnswer: null, // 当前问题的答案
      inputAns: "",
      showNextBtn: false,
      correct: false,
    };
  },
  created() {
    this.getQuestionType1();
  },
  mounted() {},
  methods: {
    getQuestionType1() {
      let len = percentageData.length;
      let ranIndex = _.random(0, len - 1);

      let item = percentageData[ranIndex];
      this.curQuestion = item;

      this.isLeft = _.random(0, 1) > 0.5;
      if (this.isLeft) {
        this.curAnswer = item.ans;
      } else {
        this.curAnswer = item.que.denominator;
      }
    },
    submit() {
      this.showNextBtn = true;
      if (this.isLeft) {
        console.log("this.inputAns: ", this.inputAns);
        console.log(
          "this.curAnswer * 1000000) / 10000: ",
          (this.curAnswer * 1000000) / 10000
        );
        console.log(
          "差值：",
          Math.abs((this.curAnswer * 1000000) / 10000 - this.inputAns)
        );

        if (Math.abs((this.curAnswer * 1000000) / 10000 - this.inputAns) <= 0) {
          this.correct = true;
        } else {
          this.correct = false;
        }
      } else {
        if (this.curAnswer == this.inputAns) {
          this.correct = true;
        } else {
          this.correct = false;
        }
      }
    },
    nextBtn() {
      this.showNextBtn = false;
      this.inputAns = "";

      this.getQuestionType1();

      this.$nextTick(() => {
        let inputDom = document.querySelector(".input-ans input");

        inputDom.focus();
      });
    },
    /**
     * 按下回车键
     */
    onInputEnter() {
      if (this.showNextBtn) {
        this.nextBtn();
      } else {
        this.submit();
      }
    },
  },
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

.practise-page {
  position: relative;
  height: 100vh !important;
  .absolute-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow-y: hidden;
    padding: 0;
    .que-box {
      margin: 3.5rem 0.2rem 0;
      padding: 1rem 0.1rem;
      box-shadow: 0 0 4px #d0d0d0;
      border-radius: 0.1rem;
      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 0.3rem;
        font-size: 0.56rem;

        .que {
          display: flex;
          flex-direction: column;
          align-items: center;
          .division {
            margin: 0.02rem auto 0.05rem;
            width: 1rem;
            border-top: 1px solid rgba(0, 0, 0, 0.4);
            border-color: inherit;
          }
        }
        .equal {
          margin: 0 0.4rem;
        }
        .ans {
          .unit {
            font-size: 0.36rem;
          }
        }
      }

      // 答案输入框整体设置
      .input-ans {
        display: inline-block;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        border-color: inherit;
        ::v-deep input {
          text-align: center;
        }
      }

      .item.__left {
        .ans {
          .input-ans {
            width: 1.15rem;
          }
        }
      }
      .item.__right {
        .que {
          .denominator {
            .input-ans {
              width: 0.92rem;
            }
          }
        }
      }
    }

    .submit-btn {
      // margin-top: 0.5rem;
    }

    .result-wrap {
      text-align: center;
      font-size: 0.4rem;
    }
    .result-wrap,
    .result-wrap-placeholder {
      margin: 0.3rem auto;
      height: 0.5rem;
      line-height: 0.5rem;
    }
  }
}
</style>
