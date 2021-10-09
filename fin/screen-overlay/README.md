# screen-overlay 全屏遮罩浮层

## 介绍

覆盖全屏的遮罩浮层，内容居中显示，带有标题和取消按钮

<img src="https://j1.58cdn.com.cn/jinrong/images/ems1627959325658247e7ab08aab9.png" style="zoom:30%">

## 使用指南

### 引用

在 app.json 或 index.json 中引入组件

```json
"usingComponents": {
  "screen-overlay": "WonderUI/screen-overlay/screen-overlay"
}
```

### 代码示例

```html
<screen-overlay show="{{show}}" hideHeader="{{hideHeader}}" hideCancel="{hideCancel}}" hideMask="{{hideMask}}" maskClosable="{{maskClosable}}">
    <view class="dcontent">
        <view class="con">
            弹框弹框弹框弹框弹框弹框弹框弹框弹框弹框弹框弹框弹框弹框
        </view>
        <view class="btns">
            <view class="btn">确定</view>
        </view>
    </view>
</screen-overlay>
```

### API

#### Tag props

| 参数  | 说明       | 类型   | 默认值  |
| :---- | :--------- | :----- | :------ |
| show  | 是否显示   | boolean | false    |
| hideHeader | 是否隐藏头部 | boolean | false |
| hideCancel | 是否隐藏头部的取消按钮 | boolean | false |
| title | 头部的标题 | string | 标题 |
| hideMask | 是否隐藏遮罩 | boolean | false |
| maskClosable | 点击遮罩是否隐藏 | boolean | true |

#### Tag events

| 事件  | 说明       | 参数   | 类型  |
| :---- | :--------- | :----- | :------ |
| showChange | 显示改变监听 | show | boolean |