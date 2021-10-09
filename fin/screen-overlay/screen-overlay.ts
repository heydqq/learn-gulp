/*
 * @Author: guoyuehua
 * @Date: 2021-06-04 17:51:27
 * @LastEditTime: 2021-07-12 15:28:18
 * @LastEditors: guoyuehua
 * @Description: 针对全屏遮罩的浮层
 * @FilePath: \58fin-we-ui\src\screen-overlay\screen-overlay.ts
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
         * 点击遮罩
         */
        maskClick(event) {
            if (this.data.maskClosable) {
                this.setData({
                    show: false,
                });
                this.triggerEvent('showChange', { ...event, show: this.data.show });
            }
        },
        /**
         * 取消点击
         */
        closeClick(event) {
            this.setData({
                show: false,
            });
            this.triggerEvent('showChange', { ...event, show: this.data.show });
        },
    },
});
