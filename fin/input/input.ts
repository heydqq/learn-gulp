import fieldItem from "../utils/behavior/field-item";

Component({
  behaviors: [fieldItem, "wx://form-field"],
  relations: {
    "../field/field": {
      type: "parent",
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    value: String,
    type: String,
    password: Boolean,
    placeholder: String,
    placeholderStyle: String,
    placeholderClass: String,
    disabled: Boolean,
    maxLength: Number,
    autoFocus: Boolean,
    focus: Boolean,
    confirmType: String,
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(e) {
      this.setValue(e.detail.value);
      this.triggerEvent("formitemchange", e.detail.value, {
        bubbles: true,
        composed: true,
        capturePhase: true,
      });
      this.triggerEvent("change", e.detail, {
        bubbles: true,
        composed: true,
        capturePhase: true,
      });
    },
    onFocus(e) {
      this.triggerEvent("focus", e.detail.value, {
        bubbles: true,
        composed: true,
        capturePhase: true,
      });
    },
    onBlur(e) {
      this.triggerEvent("blur", e.detail.value, {
        bubbles: true,
        composed: true,
        capturePhase: true,
      });
    },
    onConfirm(e) {
      this.triggerEvent("confirm", e.detail.value, {
        bubbles: true,
        composed: true,
        capturePhase: true,
      });
    },
  },
});
