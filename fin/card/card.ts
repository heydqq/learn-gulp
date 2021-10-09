/*
 * @Author: guoyuehua
 * @Date: 2021-05-26 14:47:25
 * @LastEditTime: 2021-07-23 15:56:46
 * @LastEditors: guoyuehua
 * @Description: 卡片组件,提供四种类型选择 fillet（圆角）b-fillet(大圆角) shadow（阴影）stroke（描边）
 * 也可以自定义 卡片样式
 * @FilePath: \58fin-we-ui\src\card\card.ts
 */
Component({
    externalClasses: ['won-we-class'],
    data: {},
    properties: {
        borderType: {
            type: String,
            value: 'fillet', // fillet（圆角）b-fillet(大圆角) shadow（阴影）stroke（描边）
        },
        bgColor: {
            type: String,
            value: '#ffffff',
        },
        customClass: {
            type: Boolean,
            value: false,
        },
    },
    methods: {},
});
