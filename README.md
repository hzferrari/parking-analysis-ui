# 停车场车位数据分析

- 项目在线地址：[https://static-3173a062-eadb-478f-b52f-dcebddd1ee28.bspapp.com](https://static-3173a062-eadb-478f-b52f-dcebddd1ee28.bspapp.com)

- 数据来源： yesv 停车场数据

## 已实现的图表

- 单日停车场剩余车位数量折线图

  - 以分钟为单位，显示一天中停车场剩余车位数量变化趋势（部分数据可精确到秒）
  - 显示高峰期时间段
  - 显示特殊标记点（如满位时刻，再次出现空位时刻）
  - 可选择日期
  - 可切换显示数据时间精度，精确到分钟或精确到秒（仅限支持的时段）

* 上班早高峰时间段（二期天面）日更图

  - 以天为单位，显示一段日子中早高峰时间段
  - 以天为单位，显示一段日子中二期天面满位时刻变化趋势
  - 可选择日期范围
  - 可切换显示/隐藏标签

* 单日剩余车位数每分钟变化量图

  - 同一图表中分 3 个停车场显示
  - 同一时刻，在坐标轴上分别显示出/入停车场的车辆数量（即车位数变化量）
  - 以分钟为单位，显示停车场剩余车位每分钟增加或减少量（部分数据可精确到秒）
  - 可选择日期

### 图表通用能力

- 点击图例切换一项数据显示/隐藏
- 可通过鼠标操作或手势操作，选择显示的时间范围
- 可下载保存图表为图片

## 已实现的功能

- 两种主题切换
- 屏幕大小改变时，手机横屏时图表大小自适应
- 操作说明手册，手机访问温馨提示
- 数据定时抓取。其中早高峰时段 5 秒抓取一次，非早高峰时段 1 分钟抓取一次。
- 数据保存至云数据库
- 数据接口

## 规划中

- 以周为单位的平均值，以月为单位的平均值的图表
- 按周一、周二...单独统计的图表
- 引入天气
- 手机版
- 单个图表说明

## LICENSE

Apache
