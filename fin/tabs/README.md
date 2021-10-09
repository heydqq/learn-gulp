<!--
 * @Description: 标签页
 * @Author: duanwensheng
 * @Date: 2021-07-13 20:18:04
-->
# Tabs 标签页

## 介绍

选项卡组件，用于在不同得内容区域之间进项切换 

![tabs](https://j1.58cdn.com.cn/jinrong/images/ems1628107712682572d1c1cfacbe.jpg)
![tabs](https://j1.58cdn.com.cn/jinrong/images/ems162810779886002143a20d17e9.jpg)

## 使用指南

### 引用

在 app.json 或 index.json 中引入组件

```json
"usingComponents": {
  "won-tabs": "WonderUI/weapp/tabs/tabs",
  "won-tabpanel": "WonderUI/weapp/tabpanel/tabpanel"
}
```

### 代码示例
#### 基础用法
##### 通过activeKey初始化激活标签的索引值，默认情况激活第一个标签
```html
<won-tabs activeKey="{{activeKey}}" bind:change="onChange" >
    <won-tabpanel title="标签1">标签1</won-tabpanel>
    <won-tabpanel title="标签2">标签2</won-tabpanel>
    <won-tabpanel title="标签3">标签3</won-tabpanel>
    <won-tabpanel title="标签4">标签4</won-tabpanel>
</won-tabs> 
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
<won-tabs activeKey="second" bind:change="onChange" >
    <won-tabpanel key="first" title="标签1">标签1</won-tabpanel>
    <won-tabpanel key="second" title="标签2">标签2</won-tabpanel>
    <won-tabpanel title="标签3">标签3</won-tabpanel>
    <won-tabpanel title="标签4">标签4</won-tabpanel>
</won-tabs>
```

#### 横向滚动
##### 默认当便签数超过4个，自动开启滚动
```html
<won-tabs activeKey="{{activeKey}}" bind:change="onChange" >
    <won-tabpanel title="标签1">标签1</won-tabpanel>
    <won-tabpanel title="标签2">标签2</won-tabpanel>
    <won-tabpanel title="标签3">标签3</won-tabpanel>
    <won-tabpanel title="标签4">标签4</won-tabpanel>
    <won-tabpanel title="标签5">标签5</won-tabpanel>
    <won-tabpanel title="标签6">标签6</won-tabpanel>
</won-tabs> 
```

#### 搭配二级subwon-tabs使用
##### 默认当便签数超过4个，自动开启滚动
```html
<won-tabs activeKey="{{activeKey}}" bind:change="onChange" >
    <won-tabpanel title="标签1">
        <won-subtabs bind:change="onChange">
            <won-tabpanel title="子标签1">子标签1</won-tabpanel>
            <won-tabpanel title="子标签2">子标签2</won-tabpanel>
            <won-tabpanel title="子标签3">子标签3</won-tabpanel>
            <won-tabpanel title="子标签4">子标签4</won-tabpanel>
        </won-subtabs>
    </won-tabpanel>
    <won-tabpanel title="标签2">标签2</won-tabpanel>
    <won-tabpanel title="标签3">标签3</won-tabpanel>
    <won-tabpanel title="标签4">标签4</won-tabpanel>
    <won-tabpanel title="标签5">标签5</won-tabpanel>
    <won-tabpanel title="标签6">标签6</won-tabpanel>
</won-tabs> 
```

### API

#### won-tabs props

| 参数  | 说明       | 类型   | 默认值  |
| :---- | :--------- | :----- | :------ |
| activeKey  | 当前选中标签的key值   | string | number | 0
| scrollable  | 是否开启横向滚动（默认标签数大于4时开启，当标签字数较多，导致便签个数小于4时，展示溢出，建议手动开启）   | boolean  | false



#### won-tabpanel props

| 参数  | 说明       | 类型   | 默认值  |
| :---- | :--------- | :----- | :------ |
| title  | 标签名 | string | -
| key | 标签唯一索引值 | string | number | 标签索引（从0开始） |

#### won-tabs Event
| 参数  | 说明       | 参数   |
| :---- | :--------- | :----- |
| bind:change  | 当前激活的标签改变时触发 | title: 标签名, key: 标签索引值 |

#### 外部样式类
| 参名  | 说明       |
| :---- | :--------- |
| won-we-class | 根节点样式类，用于组件自定义样式 |