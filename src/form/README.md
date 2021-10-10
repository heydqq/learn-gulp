# 表单

## 介绍

表单实现了数据收集、校验、提交和重置，并且支持自定义组件。

![form](https://j1.58cdn.com.cn/jinrong/images/ems162798227707842c381094da6f.png)

## 使用指南

#### 引入组件

```json
{
  "usingComponents": {
    "won-form": "WonderUI/form/form",
    "won-field": "WonderUI/field/field",
    "won-input": "WonderUI/input/input",
    "won-button": "WonderUI/button/button",
    "won-radio": "WonderUI/radio/radio",
    "won-radio-group": "WonderUI/radio-group/radio-group"
  }
}
```

#### wxml

```html
<won-form
  name="userinfoForm"
  initialValues="{{initialValues}}"
  bind:submit="handleSubmit"
>
  <won-field
    label="姓名"
    name="username"
    rules="{{rules.name}}"
    initialValue="{{'Meng Sio'}}"
  >
    <won-input />
  </won-field>

  <won-field required label="年龄" name="age" rules="{{rules.age}}">
    <won-input />
  </won-field>

  <won-field required label="性别" name="sex" rules="{{rules.sex}}">
    <won-radio-group>
      <won-radio value="{{1}}">男</won-radio>
      <won-radio value="{{0}}">女</won-radio>
    </won-radio-group>
  </won-field>

  <won-button formType="submit">提交</won-button>
  <won-button formType="reset">重置</won-button>
</won-form>
```

#### JS

```javascript
Page({
  data: {},
  handleSubmit: function (e) {
    console.log(e.detail);
  },
});
```

## API

### form

| 参数         | 类型                   | 是否必填 | 意义                                 | 默认值     | 版本  | 备注                                       |
| ------------ | ---------------------- | -------- | ------------------------------------ | ---------- | ----- | ------------------------------------------ |
| name         | String                 | 否       | 表单标识，用于获取表单实例           |            | 1.0.0 | wx.$getForm 方法内传入 name 可获取表单实例 |
| intialValues | Object                 | 否       | 给表单项设置初始值                   |            | 1.0.0 |                                            |
| layout       | horizontal ｜ vertical | 否       | label 与表单项是上下布局还是左右布局 | horizontal | 1.0.0 |                                            |
| label-width  | String                 | 否       | label 宽度                           | 100rpx     |
| bind:submit  | Function               | 否       | 表单提交的回调                       |            | 1.0.0 |                                            |

### field

| 参数     | 类型                                                        | 是否必填 | 意义                         | 默认值 | 版本  | 备注                     |
| -------- | ----------------------------------------------------------- | -------- | ---------------------------- | ------ | ----- | ------------------------ |
| label    | String                                                      | 否       | 表单的文字描述               | ''     | 1.0.0 |
| name     | String                                                      | 是       | 表单提交的回调               |        | 1.0.0 |
| rules    | [Rule[]](https://github.com/yiminghe/async-validator#rules) | 否       | 校验规则                     |        | 1.0.0 | 规则同 antd 表单校验规则 |
| required | Boolean                                                     | 否       | 是否标识必填项，不做实际校验 | false  |

### global

为了提供组件操作 form，我们提供了全局引用表单的 API，挂在了 `wx` 这个全局对象上。使用如下：

```javascript
// 可访问的时机，1. 表单在页面展示后 2. 页面ready周期里

// 根据form的name属性可以获取道当前表单实例

const form = wx.$getForm("userinfoForm");

const values = form.getFieldsValue();

const name = form.getFieldValue("name");

form.setFieldsValue({
  name: "Wonder UI",
  age: 12,
});

form.setFieldValue("sex", 0);

form.validateFields(["name", "age"], (errors) => {
  console.log(errors);
});
```

## 开发自定义组件

### 必备条件

```javascript
import fieldItem from "../utils/behavior/field-item"; // 引入 field-item 这个 behavior

Component({
  behaviors: [fieldItem, "wx://form-field"],
  relations: {
    // 确定跟 field 组件的父子关系
    "../field/field": {
      type: "parent",
    },
  },

  methods: {
    // 监听组件行为 onChange 事件
    onChange(e) {
      // 通过 setValue 更新表单值
      this.setValue(e.detail.value);
      // 触发 formitemchange 事件，通知 field 组件
      this.triggerEvent("formitemchange", e.detail.value, {
        bubbles: true,
        composed: true,
        capturePhase: true,
      });
    },
  },
});
```

通过如上代码，我们知道，自定义组件需要满足如下三点：

- 引入 field-item 这个 behavior
- 确定跟 field 组件的父子关系
- 监听组件行为 onChange 事件
  - 通过 setValue 更新表单值
  - 触发 formitemchange 事件，通知 field 组件

### behavior 的作用

#### value

此字段用存储表单项的值，初始值为 null；
⚠️ 自定义表单时，应尽量避免在 data 中使用 value 字段。

#### getValue

用与 field 组件收集表单组件的 value 值。

#### setValue

用于更新表单值。

### 如有必要，可重写 setValue 方法

对于一些简单的表单，尽量避免重写如上三个字段。但对一些复杂组件，比如 radio-group，我们 setValue 时，还需要处理，radio 的展示状态。在此我们需要重写 setValue 这个方法。
代码如下：

```javascript
import fieldItem from "../utils/behavior/field-item";

Component({
  behaviors: [fieldItem, "wx://form-field"],
  relations: {
    "../field/field": {
      type: "parent",
    },
    "../radio/index": {
      type: "child",
    },
  },
  methods: {
    getChildren: function () {
      return this.getRelationNodes("../radio/index");
    },

    setValue: function (v) {
      const children = this.getChildren();
      const { value: curValue } = this.data;

      this.setData({ value: v });
      children.forEach((item) => {
        item.setChecked(curValue, v);
      });
    },

    onRadioChange: function (e) {
      const { value: newVal } = e.detail;

      this.setValue(newVal);

      this.triggerEvent("formitemchange", this.data.value, {
        bubbles: true,
        composed: true,
        capturePhase: true,
      });
    },
  },
});
```

## 修改记录

- 2021-08-03 补充文档
- 2021-08-04 form 增加`label-width`和`layout`属性
