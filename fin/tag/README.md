# Tag 标签

## 介绍

自定义标签列表

![tag](https://j1.58cdn.com.cn/jinrong/images/ems16279594119590b7ed2d161006.jpg)

## 使用指南

### 引用

在 app.json 或 index.json 中引入组件

```json
"usingComponents": {
  "won-tag": "WonderUI/tag/tag"
}
```

### 代码示例

```html
        <won-tag tag-list="{{tagList}}"/>
```
```js
        Page({
            data: {
                tagList: [
                {
                    name: '标签1',
                    color: '',
                    empty: true
                },
                {
                    name: '标签2',
                    color: 'red',
                    empty: false
                },
                {
                    name: '标签',
                },
                {
                    name: '标签',
                    empty: true
                }
                ],
            }
        })

```
### API

#### Tag props

| 参数  | 说明       | 类型   | 默认值  |
| :---- | :--------- | :----- | :------ |
| tagList | 标签内容数组 | array`<tagItem>` | [] |

#### tagItem 

| 属性  | 说明       | 类型   | 默认值  |
| :---- | :--------- | :----- | :------ |
| name | 标签名字 | string（必填） | - |
| color | 标签颜色 | string | #5146FE  |
| empty | 是否是空心样式 | boolean | - |

#### 外部样式类
| 参名  | 说明       |
| :---- | :--------- |
| won-we-class | 根节点样式类，用于组件自定义样式 |
