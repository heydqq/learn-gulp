
<!--
 * @Description: 单选组件
 * @Author: huoyuhuan
 * @Date: 2021-07-13 20:18:04
-->
# picker  单选组件

## 介绍

从底部弹起的滚动选择器

<img src="https://j1.58cdn.com.cn/jinrong/images/ems1627981174584818268a4f549e.png" style="zoom:70%">


## 使用指南

### 引用

在 app.json 或 index.json 中引入组件

```json
"usingComponents": {
  "won-picker": "WonderUI/picker/picker"
}
```

### 代码示例
#### 基础用法

```html
<view>
    <button class="btn" bind:tap="showOverlay">请选择</button>
    <view>已选择：{{value}}</view>

    <won-picker 
        options="{{options}}" 
        value="{{value}}" 
        show="{{ show }}"
        confirmBtnColor='red'
        bind:onConfirm="valueChange"
    />
</view>
```

### API

#### won-picker props


| 属性 | 类型 | 默认值 | 说明 |是否必填 |
| ---- |:----:|:-------:| :----------:| :----------:|
| value | Array | 无 | 默认选中options中的value值，例如["2021", "7"] | 否
| options | Array | 无 | 数据源，格式为二维数组 | 是
| show | boolean | false | 弹框是否显示 | 是
| confirmBtnColor | string | '#5146fe' | 确定按钮的颜色 | 否

* 注：options格式为二维数组：

```javascript
// 一列数据
options = [
    [
        {value: "2020", label: "2020label"},
        {value: "2021", label: "2021label"}
    ]
]
 
// 两列数据
options = [
    [
        {value: "2020", label: "2020label"},
        {value: "2021", label: "2021label"}
    ],
    [
        {value: "6", label: "6label"},
        {value: "7", label: "7label"}
    ],
]
```

#### won-picker events
| 事件 | 类型 | 默认值 | 说明 |是否必填 |
| ---- |:----:|:-------:| :----------:| :----------:|
| bind:valueChange | function | null | 数据选择变化后的回调函数，detail为{selectValue，index}，selectValue（当前选中的数据的value值组成的数组），index（最后一次值变化的列数） | 否
| bind:onConfirm | function | null | 点击确定按钮的回调函数,detail为{value}，value（当前选中的数据的value值组成的数组） | 否


## 修改记录
