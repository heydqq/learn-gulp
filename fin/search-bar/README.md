# Search 搜索框

## 介绍

搜索框，带有搜索图标，可用于搜索类页面

![search](https://j1.58cdn.com.cn/jinrong/images/ems162795959678415cee9006e385.jpg)

## 使用指南

### 引用

在 app.json 或 index.json 中引入组件

```json
"usingComponents": {
  "won-search-bar": "WonderUI/search-bar/search-bar"
}
```

### 代码示例

```html
        <won-search-bar
            placeholder="请输入搜索内容"
            show-button="{{false}}"
            get-focus="{{true}}">
        </won-search-bar>
```
### API

#### Search props

| 参数  | 说明       | 类型   | 默认值  |
| :---- | :--------- | :----- | :------ |
| placeholder | 输入框为空时占位符	   | string | 请输入    |
| showButton | 是否在输入框右边显示按钮 | boolean | true |
| buttonText | 按钮文本	 | string | 搜索 |
| getFocus | 默认获取焦点(若是出现两个以上的输入框组件 并设置为true的话，则都不会获取焦点) | boolean | false |

#### Search events

| 事件  | 说明       | 参数   | 类型  |
| :---- | :--------- | :----- | :------ |
| search | 点击按钮时触发事件 | 无 | (event:any) => void |
| click | 点击输入框时触发事件	 | 无 | (event:any) => void |
| focus | 获取焦点时触发事件	 | 无 | (event:any) => void |
| blur | 失去焦点时触发事件	 | 无 | (event:any) => void |

#### 外部样式类
| 参名  | 说明       |
| :---- | :--------- |
| won-we-class | 根节点样式类，用于组件自定义样式 |