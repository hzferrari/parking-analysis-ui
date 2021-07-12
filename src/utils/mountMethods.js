/**
 * Vue.prototype上挂载全局方法
 */
import { Message } from "element-ui";
import { Toast } from "vant";
import util from "@/utils/util";

export default {
  install: function(Vue) {
    /**
     * 获取字符串的“字符”长度
     * @param {String} str
     */
    Object.defineProperty(Vue.prototype, "charLength", {
      value: function(str) {
        if (!str) return 0;
        var charLength = 0;
        var charCode;
        for (var i = 0, len = str.length; i < len; i++) {
          charCode = str.charCodeAt(i);
          if (charCode >= 0 && charCode <= 128) {
            charLength += 1;
          } else {
            charLength += 2;
          }
        }
        return charLength;
      },
    });

    /**
     *  判断值是否为数字
     *  @param {any}
     *  @return {Boolean} true:是数字
     */
    Object.defineProperty(Vue.prototype, "isNumber", {
      value: function(val) {
        if (typeof val !== "number") {
          return false;
        }
        // isNaN()会把空字符串以及null按照0来处理，isNaN("1")也是false
        if (!isNaN(val)) {
          return true;
        } else {
          return false;
        }
      },
    });

    /**
     * $toast
     */
    Object.defineProperty(Vue.prototype, "$toast", {
      value: function(options) {
        if (typeof options === "object") {
        } else if (typeof options === "string") {
          options = { message: options };
        }

        if (util.isMobile()) {
          Toast(options.message);
        } else {
          Message({
            message: options.message,
            type: "warning",
          });
        }

        return;
      },
    });
  },
};
