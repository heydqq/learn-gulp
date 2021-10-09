
<!--
 * @Description: 省市区选择组件
 * @Author: huoyuhuan
 * @Date: 2021-07-13 20:18:04
-->
# region-picker  省市区选择组件

## 介绍

从底部弹起的省市区选择器

<img src="https://j1.58cdn.com.cn/jinrong/images/ems16279811769719203c7a9cbad6.png" style="zoom:70%">


## 使用指南

### 引用

在 app.json 或 index.json 中引入组件

```json
"usingComponents": {
  "won-region-picker": "WonderUI/region-picker/region-picker"
}
```

### 代码示例
#### 基础用法

```html
<view>
    <button class="btn" bind:tap="showOverlay">选择地区</button>
    <view>已选择地区：{{cityName}}{{value}}</view>
    <won-region-picker
        options="{{options}}"
        value="{{value}}"
        show="{{ show }}"
        confirmBtnColor='red'
        bind:onConfirm="onConfirm"
    />
</view>
```

### API

#### won-region-picker props

| 属性 | 类型 | 默认值 | 说明 |是否必填 |
| ---- |:----:|:-------:| :----------:| :----------:|
| options | Array | 默认省市区数据 | 省市区数据源，数据格式如下 | 是
| value | Array | 无 | 默认选中数组在options中的下标值，例如[0,0,1] | 否
| show | boolean | false | 弹框是否显示 | 是
| confirmBtnColor | string | '#5146fe' | 确定按钮的颜色 | 否

* 注：options数据格式为：

```javascript
    options = [
        {
            "cityCode":"xxx",
            "cityName":"xxx",
            "childs": [
                {
                    "cityCode":"xxx",
                    "cityName":"xxx",
                    "childs": [
                        {
                            "cityCode":"xxx",
                            "cityName":"xxx",
                            "childs": []
                        }
                    ]
                }
            ]
        }
    ]
```

#### won-region-picker events
| 事件 | 类型 | 默认值 | 说明 |是否必填 |
| ---- |:----:|:-------:| :----------:| :----------:|
| bind:onConfirm | function | null | 点击确定按钮的回调函数,detail为{value, cityCode, cityName}，value（当前选中的数据的下标值组成的数组），cityCode（选中的数据对应的options中的cityCode组成的数组），cityName（选中的数据对应的options中的cityName组成的数组） | 否


## 修改记录
