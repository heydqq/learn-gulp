# Radio

## 介绍

单选项目，`won-radio`。必须与`won-radio-group`搭配使用。

![radio](https://j1.58cdn.com.cn/jinrong/images/ems1627977629316f094920387089.png)

## 使用指南

#### 引入组件

```json
{
  "usingComponents": {
    "won-radio": "WonderUI/radio/radio",
    "won-radio-group": "WonderUI/radio-group/radio-group"
  }
}
```

#### wxml

```html
<won-radio-group bind:change="handleRadioChange">
  <won-radio value="{{1}}">男</won-radio>
  <won-radio value="{{0}}">女</won-radio>
</won-radio-group>
```

#### JS

```javascript
Page({
  data: {},
  handleRadioChange: function (e) {
    console.log(e.detail);
  },
});
```

## API

### radio-group

| 参数        | 类型        | 是否必填 | 意义                                                             | 默认值 | 版本  | 备注 |
| ----------- | ----------- | -------- | ---------------------------------------------------------------- | ------ | ----- | ---- |
| bind:change | EventHandle | 否       | radio-group 中选中项发生改变时触发 change 事件，detail = {value} | 无     | 1.0.0 |      |

### radio

| 参数     | 类型    | 是否必填 | 意义                                                                           | 默认值 | 版本  | 备注 |
| -------- | ------- | -------- | ------------------------------------------------------------------------------ | ------ | ----- | ---- |
| value    | String  | 否       | radio 标识。当该 radio 选中时，radio-group 的 change 事件会携带 radio 的 value |        | 1.0.0 |
| checked  | Boolean | 否       | 当前是否选中                                                                   | false  | 1.0.0 |
| disabled | Boolean | 否       | 是否禁用                                                                       | false  | 1.0.0 |      |
| color    | String  | 否       | radio 的颜色，同 css 的 color                                                  | blue   |

## 修改记录

- 2021-08-03 补充文档
