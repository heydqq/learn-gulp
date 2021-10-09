// components/radio/index.js
Component({
  relations: {
    "../radio-group/radio-group": {
      type: "parent",
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: String,
      optionalTypes: [Number],
    },
    color: {
      type: String,
      value: "blue",
    },
    disabled: Boolean,
    checked: {
      type: Boolean,
      observer: function (newVal, oldVal) {
        if (oldVal !== newVal) {
          this.setData({ isChecked: newVal });
        }
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isChecked: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setChecked: function (curVal, newVal) {
      if (curVal === this.data.value || newVal === this.data.value) {
        this.setData({
          isChecked: newVal === this.data.value,
        });
      }
    },

    onChange: function (e) {
      
      const { disabled } = this.data;
      if (disabled) {
        return;
      }
      // 只能激活，不能取消
      const checkFlag = !this.data.isChecked;
      if (!checkFlag) {
        return;
      }

      this.triggerEvent(
        "radiochange",
        {
          value: this.data.value,
        },
        {
          bubbles: true,
          composed: true,
          capturePhase: true,
        }
      );
    },
  },
});
