import fieldItem from "../utils/behavior/field-item";

Component({
  behaviors: [fieldItem, "wx://form-field"],
  relations: {
    "../field/field": {
      type: "parent",
    },
    "../radio/radio": {
      type: "child",
    },
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    getChildren: function () {
      return this.getRelationNodes("../radio/radio");
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
      this.triggerEvent("change", this.data, {
        bubbles: true,
        composed: true,
        capturePhase: true,
      });
    },
  },
});
