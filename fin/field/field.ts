Component({
  relations: {
    "../form/form": {
      type: "parent",
      linked: function (target) {
        this.getFormInstance(target);
      },
      linkChanged: function (target) {},
      unlinked: function () {},
    },
    "wx://form-field": {
      type: "child",
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    label: {
      type: String,
    },
    name: {
      type: String,
    },
    required: {
      type: Boolean,
    },
    rules: {
      type: Array,
    },
    initialValue: {
      type: String,
      optionalTypes: [Number, Object, Array],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    error: null,
    formIns: null,
    labelWidth: "100rpx",
    layout: "horizontal",
  },

  ready: function () {
    this.setInitialValue();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getFormInstance: function (form) {
      this.formInstance = form;
    },

    setInitialValue: function () {
      const { initialValue, name } = this.properties;
      const { initialValues } = this.formInstance.properties;
      const formInitialValue = initialValues[name];
      if (initialValues && formInitialValue !== undefined) {
        this.setValue(formInitialValue);
        return;
      }
      if (initialValue) {
        this.setValue(initialValue);
      }
      return;
    },

    getInitialValue: function () {
      const { name, initialValue } = this.properties;
      if (!!(name + "")) {
        return {
          [name]: initialValue,
        };
      }
    },

    getName: function () {
      const { name } = this.properties;
      return name;
    },

    getValue: function () {
      var nodes = this.getRelationNodes("wx://form-field");
      const [elem] = nodes;
      if (!elem) {
        return;
      }
      return elem.getValue();
    },

    setValue: function (v) {
      var nodes = this.getRelationNodes("wx://form-field");
      const [elem] = nodes;
      elem.setValue(v);
    },

    getData: function () {
      const { name } = this.properties;
      const value = this.getValue();
      if (!!(name + "")) {
        return {
          [name]: value,
        };
      }
    },

    validate: function (data) {
      const { name } = this.properties;
      const values = data || this.getData();

      this.formInstance.validator.validate(values, (error) => {
        if (error) {
          error = error.filter((item) => item["field"] === name);
        }
        this.setData({
          error,
        });
      });
    },

    getError: function () {
      const { error } = this.data;
      return error;
    },

    onChange: function (e) {
      const { name } = this.properties;
      this.validate({
        [name]: e.detail,
      });
    },
  },
});
