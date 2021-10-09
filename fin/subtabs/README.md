<!--
 * @Description: 二级标签页
 * @Author: duanwensheng
 * @Date: 2021-07-13 20:18:04
-->
# Subtabs 二级标签页

## 介绍

二级选项卡组件，用于在不同得内容区域之间进项切换，可搭配标签页使用
![subtabs](https://j1.58cdn.com.cn/jinrong/images/ems1628096086543149ed02a3434b.jpg)
![subtabs](https://j1.58cdn.com.cn/jinrong/images/ems1628096201376c6729ce8b3f88.jpg)

## 使用指南

### 引用

在 app.json 或 index.json 中引入组件

```json
"usingComponents": {
  "won-subtabs": "WonderUI/weapp/subtabs/subtabs",
  "won-tabpanel": "WonderUI/weapp/tabpanel/tabpanel"
}
```

### 代码示例
#### 基础用法
##### 通过activeKey初始化激活标签的索引值，默认情况激活第一个标签
```html
<won-subtabs activeKey="{{activeKey}}" bind:change="onChange" >
    <won-tabpanel title="标签1">标签1</won-tabpanel>
    <won-tabpanel title="标签2">标签2</won-tabpanel>
    <won-tabpanel title="标签3">标签3</won-tabpanel>
    <won-tabpanel title="标签4">标签4</won-tabpanel>
</won-subtabs> 
```
```js
    Page({
        data: {
            active: 1,
        },

        onChange(event) {
            console.log(event.detail);
        }
    })

```

#### 通过key配置激活标签
##### 可选择性设置key值，默认key为索引值，从0开始
```html
<won-subtabs activeKey="second" bind:change="onChange" >
    <won-tabpanel key="first" title="标签1">标签1</won-tabpanel>
    <won-tabpanel key="second" title="标签2">标签2</won-tabpanel>
    <won-tabpanel title="标签3">标签3</won-tabpanel>
    <won-tabpanel title="标签4">标签4</won-tabpanel>
</won-subtabs>
```

#### 横向滚动
##### 默认当便签数超过4个，自动开启滚动
```html
<won-subtabs activeKey="{{activeKey}}" bind:change="onChange" >
    <won-tabpanel title="标签1">标签1</won-tabpanel>
    <won-tabpanel title="标签2">标签2</won-tabpanel>
    <won-tabpanel title="标签3">标签3</won-tabpanel>
    <won-tabpanel title="标签4">标签4</won-tabpanel>
    <won-tabpanel title="标签5">标签5</won-tabpanel>
    <won-tabpanel title="标签6">标签6</won-tabpanel>
</won-subtabs> 
```

#### 设置激活颜色
```html
<won-subtabs activeKey="{{activeKey}}" bind:change="onChange" color="goldenrod" >
    <won-tabpanel title="标签1">标签1</won-tabpanel>
    <won-tabpanel title="标签2">标签2</won-tabpanel>
    <won-tabpanel title="标签3">标签3</won-tabpanel>
    <won-tabpanel title="标签4">标签4</won-tabpanel>
</won-subtabs> 
```

#### 设置实心样式
##### 默认为空心样式
```html
<won-subtabs activeKey="{{activeKey}}" bind:change="onChange" plain="{{false}}" color="goldenrod" >
    <won-tabpanel title="标签1">标签1</won-tabpanel>
    <won-tabpanel title="标签2">标签2</won-tabpanel>
    <won-tabpanel title="标签3">标签3</won-tabpanel>
    <won-tabpanel title="标签4">标签4</won-tabpanel>
</won-subtabs> 
```
### API

#### won-subtabs props

| 参数  | 说明       | 类型   | 默认值  |
| :---- | :--------- | :----- | :------ |
| activeKey  | 当前选中标签的key值   | string | number    | 0
| plain  | 是否为空心样式 | boolean | true
| color  | 当前选中标签的颜色   | string | #5146FE
| scrollable  | 是否开启横向滚动（默认标签数大于4时开启，当标签字数较多，导致便签个数小于4时，展示溢出，建议手动开启）   | boolean  | false



#### won-tabpanel props

| 参数  | 说明       | 类型   | 默认值  |
| :---- | :--------- | :----- | :------ |
| title  | 标签名 | string | -
| key | 标签唯一索引值 | string | number | 标签索引（从0开始） |

#### won-subtabs Event
| 参数  | 说明       | 参数   |
| :---- | :--------- | :----- |
| bind:change  | 当前激活的标签改变时触发 | title: 标签名, key: 标签索引值 |

#### 外部样式类
| 参名  | 说明       |
| :---- | :--------- |
| won-we-class | 根节点样式类，用于组件自定义样式 |