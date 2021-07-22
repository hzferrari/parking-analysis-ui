import axios from "@/utils/ajax";

/**
 * 通过时时间戳获取数据
 */
export function getDataByTimestamp(startTime, endTime) {
  const data = {
    startTime,
    endTime,
  };
  return axios({
    url: "https://tcb-1i8zosz36f5964-6d80e6151b3c0.service.tcloudbase.com/pkapi/getDataByTimestamp",
    method: "POST",
    data,
  });
}

/**
 * 通过时时间戳获取以天为单位的数据
 * @param {Boolean} needDataList 是否需要返回那一天的详细数据dataList。默认是false，dataList字段数据太多，接口查询很多天数据时会很慢。建议请求的天数不多时才设为true
 */
export function getOnedayDataByTimestamp(startTime, endTime, needDataList = false) {
  const data = {
    startTime,
    endTime,
    needDataList,
  };
  return axios({
    url:
      "https://tcb-1i8zosz36f5964-6d80e6151b3c0.service.tcloudbase.com/pkapi/getOnedayDataByTimestamp",
    method: "POST",
    data,
  });
}
