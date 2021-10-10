# 定制样式

## 介绍

可以修改组件库内暴露的样式，包括颜色、字体大小等

## 使用指南

采用css变量的方式定义形如通用字体大小、主题色等颜色。

### 代码示例

在 app.wxss （让样式作用于全局）或者单独的index.wxss （让样式作用于局部页面）中 ,或者在独立的样式选择器中使用

#### *.wxss
```wxss
page{
    --color-theme:yellow;
}
```
或
####  *.wxss
```wxss
.custom-style {
    --color-theme:yellow;
}
```
### API

#### variables

| 变量名  | 说明       |  默认值  |
| :------- | :--------- | :------ |
| --font-size-xs | 字体大小：超小号 | 12px |
| --font-size-sm | 字体大小：小号 | 14px |
| --font-size-md | 字体大小：中等号 | 16px |
| --font-size-lg | 字体大小：大号 | 18px |
| --font-size-xl | 字体大小：超大号 | 20px |
| --color-theme | 主题色 | #5146FE |
| --color-positive | 正向提示色 | #36B66F |
| --color-warn | 警告提示色 | #F76260 |
| --color-dark-content | 深一点的字体色，通常用于标题、内容标题等 | #333 |
| --color-content | 常规的字体色，通常用于副标题、按钮、输入等 | number | #666 |
| --color-light-content | 浅一些的字体色，通常用于 辅助说明、标签等| #999 |
| --color-placeholder | 更浅的字体色，常用于placeholder | #ccc |
