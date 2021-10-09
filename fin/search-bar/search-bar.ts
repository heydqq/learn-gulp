/*
 * @Description: 搜索栏组件
 * @Author: zhangkai35
 * @Date: 2021-05-31 15:42:57
 */
Component({
  data: {
    inputValue: '',
    eliminateIcon: false,  // 清除icon是否展示
  },
  externalClasses: ['won-we-class'],
  properties: {
    placeholder: {
      type: String,
      value: '请输入',
    },
    showButton: {
      type: Boolean,
      value: true,
    },
    buttonText: {
      type: String,
      value: '搜索',
    },
    getFocus: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    onClickEliminateIcon() {
      this.setData({ inputValue: '', eliminateIcon: false });
    },

    onClickInput(event) {
      this.triggerEvent('click', { e: event });
    },

    onClickSearch(event) {
      this.triggerEvent('search', { e: event, inputValue: this.data.inputValue } );
    },

    onInputFocus(event) {
      const { value } = event.detail;
      if (!!value) {
        this.setData({ eliminateIcon: true });
      }
      this.triggerEvent('focus', { e: event, inputValue: value } );
    },

    onInputBlur(event) {
      // 防止失去焦点和点击事件冲突
      setTimeout(() => {
        this.setData({ eliminateIcon: false });
        this.triggerEvent('blur', { e: event, inputValue: this.data.inputValue } );
      }, 100)
    },

    onInput(event) {
      const { value } = event.detail;
      let eliminateIcon = false;
      if (!!value) {
        eliminateIcon = true;
      } else {
        eliminateIcon = false;
      }
      this.setData({ inputValue: value, eliminateIcon })
    }
  }
})