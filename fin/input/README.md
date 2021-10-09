# Input

## 介绍

Input 组件目前功能和小程序原生 Input 组件保持一致，将来会扩展更多的功能。[详见](https://developers.weixin.qq.com/miniprogram/dev/component/input.html)

![input](https://j1.58cdn.com.cn/jinrong/images/ems1627982718059e36bdbb0f12b7.png)

## 使用指南

#### 引入组件

```json
{
  "usingComponents": {
    "won-input": "WonderUI/input/input"
  }
}
```

#### wxml

```html
<won-input placeholder="请输入内容" bind:change="handleInputChange" />
```

#### JS

```javascript
Page({
  data: {},
  handleInputChange: function (e) {
    console.log(e.detail.value);
  },
});
```

## API

### input

| 参数         | 类型        | 是否必填 | 意义                                                                         | 默认值 | 版本  | 备注                 |
| ------------ | ----------- | -------- | ---------------------------------------------------------------------------- | ------ | ----- | -------------------- |
| value        | String      | 是       | 输入框的初始内容                                                             |        | 1.0.0 | 在 form 组件内非必填 |
| type         | String      | 否       | input 的类型                                                                 | text   | 1.0.0 |                      |
| password     | Boolean     | 否       | 是否是密码类型                                                               | false  | 1.0.0 |                      |
| placeholder  | String      | 是       | 输入框为空时占位符                                                           |        | 1.0.0 |                      |
| disabled     | Boolean     | 否       | 是否禁用                                                                     | false  | 1.0.0 |                      |
| maxlength    | Number      | 否       | 最大输入长度，设置为 -1 的时候不限制最大长度                                 | 140    | 1.0.0 |                      |
| confirm-type | String      | 否       | 设置键盘右下角按钮的文字，仅在 type='text'时生效                             | done   | 1.0.0 |                      |
| bind:focus   | EventHandle | 否       | 输入框聚焦时触发，event.detail = { value, height }，height 为键盘高度        |        | 1.0.0 |                      |
| bind:blur    | EventHandle | 否       | 输入框失去焦点时触发，event.detail = { value, encryptedValue, encryptError } |        | 1.0.0 |                      |
| bind:change  | EventHandle | 否       | 键盘输入时触发，event.detail = {value, cursor, keyCode}，keyCode 为键值      |        | 1.0.0 |                      |
| bind:confirm | EventHandle | 否       | 点击完成按钮时触发，event.detail = { value }                                 |        | 1.0.0 |                      |

## 修改记录

- 2021-08-03 补充文档
