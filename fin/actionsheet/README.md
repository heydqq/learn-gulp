<!--
 * @Description: 动作面板
 * @Author: huoyuhuan
 * @Date: 2021-07-13 20:18:04
-->
# actionsheet  动作面板组件

## 介绍

底部弹起的操作按钮组件

<img src="https://j1.58cdn.com.cn/jinrong/images/ems16279812623165543208f085ee.png" style="zoom:70%">

## 使用指南

### 引用

在 app.json 或 index.json 中引入组件

```json
"usingComponents": {
  "won-actionsheet": "WonderUI/actionsheet/actionsheet"
}
```

### 代码示例
#### 基础用法


##### 操作按钮通过slot插入
```html
<view>
    <button class="btn" bind:tap="showOverlay">请选择</button>
    <won-actionsheet show="{{ show }}">
        <view style="margin-bottom: 60px;">
            <view class="actionsheetitem" bindtap="onclick">1</view>
            <view class="actionsheetitem" bindtap="onclick">2</view>
            <view class="actionsheetitem" bindtap="onclick">3</view>
        </view>
    </won-actionsheet>
</view>
```

### API

#### won-actionsheet props

| 属性 | 类型 | 默认值 | 说明 |是否必填 |
| ---- |:----:|:-------:| :----------:| :----------:|
| show | boolean | false | 弹框是否显示 | 是


## 修改记录
