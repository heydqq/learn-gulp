# card 卡片

## 介绍

卡片，提供大小圆角、阴影、边框、描边类型的卡片，也可以自定义样式和背景颜色

<img src="https://j1.58cdn.com.cn/jinrong/images/ems16279584547053ae9fe534d703.png" style="zoom:30%" alt="卡片">

## 使用指南

### 引用

在 app.json 或 index.json 中引入组件

```json
"usingComponents": {
  "card": "WonderUI/card/card"
}
```

### 代码示例

```html
<card borderType="b-fillet" bgColor="#ddd">
    <view style="height:200px"></view>
</card>
```

### API

#### Tag props

| 参数        | 说明         | 类型   | 默认值       |
| :---------- | :----------- | :----- | :----------- |
| borderType  | 边框类型     | string | fillet(圆角) |
| bgColor     | 背景颜色     | string | #fff         |
| customClass | won-we-class是否生效 | boolean |    false     |

#### 外部样式类
| 参名  | 说明       |
| :---- | :--------- |
| won-we-class | 根节点样式类，用于组件自定义样式 |
