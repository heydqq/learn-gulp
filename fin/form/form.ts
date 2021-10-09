import Schema from "./async-validator/index";

wx["$getForm"] = (function () {
  if (!wx["__won_form__"]) {
    wx["__won_form__"] = {};
  }
  return (name) => {
    return wx["__won_form__"][name];
  };
})();

Component({
  relations: {
    "../field/field": {
      type: "child",
      linked: function (target) {
        this._bindItem(target);
      },
      linkChanged: function (target) {
        this._unbindItem(target);
      },
      unlinked: function () {},
    },
    "../button/button": {
      type: "descendant",
    },
  },

  /**
   * 组件的属性列表
   */
  properties: {
    name: String,
    initialValues: Object,
    labelWidth: {
      type: String,
      value: "100rpx",
    },
    layout: {
      type: String,
      value: "horizontal",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    childrenMap: {},
  },

  lifetimes: {
    attached() {
      const { name } = this.data;
      if (typeof name === "string" && name.length > 0) {
        if (!!wx["__won_form__"][name]) {
          throw new Error(`已存在一个name为${name}的form，请更换name`);
        } else {
          wx["__won_form__"][name] = this._getForm(this);
        }
      }

      this.descriptor = {};
    },
    detached: function () {
      const { name } = this.data;
      if (typeof name === "string" && name.length > 0) {
        wx["__won_form__"][name] = null;
      }
    },
  },

  ready() {
    const { initialValues } = this.data;
    if (initialValues) {
      this._setFieldsValue(initialValues);
    }

    this.validator = new Schema(this.descriptor);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _bindItem: function (child) {
      const { name, rules } = child.data;

      if (rules) {
        this.descriptor[name] = rules;
      }
      this.data.childrenMap[name] = child;
      child.setData({
        labelWidth: this.data.labelWidth,
        layout: this.data.layout,
      });
    },

    _unbindItem: function (child) {
      const childName = child.data.name;
      this.data.childrenMap[childName] = null;
    },

    _getChildrenArr: function () {
      const childrenMap = this.data.childrenMap;
      return Object.keys(childrenMap).map((item) =>
        childrenMap[item] ? childrenMap[item] : null
      );
    },

    _getForm: (context) => {
      return {
        getFieldsError: context._getFieldsError.bind(context),
        getFieldsValue: context._getFieldsValue.bind(context),
        getFieldValue: context._getFieldValue.bind(context),
        setFieldsValue: context._setFieldsValue.bind(context),
        setFieldValue: context._setFieldValue.bind(context),
      };
    },

    _getInitialValues: function () {
      const formInitValues = this.data.initialValues || {};
      const items = this._getChildrenArr();
      const childInitValues = items.reduce((acc, item) => {
        return Object.assign(acc, item.getInitialValue());
      }, {});

      return {
        ...childInitValues,
        ...formInitValues,
      };
    },

    _getFieldsValue: function () {
      const items = this._getChildrenArr();
      const values = items.reduce((acc, item) => {
        return Object.assign(acc, item.getData());
      }, {});
      return values;
    },

    _getFieldValue: function (name) {
      const childrenMap = this.data.childrenMap;
      return childrenMap[name] && childrenMap[name].getValue();
    },

    _setFieldsValue: function (values) {
      const childrenMap = this.data.childrenMap;
      Object.keys(values).forEach((item) => {
        childrenMap[item] && childrenMap[item].setValue(values[item]);
      });
    },

    _setFieldValue: function (name, value) {
      const childrenMap = this.data.childrenMap;
      childrenMap[name] && childrenMap[name].setValue(value);
    },

    _getFieldsError: function () {
      const items = this._getChildrenArr();
      const values = items.reduce((acc, item) => {
        const err = item.getError();
        if (err) {
          return acc.concat(err);
        }
        return acc;
      }, []);
      return values;
    },

    _validateFields: function (cb) {
      const values = this._getFieldsValue();
      this.validator.validate(values, (error) => {
        cb && cb(error);
      });
    },

    _validateChildrenField: function () {
      const items = this._getChildrenArr();
      items.forEach((item) => {
        item.validate();
      });
    },

    submit: function (e) {
      this._validateChildrenField();
      this._validateFields((err) => {
        this.triggerEvent(
          "submit",
          {
            errors: err,
            values: this._getFieldsValue(),
          },
          {
            bubbles: true,
            composed: true,
            capturePhase: true,
          }
        );
      });
    },

    reset: function () {
      const initialValues = this._getInitialValues();
      this._setFieldsValue(initialValues);
      this._validateChildrenField();
    },
  },
});
