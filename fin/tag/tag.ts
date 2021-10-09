/*
 * @Description: 
 * @Author: zhangkai35
 * @Date: 2021-05-27 10:29:38
 */
Component({
    data: {
    },
    properties: {
        tagList: {
            type: Array,
            value: [],
        }
    },
    methods: {
        init() {},
    },
    externalClasses: ['won-we-class'],
    lifetimes: {
        ready() {
            this.init();
        },
    },
})