/**
 * axios全局配置
 */
import axios from "axios";
import Vue from "vue";

let vm = new Vue();

// create an axios instance
const service = axios.create({
  timeout: 30000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // console.log('config',config)

    return config;
  },
  (err) => {
    console.warn("==> request interceptor: ", err);
    return Promise.reject(err);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    // console.log("🚀 ~ file: ajax.js ~ line 27 ~ response", response);

    if (response.status === 200) {
      return response.data;
    } else {
      vm.$message({
        message: "服务器异常(" + response.status + ")",
        type: "warning",
      });

      vm.$toast("服务器异常(" + response.status + ")");
    }

    return response;
  },
  (error) => {
    // console.log("🚀 ~ file: ajax.js ~ line 32 ~ error", error);

    vm.$message({
      message: "服务器异常(" + error + ")",
      type: "warning",
    });

    vm.$toast("服务器异常(" + error + ")");

    return Promise.reject(error);
  }
);

export default service;
