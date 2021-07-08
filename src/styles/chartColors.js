/**
 * charts的各种颜色配置
 */

let chartColors = {
  // 渐变色集合
  grad: {},
};

// https://uigradients.com/#BurningOrange
chartColors.grad.burningOrange = {
  type: "linear",
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    {
      offset: 0,
      color: "#FF416C", // 0% 处的颜色
    },
    {
      offset: 1,
      color: "#FF4B2B", // 100% 处的颜色
    },
  ],
};

// https://uigradients.com/#Sunkist
chartColors.grad.sunkist = {
  type: "linear",
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    {
      offset: 0,
      color: "#F2994A", // 0% 处的颜色
    },
    {
      offset: 1,
      color: "#F2C94C", // 100% 处的颜色
    },
  ],
};

// https://uigradients.com/#Sulphur
chartColors.grad.sulphur = {
  type: "linear",
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    {
      offset: 0,
      color: "#CAC531", // 0% 处的颜色
    },
    {
      offset: 1,
      color: "#F3F9A7", // 100% 处的颜色
    },
  ],
};

//
chartColors.grad.yellow = {
  type: "linear",
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    {
      offset: 0,
      color: "#fddd60", // 0% 处的颜色
    },
    {
      offset: 1,
      color: "#fffd60", // 100% 处的颜色
    },
  ],
};

export default chartColors;
