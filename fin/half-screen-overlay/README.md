# screen-overlay 半屏遮罩浮层

## 介绍

覆盖半屏的遮罩浮层，内容置底显示，带有标题、确定和取消按钮

<img src="https://j1.58cdn.com.cn/jinrong/images/ems16279589528895af590658e102.png" style="zoom:30%">

## 使用指南

### 引用

在 app.json 或 index.json 中引入组件

```json
"usingComponents": {
  "half-screen-overlay": "WonderUI/half-screen-overlay/half-screen-overlay"
}
```

### 代码示例

```html
<half-screen-overlay
  bind:confirmClick="_confirmClick"
  show="{{show}}"
  hideHeader="{{hideHeader}}"
  hideCancel="{{hideCancel}}"
  hideConfirm="{{hideConfirm}}"
  hideMask="{{hideMask}}"
  maskClosable="{{maskClosable}}"
>
  <view class="list">
    <block
      wx:for="{{list}}"
      wx:for-index="index"
      wx:for-item="item"
      wx:key="index"
    >
      <view class="item">
        <view class="content">{{item}}</view>
      </view>
    </block>
  </view>
</half-screen-overlay>
```

### API

#### Tag props

| 参数           | 说明                       | 类型    | 默认值 |
| :------------- | :------------------------- | :------ | :----- |
| show           | 是否显示                   | boolean | false  |
| hideHeader     | 是否隐藏头部               | boolean | false  |
| hideCancel     | 是否隐藏头部的取消按钮     | boolean | false  |
| cancelText     | 自定义取消按钮的文字       | string  | 取消   |
| cancelColor    | 自定义取消按钮的文字的颜色 | string  | 空     |
| cancelClosable | 是否需要取消按钮点击       | Boolean | true   |
| hideConfirm    | 是否隐藏确定按钮           | Boolean | false  |
| confirmText    | 自定义取消确定的文字       | string  | 确定   |
| confirmColor   | 自定义取消确定的文字颜色   | string  | 空     |
| title          | 头部的标题                 | string  | 标题   |
| hideMask       | 是否隐藏遮罩               | boolean | false  |
| maskClosable   | 点击遮罩是否隐藏           | boolean | true   |

#### Tag events

| 事件         | 说明                                                     | 参数 | 类型    |
| :----------- | :------------------------------------------------------- | :--- | :------ |
| showChange   | 显示改变监听                                             | show | boolean |
| confirmClick | 确定按钮点击监听                                         | 无   | 无      |
| cancelClick  | 取消按钮点击监听，只有在不需要取消按钮点击事件时才会透传 | 无   | 无      |
