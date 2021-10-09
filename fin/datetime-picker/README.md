
<!--
 * @Description: 日期时间选择组件
 * @Author: huoyuhuan
 * @Date: 2021-07-13 20:18:04
-->
# datetime-picker  日期时间选择组件

## 介绍

从底部弹起的日期时间选择器

<img src="https://j1.58cdn.com.cn/jinrong/images/ems1627981181631b1e5fa9e1726.png" style="zoom:70%">

## 使用指南

### 引用

在 app.json 或 index.json 中引入组件

```json
"usingComponents": {
  "won-datetime-picker": "WonderUI/datetime-picker/datetime-picker"
}
```

### 代码示例
#### 基础用法

```html
<view>
    <button class="btn" bind:tap="showOverlay">选择时间</button>
    <view>已选择时间：{{currentDate}}</view>

    <won-datetime-picker 
        mode="datetime"
        value="{{ currentDate }}"
        show="{{ show }}"
        confirmBtnColor='red'
        bind:onConfirm="onConfirm"
        minDate="2021-06-29 12:12:00"
        maxDate="2022-05-01 23:59:00"
    />
</view>
```

### API

#### won-datetime-picker props

| 属性 | 类型 | 默认值 | 说明 |是否必填 |
| ---- |:----:|:-------:| :----------:| :----------:|
| value | string | 当前时间(如："2021-7-6 16:42:00") | 默认选中值 | 否
| mode | string | datetime | 日期选择的类型，可选值为 datetime、date、year、month、time | 否
| minDate | string | '2000-01-01 00:00:00' | 最小可选日期, mode=time时不支持设置 | 否
| maxDate | string | '2030-12-31 23:59:59' | 最大可选日期, mode=time时不支持设置 | 否
| show | boolean | false | 弹框是否显示 | 是
| confirmBtnColor | string | '#5146fe' | 确定按钮的颜色 | 否

#### won-datetime-picker events
| 事件 | 类型 | 默认值 | 说明 |是否必填 |
| ---- |:----:|:-------:| :----------:| :----------:|
| bind:onConfirm | function | null | 点击确定按钮的回调函数,detail为{value}，value:当前选中的时间组成的数组，如["2021","7","9","12","23"] | 否


## 修改记录
