/*
 * @Author: guoyuehua
 * @Date: 2021-06-04 17:51:58
 * @LastEditTime: 2021-07-12 15:27:13
 * @LastEditors: guoyuehua
 * @Description: 针对底部弹框的遮罩
 * @FilePath: \58fin-we-ui\src\half-screen-overlay\half-screen-overlay.ts
 */
Component({
    data: {},
    properties: {
        show: { // 显示/隐藏
            type: Boolean,
            value: false,
        },
        hideHeader: { // 是否隐藏头部
            type: Boolean,
            value: false,
        },
        hideCancel: { // 是否隐藏 取消按钮
            type: Boolean,
            value: false,
        },
        cancelText: {
            type: String,
            value: '取消',
        },
        cancelColor: {
            type: String, // 取消按钮颜色
            value: '',
        },
        cancelClosable: { // 是否需要取消按钮点击
            type: Boolean,
            value: true,
        },
        hideConfirm: { // 是否隐藏确定按钮
            type: Boolean,
            value: false,
        },

        confirmText: {
            type: String, // 确定按钮文字
            value: '确定',
        },

        confirmColor: {
            type: String, // 确定按钮颜色
            value: '',
        },

        title: {
            type: String,
            value: '标题',
        },

        hideMask: { // 是否隐藏遮罩
            type: Boolean,
            value: false,
        },

        maskClosable: { // 是否需要点击遮罩
            type: Boolean,
            value: true,
        },
    },
    methods: {
        /**
         * 遮罩点击
         */
        clickMask(event) {
            if (this.data.maskClosable) {
                this.setData({
                    show: false,
                });
                this.triggerEvent('showChange', { ...event, show: this.data.show });
            }
        },
        /**
         * 确定按钮点击
         */
        confirmClick(event) {
            this.triggerEvent('confirmClick', event);
        },
        /**
         * 取消点击
         */
        closeClick(event) {
            if (this.data.cancelClosable) {
                this.setData({
                    show: false,
                });
                this.triggerEvent('showChange', { ...event, show: this.data.show });
            } else {
                this.triggerEvent('cancelClick', { ...event });
            }
        },
    },
});
