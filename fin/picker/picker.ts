// import { urlToHttpOptions } from "http";

/*
 * @Author: huoyuhuan
 * @Date: 2021-06-02 17:51:58
 * @LastEditTime: 2021-06-02 20:11:47
 * @LastEditors: huoyuhuan
 * @Description: 单选组件
 */
import fieldItem from "../utils/behavior/field-item";
interface IOptions {
    value: string | number,
    label: string | number,
}

Component({
    behaviors: [fieldItem, "wx://form-field"],
    relations: {
        "../field/field": {
        type: "parent",
        },
    },
    externalClasses: ['won-we-pick'],
    data: {
        innerValue: [],  // 当前选中的value值
        innerValueTrans: [],  // 触发父组件bindChange中传入的值
        indexValue:[],  // 数组下标值
        currentIndex: 0,  // 最后变化的列
        flag: false, // 标识是不是作为子组件被调用
        // 弹层设置数据
        maskClosable: false,
        title: '请选择',
        enabledConfirm: true,
        confirmColor: '#5146fe'
    },
    properties: {
        // 数据源
        options: Array,
        // 默认选中数据
        value: Array,
        // 弹层是否展示
        show: {
            type: Boolean,
            value: false,
        },
        // 确定按钮的颜色
        confirmBtnColor: {
            type: String,
            value: '#5146fe',
        }
    },
    observers: {
        value(value: Array<string>) {
            this.setIndexValue(value);
        },
        show(value: Boolean) {
            value && this.setIndexValue(this.data.value);
        },
        ['innerValue, currentIndex']: function(innerValue: Array<string>, currentIndex: number) {
            if (innerValue.length > 0 && currentIndex !== undefined) {
                if (innerValue[currentIndex] !== this.data.innerValueTrans[currentIndex]) {
                    this.triggerEvent('valueChange', {selectValue: innerValue, index: currentIndex});
                    this.setData({
                        innerValueTrans: innerValue
                    });
                }
                
            }
        }
    },
    methods: {
        touchStart: function (e: any) {
            this.setData({
                enabledConfirm: false,
                confirmColor: '#999999'
            });
        },
        /****
         * 监听值的变化
         */
        bindChange(e: any) {
            const { flag, options, confirmBtnColor } = this.data;
            const index = e.detail.value;
            const selectValue = [];
            // 将获取到的数组下标值映射为value值
            index.map((item: number, index: number)=>{
                selectValue[index] = options[index][item]?.value || undefined;
            });

            this.setData({
                // indexValue: index,
                innerValue: selectValue,
                enabledConfirm: true,
                confirmColor: confirmBtnColor,
            });
            if (!flag) {
                this.setData({
                    indexValue: index,
                });
            }
        },
        /****
         * 获取当前变化的列
         */
        getIndex(e: any) {
            const index = e.currentTarget.dataset.index;
            this.setData({
                currentIndex: index,
                confirmColor: this.data.confirmBtnColor
            });
        },
        /****
         * 设置选中数据为传入的value
         */
         setIndexValue(value: Array<string>) {
            let indexValue = this.valueToIndex(this.properties.options, value);
            console.log('indexValue---',indexValue);
            this.setData({
                indexValue,
            });
        },
        /****
         * 将传入的value映射为options中数组下标值
         */
        valueToIndex(options: Array<Array<IOptions>>, value: Array<string> = []) {
            let indexValue = [];
            for (let i = 0; i< options.length; i++) {
                if(!Array.isArray(options[i]) || options[i].length === 0) {
                    indexValue[i] = 0;
                    continue;
                }
                options[i].some((item, index:number)=>{
                    if (item.value === value[i]) {
                        indexValue[i] = index;
                        return true;
                    } else {
                        indexValue[i] = 0;
                    }
                });
            }
            return indexValue;
        },
        /****
         * 提供给datetime-picker调用
         */
        changeFlag() {
            this.setData({
                flag: true
            });
        },
        // 点击确定按钮时触发
        onConfirm() {
            if (!this.data.enabledConfirm) {
                return;
            }
            this.setValue(this.data.innerValue);
            this.triggerEvent("formitemchange", this.data.innerValue, {
                bubbles: true,
                composed: true,
                capturePhase: true,
            });
            this.triggerEvent('onConfirm', this.data.innerValue);
            this.setData({
                show: false,
            });
        }
    },
    attached() {
        // 在组件实例进入页面节点树时执行
        const { options, value, confirmBtnColor } = this.data;
        let indexValue = this.valueToIndex(options, value);
        this.setData({
            indexValue,
            innerValue: value,
            innerValueTrans: value,
            confirmColor: confirmBtnColor,
        });
    }
})