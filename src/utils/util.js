/*
 * 工具类
 */

let util = {};

/*
* 日期格式化
  @param  date: Date()对象
          fmt: 'yyyy/MM/dd' ,'MM-dd'等格式
  @return
*/
util.formatDate = (date, fmt) => {
  fmt = fmt ? fmt : "yyyy/MM/dd hh:mm:ss";
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  let o = {
    "M+": date.getMonth() + 1, // 月份从0开始
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    // "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    // "S": this.getMilliseconds() //毫秒
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
    }
  }
  return fmt;
};
function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}

/**
 * 根据时间戳返回星期几
 * @param {timestamp} timestamp 时间戳
 * @return {string} 星期几
 */
util.getWeekByTimestamp = function(timestamp) {
  if (timestamp) {
    let week;
    switch (new Date(timestamp).getDay()) {
      case 0:
        week = "星期日";
        break;
      case 1:
        week = "星期一";
        break;
      case 2:
        week = "星期二";
        break;
      case 3:
        week = "星期三";
        break;
      case 4:
        week = "星期四";
        break;
      case 5:
        week = "星期五";
        break;
      case 6:
        week = "星期六";
        break;

      default:
        break;
    }

    return week;
  }
  return false;
};

/**
 * 获取最近一个月（30天）的日期列表
 */
util.getFileNames = function(defaultDay) {
  let newDate = new Date(defaultDay);
  let year = newDate.getFullYear();
  let month = newDate.getMonth() + 1; // 月份从0开始
  let date = newDate.getDate();

  let fileNames = [];

  // 30天
  for (let i = 30; i > 0; i--) {
    fileNames.push(
      year + "/" + (month < 10 ? "0" + month : month) + "/" + (date < 10 ? "0" + date : date)
    );
    // 计算当前日期减一天的日期
    if (date === 1) {
      // date是1号
      if (
        month === 1 ||
        month === 3 ||
        month === 5 ||
        month === 7 ||
        month === 10 ||
        month === 12
      ) {
        date = 30;
      } else {
        date = 31;
      }

      if (month === 1) {
        month = 12;
        year--;
      } else {
        month--;
      }
    } else {
      // date不是1号
      date--;
    }
  }

  // 倒序处理，让时间正序排列
  _.reverse(fileNames);
  // console.log("fileNames: ", fileNames);

  return fileNames;
};

/**
 * 将时间戳转换为归一化的值，即全部转换为秒（忽略年月日，只看小时分钟秒）
 */
util.normalizeDatetime = function(timestamp) {
  let newDate = new Date(timestamp);
  let hour = newDate.getHours();
  let minute = newDate.getMinutes();
  let second = newDate.getSeconds();

  let totalSecond = hour * 3600 + minute * 60 + second;

  return totalSecond;
};

/**
 *  判断传入参数的类型，以字符串的形式返回
 *  @obj：数据
 **/
util.dataType = function(obj) {
  if (obj === null) return "Null";
  if (obj === undefined) return "Undefined";
  return Object.prototype.toString.call(obj).slice(8, -1);
};

/**
 * 处理对象参数值，排除对象参数值为''、null、undefined，并返回一个新对象
 **/
util.dealObjectValue = function(obj) {
  let param = {};
  if (obj === null || obj === undefined || obj === "") return param;
  for (let key in obj) {
    if (util.dataType(obj[key]) === "Object") {
      param[key] = util.dealObjectValue(obj[key]);
    } else if (obj[key] !== null && obj[key] !== undefined && obj[key] !== "") {
      param[key] = obj[key];
    }
  }
  return param;
};

/*
 * 随机生成32位的UUID
 */
util.uuid = () => {
  //随机生成4位的16进制数
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
};

/**
 * 数组或对象的深拷贝
 * @param {*} data
 */
util.deepClone = (data) => {
  // 判断数据类型
  function getType(data) {
    if (Object.prototype.toString.call(data) === "[object Array]") {
      return "array";
    } else if (Object.prototype.toString.call(data) === "[object Object]") {
      return "object";
    } else {
      return "others";
    }
  }

  var type = getType(data);
  // console.log("type: ", type);

  var obj;
  if (type === "array") {
    obj = [];
  } else if (type === "object") {
    obj = {};
  } else {
    //不再具有下一层
    return data;
  }
  if (type === "array") {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(util.deepClone(data[i]));
    }
  } else if (type === "object") {
    for (var key in data) {
      obj[key] = util.deepClone(data[key]);
    }
  }

  return obj;
};

/**
 * 判断是否为手机访问
 */
util.isMobile = function() {
  let userAgentInfo = navigator.userAgent;

  let mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];

  let mobileFlag = false;

  //根据userAgent判断是否是手机
  for (let v = 0; v < mobileAgents.length; v++) {
    if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
      mobileFlag = true;
      break;
    }
  }
  let screenWidth = window.screen.width;
  let screenHeight = window.screen.height;

  //根据屏幕分辨率判断是否是手机
  if (screenWidth < 500 && screenHeight < 800) {
    mobileFlag = true;
  }

  return mobileFlag;
};

/**
 *
 * @param {String}} weatherName
 * @returns icon的base64编码
 */
util.getWeatherIcon = function(weatherName, colorType = "color1") {
  let WHEATHER_ICON = {};

  if (colorType === "color1") {
    WHEATHER_ICON = {
      晴: require("../assets/weather-icon/color1/100-晴.png"),
      多云: require("../assets/weather-icon/color1/101-多云.png"),
      阴: require("../assets/weather-icon/color1/104-阴.png"),
      阵雨: require("../assets/weather-icon/color1/300-阵雨.png"),
      雷阵雨: require("../assets/weather-icon/color1/302-雷阵雨.png"),
      雷阵雨有冰雹: "",
      雨夹雪: "",
      小雨: require("../assets/weather-icon/color1/305-小雨.png"),
      中雨: require("../assets/weather-icon/color1/306-中雨.png"),
      大雨: require("../assets/weather-icon/color1/307-大雨.png"),
      暴雨: require("../assets/weather-icon/color1/310-暴雨.png"),
      大暴雨: require("../assets/weather-icon/color1/311-大暴雨.png"),
      特大暴雨: "",
      阵雪: "",
      小雪: "",
      中雪: "",
      大雪: "",
      暴雪: "",
      雾: require("../assets/weather-icon/color1/501-雾.png"),
      冻雨: "",
      沙尘暴: "",
      小到中雨: "",
      中到大雨: "",
      大到暴雨: "",
      暴雨到大暴雨: "",
      大暴雨到特大暴雨: "",
      小雪到中雪: "",
      中雪到大雪: "",
      大雪到暴雪: "",
      浮尘: "",
      扬沙: "",
      强沙尘暴: "",
      霾: require("../assets/weather-icon/color1/502-霾.png"),
      浓雾: require("../assets/weather-icon/color1/509-浓雾.png"),
      强浓雾: "",
      中度霾: "",
      重度霾: "",
      严重霾: "",
      大雾: "",
      特强浓雾: "",
      雨: require("../assets/weather-icon/color1/399-雨.png"),
      雪: "",
      无: "",
    };
  } else if (colorType === "color2") {
    WHEATHER_ICON = {
      晴: require("../assets/weather-icon/color2/100-晴.png"),
      多云: require("../assets/weather-icon/color2/101-多云.png"),
      阴: require("../assets/weather-icon/color2/104-阴.png"),
      阵雨: require("../assets/weather-icon/color2/300-阵雨.png"),
      雷阵雨: require("../assets/weather-icon/color2/302-雷阵雨.png"),
      雷阵雨有冰雹: "",
      雨夹雪: "",
      小雨: require("../assets/weather-icon/color2/305-小雨.png"),
      中雨: require("../assets/weather-icon/color2/306-中雨.png"),
      大雨: require("../assets/weather-icon/color2/307-大雨.png"),
      暴雨: require("../assets/weather-icon/color2/310-暴雨.png"),
      大暴雨: require("../assets/weather-icon/color2/311-大暴雨.png"),
      特大暴雨: "",
      阵雪: "",
      小雪: "",
      中雪: "",
      大雪: "",
      暴雪: "",
      雾: require("../assets/weather-icon/color2/501-雾.png"),
      冻雨: "",
      沙尘暴: "",
      小到中雨: "",
      中到大雨: "",
      大到暴雨: "",
      暴雨到大暴雨: "",
      大暴雨到特大暴雨: "",
      小雪到中雪: "",
      中雪到大雪: "",
      大雪到暴雪: "",
      浮尘: "",
      扬沙: "",
      强沙尘暴: "",
      霾: require("../assets/weather-icon/color2/502-霾.png"),
      浓雾: require("../assets/weather-icon/color2/509-浓雾.png"),
      强浓雾: "",
      中度霾: "",
      重度霾: "",
      严重霾: "",
      大雾: "",
      特强浓雾: "",
      雨: require("../assets/weather-icon/color2/399-雨.png"),
      雪: "",
      无: "",
    };
  }

  return WHEATHER_ICON[weatherName];
};

export default util;
