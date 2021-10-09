/*
 * @Description: 标签页面板
 * @Author: duanwensheng
 * @Date: 2021-05-30 17:49:46
 */

Component({
    relations: {
        '../tabs/tabs': {
            type: 'parent',
        },

        '../subtabs/subtabs': {
            type: 'parent',
        },
    },

    properties: {
        // tab 标签名
        title: {
            type: String,
            value: ''
        },
        
        // tab 唯一key 值 默认为数组index
        key: {
            type: null,
            value: 0
        },
    },

    data: {
        show: false,
    },

    methods: {
        updateRender(show) {
            this.setData({ show });
        }
    }
})