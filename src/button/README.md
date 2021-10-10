# Button 按钮

## 介绍

基础按钮组件

![tag](https://j1.58cdn.com.cn/jinrong/images/ems1627983244611bbfa8a9ad8ac2.png)

## 使用指南

### 引用

在 app.json 或 index.json 中引入组件

```json
"usingComponents": {
  "won-button": "WonderUI/button/button"
}
```

### 代码示例

```html
<won-button size="large" type='primary' shape='square' >按钮</won-button>
```
### API

#### Button props

| 参数  | 说明       | 类型   | 默认值  |
| :---- | :--------- | :----- | :------ |
| size  | 按钮大小，可取值 large、normal、small    | string | normal |
| type | 按钮的样式类型，可取值 default、primary | string | default |
| disabled | 是否禁用 | boolean | false |
| loading | 名称前是否带 loading 图标 | boolean | false |
| formType | 用于 form 组件，点击分别会触发 form 组件的 submit/reset 事件 | string | - |
| openType | 微信开放能力 | string | - |
| hoverClass | 指定按钮按下去的样式类。当 hover-class="none" 时，没有点击态效果 | string | button-hover |
| hoverStopPropagation | 指定是否阻止本节点的祖先节点出现点击态 | boolean | false |
| hoverStartTime | 按住后多久出现点击态，单位毫秒 | number | 20 |
| hoverStayTime | 手指松开后点击态保留时间，单位毫秒 | number | 70 |
| lang | 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文 | string | en |
| sessionFrom | 会话来源，open-type="contact"时有效 | string | - |
| sendMessageTitle | 会话内消息卡片标题，open-type="contact"时有效 | string | 当前标题 |
| sendMessagePath | 会话内消息卡片点击跳转小程序路径，open-type="contact"时有效 | string | 当前分享路径 |
| sendMessageImg | 会话内消息卡片图片，open-type="contact"时有效 | string | 截图 |
| appParameter | 打开 APP 时，向 APP 传递的参数，open-type=launchApp时有效 | string | - |
| showMessageCard | 是否显示会话内消息卡片，设置此参数为 true，用户进入客服会话会在右下角显示"可能要发送的小程序"提示，用户点击后可以快速发送小程序消息，open-type="contact"时有效 | boolean | false |


#### Button events

| 事件  | 说明 |
| :---- | :--------- |
| bindgetuserinfo | 用户点击该按钮时，会返回获取到的用户信息，回调的detail数据与wx.getUserInfo返回的一致，open-type="getUserInfo"时有效 |
| bindcontact | 客服消息回调，open-type="contact"时有效 |
| bindgetphonenumber | 获取用户手机号回调，open-type=getPhoneNumber时有效 |
| binderror | 当使用开放能力时，发生错误的回调，open-type=launchApp时有效 |
| bindopensetting | 获取用户手机号回调，open-type=getPhoneNumber时有效 |
| bindlaunchapp | 在打开授权设置页后回调，open-type=openSetting时有效 |
| bindgetphonenumber | 打开 APP 成功的回调，open-type=launchApp时有效 |

#### 外部样式类
| 参名  | 说明       |
| :---- | :--------- |
| won-we-class | 根节点样式类，用于组件自定义样式 |