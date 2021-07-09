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
