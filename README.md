# 停车场车位数据分析

### 已实现的图表

- 单日停车场剩余车位数量折线图

  - 以分钟/秒钟为单位，显示一天中停车场剩余车位数量变化趋势
  - 点击图例切换一条折线显示/隐藏
  - 显示高峰期时间段
  - 显示特殊标记点（如满位时刻，再次出现空位时刻）
  - 点击图例切换一项数据显示/隐藏
  - 可选择日期
  - 可选择一天内的显示时间范围（鼠标操作或手势操作）
  - 可切换显示数据时间精度，精确到分钟或精确到秒（仅限支持的时段）
  - 可下载保存图表为图片

- 上班早峰期时间段（天台停车场）日更图
  - 以天为单位，显示一段日子中早高峰时间段
  - 以天为单位，显示一段日子中天台停车场满位时刻变化趋势
  - 点击图例切换一项数据显示/隐藏
  - 可选择一天内的显示时间范围（鼠标操作或手势操作）
  - 可切换显示/隐藏标签
  - 可下载保存图表为图片

### 已实现的功能

- 主题切换
- 图表大小自适应
- 日期选择
- 数据定时抓取。其中早高峰时段 5 秒抓取一次，非早高峰时段 1 分钟抓取一次。
- 数据保存至云数据库
- 数据接口

### 规划中的表格和功能

- 图表说明功能
- 以周为单位的平均值，以月为单位的平均值的图表
- 按周一、周二...单独统计的图表
- 每分钟车位增减数量图表（分 3 个停车场，3 个图表）
- 引入天气
- 手机版（旋转时的样式，以及自动重新加载图表）
- 开屏 loading 提示
