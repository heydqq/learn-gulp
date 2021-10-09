/*
 * @Author: huoyuhuan
 * @Date: 2021-06-02 17:51:58
 * @LastEditTime: 2021-06-02 20:11:47
 * @LastEditors: huoyuhuan
 * @Description: 动作面板组件
 */

Component({
    externalClasses: ['won-we-actionsheet'],
    data: {
        // show: false,
        // 弹层设置数据
        hideHeader: true,
        maskClosable: false,
    },
    properties: {
        // 弹层是否展示
        show: {
            type: Boolean,
            value: false,
        },
    },
    methods: {
        // 用于组件内部底部取消调取
        exit() {
            console.log('11',this.data.show)
            this.setData({show: false}, () => {
                console.log('22',this.data.show)
            });
            console.log('33',this.data.show)
        },
    }
    
})